#!/bin/bash

# 入境游中国平台 - 启动脚本

echo "🌍 启动入境游中国平台..."

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 22+"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"

# 检查依赖
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# 创建数据目录
mkdir -p data public

# 检查 OpenClaw
if ! command -v openclaw &> /dev/null; then
    echo "⚠️  OpenClaw not found. Install with: npm install -g openclaw"
    echo "   Continue anyway? (y/n)"
    read -r response
    if [ "$response" != "y" ]; then
        exit 1
    fi
fi

echo "✅ OpenClaw version: $(openclaw --version 2>/dev/null || echo 'Not installed')"

# 选择运行模式
echo ""
echo "选择运行模式:"
echo "1) 仅启动 Web 服务器"
echo "2) 启动 Web + 定时任务"
echo "3) 手动生成一篇文章"
echo "4) 爬取新闻"
echo ""
read -p "请选择 (1-4): " mode

case $mode in
    1)
        echo "🚀 Starting server only..."
        node server.js
        ;;
    2)
        echo "🚀 Starting server + scheduler..."
        node server.js &
        sleep 2
        node scheduler.js
        ;;
    3)
        echo "📝 Generating article..."
        node scripts/daily-generate.js
        ;;
    4)
        echo "🕷️  Scraping news..."
        node scripts/scrape-news.js
        ;;
    *)
        echo "❌ Invalid option"
        exit 1
        ;;
esac
