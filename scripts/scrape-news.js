import Database from 'better-sqlite3';
import axios from 'axios';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, '../data/tourism.db');

let db;
try {
  db = new Database(dbPath);
} catch (err) {
  console.error('❌ Failed to open database:', err);
  process.exit(1);
}

// 模拟新闻源数据（实际环境中可以替换为真实 API）
const mockNewsData = {
  '入境游数据': [
    { title: '文化和旅游部：2024年入境游客数创新高', content: '根据最新数据，今年上半年接待入境游客已突破1000万人次，同比增长超过30%。主要来源地为东亚、东南亚国家。' },
    { title: '北京成为入境游首选城市', content: '统计数据显示，北京吸引入境游客占全国总数的25%，故宫、长城等景点日均接待国际游客超过10万人次。' },
    { title: '高铁网络推动入境游增长', content: '中国高铁网络的完善使得入境游客能够快速到达各地景区，成都、西安、杭州等城市入境游增速均超过50%。' }
  ],
  '产品创新': [
    { title: '美团推出"文化导游"AI功能', content: '美团最新发布AI文化导游服务，支持多语言讲解，已覆盖全国500个景区。游客可以通过手机获得实时文化介绍。' },
    { title: '携程发布"入境游黑卡"会员计划', content: '携程针对国际游客推出专享会员卡，提供景区优先预订、导游优选等服务，目前已有10万国际会员。' },
    { title: '抖音国际版发起"发现中国"话题', content: '抖音国际版推出"发现中国"话题挑战，鼓励国际创作者分享中国旅游体验，相关视频播放量已超过10亿次。' }
  ],
  '新闻': [
    { title: '全国两会：加强入境旅游服务设施建设', content: '代表建议进一步完善机场、车站等入境游客集散地的标识系统，提高多语言服务水平。' },
    { title: '中国与东盟旅游合作深化', content: '中国与东盟国家签署旅游合作协议，计划2025年将相互入境游客数增加至5000万人次。' },
    { title: '非遗文化成为入境游热点', content: '调查显示，70%的入境游客对中国非遗文化表示感兴趣，传统工艺、民族表演等体验项目预订火热。' }
  ]
};

// 保存原始数据
function saveRawData(dataPoints) {
  try {
    const stmt = db.prepare(`
      INSERT INTO raw_data (title, content, category, data_type)
      VALUES (?, ?, ?, ?)
    `);

    let count = 0;
    for (const [dataType, items] of Object.entries(dataPoints)) {
      for (const item of items) {
        stmt.run(item.title, item.content, '新闻', dataType);
        count++;
      }
    }
    
    console.log(`✅ Saved ${count} data points to database`);
    return count;
  } catch (err) {
    console.error('❌ Save error:', err);
    return 0;
  }
}

// 获取真实新闻源的示例（可扩展）
async function fetchFromNewsAPIs() {
  const data = {};
  
  try {
    // 示例：从新闻 API 获取数据
    // 注意：实际使用需要有有效的 API Key
    console.log('📡 Attempting to fetch from news sources...');
    
    // 这里可以添加真实的 API 调用
    // const response = await axios.get('https://api.news.cn/...', { timeout: 5000 });
    
  } catch (err) {
    console.log('ℹ️  News API unavailable, using mock data');
  }

  return data;
}

// 主函数
async function scrapeNews() {
  console.log('🕷️  Starting news scraping...');
  console.log(`⏰ ${new Date().toLocaleString('zh-CN')}`);

  try {
    // 获取新闻源数据
    const externalData = await fetchFromNewsAPIs();
    
    // 合并数据
    const allData = {
      ...mockNewsData,
      ...externalData
    };

    // 保存到数据库
    const count = saveRawData(allData);

    // 显示统计
    console.log('\n📊 Data summary:');
    for (const [type, items] of Object.entries(allData)) {
      console.log(`  • ${type}: ${items.length} items`);
    }

    console.log('\n✨ News scraping completed!');
  } catch (err) {
    console.error('❌ Error during scraping:', err);
  } finally {
    db.close();
  }
}

// Run
scrapeNews().catch(console.error);
