import { supabase } from "@/integrations/supabase/client";
import {
  Business,
  BusinessCreate,
  BusinessFilter,
  BusinessImage,
  BusinessService,
  BusinessUpdate,
  Category,
  Profile,
  ProfileUpdate,
  Review,
  Subcategory,
  LanguageCode,
  BusinessStatus
} from "@/types";

// ----- Categories -----

export const fetchCategories = async (): Promise<Category[]> => {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("name");

  if (error) {
    console.error("Error fetching categories:", error);
    throw new Error(error.message);
  }

  return data as Category[];
};

export const fetchSubcategories = async (categoryId?: number): Promise<Subcategory[]> => {
  let query = supabase.from("subcategories").select("*");

  if (categoryId) {
    query = query.eq("category_id", categoryId);
  }

  const { data, error } = await query.order("name");

  if (error) {
    console.error("Error fetching subcategories:", error);
    throw new Error(error.message);
  }

  return data as Subcategory[];
};

// ----- Businesses -----

export const fetchBusinesses = async (filters?: BusinessFilter): Promise<Business[]> => {
  let query = supabase.from("businesses").select("*");

  // Apply filters
  if (filters) {
    if (filters.category_id) {
      query = query.eq("category_id", filters.category_id);
    }
    if (filters.subcategory_id) {
      query = query.eq("subcategory_id", filters.subcategory_id);
    }
    if (filters.country) {
      query = query.eq("country", filters.country);
    }
    if (filters.city) {
      query = query.eq("city", filters.city);
    }
    if (filters.rating) {
      query = query.gte("rating", filters.rating);
    }
    if (filters.search) {
      query = query.or(
        `name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`
      );
    }

    // Only show approved businesses in public searches
    query = query.eq("status", "approved");

    // Apply sorting
    if (filters.sort) {
      switch (filters.sort) {
        case "name_asc":
          query = query.order("name", { ascending: true });
          break;
        case "name_desc":
          query = query.order("name", { ascending: false });
          break;
        case "rating_high":
          query = query.order("rating", { ascending: false });
          break;
        case "rating_low":
          query = query.order("rating", { ascending: true });
          break;
        case "newest":
          query = query.order("created_at", { ascending: false });
          break;
        case "oldest":
          query = query.order("created_at", { ascending: true });
          break;
        case "most_reviewed":
          query = query.order("review_count", { ascending: false });
          break;
        default:
          query = query.order("name", { ascending: true });
      }
    } else {
      // Default sorting
      query = query.order("name", { ascending: true });
    }
  } else {
    // Default to showing only approved businesses
    query = query.eq("status", "approved").order("name");
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching businesses:", error);
    throw new Error(error.message);
  }

  return data as Business[];
};

export const fetchFeaturedBusinesses = async (): Promise<Business[]> => {
  const { data, error } = await supabase
    .from("businesses")
    .select("*")
    .eq("is_featured", true)
    .eq("status", "approved")
    .order("name");

  if (error) {
    console.error("Error fetching featured businesses:", error);
    throw new Error(error.message);
  }

  return data as Business[];
};

export const fetchBusinessById = async (id: string): Promise<Business> => {
  const { data, error } = await supabase
    .from("businesses")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error(`Error fetching business with ID ${id}:`, error);
    throw new Error(error.message);
  }

  // Increment view count
  incrementBusinessViews(id).catch(console.error);

  return data as Business;
};

export const incrementBusinessViews = async (id: string): Promise<void> => {
  const { error } = await supabase.rpc("increment_business_views", {
    business_id: id,
  });

  if (error) {
    console.error(`Error incrementing views for business ${id}:`, error);
  }
};

export const fetchUserBusinesses = async (userId: string): Promise<Business[]> => {
  const { data, error } = await supabase
    .from("businesses")
    .select("*")
    .eq("owner_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(`Error fetching businesses for user ${userId}:`, error);
    throw new Error(error.message);
  }

  return data as Business[];
};

export const createBusiness = async (business: BusinessCreate): Promise<Business | null> => {
  try {
    // Ensure all required fields are present
    const businessData = {
      name: business.name,
      category_id: business.category_id,
      subcategory_id: business.subcategory_id,
      description: business.description,
      address: business.address,
      city: business.city,
      state: business.state,
      zip: business.zip,
      country: business.country,
      phone: business.phone,
      email: business.email,
      website: business.website,
      owner_id: business.owner_id,
      status: business.status as BusinessStatus, // Explicitly cast to BusinessStatus
      is_featured: business.is_featured,
      logo_url: business.logo_url,
      latitude: business.latitude,
      longitude: business.longitude
    };

    const { data, error } = await supabase
      .from("businesses")
      .insert(businessData)
      .select()
      .single();

    if (error) throw error;
    return data as Business;
  } catch (error) {
    console.error("Error creating business:", error);
    return null;
  }
};

