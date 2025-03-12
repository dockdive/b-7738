
type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const isProduction = import.meta.env.PROD;

// Simple API logger utility
const apiLogger = {
  debug: (message: string, data?: any) => {
    if (!isProduction) {
      console.debug(`[API DEBUG] ${message}`, data || '');
    }
  },
  
  info: (message: string, data?: any) => {
    if (!isProduction) {
      console.info(`[API INFO] ${message}`, data || '');
    }
  },
  
  warn: (message: string, data?: any) => {
    console.warn(`[API WARNING] ${message}`, data || '');
  },
  
  error: (message: string, error?: any) => {
    console.error(`[API ERROR] ${message}`, error || '');
  },
  
  // Log API request
  logRequest: (method: string, url: string, payload?: any) => {
    if (!isProduction) {
      console.info(`[API REQUEST] ${method} ${url}`, payload || '');
    }
  },
  
  // Log API response
  logResponse: (method: string, url: string, status: number, data?: any) => {
    const logLevel: LogLevel = status >= 400 ? 'error' : 'info';
    
    if (!isProduction || logLevel === 'error') {
      console[logLevel](`[API RESPONSE] ${method} ${url} (${status})`, data || '');
    }
  }
};

export default apiLogger;
