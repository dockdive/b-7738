
import { supabase } from '@/integrations/supabase/client';
import { Category, Subcategory, Business, BusinessImage, BusinessService, Review, Profile } from '@/types';

// Categories
export const getCategories = async (): Promise<Category[]> => {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name');
  
  if (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
  
  return data || [];
};

export const getSubcategories = async (categoryId?: number): Promise<Subcategory[]> => {
  let query = supabase
    .from('subcategories')
    .select('*')
    .order('name');
  
  if (categoryId) {
    query = query.eq('category_id', categoryId);
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error('Error fetching subcategories:', error);
    throw error;
  }
  
  return data || [];
};

// Businesses
export const getBusinesses = async (
  filters: {
    category_id?: number;
    search?: string;
    country?: string;
    city?: string;
    rating?: number;
    featured?: boolean;
  } = {},
  sortBy: string = 'name',
  page: number = 1,
  limit: number = 10
): Promise<{ businesses: Business[], count: number }> => {
  let query = supabase
    .from('businesses')
    .select('*', { count: 'exact' })
    .eq('status', 'approved');
  
  // Apply filters
  if (filters.category_id) {
    query = query.eq('category_id', filters.category_id);
  }
  
  if (filters.search) {
    query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
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
  
  if (filters.featured) {
    query = query.eq('is_featured', true);
  }
  
  // Apply sorting
  switch (sortBy) {
    case 'nameDesc':
      query = query.order('name', { ascending: false });
      break;
    case 'ratingHigh':
      query = query.order('rating', { ascending: false });
      break;
    case 'ratingLow':
      query = query.order('rating', { ascending: true });
      break;
    case 'newest':
      query = query.order('created_at', { ascending: false });
      break;
    case 'oldest':
      query = query.order('created_at', { ascending: true });
      break;
    case 'mostReviewed':
      query = query.order('review_count', { ascending: false });
      break;
    default:
      query = query.order('name', { ascending: true });
      break;
  }
  
  // Apply pagination
  const from = (page - 1) * limit;
  const to = from + limit - 1;
  query = query.range(from, to);
  
  const { data, error, count } = await query;
  
  if (error) {
    console.error('Error fetching businesses:', error);
    throw error;
  }
  
  return { businesses: data || [], count: count || 0 };
};

export const getBusinessById = async (id: string): Promise<Business | null> => {
  const { data, error } = await supabase
    .from('businesses')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    if (error.code === 'PGRST116') { // Record not found
      return null;
    }
    console.error('Error fetching business:', error);
    throw error;
  }
  
  // Increment view count
  await supabase
    .from('businesses')
    .update({ views: (data.views || 0) + 1 })
    .eq('id', id);
  
  return data;
};

export const getBusinessesByOwnerId = async (ownerId: string): Promise<Business[]> => {
  const { data, error } = await supabase
    .from('businesses')
    .select('*')
    .eq('owner_id', ownerId)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching user businesses:', error);
    throw error;
  }
  
  return data || [];
};

export const createBusiness = async (business: Partial<Business>): Promise<Business> => {
  const { data, error } = await supabase
    .from('businesses')
    .insert(business)
    .select()
    .single();
  
  if (error) {
    console.error('Error creating business:', error);
    throw error;
  }
  
  return data;
};

export const updateBusiness = async (id: string, updates: Partial<Business>): Promise<Business> => {
  const { data, error } = await supabase
    .from('businesses')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating business:', error);
    throw error;
  }
  
  return data;
};

export const deleteBusiness = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('businesses')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting business:', error);
    throw error;
  }
};

// Business Images
export const getBusinessImages = async (businessId: string): Promise<BusinessImage[]> => {
  const { data, error } = await supabase
    .from('business_images')
    .select('*')
    .eq('business_id', businessId)
    .order('created_at');
  
  if (error) {
    console.error('Error fetching business images:', error);
    throw error;
  }
  
  return data || [];
};

export const addBusinessImage = async (businessId: string, url: string): Promise<BusinessImage> => {
  const { data, error } = await supabase
    .from('business_images')
    .insert({ business_id: businessId, url })
    .select()
    .single();
  
  if (error) {
    console.error('Error adding business image:', error);
    throw error;
  }
  
  return data;
};

