
/**
 * Logger adapter to provide compatibility with code using both warn/warning naming
 */
import logger from "@/services/loggerService";

const loggerAdapter = {
  ...logger,
  // Provide warning as an alias for warn for backward compatibility
  warning: (...args: Parameters<typeof logger.warn>) => {
    return logger.warn(...args);
  }
};

export default loggerAdapter;
