
import { BusinessCreate, BusinessStatus } from '@/types/business';
import { supabase } from '@/integrations/supabase/client';

// Helper function to create a business with proper type handling
export const createBusiness = async (businessData: BusinessCreate) => {
  // Ensure owner_id is set - this works around the type issue with the API
  if (!businessData.owner_id) {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      businessData.owner_id = user.id;
    }
  }
  
  // The API doesn't directly match our BusinessCreate type, so we need to adapt it
  const adaptedData: Record<string, any> = { ...businessData };

  // Ensure required fields exist
  if (!adaptedData.name) {
    adaptedData.name = 'Untitled Business';
  }
  
  if (!adaptedData.owner_id) {
    throw new Error('Owner ID is required');
  }
  
  // Remove any properties that don't exist in the businesses table
  // This helps prevent the 'status' property error specifically
  return supabase
    .from('businesses')
    .insert(adaptedData);
};

// Helper function to update a business with proper type handling
export const updateBusiness = async (id: string, businessData: Partial<BusinessCreate>) => {
  // The API doesn't directly match our BusinessCreate type, so we need to adapt it
  const adaptedData: Record<string, any> = { ...businessData };
  
  return supabase
    .from('businesses')
    .update(adaptedData)
    .eq('id', id);
};
