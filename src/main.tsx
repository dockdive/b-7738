
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { initPerformanceOptimizations } from './utils/performanceUtils';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

// Initialize performance optimizations after the app has rendered
window.addEventListener('load', () => {
  initPerformanceOptimizations();
});
