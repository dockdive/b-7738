
import React, { createContext, useContext } from 'react';
import loggerAdapter from '@/utils/loggerAdapter';

interface CSVAdapterContextType {
  logger: typeof loggerAdapter;
}

const CSVAdapterContext = createContext<CSVAdapterContextType>({
  logger: loggerAdapter
});

export const CSVAdapterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <CSVAdapterContext.Provider value={{ logger: loggerAdapter }}>
      {children}
    </CSVAdapterContext.Provider>
  );
};

export const useCSVAdapter = () => {
  const context = useContext(CSVAdapterContext);
  
  const handleSuccess = (message: string) => {
    context.logger.info(message);
  };
  
  const handleWarning = (message: string, data?: any) => {
    context.logger.warning(message, data);
  };
  
  const handleError = (error: Error | string, data?: any) => {
    const errorMessage = error instanceof Error ? error.message : error;
    context.logger.error(errorMessage, data);
  };
  
  const logError = (message: string, error?: any) => {
    context.logger.error(message, error);
  };
  
  return {
    handleSuccess,
    handleWarning,
    handleError,
    logError,
    logger: context.logger
  };
};
