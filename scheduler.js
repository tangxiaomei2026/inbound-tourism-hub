import cron from 'node-cron';
import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log('📅 Scheduler initialized');

// Daily news scraping at 6 AM
cron.schedule('0 6 * * *', () => {
  console.log(`\n🕷️  [${new Date().toLocaleString('zh-CN')}] Running daily news scraping...`);
  try {
    execSync(`node ${path.join(__dirname, 'scripts/scrape-news.js')}`, { stdio: 'inherit' });
  } catch (err) {
    console.error('❌ Scraping failed:', err);
  }
});

// Daily article generation at 8 AM
cron.schedule('0 8 * * *', () => {
  console.log(`\n🤖 [${new Date().toLocaleString('zh-CN')}] Running daily article generation...`);
  try {
    execSync(`node ${path.join(__dirname, 'scripts/daily-generate.js')}`, { stdio: 'inherit' });
  } catch (err) {
    console.error('❌ Generation failed:', err);
  }
});

// Cleanup old raw data every week
cron.schedule('0 2 * * 0', () => {
  console.log(`\n🧹 [${new Date().toLocaleString('zh-CN')}] Running cleanup...`);
  try {
    const Database = require('better-sqlite3');
    const db = new Database(path.join(__dirname, 'data/tourism.db'));
    db.prepare(`
      DELETE FROM raw_data 
      WHERE created_at < datetime('now', '-30 days')
    `).run();
    console.log('✅ Cleanup completed');
    db.close();
  } catch (err) {
    console.error('❌ Cleanup failed:', err);
  }
});

console.log(`
✨ Scheduler configured:
  • Daily news scraping: 06:00 AM
  • Daily article generation: 08:00 AM
  • Weekly cleanup: Sunday 02:00 AM
`);
