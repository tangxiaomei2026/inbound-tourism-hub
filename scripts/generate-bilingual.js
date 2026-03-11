import { execSync } from 'child_process';
import Database from 'better-sqlite3';
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

// 中文文章主题（面向国内/华人）
const chineseTopics = [
  {
    topic: '中国入境游最新数据',
    angle: '数据分析',
    keywords: ['入境游客', '旅游数据', '增长趋势']
  },
  {
    topic: '外国游客最爱的中国美食',
    angle: '美食文化',
    keywords: ['美食体验', '地方特色', '饮食文化']
  },
  {
    topic: '中国高铁旅游新体验',
    angle: '交通创新',
    keywords: ['高铁网络', '便捷出行', '旅游交通']
  },
  {
    topic: '中国非遗文化体验项目',
    angle: '文化传承',
    keywords: ['非遗体验', '传统工艺', '文化交流']
  },
  {
    topic: '中国智慧旅游新发展',
    angle: '科技创新',
    keywords: ['智慧旅游', '数字化', '科技赋能']
  },
  {
    topic: '中国入境游政策新动向',
    angle: '政策解读',
    keywords: ['签证便利', '入境政策', '旅游开放']
  },
  {
    topic: '中国热门旅游城市推荐',
    angle: '目的地推荐',
    keywords: ['旅游城市', '景点推荐', '旅游攻略']
  },
  {
    topic: '中国文化旅游新产品',
    angle: '产品创新',
    keywords: ['旅游产品', '文化体验', '创新服务']
  },
  {
    topic: '中国入境游客画像分析',
    angle: '市场分析',
    keywords: ['游客画像', '市场趋势', '消费行为']
  },
  {
    topic: '中国夜间经济发展',
    angle: '夜间经济',
    keywords: ['夜间旅游', '夜经济', '消费场景']
  }
];

// 英文文章主题（面向欧美，符合西方审美）
const englishTopics = [
  {
    topic: 'Why China Should Be Your Next Travel Destination',
    angle: 'travel inspiration',
    keywords: ['must-visit', 'hidden gems', 'authentic experience']
  },
  {
    topic: 'The Ultimate Guide to Chinese Food Tourism',
    angle: 'food culture',
    keywords: ['culinary journey', 'local flavors', 'foodie paradise']
  },
  {
    topic: 'China High-Speed Rail: The Future of Travel',
    angle: 'innovation',
    keywords: ['modern infrastructure', 'efficient travel', 'connectivity']
  },
  {
    topic: 'Living Heritage: Experiencing Traditional Chinese Culture',
    angle: 'cultural immersion',
    keywords: ['intangible heritage', 'authentic crafts', 'cultural exchange']
  },
  {
    topic: 'Smart Tourism: How Technology Transforms Travel in China',
    angle: 'technology',
    keywords: ['digital innovation', 'AI-powered', 'seamless experience']
  },
  {
    topic: 'China Visa Policy Updates: What Travelers Need to Know',
    angle: 'practical guide',
    keywords: ['visa-free', 'travel requirements', 'entry policy']
  },
  {
    topic: 'Top 10 Chinese Cities for International Travelers',
    angle: 'destination guide',
    keywords: ['best destinations', 'travel recommendations', 'city highlights']
  },
  {
    topic: 'Beyond the Great Wall: Unique Experiences in China',
    angle: 'off-the-beaten-path',
    keywords: ['hidden treasures', 'authentic experiences', 'local culture']
  },
  {
    topic: 'Understanding Chinese Travelers: A Market Analysis',
    angle: 'market insights',
    keywords: ['travel trends', 'consumer behavior', 'market opportunities']
  },
  {
    topic: 'China After Dark: Exploring the Night Economy',
    angle: 'nightlife culture',
    keywords: ['night markets', 'evening entertainment', '24-hour cities']
  }
];

