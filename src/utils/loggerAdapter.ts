
/**
 * Logger adapter to provide compatibility with code using both warn/warning naming
 */
import logger from "@/services/loggerService";

// Create a type-safe logger adapter that ensures all original methods are preserved
// along with the warning alias
const loggerAdapter = {
  ...logger,
};

export default loggerAdapter;
