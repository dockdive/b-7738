import React, { useCallback } from 'react';
import { uploadCSV, generateCSVTemplate, loadSampleBusinessData } from '@/services/csvServiceAdapter';
import logger from '@/services/loggerService';
import { Category } from '@/types';

export const useCSVServiceAdapter = () => {
  const processCSV = useCallback(async (
    file: File, 
    entityType: 'business' | 'category' | 'review',
    progressCallback: (progress: number) => void
  ) => {
    try {
      logger.info(`Processing ${entityType} CSV file: ${file.name}`);
      return await uploadCSV(file, entityType, progressCallback);
    } catch (error) {
      logger.error(`Error processing ${entityType} CSV:`, error);
      throw error;
    }
  }, []);

  const downloadTemplate = useCallback((entityType: 'business' | 'category' | 'review') => {
    try {
      logger.info(`Generating template for ${entityType}`);
      return generateCSVTemplate(entityType);
    } catch (error) {
      logger.error(`Error generating template for ${entityType}:`, error);
      throw error;
    }
  }, []);

  const loadSampleData = useCallback(async (progressCallback: (progress: number) => void) => {
    try {
      logger.info('Loading sample business data');
      return await loadSampleBusinessData(progressCallback);
    } catch (error) {
      logger.error('Error loading sample data:', error);
      throw error;
    }
  }, []);

  const ensureCategoryDescription = useCallback((category: Partial<Category>): Category => {
    if (!category.name) {
      logger.warning('Category missing name, using default');
    }

    const name = category.name || 'Untitled Category';
    const defaultDescription = `Category for ${name}`;
    
    return {
      id: category.id || 0,
      name: name,
      icon: category.icon || '',
      description: category.description || defaultDescription,
      created_at: category.created_at
    };
  }, []);

  const validateCategoryData = useCallback((category: Partial<Category>): boolean => {
    if (!category.name) {
      logger.warning('Invalid category - missing name', category);
      return false;
    }
    return true;
  }, []);

  return {
    processCSV,
    downloadTemplate,
    loadSampleData,
    ensureCategoryDescription,
    validateCategoryData
  };
};

export default useCSVServiceAdapter;
