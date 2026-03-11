# 🌍 入境游中国 - 项目完整文档

## 项目概述

**入境游中国**是一个 AI 驱动的内容自动化平台，通过以下方式为入境游客提供价值：

1. **每日自动生成** - OpenClaw + MiniMax-M2.1 每天生成优质文章
2. **多源数据融合** - 收集入境游数据、新闻和产品信息
3. **实时网站展示** - 现代化 Web 界面，支持搜索和分类
4. **完全自动化** - 定时任务无需人工干预

---

## 📁 项目结构

```
inbound-tourism-hub/
├── server.js                 # Express 后端服务器
├── scheduler.js              # 定时任务调度
├── package.json              # 项目依赖
├── start.sh                  # 启动脚本
├── .env.example              # 环境变量模板
│
├── public/
│   └── index.html           # 主页面（React 式单页应用）
│
├── scripts/
│   ├── daily-generate.js    # 每日文章生成脚本
│   └── scrape-news.js       # 新闻爬虫脚本
│
├── data/
│   └── tourism.db           # SQLite 数据库（自动创建）
│
├── DEPLOYMENT.md            # 详细部署指南
├── PROJECT.md               # 本文件
└── LICENSE
```

---

## 🔄 工作流程

### 数据流图
```
┌─────────────────────────────────────────────────────┐
│           每日自动化工作流（Daily Automation）      │
└─────────────────────────────────────────────────────┘

6:00 AM ├─ 爬取新闻数据
        │  └─ 入境游数据、新闻源、产品信息
        │     ↓ 存储到 raw_data 表
        │
8:00 AM ├─ 调用 OpenClaw 生成文章
        │  └─ 读取 raw_data 中最新数据
        │     ↓ 通过 MiniMax-M2.1 处理
        │     ↓ 生成高质量文章
        │     ↓ 保存到 articles 表
        │
Online  ├─ 网站实时展示
        │  └─ 用户访问 http://localhost:3000
        │     ↓ 查看、搜索、分类文章
        │     ↓ 查看 AI 生成标记
        │
周日 2:00 AM - 数据清理
        └─ 删除 30 天前的原始数据
```

---

## 🗄️ 数据库架构

### 表 1: articles（文章表）
```sql
CREATE TABLE articles (
  id INTEGER PRIMARY KEY,
  title TEXT NOT NULL,              -- 文章标题
  content TEXT NOT NULL,            -- 文章内容
  category TEXT DEFAULT 'news',     -- 分类：新闻/产品/数据
  source TEXT,                      -- 来源说明
  image_url TEXT,                   -- 封面图片 URL
  ai_generated BOOLEAN DEFAULT 0,   -- 是否为 AI 生成
  created_at TIMESTAMP,             -- 创建时间
  updated_at TIMESTAMP              -- 更新时间
);
```

### 表 2: raw_data（原始数据表）
```sql
CREATE TABLE raw_data (
  id INTEGER PRIMARY KEY,
  title TEXT,                       -- 数据标题
  content TEXT,                     -- 数据内容
  category TEXT,                    -- 分类
  source TEXT,                      -- 来源
  data_type TEXT,                   -- 数据类型
  created_at TIMESTAMP              -- 创建时间
);
```

---

## 🚀 快速开始

### 第 1 步：安装依赖
```bash
cd inbound-tourism-hub
npm install
```

### 第 2 步：启动应用
```bash
npm run dev
# 或使用启动脚本
./start.sh
```

### 第 3 步：打开浏览器
访问 `http://localhost:3000`

---

## 📊 API 文档

### 获取所有文章
```bash
GET /api/articles?page=1&limit=10&category=news
```

**响应示例：**
```json
{
  "data": [
    {
      "id": 1,
      "title": "春节文化体验吸引国际游客",
      "content": "...",
      "category": "news",
      "source": "OpenClaw生成",
      "ai_generated": true,
      "created_at": "2024-03-11T08:30:00"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "pages": 3
  }
}
```

### 搜索文章
```bash
GET /api/search?q=春节
```

### 获取分类
```bash
GET /api/categories
```

### 获取统计
```bash
GET /api/stats
```

**响应示例：**
```json
{
  "total_articles": 42,
  "ai_generated_articles": 15,
  "categories": [
    { "category": "news", "count": 20 },
    { "category": "产品", "count": 15 },
    { "category": "数据", "count": 7 }
  ]
}
```

### 创建文章
```bash
POST /api/articles
Content-Type: application/json

{
  "title": "文章标题",
  "content": "文章内容...",
  "category": "news",
  "source": "手动添加",
  "image_url": "https://...",
  "ai_generated": false
}
```

---

## 🤖 OpenClaw 集成

### 文章生成提示词
```
请根据以下信息写一篇关于"{topic}"的文章，用于入境游文化旅游平台：

主要信息点：
- [数据点 1]
- [数据点 2]
- [数据点 3]

要求：
1. 标题要吸引人，体现中国特色文化
2. 内容 300-500 字
3. 突出对入境游客的吸引力
4. 包含实际数据或案例
5. 以 Markdown 格式返回
```

