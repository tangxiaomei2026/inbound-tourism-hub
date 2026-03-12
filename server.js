import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

// Version: 2026-03-12-v4 - With memory database for Railway deployment

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// In-memory database
const memoryDB = {
  articles: [
    {
      id: 1,
      title: "中国入境游全面复苏：2026年政策与机遇深度解析",
      content: "随着全球疫情影响逐渐消退，中国入境旅游市场正在经历前所未有的复苏与增长。2026年，中国政府推出了一系列旨在吸引国际游客的新政策，从签证便利化到支付系统升级，从基础设施完善到文化体验创新全方位发力。根据中国文化和旅游部最新发布的数据，2026年第一季度，中国接待入境游客数量同比增长显著，已经恢复到了疫情前的水平。",
      category: "news",
      source: "AI生成",
      ai_generated: true,
      language: "zh",
      created_at: new Date().toISOString()
    },
    {
      id: 2,
      title: "Beijing Launches New Payment Facilitation Measures for Inbound Tourism",
      content: "Beijing has deployed POS machines supporting overseas bank cards at major scenic spots, hotels, and shopping malls, with volunteers providing payment guidance services. Key business districts have achieved full coverage of foreign card acceptance, and popular attractions such as the Forbidden City, Temple of Heaven, and Great Wall all support foreign card payments.",
      category: "policy",
      source: "AI Generated",
      ai_generated: true,
      language: "en",
      created_at: new Date().toISOString()
    },
    {
      id: 3,
      title: "Shanghai MICE Tourism Market Shows Strong Recovery",
      content: "Shanghai has vigorously promoted the conference and incentive tourism market, with the number of international conferences undertaken in the first quarter of 2026 increasing by more than 50% year-on-year. Major five-star hotels have launched exclusive services for inbound business travelers, and conference bookings are booming.",
      category: "news",
      source: "AI Generated",
      ai_generated: true,
      language: "en",
      created_at: new Date().toISOString()
    },
    {
      id: 4,
      title: "Chengdu Panda Cultural Experience Tours Become Popular for Inbound Travel",
      content: "As the hometown of giant pandas, Chengdu has launched a series of tourism products centered on panda culture that are deeply popular among international tourists. Panda volunteer experiences, panda base deep tours, and other projects have seen bookings increase by more than 200% year-on-year.",
      category: "product",
      source: "AI Generated",
      ai_generated: true,
      language: "en",
      created_at: new Date().toISOString()
    },
    {
      id: 5,
      title: "China's High-Speed Rail Network Facilitates Inbound Tourists' Deep Travel",
      content: "With over 40,000 kilometers of high-speed rail in operation, overseas tourists can purchase high-speed rail travel passes for unlimited rides within a specified time. Major stations are equipped with multilingual service signs, and foreign language service windows provide full services in languages other than Chinese.",
      category: "infrastructure",
      source: "AI生成",
      ai_generated: true,
      language: "zh",
      created_at: new Date().toISOString()
    },
    {
      id: 6,
      title: "西安丝绸之路主题游受热捧",
      content: "借助一带一路倡议的春风，西安市推出的丝绸之路主题旅游产品带领游客重走古代商路。西安城墙自行车、兵马俑深度探访等特色项目成为入境游客必选。",
      category: "product",
      source: "AI生成",
      ai_generated: true,
      language: "zh",
      created_at: new Date().toISOString()
    }
  ],
  nextId: 7
};

console.log('✅ Memory database initialized with', memoryDB.articles.length, 'articles');

// Routes

// Get all articles
app.get('/api/articles', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const category = req.query.category;
    const language = req.query.language;
    
    let articles = [...memoryDB.articles];
    
    if (category) {
      articles = articles.filter(a => a.category === category);
    }
    
    if (language) {
      articles = articles.filter(a => a.language === language);
    }
    
    // Sort by created_at desc
    articles.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    
    const total = articles.length;
    const offset = (page - 1) * limit;
    const paginatedArticles = articles.slice(offset, offset + limit);
    
    res.json({
      data: paginatedArticles,
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
    const article = memoryDB.articles.find(a => a.id === parseInt(req.params.id));
    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }
    res.json(article);
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

    const article = {
      id: memoryDB.nextId++,
      title,
      content,
      category,
      source: source || 'Manual',
      image_url: image_url || null,
      ai_generated,
      language,
      created_at: new Date().toISOString()
    };
    
    memoryDB.articles.push(article);
    
    res.status(201).json(article);
  } catch (err) {
    console.error('Create error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get categories
app.get('/api/categories', async (req, res) => {
  try {
    const categories = [...new Set(memoryDB.articles.map(a => a.category))];
    res.json(categories);
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

    const results = memoryDB.articles.filter(a => 
      a.title.toLowerCase().includes(query.toLowerCase()) || 
      a.content.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 20);

    res.json({ data: results });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get statistics
app.get('/api/stats', async (req, res) => {
  try {
    const total = memoryDB.articles.length;
    const aiGenerated = memoryDB.articles.filter(a => a.ai_generated).length;
    const categories = [...new Set(memoryDB.articles.map(a => a.category))];
    const languages = [...new Set(memoryDB.articles.map(a => a.language))];

    res.json({
      total_articles: total,
      ai_generated_articles: aiGenerated,
      categories: categories.map(c => ({ category: c, count: memoryDB.articles.filter(a => a.category === c).length })),
      languages: languages.map(l => ({ language: l, count: memoryDB.articles.filter(a => a.language === l).length }))
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    database: 'memory',
    articles: memoryDB.articles.length
  });
});

// Serve HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`📊 API available at http://localhost:${PORT}/api`);
  console.log(`💾 Using memory database with ${memoryDB.articles.length} articles`);
});
