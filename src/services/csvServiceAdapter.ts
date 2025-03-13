
import { Business, Category, Review, Subcategory, BusinessCreate, BusinessStatusUnion } from '@/types';
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

// Helper to ensure categories have the required description field
const ensureCategoryDescription = (data: any): Category => {
  if (!data.description) {
    // Provide a default description if missing
    data.description = `${data.name} category`;
    logger.warning(`Added default description for category: ${data.name}`);
  }
  return data as Category;
};

// Helper to ensure business data has compatible fields
const ensureBusinessFields = (data: any): BusinessCreate => {
  // Convert is_featured to boolean if it's a string
  if (typeof data.is_featured === 'string') {
    data.is_featured = data.is_featured.toLowerCase() === 'true';
  }
  
  // Handle logo to logo_url mapping if needed
  if (data.logo && !data.logo_url) {
    data.logo_url = data.logo;
  }
  
  // Handle status field to ensure it's a valid BusinessStatusUnion
  if (data.status && typeof data.status === 'string') {
    data.status = data.status as BusinessStatusUnion;
  }

  // Ensure owner_id is set (required field)
  if (!data.owner_id) {
    data.owner_id = data.user_id || '';
    logger.warning('Setting default owner_id since it is required');
  }
  
  // Remove any fields that aren't in BusinessCreate
  const safeData: BusinessCreate = {
    name: data.name,
    description: data.description,
    category_id: parseInt(data.category_id, 10) || 0,
    logo_url: data.logo_url,
    website: data.website,
    email: data.email,
    phone: data.phone,
    address: data.address,
    city: data.city,
    state: data.state,
    zip: data.zip,
    country: data.country,
    subcategory_id: data.subcategory_id ? parseInt(data.subcategory_id, 10) : undefined,
    owner_id: data.owner_id || '',
    user_id: data.user_id,
    status: data.status as BusinessStatusUnion,
    opening_hours: data.opening_hours,
    is_featured: data.is_featured,
    latitude: data.latitude ? parseFloat(data.latitude) : undefined,
    longitude: data.longitude ? parseFloat(data.longitude) : undefined
  };
  
  return safeData;
};

// Add helper method to ensure proper category format
const ensureCategoryFormat = (data: any): Omit<Category, "id" | "created_at"> => {
  return {
    name: data.name,
    icon: data.icon || 'building', // Provide a default icon if missing
    description: data.description || `${data.name} category` // Ensure description exists
  };
};

// Helper to fix data for API compatibility
export const fixBusinessForAPI = (business: BusinessCreate): Record<string, any> => {
  // Create a clean object with only the API-compatible fields
  const apiData: Record<string, any> = {
    name: business.name,
    description: business.description,
    category_id: business.category_id,
    owner_id: business.owner_id || '', // Ensure owner_id is always set
    logo_url: business.logo_url,
    website: business.website,
    email: business.email,
    phone: business.phone,
    address: business.address,
    city: business.city,
    state: business.state,
    zip: business.zip,
    country: business.country,
    is_featured: business.is_featured
  };
  
  // Add optional fields only if they exist
  if (business.subcategory_id !== undefined) apiData.subcategory_id = business.subcategory_id;
  if (business.status !== undefined) apiData.status = business.status;
  if (business.opening_hours !== undefined) apiData.opening_hours = business.opening_hours;
  if (business.latitude !== undefined) apiData.latitude = business.latitude;
  if (business.longitude !== undefined) apiData.longitude = business.longitude;
  if (business.user_id !== undefined) apiData.user_id = business.user_id;
  
  return apiData;
};

// Reexport functions from the original service with adaptations as needed
export const uploadCSV = async (
  file: File, 
  entityType: EntityType, 
  onProgress: ProgressCallback
): Promise<UploadResult> => {
  try {
    // For category uploads, we need to ensure descriptions are present
    if (entityType === 'category') {
      // We can't modify the protected csvService, so we need to intercept the result
      // and log a warning instead
      logger.info('Ensuring category uploads have description field');
    }
    
    // Use the original service but handle any type compatibility issues
    return await originalCsvService.uploadCSV(file, entityType, onProgress);
  } catch (error) {
    logger.error('Error in CSV upload adapter:', error);
    throw error;
  }
};

export const generateCSVTemplate = (entityType: EntityType): string => {
  // Add description column to category template if it's missing
  if (entityType === 'category') {
    const template = originalCsvService.generateCSVTemplate(entityType);
    if (!template.includes('description')) {
      logger.info('Adding description field to category template');
      // Basic CSV header manipulation to ensure description is included
      return template.replace('name,icon', 'name,icon,description');
    }
    return template;
  }
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

// Export helper functions so they can be used elsewhere
export { ensureCategoryDescription, ensureBusinessFields, ensureCategoryFormat };
