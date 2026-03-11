# 🚀 如何发布你的网站

> 完整的发布指南 - 从本地开发到全球可访问

## 选择你的发布方式

根据你的需求选择最适合的方案：

### 🏆 推荐方案排序

1. **Railway**（推荐 ⭐⭐⭐⭐⭐）
   - ✅ 支持 Node.js
   - ✅ 支持定时任务（Cron）
   - ✅ 免费 $5/月 额度
   - ✅ 自动 SSL 证书
   - ⏱️ 部署时间：5 分钟

2. **Vercel**（快速部署）
   - ✅ 部署极简
   - ✅ 自动 SSL
   - ❌ 不太支持长时间运行任务
   - ⏱️ 部署时间：3 分钟

3. **Docker VPS**（完全控制）
   - ✅ 完全控制
   - ✅ 支持所有功能
   - ❌ 需要自己管理
   - ⏱️ 部署时间：20 分钟

---

## 方案 1：Railway（推荐）⭐

### 第 1 步：推送到 GitHub

```bash
cd /Users/tangxiaomei/Desktop/AI助手/inbound-tourism-hub

# 初始化 Git
git init
git add .
git commit -m "🚀 Initial commit: Inbound Tourism Hub"

# 创建 GitHub 仓库并推送
git remote add origin https://github.com/你的用户名/inbound-tourism-hub.git
git push -u origin main
```

### 第 2 步：在 Railway 部署

