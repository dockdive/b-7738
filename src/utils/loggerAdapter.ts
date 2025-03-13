
import logger from '@/services/loggerService';

// This adapter ensures that we have a consistent interface
// for all logging operations across the application
const loggerAdapter = {
  error: (message: string, data?: any) => logger.error(message, data),
  warn: (message: string, data?: any) => logger.warn(message, data),
  warning: (message: string, data?: any) => logger.warning(message, data),
  info: (message: string, data?: any) => logger.info(message, data),
  debug: (message: string, data?: any) => logger.debug(message, data),
  log: (message: string, data?: any) => logger.log(message, data)
};

export default loggerAdapter;
