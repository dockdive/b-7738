
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { LanguageProvider } from './contexts/LanguageContext'
import { Toaster } from './components/ui/toaster'
import { Toaster as Sonner } from './components/ui/sonner'
import TranslationDebugger from './components/TranslationDebugger'

// Create a function to handle the root creation and rendering
const renderApp = () => {
  const rootElement = document.getElementById("root");
  if (!rootElement) {
    console.error("Failed to find the root element");
    return;
  }
  
  console.log("Rendering application...");
  
  const root = createRoot(rootElement);
  root.render(
    <LanguageProvider>
      <App />
      <Toaster />
      <Sonner />
      <TranslationDebugger />
    </LanguageProvider>
  );
};

// Add a loading indicator to let users know the app is initializing
const showLoadingIndicator = () => {
  const rootElement = document.getElementById("root");
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="display: flex; justify-content: center; align-items: center; height: 100vh; flex-direction: column;">
        <div style="border: 4px solid #f3f3f3; border-top: 4px solid #3498db; border-radius: 50%; width: 50px; height: 50px; animation: spin 1s linear infinite;"></div>
        <p style="margin-top: 20px; font-family: sans-serif;">Loading Maritime Directory...</p>
      </div>
      <style>
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      </style>
    `;
  }
};

// Show loading indicator immediately
showLoadingIndicator();

// Use requestIdleCallback to defer non-critical initialization
if (window.requestIdleCallback) {
  window.requestIdleCallback(() => {
    // Small timeout to ensure loading indicator is visible
    setTimeout(renderApp, 300);
  });
} else {
  // Fallback for browsers that don't support requestIdleCallback
  setTimeout(renderApp, 300);
}
