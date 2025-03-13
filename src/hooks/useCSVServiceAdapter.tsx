
import React, { useCallback } from 'react';
import { uploadCSV, generateCSVTemplate, loadSampleBusinessData } from '@/services/csvServiceAdapter';
import loggerAdapter from '@/utils/loggerAdapter';
import { Category } from '@/types';

export const useCSVServiceAdapter = () => {
  const processCSV = useCallback(async (
    file: File, 
    entityType: 'business' | 'category' | 'review',
    progressCallback: (progress: number) => void
  ) => {
    try {
      loggerAdapter.info(`Processing ${entityType} CSV file: ${file.name}`);
      return await uploadCSV(file, entityType, progressCallback);
    } catch (error) {
      loggerAdapter.error(`Error processing ${entityType} CSV:`, error);
      throw error;
    }
  }, []);

  const downloadTemplate = useCallback((entityType: 'business' | 'category' | 'review') => {
    try {
      loggerAdapter.info(`Generating template for ${entityType}`);
      return generateCSVTemplate(entityType);
    } catch (error) {
      loggerAdapter.error(`Error generating template for ${entityType}:`, error);
      throw error;
    }
  }, []);

  const loadSampleData = useCallback(async (progressCallback: (progress: number) => void) => {
    try {
      loggerAdapter.info('Loading sample business data');
      return await loadSampleBusinessData(progressCallback);
    } catch (error) {
      loggerAdapter.error('Error loading sample data:', error);
      throw error;
    }
  }, []);

  const ensureCategoryDescription = useCallback((category: Partial<Category>): Category => {
    if (!category.name) {
      loggerAdapter.warn('Category missing name');
      throw new Error('Category name is required');
    }

    // Ensure description is always set, even if it's empty in the source data
    // Generate a default description if none is provided
    return {
      id: category.id || 0,
      name: category.name,
      icon: category.icon || '',
      description: category.description || `Category for ${category.name}`,
      created_at: category.created_at
    };
  }, []);

  const validateCategoryData = useCallback((category: Partial<Category>): boolean => {
    if (!category?.name) {
      loggerAdapter.warn('Invalid category - missing name');
      return false;
    }
    
    // Additional validation can be added here
    // For example, validating that icon is present, etc.
    
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