export const updateBusiness = async (id: string, updates: BusinessUpdate): Promise<Business> => {
  const { data, error } = await supabase
    .from("businesses")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error(`Error updating business ${id}:`, error);
    throw new Error(error.message);
  }

  return data as Business;
};

export const deleteBusiness = async (id: string): Promise<void> => {
  const { error } = await supabase.from("businesses").delete().eq("id", id);

  if (error) {
    console.error(`Error deleting business ${id}:`, error);
    throw new Error(error.message);
  }
};

// ----- Business Images -----

export const fetchBusinessImages = async (businessId: string): Promise<BusinessImage[]> => {
  const { data, error } = await supabase
    .from("business_images")
    .select("*")
    .eq("business_id", businessId)
    .order("created_at");

  if (error) {
    console.error(`Error fetching images for business ${businessId}:`, error);
    throw new Error(error.message);
  }

  return data as BusinessImage[];
};

export const uploadBusinessImage = async (
  businessId: string,
  file: File
): Promise<BusinessImage> => {
  // Generate a unique filename
  const fileExt = file.name.split(".").pop();
  const fileName = `${businessId}/${Date.now()}.${fileExt}`;
  const filePath = `business-images/${fileName}`;

  // Upload the file to storage
  const { error: uploadError } = await supabase.storage
    .from("business-images")
    .upload(filePath, file);

  if (uploadError) {
    console.error("Error uploading image:", uploadError);
    throw new Error(uploadError.message);
  }

  // Get the public URL
  const { data: urlData } = supabase.storage
    .from("business-images")
    .getPublicUrl(filePath);

  // Save the image record in the database
  const { data, error } = await supabase
    .from("business_images")
    .insert({
      business_id: businessId,
      url: urlData.publicUrl
    })
    .select()
    .single();

  if (error) {
    console.error("Error saving image record:", error);
    throw new Error(error.message);
  }

  return data as BusinessImage;
};

export const deleteBusinessImage = async (imageId: string): Promise<void> => {
  // First, get the image record to find the file path
  const { data: image, error: fetchError } = await supabase
    .from("business_images")
    .select("*")
    .eq("id", imageId)
    .single();

  if (fetchError) {
    console.error(`Error fetching image ${imageId}:`, fetchError);
    throw new Error(fetchError.message);
  }

  // Extract the storage path from the URL
  const url = new URL(image.url);
  const storagePath = url.pathname.split("/").slice(-2).join("/");

  // Delete the image from storage
  const { error: storageError } = await supabase.storage
    .from("business-images")
    .remove([storagePath]);

  if (storageError) {
    console.error(`Error deleting image from storage:`, storageError);
    // Continue to delete the database record even if storage deletion fails
  }

  // Delete the database record
  const { error } = await supabase.from("business_images").delete().eq("id", imageId);

  if (error) {
    console.error(`Error deleting image record ${imageId}:`, error);
    throw new Error(error.message);
  }
};

// ----- Business Services -----

export const fetchBusinessServices = async (businessId: string): Promise<BusinessService[]> => {
  const { data, error } = await supabase
    .from("business_services")
    .select("*")
    .eq("business_id", businessId)
    .order("name");

  if (error) {
    console.error(`Error fetching services for business ${businessId}:`, error);
    throw new Error(error.message);
  }

  return data as BusinessService[];
};

export const addBusinessService = async (
  businessId: string,
  name: string
): Promise<BusinessService> => {
  const { data, error } = await supabase
    .from("business_services")
    .insert({
      business_id: businessId,
      name: name
    })
    .select()
    .single();

  if (error) {
    console.error("Error adding business service:", error);
    throw new Error(error.message);
  }

  return data as BusinessService;
};

export const deleteBusinessService = async (serviceId: string): Promise<void> => {
  const { error } = await supabase.from("business_services").delete().eq("id", serviceId);

  if (error) {
    console.error(`Error deleting service ${serviceId}:`, error);
    throw new Error(error.message);
  }
};

// ----- Reviews -----

export const fetchBusinessReviews = async (businessId: string): Promise<Review[]> => {
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("business_id", businessId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(`Error fetching reviews for business ${businessId}:`, error);
    throw new Error(error.message);
  }

  return data as Review[];
};

