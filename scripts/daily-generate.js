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

// 获取最新收集的数据
function getLatestData() {
  const rawData = db.prepare(`
    SELECT * FROM raw_data 
    WHERE created_at > datetime('now', '-1 day')
    ORDER BY created_at DESC
    LIMIT 10
  `).all();

  return rawData;
}

// 使用 OpenClaw 生成文章
async function generateArticleWithOpenClaw(topic, dataPoints) {
  try {
    const message = `
请根据以下信息写一篇关于"${topic}"的文章，用于入境游文化旅游平台：

主要信息点：
${dataPoints.map(d => `- ${d}`).join('\n')}

要求：
1. 标题要吸引人，体现中国特色文化
2. 内容 300-500 字
3. 突出对入境游客的吸引力
4. 包含实际数据或案例
5. 以 Markdown 格式返回，仅包含标题和内容，无其他说明

格式：
# 标题

正文内容...
    `;

    // 调用 OpenClaw
    const result = execSync(`openclaw agent --message "${message.replace(/"/g, '\\"')}" --session-id daily-gen --thinking medium 2>&1`, {
      encoding: 'utf-8',
      maxBuffer: 1024 * 1024 * 10
    });

    // 解析输出
    const titleMatch = result.match(/# (.+)/);
    const contentMatch = result.match(/# .+\n\n([\s\S]+?)(?:\n\n|$)/);

    if (titleMatch && contentMatch) {
      return {
        title: titleMatch[1].trim(),
        content: contentMatch[1].trim(),
        success: true
      };
    }
    return { success: false, error: 'Failed to parse response' };
  } catch (err) {
    console.error('❌ OpenClaw error:', err.message);
    return { success: false, error: err.message };
  }
}

// 保存文章到数据库
function saveArticle(title, content, category, source) {
  try {
    const stmt = db.prepare(`
      INSERT INTO articles (title, content, category, source, ai_generated)
      VALUES (?, ?, ?, ?, 1)
    `);
    
    const result = stmt.run(title, content, category, source);
    console.log(`✅ Article saved: ${title} (ID: ${result.lastInsertRowid})`);
    return result.lastInsertRowid;
  } catch (err) {
    console.error('❌ Save error:', err);
    return null;
  }
}

// 主函数
async function generateDaily() {
  console.log('🤖 Starting daily article generation...');
  console.log(`⏰ ${new Date().toLocaleString('zh-CN')}`);

  try {
    // 获取最新数据
    const rawData = getLatestData();
    console.log(`📊 Found ${rawData.length} data points from last 24 hours`);

    if (rawData.length === 0) {
      console.log('ℹ️  No recent data to generate articles from');
      // 创建示例文章
      const exampleTopics = [
        {
          topic: '中国春节文化体验',
          dataPoints: [
            '今年春节预计接待入境游客500万人次',
            '传统灯笼制作在江南地区受欢迎',
            '美团推出"文化庙会"智能导览功能',
            '各地推出非遗文化体验项目'
          ]
        },
        {
          topic: '城市夜间经济发展',
          dataPoints: [
            '北京夜间消费同比增长25%',
            '携程发布"夜游指南"吸引入境游客',
            '成都宽窄巷子推出智能照明系统',
            '入境游客对地方特色美食需求增大'
          ]
        }
      ];

      for (const { topic, dataPoints } of exampleTopics) {
        console.log(`\n📝 Generating article about: ${topic}`);
        const result = await generateArticleWithOpenClaw(topic, dataPoints);
        
        if (result.success) {
          saveArticle(result.title, result.content, '新闻', 'AI生成');
        } else {
          console.log(`⚠️  Failed to generate: ${result.error}`);
        }
      }
    } else {
      // 按类别分组
      const groupedByType = {};
      rawData.forEach(d => {
        if (!groupedByType[d.data_type]) {
          groupedByType[d.data_type] = [];
        }
        groupedByType[d.data_type].push(d);
      });

      // 为每个类别生成文章
      for (const [dataType, items] of Object.entries(groupedByType)) {
        const dataPoints = items.map(d => d.title || d.content).slice(0, 5);
        console.log(`\n📝 Generating article for: ${dataType}`);
        
        const result = await generateArticleWithOpenClaw(dataType, dataPoints);
        
        if (result.success) {
          saveArticle(result.title, result.content, dataType, 'OpenClaw生成');
        } else {
          console.log(`⚠️  Failed to generate: ${result.error}`);
        }
      }
    }

    console.log('\n✨ Daily generation completed!');
  } catch (err) {
    console.error('❌ Error during generation:', err);
  } finally {
    db.close();
  }
}

// Run
generateDaily().catch(console.error);
