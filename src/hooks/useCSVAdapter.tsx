
import React, { createContext, useContext, ReactNode } from 'react';
import logger from '@/services/loggerService';
import { Category } from '@/types';
import useCSVServiceAdapter from './useCSVServiceAdapter';

interface CSVAdapterContextType {
  processCategories: (categories: any[]) => Category[];
  validateCategory: (category: any) => boolean;
}

const CSVAdapterContext = createContext<CSVAdapterContextType | null>(null);

export const CSVAdapterProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { ensureCategoryDescription, validateCategoryData } = useCSVServiceAdapter();
  
  const processCategories = (categories: any[]): Category[] => {
    try {
      logger.info('Processing categories', { count: categories.length });
      
      return categories
        .filter(cat => {
          const isValid = validateCategoryData(cat);
          if (!isValid) {
            logger.warning('Skipping invalid category', cat);
          }
          return isValid;
        })
        .map(cat => {
          try {
            return ensureCategoryDescription(cat);
          } catch (error) {
            logger.error('Error processing category', { category: cat, error });
            return null;
          }
        })
        .filter((cat): cat is Category => cat !== null);
    } catch (error) {
      logger.error('Error processing categories', error);
      return [];
    }
  };

  const validateCategory = (category: any): boolean => {
    return validateCategoryData(category);
  };

  return (
    <CSVAdapterContext.Provider value={{ processCategories, validateCategory }}>
      {children}
    </CSVAdapterContext.Provider>
  );
};

export const useCSVAdapter = () => {
  const context = useContext(CSVAdapterContext);
  if (!context) {
    throw new Error('useCSVAdapter must be used within a CSVAdapterProvider');
  }
  return context;
};
