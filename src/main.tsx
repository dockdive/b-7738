
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { initPerformanceOptimizations } from './utils/performanceUtils';
import { preloadTranslations, ensureRequiredTranslationFiles } from './utils/translationUtils';
import logger from './services/loggerService';

// Initialize logger
logger.info('🚀 Application starting...');

// Create root before any async operations
const root = ReactDOM.createRoot(document.getElementById('root')!);

// First render a loading state to prevent blank screen
root.render(
  <React.StrictMode>
    <div className="flex items-center justify-center h-screen w-screen">
      <div className="text-center">
        <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-lg">Loading application...</p>
      </div>
    </div>
  </React.StrictMode>
);

// Verify that all required translation files exist
ensureRequiredTranslationFiles();

// Preload translations before rendering the main app
logger.info('📚 Preloading translations...');

// Start preloading translations
preloadTranslations();

// Render the app after a small delay to ensure translations are loaded
// This helps avoid blank screens and "loading" text showing everywhere
setTimeout(() => {
  logger.info('🖥️ Rendering application...');
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );

  // Initialize performance optimizations after the app has rendered
  window.addEventListener('load', () => {
    logger.info('🔧 Initializing performance optimizations...');
    initPerformanceOptimizations();
    
    // Log translation status after page load for debugging
    logger.info('📊 Application fully loaded and rendered');
  });
}, 100); // Small delay to ensure translations are processed
