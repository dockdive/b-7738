
import { supabase } from '@/integrations/supabase/client';
import Papa from 'papaparse';
import logger from '@/services/loggerService';
import apiLogger from '@/utils/apiLogger';

/**
 * Service for importing sample data for categories, businesses, etc.
 */
export const sampleDataService = {
  /**
   * Import sample categories if none exist in the database
   */
  importSampleCategories: async (): Promise<number> => {
    try {
      logger.info('Checking if categories need to be imported');
      
      // Check if categories already exist
      const { count, error: countError } = await supabase
        .from('categories')
        .select('*', { count: 'exact', head: true });
        
      if (countError) {
        logger.error('Error checking existing categories', countError);
        throw countError;
      }
      
      // If categories exist, don't import
      if (count && count > 0) {
        logger.info('Categories already exist, skipping import', { count });
        return 0;
      }
      
      logger.info('No categories found, importing sample data');
      
      // Fetch the CSV template
      const response = await fetch('/templates/category_template.csv');
      if (!response.ok) {
        throw new Error(`Failed to fetch category template: ${response.statusText}`);
      }
      
      const csvText = await response.text();
      
      // Parse the CSV
      const { data, errors } = Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true
      });
      
      if (errors.length > 0) {
        logger.error('CSV parsing errors', errors);
        throw new Error('Failed to parse category template');
      }
      
      // Prepare categories for import
      const categories = data.map((row: any) => ({
        name: row.name,
        icon: row.icon || 'tag',
        description: row.description || '',
      }));
      
      logger.info('Importing sample categories', { count: categories.length });
      
      // Insert categories
      const { data: inserted, error: insertError } = await supabase
        .from('categories')
        .insert(categories)
        .select();
        
      if (insertError) {
        logger.error('Error importing sample categories', insertError);
        throw insertError;
      }
      
      apiLogger.info('Successfully imported sample categories', { count: inserted.length });
      return inserted.length;
    } catch (error) {
      logger.error('Failed to import sample categories', error);
      return 0;
    }
  }
};

export default sampleDataService;