// 使用 OpenClaw 生成中文文章
async function generateChineseArticle(topicInfo) {
  try {
    const message = `
请写一篇关于"${topicInfo.topic}"的中文文章，用于中国入境游文化旅游平台。

写作角度：${topicInfo.angle}
关键词：${topicInfo.keywords.join('、')}

要求：
1. 标题要新颖吸引人，体现中国特色，适合国内读者
2. 内容 400-600 字，信息丰富有深度
3. 包含具体数据、案例或实用信息
4. 语言生动，有感染力
5. 以 Markdown 格式返回，仅包含标题和内容

格式：
# 标题

正文内容...
    `;

    const result = execSync(`openclaw agent --message "${message.replace(/"/g, '\\"')}" --session-id chinese-gen --thinking medium 2>&1`, {
      encoding: 'utf-8',
      maxBuffer: 1024 * 1024 * 10,
      timeout: 60000
    });

    const titleMatch = result.match(/# (.+)/);
    const contentMatch = result.match(/# .+\n\n([\s\S]+?)(?:\n\n|$)/);

    if (titleMatch && contentMatch) {
      return {
        title: titleMatch[1].trim(),
        content: contentMatch[1].trim(),
        language: 'zh',
        success: true
      };
    }
    return { success: false, error: 'Failed to parse response' };
  } catch (err) {
    console.error('❌ Chinese article error:', err.message);
    return { success: false, error: err.message };
  }
}

// 使用 OpenClaw 生成英文文章
async function generateEnglishArticle(topicInfo) {
  try {
    const message = `
Write an article about "${topicInfo.topic}" for an international travel platform promoting China tourism.

Angle: ${topicInfo.angle}
Keywords: ${topicInfo.keywords.join(', ')}

Requirements:
1. Create a catchy, engaging headline that appeals to Western readers (US, UK, Europe)
2. Write 400-600 words with rich, compelling content
3. Include specific data, examples, or practical insights
4. Use engaging, journalistic style that captures attention
5. Focus on what makes China unique and appealing to international travelers
6. Return in Markdown format with title and content only

Format:
# Title

Body content...
    `;

    const result = execSync(`openclaw agent --message "${message.replace(/"/g, '\\"')}" --session-id english-gen --thinking medium 2>&1`, {
      encoding: 'utf-8',
      maxBuffer: 1024 * 1024 * 10,
      timeout: 60000
    });

    const titleMatch = result.match(/# (.+)/);
    const contentMatch = result.match(/# .+\n\n([\s\S]+?)(?:\n\n|$)/);

    if (titleMatch && contentMatch) {
      return {
        title: titleMatch[1].trim(),
        content: contentMatch[1].trim(),
        language: 'en',
        success: true
      };
    }
    return { success: false, error: 'Failed to parse response' };
  } catch (err) {
    console.error('❌ English article error:', err.message);
    return { success: false, error: err.message };
  }
}

// 保存文章到数据库
function saveArticle(title, content, category, source, language) {
  try {
    const stmt = db.prepare(`
      INSERT INTO articles (title, content, category, source, ai_generated, image_url)
      VALUES (?, ?, ?, ?, 1, ?)
    `);
    
    const langTag = language === 'en' ? '🇬🇧 English' : '🇨🇳 中文';
    const result = stmt.run(title, content, category, source, langTag);
    console.log(`✅ [${langTag}] Article saved: ${title.substring(0, 50)}... (ID: ${result.lastInsertRowid})`);
    return result.lastInsertRowid;
  } catch (err) {
    console.error('❌ Save error:', err);
    return null;
  }
}

// 主函数 - 生成20篇文章
async function generateBilingualArticles() {
  console.log('🤖 Starting bilingual article generation...');
  console.log(`⏰ ${new Date().toLocaleString('zh-CN')}`);
  console.log('📝 Target: 10 Chinese + 10 English = 20 articles\n');

  let chineseCount = 0;
  let englishCount = 0;

  try {
    // 生成10篇中文文章
    console.log('🇨🇳 Generating 10 Chinese articles...\n');
    for (let i = 0; i < chineseTopics.length; i++) {
      const topic = chineseTopics[i];
      console.log(`[${i + 1}/10] Generating: ${topic.topic}`);
      
      const result = await generateChineseArticle(topic);
      
      if (result.success) {
        saveArticle(result.title, result.content, '新闻', 'OpenClaw AI生成', 'zh');
        chineseCount++;
      } else {
        console.log(`⚠️  Failed: ${result.error}`);
      }
      
      // 间隔5秒，避免请求过快
      if (i < chineseTopics.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    }

    console.log('\n🇬🇧 Generating 10 English articles...\n');
    // 生成10篇英文文章
    for (let i = 0; i < englishTopics.length; i++) {
      const topic = englishTopics[i];
      console.log(`[${i + 1}/10] Generating: ${topic.topic}`);
      
      const result = await generateEnglishArticle(topic);
      
      if (result.success) {
        saveArticle(result.title, result.content, 'News', 'OpenClaw AI Generated', 'en');
        englishCount++;
      } else {
        console.log(`⚠️  Failed: ${result.error}`);
      }
      
      // 间隔5秒
      if (i < englishTopics.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    }

    console.log('\n✨ Generation completed!');
    console.log(`📊 Summary: ${chineseCount} Chinese + ${englishCount} English = ${chineseCount + englishCount} articles`);
    
  } catch (err) {
    console.error('❌ Error during generation:', err);
  } finally {
    db.close();
  }
}

// Run
generateBilingualArticles().catch(console.error);