export const deleteBusinessImage = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('business_images')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting business image:', error);
    throw error;
  }
};

// Business Services
export const getBusinessServices = async (businessId: string): Promise<BusinessService[]> => {
  const { data, error } = await supabase
    .from('business_services')
    .select('*')
    .eq('business_id', businessId)
    .order('name');
  
  if (error) {
    console.error('Error fetching business services:', error);
    throw error;
  }
  
  return data || [];
};

export const addBusinessService = async (businessId: string, name: string): Promise<BusinessService> => {
  const { data, error } = await supabase
    .from('business_services')
    .insert({ business_id: businessId, name })
    .select()
    .single();
  
  if (error) {
    console.error('Error adding business service:', error);
    throw error;
  }
  
  return data;
};

export const deleteBusinessService = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('business_services')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting business service:', error);
    throw error;
  }
};

// Reviews
export const getBusinessReviews = async (businessId: string): Promise<Review[]> => {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('business_id', businessId)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching business reviews:', error);
    throw error;
  }
  
  return data || [];
};

export const addReview = async (review: Partial<Review>): Promise<Review> => {
  const { data, error } = await supabase
    .from('reviews')
    .insert(review)
    .select()
    .single();
  
  if (error) {
    console.error('Error adding review:', error);
    throw error;
  }
  
  // Update business rating
  await updateBusinessRating(review.business_id as string);
  
  return data;
};

export const updateReview = async (id: string, updates: Partial<Review>): Promise<Review> => {
  const { data, error } = await supabase
    .from('reviews')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating review:', error);
    throw error;
  }
  
  // Update business rating
  await updateBusinessRating(data.business_id);
  
  return data;
};

export const deleteReview = async (id: string, businessId: string): Promise<void> => {
  const { error } = await supabase
    .from('reviews')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting review:', error);
    throw error;
  }
  
  // Update business rating
  await updateBusinessRating(businessId);
};

// Helper function to update business rating
const updateBusinessRating = async (businessId: string): Promise<void> => {
  // Get all reviews for the business
  const { data, error } = await supabase
    .from('reviews')
    .select('rating')
    .eq('business_id', businessId);
  
  if (error) {
    console.error('Error fetching reviews for rating update:', error);
    return;
  }
  
  if (!data || data.length === 0) {
    // No reviews, reset rating to 0
    await supabase
      .from('businesses')
      .update({ rating: 0, review_count: 0 })
      .eq('id', businessId);
    return;
  }
  
  // Calculate average rating
  const totalRating = data.reduce((sum, review) => sum + review.rating, 0);
  const averageRating = totalRating / data.length;
  
  // Update business
  await supabase
    .from('businesses')
    .update({
      rating: averageRating,
      review_count: data.length
    })
    .eq('id', businessId);
};

// Upload image to Supabase Storage
export const uploadImage = async (
  file: File,
  bucket: string = 'businesses',
  folder: string = ''
): Promise<string> => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
  const filePath = folder ? `${folder}/${fileName}` : fileName;
  
  const { error, data } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    });
  
  if (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
  
  const { data: urlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath);
  
  return urlData.publicUrl;
};

// Get user profile
export const getUserProfile = async (userId: string): Promise<Profile | null> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (error) {
    if (error.code === 'PGRST116') { // Record not found
      return null;
    }
    console.error('Error fetching user profile:', error);
    throw error;
  }
  
  return data;
};

// Update user profile
export const updateUserProfile = async (userId: string, updates: Partial<Profile>): Promise<Profile> => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
  
  return data;
};

// Create test user
export const createTestUser = async (email: string, password: string): Promise<string> => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    
    if (error) throw error;
    
    // Make user admin if it's the support@dockdive.com user
    if (email === 'support@dockdive.com' && data.user) {
      await supabase
        .from('profiles')
        .update({ is_admin: true })
        .eq('id', data.user.id);
    }
    
    return data.user?.id || '';
  } catch (error) {
    console.error('Error creating test user:', error);
    throw error;
  }
};
