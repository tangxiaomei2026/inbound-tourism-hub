# 🌍 入境游中国平台 - 部署指南

## 快速开始（本地开发）

### 1️⃣ 安装依赖
```bash
cd inbound-tourism-hub
npm install
```

### 2️⃣ 启动服务
```bash
npm run dev
```

服务会启动在 `http://localhost:3000`

### 3️⃣ 测试 API
```bash
# 查看所有文章
curl http://localhost:3000/api/articles

# 查看统计
curl http://localhost:3000/api/stats

# 搜索文章
curl http://localhost:3000/api/search?q=春节
```

---

## 生成示例文章

### 方式 1：命令行生成
```bash
node scripts/daily-generate.js
```

### 方式 2：爬取新闻再生成
```bash
# 先爬取新闻
node scripts/scrape-news.js

# 然后生成文章
node scripts/daily-generate.js
```

---

## 🚀 生产部署

### 选项 A：Vercel（推荐快速部署）

#### 部署步骤：
1. 推送代码到 GitHub
2. 连接 Vercel（vercel.com）
3. 配置环境变量
4. 一键部署

#### GitHub 推送：
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/你的用户名/inbound-tourism-hub.git
git push -u origin main
```

#### Vercel 配置：
- 项目根目录：`.`
- 构建命令：`npm install`
- 启动命令：`node server.js`
- 环境变量：
  - `PORT=3000`
  - `NODE_ENV=production`

### 选项 B：Railway（支持 Node.js + Cron）

1. 访问 railway.app
2. 创建新项目 → GitHub 仓库
3. 配置起始命令：`npm start`
4. 添加环境变量
5. 启用持久化存储（用于 SQLite 数据库）

#### 配置定时任务：
创建 `railway.yml`：
```yaml
services:
  api:
    build:
      context: .
    env:
      PORT: 3000
    start: node server.js
  scheduler:
    build:
      context: .
    start: node scheduler.js
    healthcheck:
      interval: 60s
```

### 选项 C：Docker + 自建服务器

#### Dockerfile：
```dockerfile
FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000

CMD ["node", "server.js"]
```

#### Docker Compose：
```yaml
version: '3.8'
services:
  web:
    build: .
    ports:
      - "3000:3000"
    volumes:
      - ./data:/app/data
    environment:
      NODE_ENV: production
      PORT: 3000
```

启动：
```bash
docker-compose up -d
```

### 选项 D：PM2（Linux/Mac 长期运行）

#### 安装 PM2：
```bash
npm install -g pm2
```

#### 启动应用：
```bash
pm2 start server.js --name "tourism-hub"
pm2 start scheduler.js --name "scheduler"
pm2 save
pm2 startup
```

#### 检查状态：
```bash
pm2 status
pm2 logs tourism-hub
pm2 logs scheduler
```

#### 停止/重启：
```bash
pm2 stop all
pm2 restart all
pm2 delete all
```

---

## 🔧 定时任务配置

### 方式 1：使用应用内 Scheduler
```bash
node scheduler.js
```

时间表：
- **06:00** - 每日新闻爬取
- **08:00** - 每日文章生成
- **周日 02:00** - 数据清理

### 方式 2：Crontab（Linux/Mac）
```bash
# 编辑 crontab
crontab -e

# 添加以下行：
# 每天 6 点爬取新闻
0 6 * * * cd /path/to/inbound-tourism-hub && node scripts/scrape-news.js

# 每天 8 点生成文章
0 8 * * * cd /path/to/inbound-tourism-hub && node scripts/daily-generate.js

# 每周日凌晨 2 点清理数据
0 2 * * 0 cd /path/to/inbound-tourism-hub && npm run cleanup
```

---

## 🌐 域名 & SSL

### 绑定自定义域名：

**Vercel/Railway：**
- 在平台中添加自定义域
- 配置 DNS 记录指向平台

**自建服务器：**
```bash
# 使用 Nginx
sudo apt install nginx certbot python3-certbot-nginx

# 配置 SSL
sudo certbot certonly --nginx -d yourdomain.com

# 配置 Nginx 反向代理
# /etc/nginx/sites-available/default
server {
    listen 443 ssl;
    server_name yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 📊 数据管理

### 备份数据库：
```bash
cp data/tourism.db data/tourism.backup.$(date +%Y%m%d).db
```

### 恢复数据：
```bash
cp data/tourism.backup.20240311.db data/tourism.db
```

---

## 🐛 故障排查

### 1. 文章生成失败
```bash
# 检查 OpenClaw 是否运行
ps aux | grep openclaw

# 检查 Gateway
curl http://localhost:18789/health

# 查看日志
npm run dev
```

### 2. 数据库锁定
```bash
# 删除 WAL 文件
rm data/tourism.db-wal
rm data/tourism.db-shm
```

### 3. 端口占用
```bash
# 查看占用 3000 端口的进程
lsof -i :3000

# 更改端口
PORT=3001 npm run dev
```

---

## 📈 性能优化

### 1. 添加缓存
```bash
npm install redis
```

### 2. 数据库索引
```sql
CREATE INDEX idx_created_at ON articles(created_at);
CREATE INDEX idx_category ON articles(category);
```

### 3. CDN 加速
- 使用 Cloudflare（免费）
- 缓存 `/public` 目录中的静态文件

---

## 🔒 安全建议

1. **环境变量**
   - 不要提交 `.env` 到 Git
   - 在部署平台中设置敏感信息

2. **API 限流**
   ```bash
   npm install express-rate-limit
   ```

3. **CORS 配置**
   - 只允许自己的前端域名
   ```javascript
   app.use(cors({
     origin: 'https://yourdomain.com'
   }));
   ```

4. **SQL 注入防护**
   - 使用参数化查询（已实现）

---

## 💰 成本估算

| 平台 | 免费额度 | 月成本 |
|------|--------|--------|
| **Vercel** | 足够小项目 | $0-10 |
| **Railway** | 5$/月 | $5-20 |
| **Docker VPS** | - | $5-50 |

---

## 📞 需要帮助？

- GitHub Issues: 提交 bug 和功能请求
- 检查日志：`npm run dev` 或 `pm2 logs`
- OpenClaw 文档：https://docs.clawd.bot

---

祝你部署顺利！🚀
