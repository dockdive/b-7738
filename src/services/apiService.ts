// Import necessary types and supabase client
import { supabase } from "@/integrations/supabase/client";
import { 
  Business, 
  BusinessCreate, 
  BusinessFilter, 
  BusinessStatus, 
  Category,
  Review,
  Profile,
  ProfileUpdate,
  Subcategory,
  LanguageCode
} from "@/types";

// Create business function
export const createBusiness = async (business: BusinessCreate): Promise<Business> => {
  try {
    // Fix: Cast business.status as BusinessStatus to match the type definition
    const { data, error } = await supabase
      .from('businesses')
      .insert({
        ...business,
        status: business.status as BusinessStatus // Type cast to match expected type
      })
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    
    // Cast the status properly
    return {
      ...data,
      status: data.status as BusinessStatus
    } as Business;
  } catch (error) {
    console.error('Error creating business:', error);
    throw error;
  }
};

// Reply to review function
export const replyToReview = async (reviewId: string, reply: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('reviews')
      .update({ reply: reply }) // Fix: Use explicit property assignment instead of shorthand
      .eq('id', reviewId);
    
    if (error) throw error;
  } catch (error) {
    console.error('Error replying to review:', error);
    throw error;
  }
};

// Add missing API functions that are being imported in other files
export const fetchBusinesses = async (filters?: BusinessFilter): Promise<Business[]> => {
  try {
    let query = supabase.from('businesses').select('*');
    
    if (filters) {
      if (filters.category_id) {
        query = query.eq('category_id', filters.category_id);
      }
      if (filters.subcategory_id) {
        query = query.eq('subcategory_id', filters.subcategory_id);
      }
      if (filters.country) {
        query = query.eq('country', filters.country);
      }
      if (filters.city) {
        query = query.eq('city', filters.city);
      }
      if (filters.rating) {
        query = query.gte('rating', filters.rating);
      }
      if (filters.search) {
        query = query.ilike('name', `%${filters.search}%`);
      }
      
      // Handle sorting
      if (filters.sort) {
        switch (filters.sort) {
          case 'name_asc':
            query = query.order('name', { ascending: true });
            break;
          case 'name_desc':
            query = query.order('name', { ascending: false });
            break;
          case 'rating_high':
            query = query.order('rating', { ascending: false });
            break;
          case 'rating_low':
            query = query.order('rating', { ascending: true });
            break;
          case 'newest':
            query = query.order('created_at', { ascending: false });
            break;
          case 'oldest':
            query = query.order('created_at', { ascending: true });
            break;
          case 'most_reviewed':
            query = query.order('review_count', { ascending: false });
            break;
          default:
            query = query.order('name', { ascending: true });
        }
      }
    }
    
    const { data, error } = await query;
    
    if (error) throw new Error(error.message);
    
    // Cast the status properly for each business
    return (data || []).map(item => ({
      ...item,
      status: item.status as BusinessStatus
    })) as Business[];
  } catch (error) {
    console.error('Error fetching businesses:', error);
    return [];
  }
};

export const fetchBusinessById = async (id: string): Promise<Business | null> => {
  try {
    const { data, error } = await supabase
      .from('businesses')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw new Error(error.message);
    
    // Cast the status properly
    return data ? {
      ...data,
      status: data.status as BusinessStatus
    } as Business : null;
  } catch (error) {
    console.error(`Error fetching business with ID ${id}:`, error);
    return null;
  }
};

export const fetchCategories = async (): Promise<Category[]> => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');
    
    if (error) throw new Error(error.message);
    return data || [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};

export const fetchSubcategories = async (categoryId?: number): Promise<Subcategory[]> => {
  try {
    let query = supabase.from('subcategories').select('*');
    
    if (categoryId) {
      query = query.eq('category_id', categoryId);
    }
    
    const { data, error } = await query.order('name');
    
    if (error) throw new Error(error.message);
    return data || [];
  } catch (error) {
    console.error('Error fetching subcategories:', error);
    return [];
  }
};

export const fetchReviewsByBusinessId = async (businessId: string): Promise<Review[]> => {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('business_id', businessId)
      .order('created_at', { ascending: false });
    
    if (error) throw new Error(error.message);
    return data || [];
  } catch (error) {
    console.error(`Error fetching reviews for business ${businessId}:`, error);
    return [];
  }
};

export const fetchFeaturedBusinesses = async (): Promise<Business[]> => {
  try {
    const { data, error } = await supabase
      .from('businesses')
      .select('*')
      .eq('is_featured', true)
      .order('rating', { ascending: false })
      .limit(6);
    
    if (error) throw new Error(error.message);
    
    // Cast the status properly for each featured business
    return (data || []).map(item => ({
      ...item,
      status: item.status as BusinessStatus
    })) as Business[];
  } catch (error) {
    console.error('Error fetching featured businesses:', error);
    return [];
  }
};

export const fetchProfile = async (userId: string): Promise<Profile> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) throw new Error(error.message);
    
    // Cast the language properly to ensure it matches LanguageCode type
    return {
      ...data,
      language: data.language as LanguageCode
    } as Profile;
  } catch (error) {
    console.error(`Error fetching profile for user ${userId}:`, error);
    throw error;
  }
};

export const updateProfile = async (userId: string, updates: ProfileUpdate): Promise<Profile> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    
    // Cast the language properly to ensure it matches LanguageCode type
    return {
      ...data,
      language: data.language as LanguageCode
    } as Profile;
  } catch (error) {
    console.error(`Error updating profile for user ${userId}:`, error);
    throw error;
  }
};

export const uploadImage = async (userId: string, file: File): Promise<string> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `avatars/${fileName}`;
    
    const { error } = await supabase.storage
      .from('user-files')
      .upload(filePath, file);
    
    if (error) throw new Error(error.message);
    
    const { data } = supabase.storage
      .from('user-files')
      .getPublicUrl(filePath);
    
    return data.publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};
