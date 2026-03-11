# ✅ Railway 部署检查清单

> 一份分步骤的部署指南，确保每一步都不遗漏

## 📝 前置准备

在开始前，确保你有：

- [ ] GitHub 账号（如果没有，去 https://github.com/signup 注册）
- [ ] Railway 账号（去 https://railway.app 注册，使用 GitHub 登录即可）
- [ ] 本项目代码已提交到本地 Git ✅ 已完成

---

## 🔧 第 1 步：创建 GitHub 仓库

### 时间：5 分钟

1. [ ] 打开 https://github.com/new
2. [ ] 输入仓库名称：`inbound-tourism-hub`
3. [ ] 输入描述：`AI-powered inbound tourism content platform`
4. [ ] 选择 Public 或 Private
5. [ ] **不**勾选 "Initialize this repository with:"
6. [ ] 点击 "Create repository"
7. [ ] 复制仓库 URL（格式：`https://github.com/你的用户名/inbound-tourism-hub.git`）

### 📌 保存你的 GitHub 仓库 URL：
```
https://github.com/___你的用户名___/inbound-tourism-hub.git
```

---

## 📤 第 2 步：推送代码到 GitHub

### 时间：2 分钟

在终端执行以下命令：

```bash
cd /Users/tangxiaomei/Desktop/AI助手/inbound-tourism-hub

# 添加远程仓库（用你的 URL 替换 ____)
git remote add origin https://github.com/____你的用户名____/inbound-tourism-hub.git

# 推送到 GitHub
git push -u origin main
```

### 验证

- [ ] 打开 https://github.com/你的用户名/inbound-tourism-hub
- [ ] 应该能看到你的代码文件（server.js, public/index.html 等）

---

## 🚀 第 3 步：在 Railway 部署

### 时间：5 分钟

1. [ ] 打开 https://railway.app
2. [ ] 使用 GitHub 账号登录
3. [ ] 点击 "New Project"
4. [ ] 选择 "Deploy from GitHub"
5. [ ] 授权 Railway 访问你的 GitHub
6. [ ] 搜索 `inbound-tourism-hub`
7. [ ] 点击选择这个仓库
8. [ ] 点击 "Deploy"

### 等待构建

- [ ] Railway 开始构建（显示 "Building..."）
- [ ] 构建完成（通常 2-3 分钟）
- [ ] 出现 "Deployment successful"

### 📌 保存你的 Railway URL：

部署完成后，你会看到一个类似这样的 URL：
```
https://inbound-tourism-hub-production.up.railway.app
```

打开这个 URL，应该能看到你的网站！✨

---

## ⚙️ 第 4 步：配置环境变量

### 时间：1 分钟

在 Railway Dashboard：

1. [ ] 点击你的项目
2. [ ] 点击 "Variables" 标签
3. [ ] 添加以下变量：

```
NODE_ENV = production
PORT = 3000
```

4. [ ] 点击 "Save" 或 "Deploy"

---

## 💾 第 5 步：启用数据库持久化

### 时间：2 分钟

在 Railway Dashboard：

1. [ ] 点击你的项目
2. [ ] 点击 "Volumes" 标签
3. [ ] 点击 "+ Add Volume"
4. [ ] 输入：
   - **Mount Path**: `/app/data`
   - **Size**: `1 GB`
5. [ ] 点击 "Create"

这样数据库不会在重启时丢失。

---

## 📅 第 6 步：启用定时任务

### 时间：1 分钟

我们已经创建了 `Procfile` 文件。推送到 GitHub 后，Railway 会自动读取它。

在 Railway Dashboard：

1. [ ] 项目已自动重新部署
2. [ ] 点击 "Services" 或 "Deployments"
3. [ ] 应该看到两个运行中的进程：
   - `web` - Web 服务器
   - `scheduler` - 定时任务

### 定时任务时间表

- [ ] **每天 06:00 AM** - 自动爬取新闻
- [ ] **每天 08:00 AM** - 自动生成文章
- [ ] **每周日 02:00 AM** - 数据清理

---

## 🎯 第 7 步：验证部署成功

### 网站访问

1. [ ] 打开你的 Railway URL
2. [ ] 应该能看到网站首页
3. [ ] 可以搜索、分类、查看统计

### API 验证

```bash
# 替换成你的 Railway URL
curl https://inbound-tourism-hub-production.up.railway.app/api/stats

# 应该返回 JSON：
# {
#   "total_articles": 0,
#   "ai_generated_articles": 0,
#   "categories": []
# }
```

### 检查日志

1. [ ] 在 Railway Dashboard 点击 "Logs"
2. [ ] 应该能看到服务器启动日志

---

## 🌐 第 8 步：绑定自定义域名（可选）

### 时间：10 分钟（如果你有自己的域名）

如果你有自己的域名（例如 `tourism.example.com`），可以绑定：

1. [ ] 在 Railway Dashboard 点击 "Settings"
2. [ ] 点击 "Domains"
3. [ ] 点击 "+ Add Domain"
4. [ ] 输入你的域名
5. [ ] Railway 会显示 DNS 配置
6. [ ] 在你的域名提供商（GoDaddy、Namecheap 等）配置 DNS
7. [ ] 等待 DNS 生效（通常 24 小时内）

---

## 📊 现在你的网站有：

- ✅ 24/7 在线运行
- ✅ 每天自动生成文章
- ✅ 全球用户可访问
- ✅ 数据持久化
- ✅ 定时任务自动执行
- ✅ 可绑定自定义域名

---

## 🎉 完成！

🌍 **你的 AI 驱动文化旅游平台现在在线了！**

### 分享你的成果

- 📱 分享你的 Railway URL 给朋友
- 💾 保存这个 URL：`https://inbound-tourism-hub-production.up.railway.app`
- 🔗 如果绑定了域名，分享你的域名

---

## 🆘 遇到问题？

### 问题：部署失败

查看 Railway 的 Build Logs：
1. 项目 → "Deploy"
2. 查看最新的构建日志
3. 看错误信息

### 问题：网站无法访问

1. 检查 Railway 的 "Services" 是否显示 "Running"
2. 查看 "Logs" 中的错误信息
3. 确保环境变量已正确设置

### 问题：定时任务不执行

1. 确保 Procfile 已推送到 GitHub
2. Railway 看到 Procfile 会自动重新部署
3. 检查 "Services" 中 scheduler 是否在运行

---

## 📞 获取帮助

- Railway 文档：https://docs.railway.app
- OpenClaw 文档：https://docs.clawd.bot
- GitHub 文档：https://docs.github.com

---

## ✨ 接下来的步骤

### 短期（1 周）
- [ ] 等待定时任务自动执行
- [ ] 观察生成的文章质量
- [ ] 根据需要调整提示词

### 中期（1 个月）
- [ ] 优化文章生成质量
- [ ] 添加更多数据源
- [ ] 改进网站设计

### 长期（持续）
- [ ] 收集用户反馈
- [ ] 持续迭代优化
- [ ] 扩展功能

---

## 🎊 祝贺你！

你现在有一个完整的、在互联网上运行的 AI 驱动内容平台！

**享受你的创作！** 🚀✨

---

**最后一步**：
1. 完成上面的每一个检查项
2. 打开你的 Railway URL 看看
3. 分享给朋友（可选）

让我知道你成功了！ 🎉
