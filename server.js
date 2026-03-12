import express from 'express';
import cors from 'cors';
import pg from 'pg';
import path from 'path';
import { fileURLToPath } from 'url';

const { Pool } = pg;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

// Version: 2026-03-12-v2 - Updated with images, modal and social UI

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Database setup - PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://localhost:5432/tourism',
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false
});

// Initialize database
async function initDB() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS articles (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        category TEXT DEFAULT 'news',
        source TEXT,
        image_url TEXT,
        ai_generated BOOLEAN DEFAULT false,
        language TEXT DEFAULT 'zh',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Database initialized');
  } catch (err) {
    console.error('❌ Database error:', err);
  }
}

initDB();

// Routes

// Get all articles
app.get('/api/articles', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const category = req.query.category;
    const language = req.query.language;
    const offset = (page - 1) * limit;

    let query = 'SELECT * FROM articles WHERE 1=1';
    const params = [];
    let paramIndex = 1;

    if (category) {
      query += ` AND category = $${paramIndex++}`;
      params.push(category);
    }

    if (language) {
      query += ` AND language = $${paramIndex++}`;
      params.push(language);
    }

    query += ` ORDER BY created_at DESC LIMIT $${paramIndex++} OFFSET $${paramIndex++}`;
    params.push(limit, offset);

    const articlesResult = await pool.query(query, params);
    
    let countQuery = 'SELECT COUNT(*) as total FROM articles WHERE 1=1';
    const countParams = [];
    let countIndex = 1;

    if (category) {
      countQuery += ` AND category = $${countIndex++}`;
      countParams.push(category);
    }

    if (language) {
      countQuery += ` AND language = $${countIndex++}`;
      countParams.push(language);
    }

    const countResult = await pool.query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].total);

    res.json({
      data: articlesResult.rows,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get single article
app.get('/api/articles/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM articles WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Article not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create article
app.post('/api/articles', async (req, res) => {
  try {
    const { title, content, category = 'news', source, image_url, ai_generated = false, language = 'zh' } = req.body;
    
    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    const result = await pool.query(
      `INSERT INTO articles (title, content, category, source, image_url, ai_generated, language) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [title, content, category, source || 'Manual', image_url || null, ai_generated, language]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Create error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get categories
app.get('/api/categories', async (req, res) => {
  try {
    const result = await pool.query('SELECT DISTINCT category FROM articles');
    res.json(result.rows.map(r => r.category));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Search articles
app.get('/api/search', async (req, res) => {
  try {
    const query = req.query.q || '';
    if (!query) {
      return res.json({ data: [] });
    }

    const result = await pool.query(
      `SELECT * FROM articles 
       WHERE title ILIKE $1 OR content ILIKE $1
       ORDER BY created_at DESC LIMIT 20`,
      [`%${query}%`]
    );

    res.json({ data: result.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get statistics
app.get('/api/stats', async (req, res) => {
  try {
    const totalResult = await pool.query('SELECT COUNT(*) as count FROM articles');
    const aiResult = await pool.query('SELECT COUNT(*) as count FROM articles WHERE ai_generated = true');
    const categoriesResult = await pool.query('SELECT category, COUNT(*) as count FROM articles GROUP BY category');
    const languageResult = await pool.query('SELECT language, COUNT(*) as count FROM articles GROUP BY language');

    res.json({
      total_articles: parseInt(totalResult.rows[0].count),
      ai_generated_articles: parseInt(aiResult.rows[0].count),
      categories: categoriesResult.rows,
      languages: languageResult.rows
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
