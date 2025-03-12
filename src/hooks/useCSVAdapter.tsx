
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
  const { ensureCategoryDescription } = useCSVServiceAdapter();
  
  const processCategories = (categories: any[]): Category[] => {
    try {
      logger.info('Processing categories', { count: categories.length });
      
      return categories
        .filter(cat => validateCategory(cat))
        .map(cat => ensureCategoryDescription({
          id: cat.id,
          name: cat.name,
          icon: cat.icon || '',
          description: cat.description || `Category for ${cat.name}`
        }));
    } catch (error) {
      logger.error('Error processing categories', error);
      return [];
    }
  };

  const validateCategory = (category: any): boolean => {
    try {
      const isValid = !!(category?.name && category?.id);
      
      if (!isValid) {
        logger.warning('Invalid category', category);
      }
      
      return isValid;
    } catch (error) {
      logger.error('Error validating category', error);
      return false;
    }
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