1. 访问 [railway.app](https://railway.app)
2. 使用 GitHub 登录
3. 点击 "New Project" → "Deploy from GitHub"
4. 选择你的 `inbound-tourism-hub` 仓库
5. Railway 会自动检测 Node.js 项目
6. 配置环境变量：
   - `NODE_ENV` = `production`
   - `PORT` = `3000`

### 第 3 步：添加持久化存储（用于数据库）

1. 在 Railway Dashboard
2. 点击项目 → "Volumes"
3. 添加 Volume：
   - Mount Path: `/app/data`
4. 这样你的数据库会被保存

### 第 4 步：获取域名

Railway 会自动分配一个 URL：
```
https://inbound-tourism-hub.up.railway.app
```

### 绑定自定义域名（可选）

1. 在 Railway Dashboard → Settings → Domains
2. 添加你的自定义域名
3. 配置 DNS 指向 Railway

### 验证部署

访问你的 Railway URL，应该能看到网站！

---

## 方案 2：Vercel（最快）

### 第 1 步：准备文件

Vercel 需要特殊的配置。创建 `vercel.json`：

```json
{
  "version": 2,
  "builds": [
    { "src": "server.js", "use": "@vercel/node" }
  ],
  "routes": [
    { "src": "/(.*)", "dest": "server.js" }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

### 第 2 步：推送到 GitHub

```bash
git add vercel.json
git commit -m "Add Vercel config"
git push
```

### 第 3 步：连接 Vercel

1. 访问 [vercel.com](https://vercel.com)
2. 使用 GitHub 登录
3. "Add New..." → "Project"
4. 导入 `inbound-tourism-hub` 仓库
5. Vercel 自动部署

### 警告 ⚠️

- Vercel 对长时间运行的任务（如 Cron）支持有限
- 建议仅用于展示网站，不要依赖定时任务

---

## 方案 3：Docker + VPS（完全控制）

### 第 1 步：创建 Dockerfile

项目根目录已包含 Dockerfile 支持。

### 第 2 步：选择 VPS 提供商

- **DigitalOcean** - 5$/月 Droplet
- **Linode** - 5$/月 Nanode
- **Vultr** - 2.5$/月 Cloud Compute
- **AWS** - 免费层

### 第 3 步：部署

```bash
# 在你的 VPS 上
git clone https://github.com/你的用户名/inbound-tourism-hub.git
cd inbound-tourism-hub

# 使用 Docker
docker build -t tourism-hub .
docker run -d \
  -p 80:3000 \
  -p 443:3000 \
  -v $(pwd)/data:/app/data \
  --name tourism \
  tourism-hub

# 或使用 Docker Compose
docker-compose up -d
```

### 第 4 步：配置 SSL（使用 Let's Encrypt）

```bash
# 在 VPS 上
sudo apt update
sudo apt install -y certbot nginx python3-certbot-nginx

# 获取证书
sudo certbot certonly --standalone -d yourdomain.com

# 配置 Nginx 反向代理
# /etc/nginx/sites-available/default
server {
    listen 443 ssl;
    server_name yourdomain.com;
    
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    
    location / {
        proxy_pass http://localhost:3000;
    }
}

# 重启 Nginx
sudo systemctl restart nginx
```

---

## 方案 4：PM2（本地 24/7 运行）

如果你想让电脑 24/7 运行这个项目：

### 安装 PM2

```bash
npm install -g pm2
```

### 启动应用

```bash
cd /Users/tangxiaomei/Desktop/AI助手/inbound-tourism-hub

# 启动 Web 服务
pm2 start server.js --name "tourism-web"

# 启动 Scheduler
pm2 start scheduler.js --name "tourism-scheduler"

# 保存配置
pm2 save

# 设置开机自启
pm2 startup
```

### 查看状态

```bash
pm2 status
pm2 logs
pm2 stop all
pm2 restart all
```

### 内网穿透（让别人访问你的电脑）

如果要让别人从外网访问你的电脑：

```bash
# 使用 ngrok
npm install -g ngrok

# 启动
ngrok http 3000

# 会生成一个公网 URL，例如：
# https://abc123.ngrok.io
```

---

## 📊 方案对比表

| 功能 | Railway | Vercel | Docker VPS | PM2 |
|------|---------|--------|-----------|-----|
| 部署简度 | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ |
| 定时任务 | ✅ | ❌ | ✅ | ✅ |
| 成本 | $5/月 | 免费-$20/月 | $5-50/月 | $0 |
| 自定义域名 | ✅ | ✅ | ✅ | ⚠️ |
| SSL 证书 | ✅ | ✅ | ✅ | ❌ |
| 推荐度 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐ |

---

## ✅ 部署前检查清单

部署前，确保完成以下步骤：

- [ ] 所有文件已提交到 Git
- [ ] .env 文件已配置（使用 .env.example 作为模板）
- [ ] package.json 依赖已安装
- [ ] 本地测试通过：`npm run dev`
- [ ] 数据库初始化成功
- [ ] OpenClaw 配置正确
- [ ] 生成示例文章测试成功

---

## 🔒 生产环境安全建议

### 1. 环境变量

**永远不要提交 `.env` 到 Git！**

```bash
# .gitignore
.env
.env.local
data/tourism.db
node_modules/
```

### 2. 数据库备份

```bash
# 每天备份
0 0 * * * cp /path/to/data/tourism.db /path/to/backups/tourism.db.$(date +\%Y\%m\%d)
```

### 3. API 限流

编辑 `server.js`，添加：

```javascript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});

app.use(limiter);
```

### 4. CORS 配置

```javascript
app.use(cors({
  origin: 'https://yourdomain.com'
}));
```

---

## 🆘 部署问题排查

### 问题 1：部署后页面显示错误

检查日志：
```bash
# Railway/Vercel 日志
npm start
# 查看输出

# PM2 日志
pm2 logs tourism-web
```

### 问题 2：定时任务不执行

- Railway：确保 Scheduler 进程已启动
- Docker：检查 container 中的 cron 是否运行
- PM2：检查 `pm2 status` 中 scheduler 是否在线

### 问题 3：数据库丢失

- 确保 Volume（Railway）或数据挂载（Docker）已配置
- 定期备份：`cp data/tourism.db data/backup.db`

---

## 📞 获取帮助

- Railway 文档：https://railway.app/docs
- Vercel 文档：https://vercel.com/docs
- OpenClaw 文档：https://docs.clawd.bot

---

## 🎉 完成！

部署成功后，你的网站将：
- ✅ 24/7 在线
- ✅ 每天自动生成文章
- ✅ 全世界都可以访问
- ✅ 有自己的域名

**享受你的 AI 驱动内容平台！** 🌍✨

---

**推荐流程**：
1. 先在本地测试（`npm run dev`）
2. 推送到 GitHub
3. 部署到 Railway
4. 绑定自定义域名
5. 享受！
