
import { LanguageCode } from '@/constants/languageConstants';

// This file adds or updates types needed by the application

export interface Category {
  id: number;
  name: string;
  icon: string;
  description: string; // Required description field
  created_at?: string;
}

// Add Subcategory type that was missing
export interface Subcategory {
  id: number;
  name: string;
  category_id: number;
  description?: string;
  created_at?: string;
}

// Update BusinessStatus to be a union type consistently
export type BusinessStatusUnion = 'pending' | 'approved' | 'rejected';

// For backward compatibility with existing code
export type BusinessStatus = BusinessStatusUnion;

export interface BusinessStatusObject {
  status: BusinessStatusUnion;
  reason?: string;
}

export interface Business {
  id: string;
  name: string;
  description: string;
  logo?: string;
  logo_url?: string;
  website?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  category_id: number;
  subcategory_id?: number;
  user_id?: string;
  created_at?: string;
  updated_at?: string;
  status?: BusinessStatusUnion;
  featured?: boolean;
  is_featured?: boolean; // Alias for featured (for compatibility)
  rating?: number;
  review_count?: number;
  services?: string[];
  images?: string[];
  opening_hours?: Record<string, string>;
  owner_id?: string;
  latitude?: number; // Add latitude for map integration
  longitude?: number; // Add longitude for map integration
}

// Update BusinessCreate type for form submissions to match API and page requirements
export interface BusinessCreate {
  name: string;
  description: string;
  logo?: File;
  logo_url?: string;
  website?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  category_id: number;
  subcategory_id?: number;
  owner_id?: string;
  user_id?: string;
  status?: BusinessStatusUnion;
  opening_hours?: Record<string, string>;
  is_featured?: boolean;
  latitude?: number;
  longitude?: number;
}

// Add BusinessFilter type
export interface BusinessFilter {
  category_id?: number;
  subcategory_id?: number;
  search?: string;
  featured?: boolean;
  status?: BusinessStatusUnion;
  sort?: 'newest' | 'oldest' | 'name_asc' | 'name_desc' | 'rating' | 'rating_high' | 'rating_low' | 'most_reviewed';
  country?: string;
  city?: string;
  rating?: number;
}

export interface User {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  company_name?: string;
  phone?: string;
  country?: string;
  language?: LanguageCode;
  created_at?: string;
  updated_at?: string;
}

// Update Profile to make it fully compatible with API and User
export interface Profile {
  id: string;
  email: string; // Make email required
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  company_name?: string;
  phone?: string;
  country?: string;
  language?: LanguageCode;
  created_at?: string;
  updated_at?: string;
  bio?: string;
  website?: string;
  is_admin?: boolean; // Add to match API response
  social_links?: {
    twitter?: string;
    facebook?: string;
    linkedin?: string;
    instagram?: string;
  };
}

export interface ProfileUpdate {
  first_name?: string;
  last_name?: string;
  phone?: string;
  company_name?: string;
  country?: string;
  language?: LanguageCode;
  bio?: string;
  website?: string;
  avatar_url?: string;
  email?: string; // Add email for compatibility with API updates
  social_links?: {
    twitter?: string;
    facebook?: string;
    linkedin?: string;
    instagram?: string;
  };
}

export interface Review {
  id: string;
  business_id: string;
  user_id: string;
  user_name?: string;
  rating: number;
  comment: string;
  reply?: string;
  created_at?: string;
  updated_at?: string;
}

// Re-export wiki types for easy access
export type { WikiEntry, WikiSearchResult, WikiServiceInterface, WikiPage, WikiCategory } from './wiki';

// Re-export LanguageCode for global use
export type { LanguageCode };
