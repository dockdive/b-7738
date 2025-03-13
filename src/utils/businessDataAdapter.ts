
import { Business, BusinessCreate } from '@/types/business';

// Helper function to adapt database business data to form data
export const adaptBusinessData = (business: any) => {
  // Create a new object with all the properties from the business
  const adaptedData = { ...business };
  
  // Add postal_code as an alias for zip if it doesn't exist
  if (!adaptedData.postal_code && adaptedData.zip) {
    adaptedData.postal_code = adaptedData.zip;
  }
  
  // Ensure opening_hours exists
  if (!adaptedData.opening_hours) {
    adaptedData.opening_hours = {};
  }
  
  // Ensure services exists
  if (!adaptedData.services) {
    adaptedData.services = [];
  }
  
  return adaptedData;
};

// Helper function to adapt form data to database format
export const adaptFormDataToBusinessData = (formData: any): BusinessCreate => {
  const businessData: BusinessCreate = {
    ...formData
  };
  
  // Copy postal_code to zip if needed
  if (formData.postal_code && !formData.zip) {
    businessData.zip = formData.postal_code;
  }
  
  return businessData;
};

// Helper function to handle possible missing role in profile data
export const adaptProfileData = (profile: any) => {
  const adaptedProfile = { ...profile };
  
  // Ensure role exists
  if (!adaptedProfile.role) {
    adaptedProfile.role = adaptedProfile.is_admin ? 'admin' : 'user';
  }
  
  return adaptedProfile;
};

// Helper function to clean business data before sending to the API
export const cleanBusinessDataForAPI = (data: Record<string, any>) => {
  // Create a clean copy with known fields
  const cleanData: Record<string, any> = {};
  
  // Add fields that we know exist in the table
  const knownFields = [
    'name', 'description', 'category_id', 'subcategory_id', 
    'address', 'city', 'state', 'country', 'zip',
    'email', 'phone', 'website', 'logo_url',
    'owner_id', 'is_featured', 'user_id', 'postal_code',
    'opening_hours', 'services'
  ];
  
  knownFields.forEach(field => {
    if (data[field] !== undefined) {
      cleanData[field] = data[field];
    }
  });
  
  // Ensure required fields
  if (!cleanData.name) {
    cleanData.name = 'Untitled Business';
  }
  
  // Special handling for zip/postal_code
  if (!cleanData.zip && data.postal_code) {
    cleanData.zip = data.postal_code;
  }
  
  return cleanData;
};
