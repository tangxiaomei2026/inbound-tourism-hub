# 🚀 Railway 部署完整指南

> 一步步教你在 Railway 上部署这个项目

## 📋 你现在的情况

✅ 代码已提交到本地 Git  
✅ 项目结构完整  
✅ 依赖配置正确  

现在需要：
1. 推送到 GitHub
2. 在 Railway 连接部署
3. 配置环境变量
4. 启用定时任务

---

## 第 1 步：创建 GitHub 仓库

### 1.1 访问 GitHub

1. 打开 https://github.com/new
2. 登录你的 GitHub 账号（如果没有请先注册：https://github.com/signup）

### 1.2 创建新仓库

在 GitHub 上创建一个新仓库，参数如下：

| 字段 | 值 |
|------|-----|
| **Repository name** | `inbound-tourism-hub` |
| **Description** | `AI-powered inbound tourism content platform` |
| **Public/Private** | Public（推荐）或 Private |
| **Initialize** | 不勾选（我们已有代码） |

点击 "Create repository"

### 1.3 获取仓库 URL

仓库创建后，你会看到一个 URL，格式如下：

```
https://github.com/你的用户名/inbound-tourism-hub.git
```

**复制这个 URL！** 后面会用到。

---

## 第 2 步：推送到 GitHub

在终端中执行以下命令：

```bash
cd /Users/tangxiaomei/Desktop/AI助手/inbound-tourism-hub

# 添加远程仓库（替换成你的 URL）
git remote add origin https://github.com/你的用户名/inbound-tourism-hub.git

# 推送到 GitHub
git push -u origin main
```

**可能遇到的问题**：
- 如果遇到 "permission denied"，可能是 SSH 密钥问题
- 解决：使用 HTTPS 加上 Personal Access Token
  ```bash
  git remote remove origin
  git remote add origin https://你的用户名:你的token@github.com/你的用户名/inbound-tourism-hub.git
  git push -u origin main
  ```

验证推送成功：
- 打开 https://github.com/你的用户名/inbound-tourism-hub
- 应该能看到你的代码文件

---

## 第 3 步：在 Railway 部署

### 3.1 访问 Railway

1. 打开 https://railway.app
2. 使用 GitHub 账号登录（点击 "Login with GitHub"）

### 3.2 创建新项目

1. 登录后，点击 "New Project"
2. 选择 "Deploy from GitHub"

### 3.3 连接 GitHub 仓库

1. 授权 Railway 访问你的 GitHub
2. 搜索并选择 `inbound-tourism-hub` 仓库
3. 点击 "Deploy"

Railway 会自动检测项目类型（Node.js）并开始构建。

构建需要 2-3 分钟，你可以在 Dashboard 中查看进度。

---

## 第 4 步：配置环境变量

### 4.1 打开项目设置

在 Railway Dashboard 中：
1. 点击你的项目 "inbound-tourism-hub"
2. 点击 "Variables" 标签

### 4.2 添加环境变量

添加以下变量：

```
NODE_ENV=production
PORT=3000
```

点击 "Deploy" 重新部署。

---

## 第 5 步：启用持久化存储（保存数据）

SQLite 数据库需要持久化存储，否则重启后数据会丢失。

### 5.1 添加 Volume

在 Railway Dashboard：
1. 项目 → "Volumes" 标签
2. 点击 "+ Add Volume"
3. 配置如下：

| 字段 | 值 |
|------|-----|
| **Mount Path** | `/app/data` |
| **Size** | 1 GB（足够用） |

### 5.2 验证

重新部署后，数据会被保存。

---

## 第 6 步：获取你的公网 URL

部署完成后，Railway 会生成一个公网 URL，格式如下：

```
https://inbound-tourism-hub-production.up.railway.app
```

✅ **你的网站现在在线了！**

打开这个 URL，应该能看到你的网站。

---

## 第 7 步：启用定时任务

Railway 支持多个进程。我们需要启动 scheduler。

