#!/bin/bash

echo "🚀 启动 Qiankun 微前端项目..."
echo ""

# 检查是否安装了依赖
if [ ! -d "main-app/node_modules" ]; then
  echo "⚠️  主应用缺少依赖，正在安装..."
  cd main-app && npm install && cd ..
fi

if [ ! -d "micro-app-react18/node_modules" ]; then
  echo "⚠️  React 18 子应用缺少依赖，正在安装..."
  cd micro-app-react18 && npm install && cd ..
fi

if [ ! -d "micro-app-react17/node_modules" ]; then
  echo "⚠️  React 17 子应用缺少依赖，正在安装..."
  cd micro-app-react17 && npm install && cd ..
fi

echo ""
echo "✅ 依赖检查完成"
echo ""
echo "📦 启动所有应用..."
echo ""
echo "  - 主应用: http://localhost:3000"
echo "  - React 18 子应用: http://localhost:3001"
echo "  - React 17 子应用: http://localhost:3002"
echo ""

# 使用 osascript 在新的 Terminal 窗口中运行每个应用
osascript -e 'tell app "Terminal" to do script "cd '"$(pwd)"'/main-app && npm start"'
sleep 2
osascript -e 'tell app "Terminal" to do script "cd '"$(pwd)"'/micro-app-react18 && npm start"'
sleep 2
osascript -e 'tell app "Terminal" to do script "cd '"$(pwd)"'/micro-app-react17 && npm start"'

echo "✅ 所有应用已在新窗口中启动！"
echo ""
echo "💡 提示：请等待所有应用启动完成后，访问 http://localhost:3000"
