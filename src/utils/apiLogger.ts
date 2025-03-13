
/**
 * A simple logger utility for API operations
 */
export const apiLogger = {
  log: (message: string, ...args: any[]) => {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[API] ${message}`, ...args);
    }
  },
  
  error: (message: string, error: any) => {
    console.error(`[API ERROR] ${message}`, error);
  },
  
  warn: (message: string, ...args: any[]) => {
    console.warn(`[API WARNING] ${message}`, ...args);
  },
  
  info: (message: string, ...args: any[]) => {
    if (process.env.NODE_ENV !== 'production') {
      console.info(`[API INFO] ${message}`, ...args);
    }
  }
};

export default apiLogger;
