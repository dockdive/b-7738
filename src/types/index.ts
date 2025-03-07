// Import the LanguageCode type from the LanguageContext
import { LanguageCode } from "@/contexts/LanguageContext";

// Business-related types
export type BusinessStatus = "pending" | "approved" | "rejected";

// Re-export the LanguageCode type
export { LanguageCode };

export type Business = {
  id: string;
  name: string;
  description: string;
  logo_url: string | null;
  category_id: number | null;
  subcategory_id: number | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  country: string | null;
  latitude: number | null;
  longitude: number | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  owner_id: string;
  status: BusinessStatus;
  is_featured: boolean;
  rating: number;
  review_count: number;
  views: number;
  created_at: string;
  updated_at: string;
  services?: string[]; // Services as optional array
  images?: string[]; // Images as optional array
  opening_hours?: string; // Opening hours as optional
};

export type BusinessImage = {
  id: string;
  business_id: string;
  url: string;
  created_at: string;
};

export type BusinessService = {
  id: string;
  business_id: string;
  name: string;
  created_at: string;
};

// Category-related types
export type Category = {
  id: number;
  name: string;
  icon: string;
  created_at: string;
};

export type Subcategory = {
  id: number;
  category_id: number;
  name: string;
  created_at: string;
};

// Review-related types
export type Review = {
  id: string;
  business_id: string;
  user_id: string;
  user_name?: string; // Add user_name as optional
  rating: number;
  comment: string | null;
  reply: string | null;
  is_reported: boolean;
  created_at: string;
  updated_at: string;
};

// Profile-related types
export type Profile = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  company_name: string | null;
  phone: string | null;
  country: string | null;
  language: LanguageCode;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
};

// For search and filtering
export type BusinessFilter = {
  category_id?: number;
  subcategory_id?: number;
  country?: string;
  city?: string;
  rating?: number;
  search?: string;
  sort?: "name_asc" | "name_desc" | "rating_high" | "rating_low" | "newest" | "oldest" | "most_reviewed";
};

// Profile update
export type ProfileUpdate = {
  first_name?: string;
  last_name?: string;
  company_name?: string;
  phone?: string;
  country?: string;
  language?: LanguageCode;
  avatar_url?: string;
};

// Business creation and update
export type BusinessCreate = Omit<Business, "id" | "rating" | "review_count" | "views" | "created_at" | "updated_at">;

export type BusinessUpdate = Partial<Omit<Business, "id" | "owner_id" | "created_at" | "updated_at">>;

// Add BusinessInput type for the AddBusiness page
export type BusinessInput = Omit<Business, "id" | "rating" | "review_count" | "views" | "created_at" | "updated_at" | "owner_id"> & {
  services: string[];
  primary_language: LanguageCode;
  additional_languages: LanguageCode[];
  opening_hours: string;
  images: string[];
};
