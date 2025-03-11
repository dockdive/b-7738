
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { initPerformanceOptimizations } from './utils/performanceUtils';
import { preloadTranslations } from './utils/translationUtils';
import logger from './services/loggerService';

// Initialize logger
logger.info('🚀 Application starting...');

// Preload translations before rendering the app
logger.info('📚 Preloading translations...');
preloadTranslations();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

// Initialize performance optimizations after the app has rendered
window.addEventListener('load', () => {
  logger.info('🔧 Initializing performance optimizations...');
  initPerformanceOptimizations();
  
  // Log translation status after page load for debugging
  const languages = ['en', 'nl'];
  languages.forEach(lang => {
    try {
      const translationTest = require(`./locales/${lang}.json`);
      logger.info(`✅ Base translation file for ${lang} loaded successfully`);
    } catch (e) {
      logger.warning(`❌ Base translation file for ${lang} not found or has errors`);
    }
  });
});
