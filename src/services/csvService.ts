
import { supabase } from '@/integrations/supabase/client';
import Papa from 'papaparse';
import { BusinessCreate, Category, Subcategory } from '@/types';

type ParseResult<T> = {
  data: T[];
  errors: string[];
};

type UploadResult = {
  count: number;
  errors: string[];
};

type ProgressCallback = (progress: number) => void;

// Process CSV file and return structured data
const parseCSV = <T>(file: File): Promise<ParseResult<T>> => {
  return new Promise((resolve, reject) => {
    const results: T[] = [];
    const errors: string[] = [];

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      step: (results, parser) => {
        const row = results.data;
        // We could do validation here if needed
      },
      complete: (results) => {
        resolve({
          data: results.data as T[],
          errors: results.errors.map(err => `Row ${err.row}: ${err.message}`)
        });
      },
      error: (error) => {
        reject(error);
      }
    });
  });
};

// Main function to upload CSV data
export const uploadCSV = async (
  file: File, 
  entityType: 'business' | 'category' | 'review',
  onProgress?: ProgressCallback
): Promise<UploadResult> => {
  try {
    // 1. Parse the CSV file
    const parseResult = await parseCSV(file);
    
    if (parseResult.errors.length > 0) {
      throw new Error(`CSV parsing errors: ${parseResult.errors.join(', ')}`);
    }
    
    // 2. Process based on entity type
    let result: UploadResult;
    switch (entityType) {
      case 'business':
        result = await processBusinesses(parseResult.data, onProgress);
        break;
      case 'category':
        result = await processCategories(parseResult.data, onProgress);
        break;
      case 'review':
        result = await processReviews(parseResult.data, onProgress);
        break;
      default:
        throw new Error('Invalid entity type');
    }
    
    // 3. Return the result
    return result;
  } catch (error) {
    console.error('CSV upload error:', error);
    throw error;
  }
};

// Process businesses
const processBusinesses = async (
  data: any[], 
  onProgress?: ProgressCallback
): Promise<UploadResult> => {
  const errors: string[] = [];
  let processed = 0;
  
  for (const [index, row] of data.entries()) {
    try {
      // Validate required fields
      if (!row.name || !row.description || !row.category_id) {
        errors.push(`Row ${index + 2}: Missing required fields`);
        continue;
      }
      
      // Create business object
      const business: BusinessCreate = {
        name: row.name,
        description: row.description,
        category_id: Number(row.category_id),
        subcategory_id: row.subcategory_id ? Number(row.subcategory_id) : null,
        address: row.address || '',
        city: row.city || '',
        state: row.state || null,
        zip: row.zip || null,
        country: row.country || '',
        phone: row.phone || null,
        email: row.email || '',
        website: row.website || null,
        owner_id: '', // Will be set by the RLS policy
        status: 'pending',
        is_featured: Boolean(row.is_featured) || false,
        logo_url: row.logo_url || null,
        latitude: row.latitude || null,
        longitude: row.longitude || null
      };
      
      // Insert into database
      const { error } = await supabase
        .from('businesses')
        .insert(business);
      
      if (error) throw new Error(error.message);
      
      processed++;
      
      // Update progress
      if (onProgress) {
        onProgress(Math.round((index + 1) / data.length * 100));
      }
    } catch (error) {
      console.error(`Error processing row ${index + 2}:`, error);
      errors.push(`Row ${index + 2}: ${(error as Error).message}`);
    }
  }
  
  return {
    count: processed,
    errors
  };
};

// Process categories
const processCategories = async (
  data: any[], 
  onProgress?: ProgressCallback
): Promise<UploadResult> => {
  const errors: string[] = [];
  let processed = 0;
  
  for (const [index, row] of data.entries()) {
    try {
      // Validate required fields
      if (!row.name || !row.icon) {
        errors.push(`Row ${index + 2}: Missing required fields`);
        continue;
      }
      
      // Create category object
      const category: Omit<Category, 'id' | 'created_at'> = {
        name: row.name,
        icon: row.icon
      };
      
      // Insert into database
      const { error } = await supabase
        .from('categories')
        .insert(category);
      
      if (error) throw new Error(error.message);
      
      processed++;
      
      // Update progress
      if (onProgress) {
        onProgress(Math.round((index + 1) / data.length * 100));
      }
    } catch (error) {
      console.error(`Error processing row ${index + 2}:`, error);
      errors.push(`Row ${index + 2}: ${(error as Error).message}`);
    }
  }
  
  return {
    count: processed,
    errors
  };
};

// Process reviews
const processReviews = async (
  data: any[], 
  onProgress?: ProgressCallback
): Promise<UploadResult> => {
  const errors: string[] = [];
  let processed = 0;
  
  for (const [index, row] of data.entries()) {
    try {
      // Validate required fields
      if (!row.business_id || !row.rating || row.rating < 1 || row.rating > 5) {
        errors.push(`Row ${index + 2}: Missing required fields or invalid rating`);
        continue;
      }
      
      // Create review object
      const review = {
        business_id: row.business_id,
        rating: Number(row.rating),
        comment: row.comment || null,
        user_id: '', // Will be set by the RLS policy
      };
      
      // Insert into database
      const { error } = await supabase
        .from('reviews')
        .insert(review);
      
      if (error) throw new Error(error.message);
      
      processed++;
      
      // Update progress
      if (onProgress) {
        onProgress(Math.round((index + 1) / data.length * 100));
      }
    } catch (error) {
      console.error(`Error processing row ${index + 2}:`, error);
      errors.push(`Row ${index + 2}: ${(error as Error).message}`);
    }
  }
  
  return {
    count: processed,
    errors
  };
};

// Generate CSV templates for download
export const generateCSVTemplate = (entityType: 'business' | 'category' | 'review'): string => {
  let headers: string[] = [];
  let sampleData: Record<string, any>[] = [];
  
  switch (entityType) {
    case 'business':
      headers = ['name', 'description', 'category_id', 'subcategory_id', 'address', 'city', 'state', 'zip', 'country', 'phone', 'email', 'website', 'is_featured'];
      sampleData = [
        {
          name: 'Maritime Supplies Inc.',
          description: 'Quality maritime equipment and supplies.',
          category_id: 5,
          subcategory_id: 21,
          address: '123 Harbor St',
          city: 'Portside',
          state: 'CA',
          zip: '94123',
          country: 'USA',
          phone: '+1-555-123-4567',
          email: 'contact@maritimesupplies.example.com',
          website: 'https://maritimesupplies.example.com',
          is_featured: true
        }
      ];
      break;
    case 'category':
      headers = ['name', 'icon'];
      sampleData = [
        {
          name: 'Marine Parts',
          icon: 'anchor'
        }
      ];
      break;
    case 'review':
      headers = ['business_id', 'rating', 'comment'];
      sampleData = [
        {
          business_id: '[uuid of business]',
          rating: 5,
          comment: 'Excellent service and quality products!'
        }
      ];
      break;
  }
  
  return Papa.unparse({
    fields: headers,
    data: sampleData
  });
};
