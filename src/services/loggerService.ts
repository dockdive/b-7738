
/**
 * Simple logger service for application-wide logging
 */
const logger = {
  // Log informational messages
  info: (message: string, ...args: any[]): void => {
    if (process.env.NODE_ENV !== 'production') {
      console.info(`[INFO] ${message}`, ...args);
    }
  },
  
  // Log warnings
  warn: (message: string, ...args: any[]): void => {
    console.warn(`[WARNING] ${message}`, ...args);
  },
  
  // Log errors
  error: (message: string, error?: any): void => {
    console.error(`[ERROR] ${message}`, error || '');
  },
  
  // Log debug messages (only in development)
  debug: (message: string, ...args: any[]): void => {
    if (process.env.NODE_ENV !== 'production') {
      console.debug(`[DEBUG] ${message}`, ...args);
    }
  }
};

export default logger;
