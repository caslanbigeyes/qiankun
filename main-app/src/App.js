import './App.css';
import { useState, useEffect } from 'react';

function App() {
  const [currentApp, setCurrentApp] = useState('home');
  const [user, setUser] = useState({ name: '张三', role: 'admin' });

  useEffect(() => {
    // 监听路由变化
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      if (hash.startsWith('/react18')) {
        setCurrentApp('react18');
      } else if (hash.startsWith('/react17')) {
        setCurrentApp('react17');
      } else {
        setCurrentApp('home');
      }
    };
    
    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // 初始化
    
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // 在组件挂载时广播初始登录状态
  useEffect(() => {
    if (user) {
      const channel = new BroadcastChannel('auth');
      channel.postMessage({ type: 'LOGIN', user });
      console.log('📢 初始登录状态已广播', user);
      channel.close();
    }
  }, []); // 只在组件挂载时执行一次

  const handleLogin = () => {
    const newUser = { name: '李四', role: 'user', token: 'token-' + Date.now() };
    setUser(newUser);
    // 保存到 localStorage
    localStorage.setItem('qiankun_user', JSON.stringify(newUser));
    // 广播登录事件
    const channel = new BroadcastChannel('auth');
    console.log('📢 主应用: 广播登录事件', newUser);
    channel.postMessage({ type: 'LOGIN', user: newUser });
    channel.close();
    alert('登录成功！状态已广播到子应用');
  };

  const handleLogout = () => {
    setUser(null);
    // 清除 localStorage
    localStorage.removeItem('qiankun_user');
    // 广播登出事件
    const channel = new BroadcastChannel('auth');
    console.log('📢 主应用: 广播登出事件');
    channel.postMessage({ type: 'LOGOUT' });
    channel.close();
    alert('已登出！');
  };

  return (
    <div className="App">
      <header style={{
        background: '#282c34',
        padding: '20px',
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h1 style={{ margin: 0 }}>🚀 Qiankun 主应用</h1>
        <div>
          {user ? (
            <span>
              欢迎，{user.name} ({user.role})
              <button onClick={handleLogout} style={{ marginLeft: '10px' }}>登出</button>
            </span>
          ) : (
            <button onClick={handleLogin}>模拟登录</button>
          )}
        </div>
      </header>

      <nav style={{ background: '#f0f0f0', padding: '15px', borderBottom: '2px solid #ccc' }}>
        <button
          onClick={() => { setCurrentApp('home'); window.location.hash = ''; }}
          style={{
            marginRight: '10px',
            padding: '8px 16px',
            background: currentApp === 'home' ? '#1890ff' : '#fff',
            color: currentApp === 'home' ? '#fff' : '#000',
            border: '1px solid #d9d9d9',
            cursor: 'pointer'
          }}
        >
          主页
        </button>
        <button
          onClick={() => { setCurrentApp('react18'); window.location.hash = '#/react18'; }}
          style={{
            marginRight: '10px',
            padding: '8px 16px',
            background: currentApp === 'react18' ? '#1890ff' : '#fff',
            color: currentApp === 'react18' ? '#fff' : '#000',
            border: '1px solid #d9d9d9',
            cursor: 'pointer'
          }}
        >
          React 18 子应用
        </button>
        <button
          onClick={() => { setCurrentApp('react17'); window.location.hash = '#/react17'; }}
          style={{
            padding: '8px 16px',
            background: currentApp === 'react17' ? '#1890ff' : '#fff',
            color: currentApp === 'react17' ? '#fff' : '#000',
            border: '1px solid #d9d9d9',
            cursor: 'pointer'
          }}
        >
          React 17 子应用
        </button>
      </nav>

      <main style={{ padding: '20px' }}>
        {currentApp === 'home' && (
          <div>
            <h2>📚 微前端难点验证项目</h2>
            <div style={{ background: '#f9f9f9', padding: '20px', borderRadius: '8px' }}>
              <h3>当前项目包含：</h3>
              <ul style={{ textAlign: 'left', maxWidth: '800px', margin: '0 auto' }}>
                <li><strong>难点一：依赖版本冲突</strong> - React 18 vs React 17</li>
                <li><strong>难点二：全局状态同步</strong> - 使用 BroadcastChannel 同步登录态</li>
                <li><strong>难点三：样式隔离</strong> - CSS Modules + Scoped CSS</li>
                <li><strong>难点四：性能优化</strong> - 预加载配置</li>
                <li><strong>难点五：子应用通信</strong> - EventBus 实现</li>
              </ul>
              <p style={{ marginTop: '20px', color: '#666' }}>
                点击上方导航切换到子应用，观察各个难点的解决方案
              </p>
            </div>
          </div>
        )}
        
        {/* 子应用容器 */}
        <div id="subapp-container" style={{ display: currentApp !== 'home' ? 'block' : 'none' }}></div>
      </main>
    </div>
  );
}

export default App;
