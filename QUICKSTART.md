# ⚡ 快速启动手册

> 5 分钟内启动并运行你的 AI 驱动内容平台！

## 📋 前置检查清单

```bash
# 1️⃣ 检查 Node.js
node --version  # 需要 v22+

# 2️⃣ 检查 OpenClaw
openclaw --version

# 3️⃣ 检查 OpenClaw Gateway
curl http://localhost:18789/health
```

如果任何一项失败，请先完成设置。

---

## 🚀 3 步启动

### Step 1: 安装依赖（1 分钟）
```bash
cd /Users/tangxiaomei/Desktop/AI助手/inbound-tourism-hub
npm install
```

### Step 2: 启动服务（1 分钟）
```bash
npm run dev
```

你会看到：
```
✅ Database initialized
🚀 Server running at http://localhost:3000
📊 API available at http://localhost:3000/api
```

### Step 3: 打开网站（1 分钟）
访问：**http://localhost:3000** 🎉

---

## 🤖 生成第一篇 AI 文章（2 分钟）

### 新终端中运行：
```bash
cd /Users/tangxiaomei/Desktop/AI助手/inbound-tourism-hub

# 爬取示例新闻
node scripts/scrape-news.js

# 生成 AI 文章
node scripts/daily-generate.js
```

### 预期输出：
```
✅ Saved 9 data points to database
🤖 Generating article about: 入境游数据
✅ Article saved: [标题] (ID: 1)
✨ Daily generation completed!
```

### 刷新网站查看
回到 http://localhost:3000，你会看到生成的文章！

---

## 💻 常用命令速查

| 命令 | 作用 |
|------|------|
| `npm run dev` | 启动 Web 服务器 |
| `node scripts/scrape-news.js` | 爬取新闻 |
| `node scripts/daily-generate.js` | 生成文章 |
| `node scheduler.js` | 启动定时任务 |
| `curl http://localhost:3000/api/stats` | 查看统计 |
| `./start.sh` | 互动式启动（推荐） |

---

## 🌐 测试 API

```bash
# 查看所有文章
curl http://localhost:3000/api/articles

# 搜索文章
curl "http://localhost:3000/api/search?q=春节"

# 查看分类
curl http://localhost:3000/api/categories

# 查看统计
curl http://localhost:3000/api/stats
```

---

## 📁 项目文件速览

```
inbound-tourism-hub/
├── 📄 README.md              ← 项目介绍
├── 📄 PROJECT.md             ← 完整文档  
├── 📄 DEPLOYMENT.md          ← 部署指南
├── 🚀 server.js              ← 后端服务器
├── ⏰ scheduler.js            ← 定时任务
├── 🤖 scripts/
│   ├── daily-generate.js     ← 文章生成
│   └── scrape-news.js        ← 新闻爬取
├── 🌐 public/index.html      ← 网站页面
└── 📦 package.json           ← 依赖配置
```

---

## 🔥 下一步

### 运行定时任务（自动化）
```bash
# 后台启动 Web 服务
npm run dev &

# 启动定时任务
node scheduler.js

# 时间表：
# 06:00 AM - 爬取新闻
# 08:00 AM - 生成文章
```

### 自定义配置
编辑 `scheduler.js` 修改时间表：
```javascript
cron.schedule('0 6 * * *', () => {
  // 改为你想要的时间
});
```

### 部署到生产
- **快速**：使用 Vercel（见 DEPLOYMENT.md）
- **完整**：使用 Railway 或 Docker

详见 `DEPLOYMENT.md` 完整部署指南

---

## ✅ 检查清单

- [ ] Node.js v22+ 已安装
- [ ] OpenClaw 已配置
- [ ] Gateway 正在运行
- [ ] `npm install` 完成
- [ ] `npm run dev` 启动成功
- [ ] 网站可访问 http://localhost:3000
- [ ] 文章可成功生成

---

## 🆘 快速故障排除

### 问题 1：端口 3000 已被占用
```bash
# 使用其他端口
PORT=3001 npm run dev
```

### 问题 2：OpenClaw 生成失败
```bash
# 检查 Gateway
curl http://localhost:18789/health

# 如果失败，启动 Gateway
openclaw gateway --port 18789
```

### 问题 3：数据库错误
```bash
# 删除 WAL 文件
rm data/tourism.db-wal data/tourism.db-shm

# 重启服务
npm run dev
```

---

## 📞 获取帮助

1. 查看 `PROJECT.md` - 完整文档
2. 查看 `DEPLOYMENT.md` - 部署问题
3. 查看 OpenClaw 文档 - https://docs.clawd.bot
4. 查看源代码注释 - 代码都有详细注释

---

## 🎉 完成！

你现在有一个完整的 AI 驱动内容平台！

**享受你的创作！** 🌍✨

---

**提示**：使用 `./start.sh` 脚本可以快速启动，它会引导你选择运行模式。

```bash
./start.sh
# 然后选择 2 (启动 Web + 定时任务)
```
