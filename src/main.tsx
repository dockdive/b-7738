
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import AppLanguageWrapper from './components/AppLanguageWrapper';
import './index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <AppLanguageWrapper>
      <App />
    </AppLanguageWrapper>
  </React.StrictMode>
);
