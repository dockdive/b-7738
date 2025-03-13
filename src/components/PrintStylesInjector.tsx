import React, { useEffect } from 'react';

/**
 * A component that injects print stylesheets into the document head
 * without modifying index.html which may be a protected file
 */
const PrintStylesInjector: React.FC = () => {
  useEffect(() => {
    // Check if the print stylesheet is already loaded
    if (!document.querySelector('link[href="/print.css"]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = '/print.css';
      link.media = 'print';
      document.head.appendChild(link);
    }
    
    return () => {
      // No need to remove the link since it's harmless to keep
    };
  }, []);

  return null; // This component doesn't render anything
};

export default PrintStylesInjector;
