
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { initPerformanceOptimizations } from './utils/performanceUtils';
import { preloadTranslations, ensureRequiredTranslationFiles } from './utils/translationUtils';
import logger from './services/loggerService';

// Initialize logger
logger.info('🚀 Application starting...');

// Verify that all required translation files exist
ensureRequiredTranslationFiles();

// Create root before any async operations
const root = ReactDOM.createRoot(document.getElementById('root')!);

// Preload translations before rendering
logger.info('📚 Preloading translations...');
preloadTranslations();

// Render the app
logger.info('🖥️ Rendering application...');
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

// Initialize performance optimizations after the app has rendered
window.addEventListener('load', () => {
  logger.info('🔧 Initializing performance optimizations...');
  initPerformanceOptimizations();
  
  // Log translation status after page load for debugging
  logger.info('📊 Application fully loaded and rendered');
});
