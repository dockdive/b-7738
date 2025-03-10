import { supabase } from '@/integrations/supabase/client';
import Papa from 'papaparse';
import { BusinessCreate, Category, Subcategory } from '@/types';
import logger from './loggerService';

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
  logger.info(`Starting CSV parsing of file: ${file.name} (${file.size} bytes)`);
  
  return new Promise((resolve, reject) => {
    const results: T[] = [];
    const errors: string[] = [];

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      step: (result, parser) => {
        // Validation could be added here
        const row = result.data;
        logger.debug('Processing CSV row', row);
      },
      complete: (results) => {
        logger.info(`CSV parsing complete: ${results.data.length} rows parsed, ${results.errors.length} errors`);
        if (results.errors.length > 0) {
          logger.warning('CSV parsing had errors', results.errors);
        }
        
        resolve({
          data: results.data as T[],
          errors: results.errors.map(err => `Row ${err.row}: ${err.message}`)
        });
      },
      error: (error) => {
        logger.error('CSV parsing failed', error);
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
    logger.info(`Starting CSV upload for entity type: ${entityType}`);
    
    // 1. Parse the CSV file
    const parseResult = await parseCSV(file);
    
    if (parseResult.errors.length > 0) {
      logger.error(`CSV parsing errors prevented upload: ${parseResult.errors.join(', ')}`);
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
        logger.error(`Invalid entity type: ${entityType}`);
        throw new Error('Invalid entity type');
    }
    
    // 3. Return the result
    logger.info(`CSV upload complete for ${entityType}: ${result.count} items processed, ${result.errors.length} errors`);
    return result;
  } catch (error) {
    logger.error('CSV upload error:', error);
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
  
  logger.info(`Processing ${data.length} businesses from CSV`);
  
  for (const [index, row] of data.entries()) {
    try {
      // Validate required fields
      if (!row.name || !row.description || !row.category_id) {
        const errorMsg = `Row ${index + 2}: Missing required fields`;
        logger.warning(errorMsg, row);
        errors.push(errorMsg);
        continue;
      }
      
      // Log the data being processed
      logger.debug(`Processing business: ${row.name}`, row);
      
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
      logger.debug(`Inserting business into database: ${business.name}`);
      const { error } = await supabase
        .from('businesses')
        .insert(business);
      
      if (error) {
        logger.error(`Database error for business ${business.name}:`, error);
        throw new Error(error.message);
      }
      
      logger.info(`Successfully inserted business: ${business.name}`);
      processed++;
      
      // Update progress
      if (onProgress) {
        onProgress(Math.round((index + 1) / data.length * 100));
      }
    } catch (error) {
      const errorMsg = `Row ${index + 2}: ${(error as Error).message}`;
      logger.error(`Error processing row ${index + 2}:`, error);
      errors.push(errorMsg);
    }
  }
  
  logger.info(`Business processing complete: ${processed}/${data.length} inserted successfully`);
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
  
  logger.info(`Processing ${data.length} categories from CSV`);
  
  for (const [index, row] of data.entries()) {
    try {
      // Validate required fields
      if (!row.name || !row.icon) {
        const errorMsg = `Row ${index + 2}: Missing required fields`;
        logger.warning(errorMsg, row);
        errors.push(errorMsg);
        continue;
      }
      
      // Log the data being processed
      logger.debug(`Processing category: ${row.name}`, row);
      
      // Create category object
      const category: Omit<Category, 'id' | 'created_at'> = {
        name: row.name,
        icon: row.icon
      };
      
      // Insert into database
      logger.debug(`Inserting category into database: ${category.name}`);
      const { error } = await supabase
        .from('categories')
        .insert(category);
      
      if (error) {
        logger.error(`Database error for category ${category.name}:`, error);
        throw new Error(error.message);
      }
      
      logger.info(`Successfully inserted category: ${category.name}`);
      processed++;
      
      // Update progress
      if (onProgress) {
        onProgress(Math.round((index + 1) / data.length * 100));
      }
    } catch (error) {
      const errorMsg = `Row ${index + 2}: ${(error as Error).message}`;
      logger.error(`Error processing row ${index + 2}:`, error);
      errors.push(errorMsg);
    }
  }
  
  logger.info(`Category processing complete: ${processed}/${data.length} inserted successfully`);
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
  
  logger.info(`Processing ${data.length} reviews from CSV`);
  
  for (const [index, row] of data.entries()) {
    try {
      // Validate required fields
      if (!row.business_id || !row.rating || row.rating < 1 || row.rating > 5) {
        const errorMsg = `Row ${index + 2}: Missing required fields or invalid rating`;
        logger.warning(errorMsg, row);
        errors.push(errorMsg);
        continue;
      }
      
      // Log the data being processed
      logger.debug(`Processing review for business_id: ${row.business_id}`, row);
      
      // Create review object
      const review = {
        business_id: row.business_id,
        rating: Number(row.rating),
        comment: row.comment || null,
        user_id: '', // Will be set by the RLS policy
      };
      
      // Insert into database
      logger.debug(`Inserting review into database for business_id: ${review.business_id}`);
      const { error } = await supabase
        .from('reviews')
        .insert(review);
      
      if (error) {
        logger.error(`Database error for review:`, error);
        throw new Error(error.message);
      }
      
      logger.info(`Successfully inserted review for business_id: ${review.business_id}`);
      processed++;
      
      // Update progress
      if (onProgress) {
        onProgress(Math.round((index + 1) / data.length * 100));
      }
    } catch (error) {
      const errorMsg = `Row ${index + 2}: ${(error as Error).message}`;
      logger.error(`Error processing row ${index + 2}:`, error);
      errors.push(errorMsg);
    }
  }
  
  logger.info(`Review processing complete: ${processed}/${data.length} inserted successfully`);
  return {
    count: processed,
    errors
  };
};

// Generate CSV templates for download with expanded business data
export const generateCSVTemplate = (entityType: 'business' | 'category' | 'review'): string => {
  logger.info(`Generating CSV template for entity type: ${entityType}`);
  
  let headers: string[] = [];
  let sampleData: Record<string, any>[] = [];
  
  switch (entityType) {
    case 'business':
      headers = ['name', 'description', 'category_id', 'subcategory_id', 'address', 'city', 'state', 'zip', 'country', 'phone', 'email', 'website', 'is_featured', 'logo_url', 'latitude', 'longitude'];
      sampleData = [
        {
          name: 'Maritime Supplies Inc.',
          description: 'Quality maritime equipment and supplies for all vessel types.',
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
          is_featured: true,
          logo_url: 'https://example.com/logo.png',
          latitude: 37.8199,
          longitude: -122.4783
        }
      ];
      break;
    case 'category':
      headers = ['name', 'icon', 'description'];
      sampleData = [
        {
          name: 'Marine Parts',
          icon: 'anchor',
          description: 'Marine parts and components for all types of vessels.'
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
  
  const csvResult = Papa.unparse({
    fields: headers,
    data: sampleData
  });
  
  logger.info(`CSV template generated for ${entityType}`);
  return csvResult;
};

// Create a function to generate sample business data for testing
export const generateSampleBusinessData = (): Record<string, any>[] => {
  logger.info('Generating sample business data for testing');
  
  const businessNames = [
    'Atlantic Marine Services',
    'Blue Ocean Yacht Supply',
    'Coastal Navigation Systems',
    'Deep Sea Equipment Co.',
    'Eastern Harbor Supplies',
    'Fisherfolk Outfitters',
    'Gulf Stream Technologies',
    'Harbor Master Chandlery',
    'Island Boat Repairs',
    'Jetty Marine Electronics',
    'Knot & Sail Specialists',
    'Lighthouse Navigation',
    'Maritime Safety Solutions',
    'Northern Seas Outfitters',
    'Ocean View Boat Parts',
    'Pacific Marine Engineering',
    'Quayside Yacht Services',
    'Reef & Anchor Supplies',
    'Seafarer\'s Equipment Shop',
    'Tidal Wave Vessel Maintenance'
  ];
  
  const descriptions = [
    'Specializing in marine electronics and navigation systems for commercial vessels.',
    'Full-service yacht supply store offering premium equipment for sailing enthusiasts.',
    'Expert providers of maritime safety equipment and compliance solutions.',
    'Comprehensive boat repair and maintenance services with certified technicians.',
    'Marine engineering consultancy with over 25 years of industry experience.',
    'Family-owned business supplying quality marine hardware since 1978.',
    'Specialized in sustainable and eco-friendly boating equipment and supplies.',
    'Premier source for navigation instruments and maritime communication devices.',
    'Offering complete vessel outfitting with customized solutions for all boat types.',
    'Expert marine electrical systems installation and repairs for all vessel classes.'
  ];
  
  const cities = ['Rotterdam', 'Amsterdam', 'Antwerp', 'Hamburg', 'Marseille', 'Valencia', 'Piraeus', 'Genoa', 'Southampton', 'Copenhagen'];
  const countries = ['Netherlands', 'Netherlands', 'Belgium', 'Germany', 'France', 'Spain', 'Greece', 'Italy', 'UK', 'Denmark'];
  
  const websites = [
    'https://example-marine.com',
    'https://sampleboating.net',
    'https://testyachtservices.com',
    'https://demomaritimesupplies.org',
    'https://exampleboatsales.com'
  ];
  
  // Generate 20 sample businesses
  return Array.from({ length: 20 }).map((_, index) => {
    const cityIndex = index % cities.length;
    
    return {
      name: businessNames[index % businessNames.length],
      description: descriptions[index % descriptions.length] + ' Serving the ' + cities[cityIndex] + ' area with pride.',
      category_id: (index % 5) + 1, // Assuming categories 1-5 exist
      subcategory_id: (index % 3) + 1, // Assuming subcategories 1-3 exist
      address: (index * 100 + 123) + ' Harbor Street',
      city: cities[cityIndex],
      state: null,
      zip: index * 1000 + 1000 + '',
      country: countries[cityIndex],
      phone: '+31-555-' + (index * 111 + 1000),
      email: `contact@${businessNames[index % businessNames.length].toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
      website: websites[index % websites.length],
      is_featured: index < 5, // First 5 are featured
      logo_url: `https://placehold.co/200x200?text=${index+1}`,
      latitude: 52.3676 + (index * 0.01),
      longitude: 4.9041 + (index * 0.01)
    };
  });
};

// Function to load sample data directly
export const loadSampleBusinessData = async (onProgress?: ProgressCallback): Promise<UploadResult> => {
  const sampleData = generateSampleBusinessData();
  logger.info(`Loading ${sampleData.length} sample businesses directly to database`);
  return processBusinesses(sampleData, onProgress);
};
