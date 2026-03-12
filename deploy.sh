#!/bin/bash

echo "🚀 开始部署到Railway..."

# 检查railway CLI
if ! command -v railway &> /dev/null; then
    echo "📦 安装Railway CLI..."
    npm install -g @railway/cli
fi

# 登录Railway
echo "🔑 请登录Railway..."
railway login

# 链接到项目
echo "🔗 链接到项目 proud-serenity..."
railway link --project proud-serenity

# 部署
echo "📤 部署应用..."
railway up

echo "✅ 部署完成！"
echo "🌐 请访问Railway Dashboard查看域名"
