
import logger from '@/services/loggerService';
import { toast } from '@/hooks/use-toast';

/**
 * Sets a mock user email for testing purposes
 * @param email The email to set
 */
export const setMockUserEmail = (email: string): void => {
  try {
    localStorage.setItem('user-email', email);
    logger.info(`Set mock user email to: ${email}`);
    toast({
      title: "Development Mode",
      description: `Set mock user email to: ${email}`,
    });
  } catch (error) {
    logger.error('Error setting mock user email:', error);
  }
};

/**
 * Clears the mock user email
 */
export const clearMockUserEmail = (): void => {
  try {
    localStorage.removeItem('user-email');
    logger.info('Cleared mock user email');
    toast({
      title: "Development Mode",
      description: "Cleared mock user email",
    });
  } catch (error) {
    logger.error('Error clearing mock user email:', error);
  }
};

/**
 * Gets the current mock user email
 */
export const getMockUserEmail = (): string | null => {
  try {
    return localStorage.getItem('user-email');
  } catch (error) {
    logger.error('Error getting mock user email:', error);
    return null;
  }
};

/**
 * Sets a mock admin user for testing bulk upload
 * This automatically sets a user with an atalio.com email
 */
export const setMockAdminUser = (): void => {
  setMockUserEmail('admin@atalio.com');
};
