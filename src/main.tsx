
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Create a function to handle the root creation and rendering
const renderApp = () => {
  const rootElement = document.getElementById("root");
  if (!rootElement) {
    console.error("Failed to find the root element");
    return;
  }
  const root = createRoot(rootElement);
  root.render(<App />);
};

// Use requestIdleCallback to defer non-critical initialization
if (window.requestIdleCallback) {
  window.requestIdleCallback(renderApp);
} else {
  // Fallback for browsers that don't support requestIdleCallback
  setTimeout(renderApp, 1);
}
