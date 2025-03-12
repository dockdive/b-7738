
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

  // Helper function to ensure categories have description
  const ensureCategoryDescription = useCallback((category: Partial<Category>): Category => {
    const defaultDescription = category.name ? `Category for ${category.name}` : 'Default category description';
    return {
      id: category.id || 0,
      name: category.name || '',
      icon: category.icon || '',
      description: category.description || defaultDescription,
      created_at: category.created_at
    };
  }, []);

  return {
    processCSV,
    downloadTemplate,
    loadSampleData,
    ensureCategoryDescription
  };
};

export default useCSVServiceAdapter;
