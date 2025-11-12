import { registerMicroApps, start } from 'qiankun';

// EventBus 用于子应用通信
window.eventBus = {
  events: {},
  history: {}, // 消息历史记录（每个事件保留最近10条）
  on(event, callback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
    console.log(`📡 EventBus: 注册监听器 "${event}"，当前监听器数量: ${this.events[event].length}`);
    
    // 如果有历史消息，立即发送给新监听器
    if (this.history[event] && this.history[event].length > 0) {
      console.log(`📡 EventBus: 发现 ${this.history[event].length} 条历史消息，立即推送给新监听器`);
      this.history[event].forEach(historyData => {
        callback(historyData);
      });
    }
  },
  emit(event, data) {
    console.log(`📡 EventBus: 发送事件 "${event}"，数据:`, data);
    
    // 保存到历史记录
    if (!this.history[event]) {
      this.history[event] = [];
    }
    this.history[event].push(data);
    // 只保留最近10条消息
    if (this.history[event].length > 10) {
      this.history[event].shift();
    }
    
    if (this.events[event]) {
      console.log(`📡 EventBus: 找到 ${this.events[event].length} 个监听器`);
      this.events[event].forEach((callback, index) => {
        console.log(`📡 EventBus: 执行监听器 #${index + 1}`);
        callback(data);
      });
    } else {
      console.warn(`📡 EventBus: 没有找到事件 "${event}" 的监听器，但已保存到历史记录`);
    }
  },
  off(event, callback) {
    if (this.events[event]) {
      const beforeLength = this.events[event].length;
      this.events[event] = this.events[event].filter(cb => cb !== callback);
      const afterLength = this.events[event].length;
      console.log(`📡 EventBus: 移除监听器 "${event}"，${beforeLength} -> ${afterLength}`);
    }
  },
  clearHistory(event) {
    if (event) {
      delete this.history[event];
      console.log(`📡 EventBus: 清除事件 "${event}" 的历史记录`);
    } else {
      this.history = {};
      console.log(`📡 EventBus: 清除所有历史记录`);
    }
  }
};

// 注册微应用
registerMicroApps([
  {
    name: 'react18App',
    entry: '//localhost:3001',
    container: '#subapp-container',
    activeRule: (location) => location.hash.startsWith('#/react18'),
    props: {
      name: 'React 18 子应用'
    }
  },
  {
    name: 'react17App',
    entry: '//localhost:3002',
    container: '#subapp-container',
    activeRule: (location) => location.hash.startsWith('#/react17'),
    props: {
      name: 'React 17 子应用'
    }
  }
], {
  beforeLoad: [
    app => {
      console.log('[主应用] 准备加载', app.name);
      return Promise.resolve();
    }
  ],
  beforeMount: [
    app => {
      console.log('[主应用] 准备挂载', app.name);
      return Promise.resolve();
    }
  ],
  afterMount: [
    app => {
      console.log('[主应用] 挂载完成', app.name);
      return Promise.resolve();
    }
  ],
  afterUnmount: [
    app => {
      console.log('[主应用] 卸载完成', app.name);
      return Promise.resolve();
    }
  ]
});

// 启动 qiankun
start({
  prefetch: 'all', // 开启预加载，预加载所有子应用
  sandbox: {
    strictStyleIsolation: false, // 样式隔离
    experimentalStyleIsolation: true
  },
  singular: false // 允许多应用同时存在
});

console.log('🚀 Qiankun 主应用启动成功！singular: false - 允许多应用同时存在');
