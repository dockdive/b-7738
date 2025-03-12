
import { Business, Category, Review } from '@/types';
import * as originalCsvService from '@/services/csvService';
import logger from '@/services/loggerService';

// This adapter wraps the original CSV service to add compatibility with our updated types
// without modifying the protected original file

type EntityType = 'business' | 'category' | 'review';
type ProgressCallback = (progress: number) => void;

export interface UploadResult {
  count: number;
  errors: string[];
}

// Reexport functions from the original service with adaptations as needed
export const uploadCSV = async (
  file: File, 
  entityType: EntityType, 
  onProgress: ProgressCallback
): Promise<UploadResult> => {
  try {
    // Use the original service but handle any type compatibility issues
    return await originalCsvService.uploadCSV(file, entityType, onProgress);
  } catch (error) {
    logger.error('Error in CSV upload adapter:', error);
    throw error;
  }
};

export const generateCSVTemplate = (entityType: EntityType): string => {
  return originalCsvService.generateCSVTemplate(entityType);
};

export const loadSampleBusinessData = async (
  onProgress: ProgressCallback
): Promise<UploadResult> => {
  try {
    return await originalCsvService.loadSampleBusinessData(onProgress);
  } catch (error) {
    logger.error('Error in sample data loading adapter:', error);
    throw error;
  }
};

// Add any additional helper functions or type adapters here
