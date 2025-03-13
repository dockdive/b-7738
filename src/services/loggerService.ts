
/**
 * Log levels for the application
 */
export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error'
}

/**
 * Log entry structure
 */
export interface LogEntry {
  timestamp: number;
  level: LogLevel;
  message: string;
  data?: any;
}

// Store logs in memory (cleared on page refresh)
const logs: LogEntry[] = [];

/**
 * Simple logger service for application-wide logging
 */
const logger = {
  // Log informational messages
  info: (message: string, ...args: any[]): void => {
    if (process.env.NODE_ENV !== 'production') {
      console.info(`[INFO] ${message}`, ...args);
    }
    logs.push({
      timestamp: Date.now(),
      level: LogLevel.INFO,
      message,
      data: args.length > 0 ? args : undefined
    });
  },
  
  // Log warnings
  warn: (message: string, ...args: any[]): void => {
    console.warn(`[WARNING] ${message}`, ...args);
    logs.push({
      timestamp: Date.now(),
      level: LogLevel.WARNING,
      message,
      data: args.length > 0 ? args : undefined
    });
  },
  
  // Log errors
  error: (message: string, error?: any): void => {
    console.error(`[ERROR] ${message}`, error || '');
    logs.push({
      timestamp: Date.now(),
      level: LogLevel.ERROR,
      message,
      data: error
    });
  },
  
  // Log debug messages (only in development)
  debug: (message: string, ...args: any[]): void => {
    if (process.env.NODE_ENV !== 'production') {
      console.debug(`[DEBUG] ${message}`, ...args);
    }
    logs.push({
      timestamp: Date.now(),
      level: LogLevel.DEBUG,
      message,
      data: args.length > 0 ? args : undefined
    });
  }
};

/**
 * Get all logs
 */
export const getLogs = (): LogEntry[] => {
  return [...logs];
};

/**
 * Get logs filtered by level
 */
export const getLogsByLevel = (level: LogLevel): LogEntry[] => {
  return logs.filter(log => log.level === level);
};

export default logger;
