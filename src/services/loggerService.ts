
export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug',
  LOG = 'log'
}

interface LoggerOptions {
  level: LogLevel;
  prefix?: string;
  enableConsole?: boolean;
}

class Logger {
  private level: LogLevel;
  private prefix: string;
  private enableConsole: boolean;
  
  constructor(options: LoggerOptions) {
    this.level = options.level || LogLevel.INFO;
    this.prefix = options.prefix || '[App]';
    this.enableConsole = options.enableConsole !== false;
  }
  
  /**
   * Log an error message
   */
  error(message: string, error?: any): void {
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
    if (this.shouldLog(LogLevel.WARN) && this.enableConsole) {
      console.warn(`${this.prefix} ${message}`, ...args);
    }
  }
  
  /**
   * Log an info message
   */
  info(message: string, ...args: any[]): void {
    if (this.shouldLog(LogLevel.INFO) && this.enableConsole) {
      console.info(`${this.prefix} ${message}`, ...args);
    }
  }
  
  /**
   * Log a debug message
   */
  debug(message: string, ...args: any[]): void {
    if (this.shouldLog(LogLevel.DEBUG) && this.enableConsole) {
      console.debug(`${this.prefix} ${message}`, ...args);
    }
  }
  
  /**
   * Log a standard message
   */
  log(message: string, ...args: any[]): void {
    if (this.shouldLog(LogLevel.LOG) && this.enableConsole) {
      console.log(`${this.prefix} ${message}`, ...args);
    }
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

export default logger;