export const fetchReviewsByBusinessId = async (businessId: string): Promise<Review[]> => {
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("business_id", businessId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(`Error fetching reviews for business ${businessId}:`, error);
    throw new Error(error.message);
  }

  return data as Review[];
};

export const fetchUserReviews = async (userId: string): Promise<Review[]> => {
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(`Error fetching reviews for user ${userId}:`, error);
    throw new Error(error.message);
  }

  return data as Review[];
};

export const createReview = async (
  review: Partial<Review> & { rating: number }
): Promise<Review> => {
  // Ensure the 'rating' field is present, as it's required by the database schema
  if (review.rating === undefined) {
    throw new Error("Rating is required for a review");
  }

  const { data, error } = await supabase
    .from("reviews")
    .insert({
      business_id: review.business_id,
      user_id: review.user_id,
      rating: review.rating,
      comment: review.comment,
      reply: review.reply,
      is_reported: review.is_reported,
      updated_at: review.updated_at,
      created_at: review.created_at
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating review:", error);
    throw new Error(error.message);
  }

  // Update business rating and review count
  updateBusinessRating(review.business_id as string).catch(console.error);

  return data as Review;
};

export const updateReview = async (
  id: string,
  updates: Partial<Review>
): Promise<Review> => {
  const { data, error } = await supabase
    .from("reviews")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error(`Error updating review ${id}:`, error);
    throw new Error(error.message);
  }

  // Update business rating if the rating changed
  if (updates.rating) {
    const review = data as Review;
    updateBusinessRating(review.business_id).catch(console.error);
  }

  return data as Review;
};

export const deleteReview = async (id: string): Promise<void> => {
  // Get the review to determine which business rating to update
  const { data: review, error: fetchError } = await supabase
    .from("reviews")
    .select("business_id")
    .eq("id", id)
    .single();

  if (fetchError) {
    console.error(`Error fetching review ${id}:`, fetchError);
    throw new Error(fetchError.message);
  }

  const { error } = await supabase.from("reviews").delete().eq("id", id);

  if (error) {
    console.error(`Error deleting review ${id}:`, error);
    throw new Error(error.message);
  }

  // Update business rating
  updateBusinessRating(review.business_id).catch(console.error);
};

export const updateBusinessRating = async (businessId: string): Promise<void> => {
  const { error } = await supabase.rpc("update_business_rating", {
    business_id: businessId,
  });

  if (error) {
    console.error(`Error updating rating for business ${businessId}:`, error);
  }
};

export const reportReview = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from("reviews")
    .update({ is_reported: true })
    .eq("id", id);

  if (error) {
    console.error(`Error reporting review ${id}:`, error);
    throw new Error(error.message);
  }
};

export const replyToReview = async (reviewId: string, reply: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('reviews')
      .update({ reply: reply }) // Use explicit property assignment instead of shorthand
      .eq('id', reviewId);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error replying to review:', error);
    return false;
  }
};

// ----- User Profile -----

export const fetchProfile = async (userId: string): Promise<Profile> => {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    console.error(`Error fetching profile for user ${userId}:`, error);
    throw new Error(error.message);
  }

  return data as Profile;
};

export const updateProfile = async (
  userId: string,
  updates: ProfileUpdate
): Promise<Profile> => {
  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", userId)
    .select()
    .single();

  if (error) {
    console.error(`Error updating profile for user ${userId}:`, error);
    throw new Error(error.message);
  }

  return data as Profile;
};

// Helper functions for profile image upload
export const uploadProfileAvatar = async (
  userId: string,
  file: File
): Promise<string> => {
  // Generate a unique filename
  const fileExt = file.name.split(".").pop();
  const fileName = `${userId}/avatar.${fileExt}`;
  const filePath = `avatars/${fileName}`;

  // Upload the file to storage
  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(filePath, file, { upsert: true });

  if (uploadError) {
    console.error("Error uploading avatar:", uploadError);
    throw new Error(uploadError.message);
  }

  // Get the public URL
  const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(filePath);

  // Update profile with new avatar URL
  const { error } = await supabase
    .from("profiles")
    .update({ avatar_url: urlData.publicUrl } as any)
    .eq("id", userId);

  if (error) {
    console.error("Error updating profile with avatar URL:", error);
    throw new Error(error.message);
  }

  return urlData.publicUrl;
};

// Export uploadImage as an alias to uploadProfileAvatar for backward compatibility
export const uploadImage = uploadProfileAvatar;
