
/**
 * Lazy loads images that are outside the viewport
 */
export const setupLazyLoading = () => {
  if ('IntersectionObserver' in window) {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }
          imageObserver.unobserve(img);
        }
      });
    });

    lazyImages.forEach(img => {
      imageObserver.observe(img);
    });
  }
};

/**
 * Prefetches critical resources for faster page loads
 */
export const prefetchResources = (paths: string[]) => {
  if (!window.requestIdleCallback) return;

  window.requestIdleCallback(() => {
    const prefetcher = document.createElement('link');
    prefetcher.rel = 'prefetch';
    prefetcher.as = 'document';
    
    paths.forEach(path => {
      prefetcher.href = path;
      document.head.appendChild(prefetcher.cloneNode(true));
    });
  });
};

/**
 * Detects slow connections and adjusts the experience accordingly
 */
export const detectSlowConnection = (): boolean => {
  if ('connection' in navigator) {
    // @ts-ignore - navigator.connection is an experimental API
    const connection = navigator.connection;
    if (connection) {
      return connection.saveData || 
             connection.effectiveType === 'slow-2g' || 
             connection.effectiveType === '2g';
    }
  }
  return false;
};

/**
 * Adjusts the website for slow connections
 */
export const optimizeForSlowConnections = () => {
  if (detectSlowConnection()) {
    // Replace high-res images with low-res alternatives
    document.querySelectorAll('img[data-low-res]').forEach(img => {
      const lowRes = (img as HTMLImageElement).dataset.lowRes;
      if (lowRes) {
        (img as HTMLImageElement).src = lowRes;
      }
    });
    
    // Disable animations
    document.body.classList.add('reduce-motion');
  }
};

/**
 * Initializes all performance optimizations
 */
export const initPerformanceOptimizations = () => {
  setupLazyLoading();
  optimizeForSlowConnections();
  
  // Prefetch critical pages
  prefetchResources([
    '/businesses',
    '/add-business',
    '/auth'
  ]);
};
