
export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  WARNING = 'warning', // Adding WARNING as alias for WARN
  INFO = 'info',
  DEBUG = 'debug',
  LOG = 'log'
}

interface LoggerOptions {
  level: LogLevel;
  prefix?: string;
  enableConsole?: boolean;
}

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: Date;
  data?: any;
}

class Logger {
  private level: LogLevel;
  private prefix: string;
  private enableConsole: boolean;
  private logs: LogEntry[] = [];
  private maxLogEntries: number = 1000;
  
  constructor(options: LoggerOptions) {
    this.level = options.level || LogLevel.INFO;
    this.prefix = options.prefix || '[App]';
    this.enableConsole = options.enableConsole !== false;
  }
  
  /**
   * Log an error message
   */
  error(message: string, error?: any): void {
    this.addLogEntry(LogLevel.ERROR, message, error);
    
    if (this.enableConsole) {
      if (error) {
        console.error(`${this.prefix} ${message}`, error);
      } else {
        console.error(`${this.prefix} ${message}`);
      }
    }
    
    // Here you could also send errors to a monitoring service
    // like Sentry or a custom error tracking endpoint
  }
  
  /**
   * Log a warning message (alias for warn)
   */
  warning(message: string, ...args: any[]): void {
    this.warn(message, ...args);
  }
  
  /**
   * Log a warning message
   */
  warn(message: string, ...args: any[]): void {
    this.addLogEntry(LogLevel.WARN, message, ...args);
    
    if (this.shouldLog(LogLevel.WARN) && this.enableConsole) {
      console.warn(`${this.prefix} ${message}`, ...args);
    }
  }
  
  /**
   * Log an info message
   */
  info(message: string, ...args: any[]): void {
    this.addLogEntry(LogLevel.INFO, message, ...args);
    
    if (this.shouldLog(LogLevel.INFO) && this.enableConsole) {
      console.info(`${this.prefix} ${message}`, ...args);
    }
  }
  
  /**
   * Log a debug message
   */
  debug(message: string, ...args: any[]): void {
    this.addLogEntry(LogLevel.DEBUG, message, ...args);
    
    if (this.shouldLog(LogLevel.DEBUG) && this.enableConsole) {
      console.debug(`${this.prefix} ${message}`, ...args);
    }
  }
  
  /**
   * Log a standard message
   */
  log(message: string, ...args: any[]): void {
    this.addLogEntry(LogLevel.LOG, message, ...args);
    
    if (this.shouldLog(LogLevel.LOG) && this.enableConsole) {
      console.log(`${this.prefix} ${message}`, ...args);
    }
  }
  
  /**
   * Add a log entry to the internal logs array
   */
  private addLogEntry(level: LogLevel, message: string, ...data: any[]): void {
    // Add the log entry to the beginning of the array for most recent first
    this.logs.unshift({
      level,
      message,
      timestamp: new Date(),
      data: data.length ? data : undefined
    });
    
    // Trim logs if they exceed maximum size
    if (this.logs.length > this.maxLogEntries) {
      this.logs = this.logs.slice(0, this.maxLogEntries);
    }
  }
  
  /**
   * Get all logs
   */
  getLogs(): LogEntry[] {
    return [...this.logs];
  }
  
  /**
   * Get logs filtered by level
   */
  getLogsByLevel(level: LogLevel): LogEntry[] {
    return this.logs.filter(log => log.level === level);
  }
  
  /**
   * Clear all logs
   */
  clearLogs(): void {
    this.logs = [];
  }
  
  /**
   * Determine if a message of the given level should be logged
   */
  private shouldLog(level: LogLevel): boolean {
    const levels = [LogLevel.ERROR, LogLevel.WARN, LogLevel.INFO, LogLevel.DEBUG, LogLevel.LOG];
    const currentLevelIndex = levels.indexOf(this.level);
    const targetLevelIndex = levels.indexOf(level);
    
    return targetLevelIndex <= currentLevelIndex;
  }
}

// Create and export a default logger instance
const logger = new Logger({
  level: process.env.NODE_ENV === 'production' ? LogLevel.ERROR : LogLevel.DEBUG,
  prefix: '[Maritime]'
});

// Export the instance methods directly
export const getLogs = () => logger.getLogs();
export const getLogsByLevel = (level: LogLevel) => logger.getLogsByLevel(level);
export const clearLogs = () => logger.clearLogs();

export default logger;
