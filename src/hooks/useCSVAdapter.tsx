
import React, { createContext, useContext, ReactNode } from 'react';
import loggerAdapter from '@/utils/loggerAdapter';
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
      loggerAdapter.info('Processing categories', { count: categories.length });
      
      return categories
        .filter(cat => {
          // Pre-validate each category
          const isValid = validateCategoryData(cat);
          if (!isValid) {
            loggerAdapter.warning('Skipping invalid category', cat);
          }
          return isValid;
        })
        .map(cat => {
          try {
            // Ensure each category has all required fields, especially description
            return ensureCategoryDescription(cat);
          } catch (error) {
            loggerAdapter.error('Error processing category', { category: cat, error });
            return null;
          }
        })
        .filter((cat): cat is Category => cat !== null);
    } catch (error) {
      loggerAdapter.error('Error processing categories', error);
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
