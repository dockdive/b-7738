// Logger levels for different types of messages
export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error'
}

// Interface for log messages
interface LogMessage {
  level: LogLevel;
  message: string;
  timestamp: Date;
  data?: any;
}

// Store logs in memory for the current session
const logs: LogMessage[] = [];

// Maximum number of logs to keep in memory
const MAX_LOGS = 1000;

/**
 * Add a log entry
 */
const log = (level: LogLevel, message: string, data?: any): void => {
  const logEntry: LogMessage = {
    level,
    message,
    timestamp: new Date(),
    data
  };
  
  // Add to in-memory logs
  logs.unshift(logEntry);
  
  // Trim logs if they exceed the maximum
  if (logs.length > MAX_LOGS) {
    logs.length = MAX_LOGS;
  }
  
  // Also log to console
  switch (level) {
    case LogLevel.DEBUG:
      console.debug(`[DEBUG] ${message}`, data || '');
      break;
    case LogLevel.INFO:
      console.info(`[INFO] ${message}`, data || '');
      break;
    case LogLevel.WARNING:
      console.warn(`[WARNING] ${message}`, data || '');
      break;
    case LogLevel.ERROR:
      console.error(`[ERROR] ${message}`, data || '');
      break;
  }
}

/**
 * Debug level logging
 */
export const debug = (message: string, data?: any): void => {
  log(LogLevel.DEBUG, message, data);
}

/**
 * Info level logging
 */
export const info = (message: string, data?: any): void => {
  log(LogLevel.INFO, message, data);
}

/**
 * Warning level logging
 */
export const warning = (message: string, data?: any): void => {
  log(LogLevel.WARNING, message, data);
}

/**
 * Error level logging
 */
export const error = (message: string, data?: any): void => {
  log(LogLevel.ERROR, message, data);
}

/**
 * Get all logs
 */
export const getLogs = (): LogMessage[] => {
  return [...logs];
}

/**
 * Clear all logs
 */
export const clearLogs = (): void => {
  logs.length = 0;
}

/**
 * Get logs filtered by level
 */
export const getLogsByLevel = (level: LogLevel): LogMessage[] => {
  return logs.filter(log => log.level === level);
}

export default {
  debug,
  info,
  warning,
  error,
  getLogs,
  clearLogs,
  getLogsByLevel
};
