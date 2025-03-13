
import { BusinessCreate, BusinessStatus } from '@/types/business';
import { supabase } from '@/integrations/supabase/client';
import { cleanBusinessDataForAPI } from './businessDataAdapter';

// Helper function to create a business with proper type handling
export const createBusiness = async (businessData: BusinessCreate) => {
  // Ensure owner_id is set - this works around the type issue with the API
  if (!businessData.owner_id) {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      businessData.owner_id = user.id;
    }
  }
  
  // Clean and adapt the data for the API
  const adaptedData = cleanBusinessDataForAPI(businessData);
  
  // Remove any properties that don't exist in the businesses table
  // This helps prevent the 'status' property error specifically
  return supabase
    .from('businesses')
    .insert(adaptedData);
};

// Helper function to update a business with proper type handling
export const updateBusiness = async (id: string, businessData: Partial<BusinessCreate>) => {
  // Clean and adapt the data for the API
  const adaptedData = cleanBusinessDataForAPI(businessData);
  
  return supabase
    .from('businesses')
    .update(adaptedData)
    .eq('id', id);
};
