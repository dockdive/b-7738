
/**
 * Simple logger service for application-wide logging
 */

// Define log levels
export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error'
}

// Store for logs
interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: number;
  data?: any;
}

const logs: LogEntry[] = [];

const logger = {
  info: (message: string, ...args: any[]) => {
    console.info(`[INFO] ${message}`, ...args);
    logs.push({
      level: LogLevel.INFO,
      message,
      timestamp: Date.now(),
      data: args.length > 0 ? args[0] : undefined
    });
  },
  
  warning: (message: string, ...args: any[]) => {
    console.warn(`[WARNING] ${message}`, ...args);
    logs.push({
      level: LogLevel.WARNING,
      message,
      timestamp: Date.now(),
      data: args.length > 0 ? args[0] : undefined
    });
  },
  
  error: (message: string, ...args: any[]) => {
    console.error(`[ERROR] ${message}`, ...args);
    logs.push({
      level: LogLevel.ERROR,
      message,
      timestamp: Date.now(),
      data: args.length > 0 ? args[0] : undefined
    });
  },
  
  debug: (message: string, ...args: any[]) => {
    if (process.env.NODE_ENV !== 'production') {
      console.debug(`[DEBUG] ${message}`, ...args);
      logs.push({
        level: LogLevel.DEBUG,
        message,
        timestamp: Date.now(),
        data: args.length > 0 ? args[0] : undefined
      });
    }
  }
};

// Helper functions for accessing logs
export const getLogs = (): LogEntry[] => {
  return [...logs].sort((a, b) => b.timestamp - a.timestamp);
};

export const getLogsByLevel = (level: LogLevel): LogEntry[] => {
  return getLogs().filter(log => log.level === level);
};

export default logger;
