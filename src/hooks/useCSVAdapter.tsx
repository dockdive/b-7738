
import React, { createContext, useContext, ReactNode } from 'react';
import * as csvService from '@/services/csvService';
import { Category } from '@/types';

interface CSVAdapterContextType {
  processCategories: (categories: any[]) => Category[];
  validateCategory: (category: any) => boolean;
}

const CSVAdapterContext = createContext<CSVAdapterContextType | null>(null);

export const CSVAdapterProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const processCategories = (categories: any[]): Category[] => {
    return categories.map(cat => ({
      id: cat.id,
      name: cat.name,
      icon: cat.icon || '',
      description: cat.description || `Category for ${cat.name}`
    }));
  };

  const validateCategory = (category: any): boolean => {
    return !!(category?.name && category?.id);
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