### 手动触发生成
```bash
# 生成一篇文章
node scripts/daily-generate.js

# 先爬取新闻，再生成
node scripts/scrape-news.js && node scripts/daily-generate.js
```

---

## ⏰ 定时任务配置

### 使用应用内 Scheduler
```bash
node scheduler.js
```

**时间表：**
- `0 6 * * *` - 每天 6:00 AM 爬取新闻
- `0 8 * * *` - 每天 8:00 AM 生成文章
- `0 2 * * 0` - 每周日 2:00 AM 清理数据

### 使用 Linux Crontab
```bash
crontab -e

# 添加以下行：
0 6 * * * cd /path/to/project && node scripts/scrape-news.js
0 8 * * * cd /path/to/project && node scripts/daily-generate.js
```

---

## 🎨 前端特性

### 设计特色
- ✨ 现代化渐变 UI（金色 + 深蓝色主题）
- 🎭 Playfair Display + Sora 字体搭配
- 🌊 毛玻璃效果（backdrop-filter）
- ⚡ 流畅动画和过渡效果
- 📱 完全响应式设计

### 功能
- 🔍 **搜索** - 实时搜索文章标题和内容
- 📂 **分类** - 按类别筛选文章
- 📊 **统计** - 显示文章总数、AI 生成数、分类数
- 🤖 **AI 标记** - 清晰标记 AI 生成文章
- 📄 **分页** - 支持多页浏览
- ⏱️ **时间戳** - 显示文章发布时间

---

## 🌐 部署方案对比

| 方案 | 优点 | 缺点 | 成本 |
|------|------|------|------|
| **Vercel** | 部署简单，自动 SSL | 对长时间运行不友好 | 免费-10$/月 |
| **Railway** | 支持 Cron，易用 | 需要付费存储 | 5-20$/月 |
| **Docker VPS** | 完全控制，灵活 | 需要自己管理 | 5-50$/月 |
| **PM2 (本地)** | 无成本，完全控制 | 需要 24/7 电脑运行 | $0 |

**推荐方案**：Railway 或 Docker VPS（支持定时任务）

详见 `DEPLOYMENT.md`

---

## 💡 使用场景

### 1. 文旅局官方用途
- 发布入境游相关政策
- 展示文化景点和产品
- 吸引入境游客

### 2. 旅游平台数据源
- 为携程、美团等提供内容
- 聚合产品新闻和更新
- 实时跟踪入境游趋势

### 3. AI 内容创作学习
- 学习如何整合 OpenClaw
- 理解定时自动化流程
- 构建类似内容平台

---

## 🔧 扩展功能思路

### 短期（1-2 周）
- [ ] 添加用户评论功能
- [ ] 实现文章点赞和收藏
- [ ] 多语言支持（英文、日文等）
- [ ] 邮件订阅功能

### 中期（1-3 个月）
- [ ] 社交媒体分享集成
- [ ] 推荐系统（基于浏览历史）
- [ ] 行业数据可视化
- [ ] 用户账户系统

### 长期（3+ 个月）
- [ ] 实时直播功能
- [ ] 虚拟旅游体验（WebXR）
- [ ] 多语言智能翻译
- [ ] 行为分析和热力图

---

## 📈 性能指标

### 目标
- ⚡ 首页加载 < 2 秒
- 📊 支持 1000+ 并发用户
- 🔄 API 响应时间 < 200ms
- 🤖 AI 生成 1 篇文章 < 30 秒

### 监测
```bash
# 查看性能
curl http://localhost:3000/api/health

# 数据库查询性能
PRAGMA query_only = ON;
EXPLAIN QUERY PLAN SELECT * FROM articles WHERE category = 'news';
```

---

## 🔒 安全清单

- [x] SQL 注入防护（参数化查询）
- [ ] API 速率限制
- [ ] CORS 配置
- [ ] 环境变量管理
- [ ] 数据库备份策略
- [ ] 错误日志隐藏

---

## 🆘 故障排查

### 问题 1：OpenClaw 生成失败
```bash
# 检查 OpenClaw
openclaw --version
openclaw doctor

# 检查 Gateway
curl http://localhost:18789/health
```

### 问题 2：数据库错误
```bash
# 检查数据库
sqlite3 data/tourism.db ".tables"

# 恢复数据库
rm data/tourism.db-wal
rm data/tourism.db-shm
```

### 问题 3：端口冲突
```bash
# 找到占用 3000 的进程
lsof -i :3000

# 改用其他端口
PORT=3001 npm run dev
```

---

## 📚 参考资源

- **OpenClaw 文档**：https://docs.clawd.bot
- **Express.js**：https://expressjs.com
- **SQLite**：https://www.sqlite.org
- **Tailwind CSS**：https://tailwindcss.com

---

## 📄 许可证

MIT License - 可自由使用和修改

---

## 🤝 反馈和贡献

欢迎提交 Issue 和 Pull Request！

---

**最后更新**：2024 年 3 月 11 日  
**项目状态**：✅ 生产就绪
