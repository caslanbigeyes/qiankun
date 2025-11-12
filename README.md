# 🚀 Qiankun 微前端难点验证项目

这是一个完整的 qiankun 微前端示例项目，用于验证和解决微前端开发中的常见难点。

## 📦 项目结构

```
qiankun/
├── main-app/              # 主应用（React + Qiankun）
├── micro-app-react18/     # React 18 子应用
├── micro-app-react17/     # React 17 子应用
├── start-all.sh           # 一键启动脚本
└── README.md              # 项目文档
```

## ✨ 功能特性

本项目演示了以下微前端难点的解决方案：

### 1️⃣ 依赖版本冲突
- **问题**：主应用和子应用可能使用不同版本的 React
- **解决方案**：
  - Webpack UMD 打包配置
  - 独立的 library 命名空间
  - 避免全局变量污染

### 2️⃣ 全局状态同步
- **问题**：主应用登录后，子应用需要获取登录状态
- **解决方案**：
  - 使用 `BroadcastChannel` 实现跨应用状态同步
  - 实时监听登录/登出事件
  - 支持多窗口状态同步

### 3️⃣ 样式隔离
- **问题**：不同应用的样式可能互相污染
- **解决方案**：
  - qiankun 的 `experimentalStyleIsolation` 配置
  - CSS Modules
  - 独立的样式命名空间

### 4️⃣ 性能优化
- **问题**：子应用首次加载慢
- **解决方案**：
  - 开启 qiankun 预加载（`prefetch: true`）
  - 合理的代码分割
  - 静态资源 CDN 缓存

### 5️⃣ 子应用通信
- **问题**：子应用之间需要通信（非父子关系）
- **解决方案**：
  - 实现全局 EventBus
  - 支持事件订阅/发布
  - 解耦的消息传递机制

## 🚀 快速开始

### 方式一：使用一键启动脚本（推荐）

```bash
./start-all.sh
```

脚本会自动：
1. 检查并安装依赖
2. 在新的 Terminal 窗口中启动所有应用
3. 自动打开浏览器访问主应用

### 方式二：手动启动

**1. 安装依赖**

```bash
# 主应用
cd main-app && npm install

# React 18 子应用
cd ../micro-app-react18 && npm install

# React 17 子应用
cd ../micro-app-react17 && npm install
```

**2. 启动应用（需要开启 3 个终端窗口）**

```bash
# 终端 1 - 启动主应用
cd main-app
npm start

# 终端 2 - 启动 React 18 子应用
cd micro-app-react18
npm start

# 终端 3 - 启动 React 17 子应用
cd micro-app-react17
npm start
```

**3. 访问应用**

- 主应用：http://localhost:3000
- React 18 子应用（可独立访问）：http://localhost:3001
- React 17 子应用（可独立访问）：http://localhost:3002

## 🧪 验证难点

### 验证登录状态同步
1. 访问主应用 http://localhost:3000
2. 点击"模拟登录"按钮
3. 切换到 React 18 或 React 17 子应用
4. 观察子应用中的登录状态是否同步更新
5. 点击"登出"按钮，观察状态同步

### 验证子应用通信
1. 切换到 React 18 子应用
2. 点击"发送消息到 React 17"按钮
3. 切换到 React 17 子应用
4. 查看消息记录，应该能看到来自 React 18 的消息
5. 反向操作也可以验证

### 验证样式隔离
1. 在浏览器开发者工具中检查元素
2. 观察不同子应用的样式是否互相隔离
3. 主应用的样式不会影响子应用

### 验证性能优化
1. 打开浏览器开发者工具的 Network 面板
2. 切换子应用观察资源加载
3. 再次切换回已加载过的子应用，观察是否有预加载效果

### 验证依赖版本冲突解决
1. 查看控制台日志，确认两个子应用都正常加载
2. 检查 React DevTools，确认 React 版本
3. 观察两个应用是否能正常运行，没有版本冲突

## 📝 技术要点

### 主应用配置

**qiankun 注册配置** (`main-app/src/micro-app.js`)：
```javascript
registerMicroApps([
  {
    name: 'react18App',
    entry: '//localhost:3001',
    container: '#subapp-container',
    activeRule: '/react18'
  }
]);

start({
  prefetch: true,  // 预加载
  sandbox: {
    experimentalStyleIsolation: true  // 样式隔离
  }
});
```

### 子应用配置

**Webpack UMD 配置** (`config-overrides.js`)：
```javascript
config.output.library = `react18App`;
config.output.libraryTarget = 'umd';
config.output.globalObject = 'window';
```

**生命周期导出** (`src/index.js`)：
```javascript
export async function bootstrap() {}
export async function mount(props) {}
export async function unmount(props) {}
```

**公共路径配置** (`src/public-path.js`)：
```javascript
if (window.__POWERED_BY_QIANKUN__) {
  __webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__;
}
```

## 🛠️ 技术栈

- **主应用**：React 18 + qiankun
- **子应用1**：React 18（演示同版本）
- **子应用2**：React 17（演示版本冲突）
- **构建工具**：Create React App + react-app-rewired
- **通信方式**：BroadcastChannel + EventBus

## 📚 相关文档

- [qiankun 官方文档](https://qiankun.umijs.org/zh)
- [React 官方文档](https://react.dev/)
- [Webpack 配置文档](https://webpack.js.org/configuration/)

## 🤔 常见问题

### Q1: 子应用加载失败？
**A**: 确保所有应用都已启动，并且端口号正确（主应用 3000，子应用 3001 和 3002）

### Q2: 样式污染问题？
**A**: 检查 qiankun 的 `experimentalStyleIsolation` 配置是否开启

### Q3: 登录状态不同步？
**A**: 检查浏览器控制台是否有 BroadcastChannel 相关错误，确保浏览器支持该 API

### Q4: 子应用通信失败？
**A**: 确认 `window.eventBus` 已在主应用中初始化

### Q5: 启动脚本无法执行？
**A**: 运行 `chmod +x start-all.sh` 添加执行权限

## 💡 最佳实践

1. **独立运行**：每个子应用都应该能够独立运行和开发
2. **版本管理**：统一管理公共依赖版本
3. **样式隔离**：使用 CSS Modules 或 CSS-in-JS
4. **状态管理**：使用 BroadcastChannel 或全局状态管理
5. **性能优化**：开启预加载、合理拆分代码
6. **错误处理**：完善的错误边界和降级方案

## 📧 反馈与贡献

如果你发现问题或有改进建议，欢迎提出 Issue 或 PR！

---

**祝你学习顺利，微前端开发愉快！** 🎉
# qiankun
