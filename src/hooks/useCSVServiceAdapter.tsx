
import React, { createContext, useContext, ReactNode } from 'react';
import * as csvService from '@/services/csvService';
import { adaptCategory, adaptCategories } from '@/utils/categoryAdapter';

// Create context interface for the CSV service adapter
interface CSVServiceAdapterContextType {
  parseCsvFile: typeof csvService.parseCsvFile;
  validateBusinessData: typeof csvService.validateBusinessData;
  validateCategoryData: typeof csvService.validateCategoryData;
  validateReviewData: typeof csvService.validateReviewData;
  processBusinessCsv: typeof csvService.processBusinessCsv;
  processCategoryCsv: typeof csvService.processCategoryCsv;
  processReviewCsv: typeof csvService.processReviewCsv;
  getTemplateFileName: typeof csvService.getTemplateFileName;
  downloadCsvTemplate: typeof csvService.downloadCsvTemplate;
}

// Create context with default values
const CSVServiceAdapterContext = createContext<CSVServiceAdapterContextType | null>(null);

// Create provider component
interface CSVServiceAdapterProviderProps {
  children: ReactNode;
}

export const CSVServiceAdapterProvider: React.FC<CSVServiceAdapterProviderProps> = ({ children }) => {
  // Wrap original functions to adapt category objects
  const processCategoryCsv: typeof csvService.processCategoryCsv = async (data) => {
    const result = await csvService.processCategoryCsv(data);
    
    // Add description field to categories if missing
    if (result.data) {
      result.data = adaptCategories(result.data);
    }
    
    return result;
  };

  return (
    <CSVServiceAdapterContext.Provider value={{
      parseCsvFile: csvService.parseCsvFile,
      validateBusinessData: csvService.validateBusinessData,
      validateCategoryData: csvService.validateCategoryData,
      validateReviewData: csvService.validateReviewData,
      processBusinessCsv: csvService.processBusinessCsv,
      processCategoryCsv,
      processReviewCsv: csvService.processReviewCsv,
      getTemplateFileName: csvService.getTemplateFileName,
      downloadCsvTemplate: csvService.downloadCsvTemplate,
    }}>
      {children}
    </CSVServiceAdapterContext.Provider>
  );
};

// Hook to use the CSV service adapter
export const useCSVServiceAdapter = () => {
  const context = useContext(CSVServiceAdapterContext);
  if (!context) {
    throw new Error('useCSVServiceAdapter must be used within a CSVServiceAdapterProvider');
  }
  return context;
};
