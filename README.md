# 🌍 入境游中国 - AI 驱动的文化旅游平台

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-22+-green)](https://nodejs.org)
[![OpenClaw](https://img.shields.io/badge/OpenClaw-✓-blue)](https://docs.clawd.bot)

> 一个完全自动化的内容发布平台，每天自动收集入境游新闻、产品信息，通过 AI（OpenClaw + MiniMax-M2.1）生成优质文章，并发布到网站。

## ✨ 核心特性

- 🤖 **AI 文章生成** - 使用 OpenClaw + MiniMax-M2.1 自动撰写文章
- 🕷️ **多源数据收集** - 聚合入境游数据、新闻和产品信息
- ⏰ **完全自动化** - 每日定时爬取 → 生成 → 发布
- 🌐 **现代化网站** - 搜索、分类、统计，响应式设计
- 📊 **实时统计** - 文章总数、AI 生成数、分类统计
- 🔍 **全文搜索** - 快速查找感兴趣的内容
- 🎨 **精美 UI** - 金色渐变主题，毛玻璃效果

## 🚀 快速开始

### 前置要求
- Node.js 22+
- OpenClaw 已安装（配置好 Gateway 和 MiniMax 模型）
- macOS / Linux / Windows (WSL2)

### 1️⃣ 克隆或创建项目
```bash
cd /Users/tangxiaomei/Desktop/AI助手
# 项目已创建在 inbound-tourism-hub 目录
cd inbound-tourism-hub
```

### 2️⃣ 安装依赖
```bash
npm install
```

### 3️⃣ 启动服务
```bash
# 方式 1：使用启动脚本（推荐）
./start.sh

# 方式 2：直接启动
npm run dev

# 方式 3：完整启动（包括定时任务）
node server.js &
node scheduler.js
```

### 4️⃣ 打开网站
访问 **http://localhost:3000**

## 📖 使用指南

### 生成示例文章
```bash
# 爬取最新新闻
node scripts/scrape-news.js

# 生成 AI 文章
node scripts/daily-generate.js
```

### 手动添加文章
```bash
curl -X POST http://localhost:3000/api/articles \
  -H "Content-Type: application/json" \
  -d '{
    "title": "我的第一篇文章",
    "content": "这是内容...",
    "category": "news",
    "source": "手动添加"
  }'
```

### 搜索功能
在网站首页输入关键词，实时搜索所有文章。

## 🎯 工作流程

```
每天 6:00 AM  ├─ 🕷️  爬取新闻
              └─ 存储到数据库
              
每天 8:00 AM  ├─ 🤖 OpenClaw 生成文章
              └─ 发布到网站
              
用户访问     ├─ 🌐 查看文章
              ├─ 🔍 搜索和分类
              └─ 📊 查看统计信息
```

## 📂 项目结构

```
inbound-tourism-hub/
├── server.js                 # Express 后端（3000 端口）
├── scheduler.js              # 定时任务
├── public/index.html         # 前端页面
├── scripts/
│   ├── daily-generate.js     # AI 文章生成
│   └── scrape-news.js        # 新闻爬虫
├── data/tourism.db           # SQLite 数据库
├── DEPLOYMENT.md             # 详细部署指南
└── PROJECT.md                # 完整项目文档
```

## 🔌 API 接口

### 文章操作
```bash
# 获取所有文章
GET /api/articles?page=1&limit=10&category=news

# 搜索文章
GET /api/search?q=春节

# 获取分类
GET /api/categories

# 获取统计
GET /api/stats

# 创建文章
POST /api/articles
```

## ⏰ 定时任务

### 默认时间表
| 时间 | 任务 | 说明 |
|------|------|------|
| 06:00 | 爬取新闻 | 收集最新的入境游信息 |
| 08:00 | 生成文章 | AI 自动撰写文章 |
| 周日 02:00 | 数据清理 | 删除 30 天前的数据 |

### 自定义时间
编辑 `scheduler.js` 中的 cron 表达式，例如：
```javascript
cron.schedule('0 7 * * *', () => {
  // 改为每天 7 点执行
});
```

## 🌐 部署到生产环境

### 快速部署到 Vercel（免费）
```bash
# 1. 推送到 GitHub
git init
git add .
git commit -m "Initial commit"
git push -u origin main

# 2. 在 vercel.com 连接 GitHub 仓库
# 3. 一键部署完成！
```

### 部署到 Railway（支持 Cron）
详见 `DEPLOYMENT.md` 的"Railway"章节

### 自建服务器 (Docker)
```bash
docker build -t tourism-hub .
docker run -d -p 3000:3000 -v $(pwd)/data:/app/data tourism-hub
```

详见 `DEPLOYMENT.md` 的完整指南

## 🤖 OpenClaw 集成

本项目自动使用 OpenClaw 和 MiniMax-M2.1 模型生成文章。

### 确保 OpenClaw 已配置
```bash
# 检查 OpenClaw
openclaw --version

# 检查 Gateway
curl http://localhost:18789/health

# 查看配置
cat ~/.openclaw/openclaw.json | grep friday
```

### 手动测试生成
```bash
node scripts/daily-generate.js
```

## 📊 示例数据

项目包含示例新闻源，首次运行会自动生成示例文章，包括：
- ✈️ 入境游客数据和统计
- 🏛️ 文化旅游产品
- 🛍️ 新商业创新
- 📰 行业新闻

## 🎨 前端亮点

- **现代设计**：金色渐变主题 + 毛玻璃效果
- **字体搭配**：Playfair Display (标题) + Sora (正文)
- **响应式**：完美适配手机、平板、桌面
- **实时交互**：搜索、分类、分页无刷新切换
- **性能优化**：轻量级 HTML，无 npm 前端依赖

## 💡 使用场景

### 文旅部门
- 发布入境游相关资讯
- 展示文化景点和产品
- 实时跟踪入境游趋势

### 旅游平台
- 为携程、美团等聚合内容
- 自动化内容运营
- 数据驱动的决策支持

### 开发学习
- 学习 OpenClaw 集成
- 理解定时自动化
- 构建类似内容平台

## 🔧 故障排查

### 问题：OpenClaw 命令未找到
```bash
# 确保 OpenClaw 已安装
npm install -g openclaw@latest

# 检查版本
openclaw --version
```

### 问题：Gateway 连接失败
```bash
# 启动 Gateway
openclaw gateway --port 18789

# 验证运行
curl http://localhost:18789/health
```

### 问题：文章生成很慢
- 检查网络连接
- 查看 OpenClaw 日志
- 尝试手动测试：`openclaw agent --message "test"`

### 问题：数据库被锁定
```bash
# 删除 WAL 文件
rm data/tourism.db-wal
rm data/tourism.db-shm
```

## 📚 更多资源

- 📖 **完整文档**：查看 `PROJECT.md`
- 🚀 **部署指南**：查看 `DEPLOYMENT.md`
- 🔗 **OpenClaw 文档**：https://docs.clawd.bot
- 🎨 **Tailwind CSS**：https://tailwindcss.com

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License - 自由使用和修改

---

## 🎯 下一步

1. ✅ **运行项目** - `npm run dev`
2. ✅ **生成文章** - `node scripts/daily-generate.js`
3. ✅ **打开网站** - http://localhost:3000
4. ✅ **部署上线** - 按照 `DEPLOYMENT.md` 部署

## 🎉 享受！

有任何问题，查看项目文档或 OpenClaw 官方文档。

**祝你使用愉快！** 🌍✨
