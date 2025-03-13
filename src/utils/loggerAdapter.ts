
import logger from '@/services/loggerService';

/**
 * Creates a logger adapter that ensures all logging methods are available
 * even if accessed through destructuring
 */
export const createLoggerAdapter = () => {
  return {
    info: (...args: Parameters<typeof logger.info>) => logger.info(...args),
    error: (...args: Parameters<typeof logger.error>) => logger.error(...args),
    warn: (...args: Parameters<typeof logger.warn>) => logger.warn(...args),
    warning: (...args: Parameters<typeof logger.warning>) => logger.warning(...args),
    debug: (...args: Parameters<typeof logger.debug>) => logger.debug(...args),
    log: (...args: Parameters<typeof logger.log>) => logger.log(...args),
    getLogs: () => logger.getLogs(),
    getLogsByLevel: (level: any) => logger.getLogsByLevel(level),
    clearLogs: () => logger.clearLogs()
  };
};

// Export a default instance of the adapter
const loggerAdapter = createLoggerAdapter();
export default loggerAdapter;
