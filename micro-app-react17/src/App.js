import './App.css';
import { useState, useEffect } from 'react';

function App() {
  // 从 localStorage 读取初始登录状态
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('qiankun_user');
    console.log('🔥 React 17 子应用: 从 localStorage 读取用户', savedUser);
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    console.log('🔥 React 17 子应用: useEffect 已执行');
    
    // 监听 BroadcastChannel 登录事件
    const channel = new BroadcastChannel('auth');
    console.log('🔥 React 17 子应用: BroadcastChannel 已创建');
    
    channel.onmessage = (e) => {
      console.log('🔥 React 17 子应用: 收到 BroadcastChannel 消息', e.data);
      if (e.data.type === 'LOGIN') {
        setUser(e.data.user);
        addMessage('接收到主应用登录通知: ' + e.data.user.name);
      } else if (e.data.type === 'LOGOUT') {
        setUser(null);
        addMessage('接收到主应用登出通知');
      }
    };

    // 监听 EventBus 事件
    if (window.eventBus) {
      console.log('🔥 React 17 子应用: EventBus 已找到');
      window.eventBus.on('messageFromReact18', (data) => {
        addMessage('收到 React18 消息: ' + data);
      });
    } else {
      console.log('🔥 React 17 子应用: EventBus 未找到');
    }

    return () => {
      console.log('🔥 React 17 子应用: 清理 BroadcastChannel');
      channel.close();
    };
  }, []);

  const addMessage = (msg) => {
    setMessages(prev => [...prev, { text: msg, time: new Date().toLocaleTimeString() }]);
  };

  const sendMessageToReact18 = () => {
    if (window.eventBus) {
      const msg = 'Hello from React 17! (时间: ' + new Date().toLocaleTimeString() + ')';
      console.log('🔥 React 17 子应用: 发送 EventBus 消息', msg);
      window.eventBus.emit('messageFromReact17', msg);
      addMessage('发送消息到 React18: ' + msg);
    } else {
      console.error('🔥 React 17 子应用: EventBus 不存在，无法发送消息');
    }
  };

  return (
    <div style={{ padding: '20px', background: '#fff7e6', minHeight: '400px' }}>
      <div style={{
        background: '#fa8c16',
        color: 'white',
        padding: '15px',
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        <h2 style={{ margin: 0 }}>🔥 React 17 子应用</h2>
        <p style={{ margin: '10px 0 0 0', fontSize: '14px' }}>React 版本: 17.x (模拟版本冲突)</p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>👤 登录状态同步（BroadcastChannel）</h3>
        <div style={{ background: 'white', padding: '15px', borderRadius: '4px', border: '1px solid #ffd591' }}>
          {user ? (
            <div>
              <p>✅ 当前用户: <strong>{user.name}</strong></p>
              <p>角色: {user.role}</p>
              {user.token && <p style={{ fontSize: '12px', color: '#999' }}>Token: {user.token}</p>}
            </div>
          ) : (
            <p>❌ 未登录，请在主应用登录</p>
          )}
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>📡 子应用通信（EventBus）</h3>
        <button
          onClick={sendMessageToReact18}
          style={{
            padding: '10px 20px',
            background: '#fa8c16',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginBottom: '10px'
          }}
        >
          发送消息到 React 18
        </button>
        <div style={{ background: 'white', padding: '15px', borderRadius: '4px', maxHeight: '200px', overflow: 'auto', border: '1px solid #ffd591' }}>
          <h4 style={{ marginTop: 0 }}>消息记录:</h4>
          {messages.length === 0 ? (
            <p style={{ color: '#999' }}>暂无消息</p>
          ) : (
            messages.map((msg, index) => (
              <div key={index} style={{ borderBottom: '1px solid #f0f0f0', padding: '5px 0' }}>
                <span style={{ color: '#999', fontSize: '12px' }}>[{msg.time}]</span> {msg.text}
              </div>
            ))
          )}
        </div>
      </div>

      <div style={{ background: 'white', padding: '15px', borderRadius: '4px', border: '1px solid #ffd591' }}>
        <h3 style={{ marginTop: 0 }}>✨ 特性展示</h3>
        <ul style={{ textAlign: 'left' }}>
          <li>✅ React 17 版本（模拟版本冲突场景）</li>
          <li>✅ Webpack UMD 打包配置</li>
          <li>✅ BroadcastChannel 实现状态同步</li>
          <li>✅ EventBus 跨应用通信</li>
          <li>✅ 样式隔离测试</li>
        </ul>
      </div>
    </div>
  );
}

export default App;
