import express from 'express';
import cors from 'cors';
import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Database setup
let db;
try {
  const dataDir = path.join(__dirname, 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  
  db = new Database(path.join(dataDir, 'tourism.db'));
  db.pragma('journal_mode = WAL');
  
  // Create tables if they don't exist
  db.exec(`
    CREATE TABLE IF NOT EXISTS articles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      category TEXT DEFAULT 'news',
      source TEXT,
      image_url TEXT,
      ai_generated BOOLEAN DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    
    CREATE TABLE IF NOT EXISTS data_sources (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      url TEXT NOT NULL,
      type TEXT,
      active BOOLEAN DEFAULT 1,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    
    CREATE TABLE IF NOT EXISTS raw_data (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      content TEXT,
      category TEXT,
      source TEXT,
      data_type TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
  console.log('✅ Database initialized');
} catch (err) {
  console.error('❌ Database error:', err);
  process.exit(1);
}

// Routes

// Get all articles with pagination
app.get('/api/articles', (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const category = req.query.category;
    const offset = (page - 1) * limit;

    let query = 'SELECT * FROM articles';
    const params = [];

    if (category) {
      query += ' WHERE category = ?';
      params.push(category);
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const articles = db.prepare(query).all(...params);
    
    let countQuery = 'SELECT COUNT(*) as total FROM articles';
    if (category) {
      countQuery += ' WHERE category = ?';
    }
    const { total } = db.prepare(countQuery).get(...(category ? [category] : []));

    res.json({
      data: articles,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single article
app.get('/api/articles/:id', (req, res) => {
  try {
    const article = db.prepare('SELECT * FROM articles WHERE id = ?').get(req.params.id);
    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }
    res.json(article);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create article
app.post('/api/articles', (req, res) => {
  try {
    const { title, content, category = 'news', source, image_url, ai_generated = false } = req.body;
    
    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    // Convert any value to integer for SQLite
    const aiGenValue = (ai_generated === true || ai_generated === 1) ? 1 : 0;
    
    // Ensure all values are strings or numbers
    const safeTitle = String(title);
    const safeContent = String(content);
    const safeCategory = String(category || 'news');
    const safeSource = source ? String(source) : 'Manual';
    // Handle image_url - if it's boolean or invalid, set to null
    let safeImageUrl = null;
    if (image_url && typeof image_url === 'string' && image_url.length > 0) {
      safeImageUrl = String(image_url);
    }

    const stmt = db.prepare(`
      INSERT INTO articles (title, content, category, source, image_url, ai_generated)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    
    const result = stmt.run(safeTitle, safeContent, safeCategory, safeSource, safeImageUrl, aiGenValue);
    res.status(201).json({ id: result.lastInsertRowid, title: safeTitle, content: safeContent, category: safeCategory, source: safeSource, ai_generated: aiGenValue });
  } catch (err) {
    console.error('Create article error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Update article
app.put('/api/articles/:id', (req, res) => {
  try {
    const { title, content, category, source, image_url } = req.body;
    
    const stmt = db.prepare(`
      UPDATE articles 
      SET title = ?, content = ?, category = ?, source = ?, image_url = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);
    
    stmt.run(title, content, category, source, image_url, req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete article
app.delete('/api/articles/:id', (req, res) => {
  try {
    db.prepare('DELETE FROM articles WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get categories
app.get('/api/categories', (req, res) => {
  try {
    const categories = db.prepare('SELECT DISTINCT category FROM articles').all();
    res.json(categories.map(c => c.category));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Search articles
app.get('/api/search', (req, res) => {
  try {
    const query = req.query.q || '';
    if (!query) {
      return res.json({ data: [] });
    }

    const results = db.prepare(`
      SELECT * FROM articles 
      WHERE title LIKE ? OR content LIKE ?
      ORDER BY created_at DESC
      LIMIT 20
    `).all(`%${query}%`, `%${query}%`);

    res.json({ data: results });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get statistics
app.get('/api/stats', (req, res) => {
  try {
    const totalArticles = db.prepare('SELECT COUNT(*) as count FROM articles').get();
    const aiGenerated = db.prepare('SELECT COUNT(*) as count FROM articles WHERE ai_generated = 1').get();
    const categories = db.prepare('SELECT category, COUNT(*) as count FROM articles GROUP BY category').all();

    res.json({
      total_articles: totalArticles.count,
      ai_generated_articles: aiGenerated.count,
      categories
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`📊 API available at http://localhost:${PORT}/api`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  db.close();
  process.exit(0);
});
