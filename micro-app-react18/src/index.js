import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import './public-path';

let root = null;

function render(props) {
  const { container } = props || {};
  let domElement;
  
  if (container) {
    // qiankun 模式：在主应用提供的容器中创建子元素
    domElement = container.querySelector('#react18-root');
    if (!domElement) {
      domElement = document.createElement('div');
      domElement.id = 'react18-root';
      container.appendChild(domElement);
    }
  } else {
    // 独立运行模式
    domElement = document.getElementById('react18-root');
  }
  
  root = ReactDOM.createRoot(domElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

// 独立运行时
 if (!window.__POWERED_BY_QIANKUN__) {
  render({});
}

// qiankun 生命周期
 export async function bootstrap() {
  console.log('[React 18 子应用] bootstrap');
}

export async function mount(props) {
  console.log('[React 18 子应用] mount', props);
  render(props);
}

export async function unmount(props) {
  console.log('[React 18 子应用] unmount', props);
  if (root) {
    root.unmount();
    root = null;
  }
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
