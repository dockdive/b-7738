
import { supabase } from '@/integrations/supabase/client';
import logger from './loggerService';
import { generateSampleBusinessData } from './csvService';
import { BusinessStatus } from '@/types';

/**
 * Populates the database with sample businesses
 */
export const populateSampleBusinesses = async (): Promise<boolean> => {
  try {
    logger.info('Starting to populate database with sample businesses');
    
    // Generate sample business data
    const businesses = generateSampleBusinessData();
    
    // First check if we already have businesses
    const { data: existingBusinesses, error: checkError } = await supabase
      .from('businesses')
      .select('id')
      .limit(1);
      
    if (checkError) {
      logger.error('Error checking existing businesses:', checkError);
      return false;
    }
    
    // If we already have businesses, don't add more
    if (existingBusinesses && existingBusinesses.length > 0) {
      logger.info('Businesses already exist in the database, skipping population');
      return true;
    }
    
    // Insert businesses in batches to avoid hitting limits
    const batchSize = 5;
    for (let i = 0; i < businesses.length; i += batchSize) {
      const batch = businesses.slice(i, i + batchSize);
      const { error } = await supabase
        .from('businesses')
        .insert(batch.map(business => ({
          name: business.name,
          description: business.description,
          category_id: business.category_id,
          subcategory_id: business.subcategory_id,
          address: business.address,
          city: business.city,
          state: business.state,
          zip: business.zip,
          country: business.country,
          phone: business.phone,
          email: business.email,
          website: business.website,
          is_featured: business.is_featured,
          logo_url: business.logo_url,
          latitude: business.latitude,
          longitude: business.longitude,
          owner_id: '00000000-0000-0000-0000-000000000000', // This will be replaced by the RLS policy
          status: 'approved' as BusinessStatus // Cast to BusinessStatus type
        })));
      
      if (error) {
        logger.error(`Error inserting batch ${i}-${i+batchSize}:`, error);
        return false;
      }
      
      logger.info(`Successfully inserted batch ${i}-${i+batchSize}`);
    }
    
    logger.info('Successfully populated database with sample businesses');
    return true;
  } catch (error) {
    logger.error('Error populating database with sample businesses:', error);
    return false;
  }
};
