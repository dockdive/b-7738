
import { BusinessCreate, BusinessStatus } from '@/types/business';
import { supabase, supabaseFallback } from '@/integrations/supabase/client';
import { cleanBusinessDataForAPI } from './businessDataAdapter';

// Helper function to create a business with proper type handling
export const createBusiness = async (businessData: BusinessCreate) => {
  // Determine which client to use
  const client = await testSupabaseConnection() ? supabase : supabaseFallback;
  
  // Ensure owner_id is set - this works around the type issue with the API
  if (!businessData.owner_id) {
    try {
      const { data: { user } } = await client.auth.getSession();
      if (user) {
        businessData.owner_id = user.id;
      }
    } catch (error) {
      console.error('Error getting user session:', error);
    }
  }
  
  // Make sure required fields exist to avoid type errors
  if (!businessData.name) {
    businessData.name = 'Untitled Business';
  }
  
  // Clean and adapt the data for the API
  const adaptedData = cleanBusinessDataForAPI(businessData);
  
  // Remove any properties that don't exist in the businesses table
  // This helps prevent the 'status' property error specifically
  return client
    .from('businesses')
    .insert(adaptedData as any);
};

// Helper function to update a business with proper type handling
export const updateBusiness = async (id: string, businessData: Partial<BusinessCreate>) => {
  // Determine which client to use
  const client = await testSupabaseConnection() ? supabase : supabaseFallback;
  
  // Clean and adapt the data for the API
  const adaptedData = cleanBusinessDataForAPI(businessData);
  
  return client
    .from('businesses')
    .update(adaptedData as any)
    .eq('id', id);
};

// Helper function to test if Supabase connection is working
export const testSupabaseConnection = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase.from('categories').select('count', { count: 'exact', head: true });
    return !error;
  } catch (error) {
    console.warn('Supabase connection test failed:', error);
    return false;
  }
};