### 7.1 创建 Procfile

在项目根目录创建 `Procfile` 文件：

```
web: node server.js
scheduler: node scheduler.js
```

### 7.2 推送更新

```bash
cd /Users/tangxiaomei/Desktop/AI助手/inbound-tourism-hub

git add Procfile
git commit -m "Add Procfile for scheduler"
git push origin main
```

### 7.3 Railway 会自动重新构建

稍等几分钟，Railway 会看到 Procfile 并启动两个进程：
- **web** - Web 服务器
- **scheduler** - 定时任务

在 Railway Dashboard 可以看到两个进程都在运行。

---

## 第 8 步：绑定自定义域名（可选）

如果你想用自己的域名而不是 railway.app 的域名：

### 8.1 在 Railway 添加域名

1. 项目 → "Settings" → "Domains"
2. 点击 "+ Add Domain"
3. 输入你的域名，例如 `tourism.example.com`

### 8.2 配置 DNS

Railway 会显示要配置的 DNS 记录。
根据你的域名提供商（GoDaddy、Namecheap 等）配置 DNS。

通常是添加一条 CNAME 记录指向 Railway 的服务器。

---

## ✅ 检查清单

部署完成后，验证以下内容：

- [ ] GitHub 仓库已创建
- [ ] 代码已推送到 GitHub
- [ ] Railway 项目已创建
- [ ] 网站可以访问（railway.app URL）
- [ ] 数据库持久化已配置
- [ ] Scheduler 进程正在运行
- [ ] 可以手动触发定时任务验证

---

## 🔍 验证部署

### 访问网站

打开你的 Railway URL，应该能看到网站首页。

### 查看日志

在 Railway Dashboard：
1. 点击 "Logs"
2. 应该能看到服务器启动日志

### 手动触发爬虫和生成

访问 API：

```bash
# 注意：替换成你的 Railway URL
curl https://inbound-tourism-hub-production.up.railway.app/api/stats
```

应该返回统计数据。

### 等待定时任务

- 每天 06:00 AM - 自动爬取新闻
- 每天 08:00 AM - 自动生成文章

如果不想等，可以手动触发（后面有方法）。

---

## 🆘 故障排查

### 问题 1：部署失败

查看 Railway 的 Build Logs：
1. 项目 → "Deploy"
2. 查看最新的构建日志
3. 查看错误信息

常见原因：
- package.json 有问题
- Node.js 版本不兼容
- 缺少某个依赖

### 问题 2：网站显示错误

检查运行日志：
1. 项目 → "Logs"
2. 查看错误堆栈跟踪

### 问题 3：定时任务不执行

确保：
1. Procfile 已正确创建
2. Scheduler 进程在 Railway Dashboard 中显示为 "Running"
3. OpenClaw 已正确配置

---

## 💡 进阶：手动触发任务

如果不想等每天的定时任务，可以手动触发。

创建一个简单的 API 端点用于测试。

编辑 `server.js`，添加：

```javascript
// 手动触发生成（仅开发用）
app.post('/api/admin/generate', async (req, res) => {
  try {
    // 这里调用你的生成脚本
    res.json({ message: '文章生成中...' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
```

---

## 📈 监测成本

Railway 提供 $5/月的免费额度，足够这个项目使用。

查看实时成本：
- 项目 → "Usage"

---

## 🎉 完成！

你的网站现在：
- ✅ 在互联网上 24/7 运行
- ✅ 每天自动生成文章
- ✅ 全球用户都可以访问
- ✅ 支持自定义域名

**享受你的 AI 驱动内容平台！** 🌍✨

---

## 📞 需要帮助？

- Railway 文档：https://docs.railway.app
- OpenClaw 文档：https://docs.clawd.bot
- GitHub 文档：https://docs.github.com

---

**下一步**：
1. 创建 GitHub 账号（如果没有）
2. 按照本指南创建仓库
3. 在 Railway 部署
4. 分享你的网站链接！
