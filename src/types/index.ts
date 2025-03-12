
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

export interface BusinessStatus {
  status: 'pending' | 'approved' | 'rejected';
  reason?: string;
}

export interface Business {
  id: string;
  name: string;
  description: string;
  logo?: string;
  logo_url?: string; // Added for compatibility with existing code
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
  status?: 'pending' | 'approved' | 'rejected';
  featured?: boolean;
  is_featured?: boolean; // Alias for featured (for compatibility)
  rating?: number; // Added for compatibility
  review_count?: number; // Added for compatibility
  services?: string[]; // Added for compatibility
  images?: string[]; // Added for compatibility
  opening_hours?: Record<string, string>; // Added for compatibility
  owner_id?: string; // Added for compatibility with API
}

// Add BusinessCreate type for form submissions
export interface BusinessCreate {
  name: string;
  description: string;
  logo?: File;
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
  status?: 'pending' | 'approved' | 'rejected';
  opening_hours?: Record<string, string>;
  is_featured?: boolean; // Added to match AddBusiness.tsx usage
}

// Add BusinessFilter type
export interface BusinessFilter {
  category_id?: number;
  subcategory_id?: number;
  search?: string;
  featured?: boolean;
  status?: 'pending' | 'approved' | 'rejected';
  sort?: 'newest' | 'oldest' | 'name_asc' | 'name_desc' | 'rating' | 'rating_high' | 'rating_low' | 'most_reviewed';
  country?: string; // Added for compatibility with API
  city?: string; // Added for compatibility with API
  rating?: number; // Added for compatibility with API
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

// Add Profile and ProfileUpdate types
export interface Profile extends User {
  bio?: string;
  website?: string;
  email?: string; // Added to resolve type errors
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
  avatar_url?: string; // Added for compatibility with API
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
  user_name?: string; // Added for compatibility
  rating: number;
  comment: string;
  reply?: string; // Added for compatibility
  created_at?: string;
  updated_at?: string;
}

// Re-export wiki types for easy access
export type { WikiEntry, WikiSearchResult, WikiServiceInterface, WikiPage, WikiCategory } from './wiki';

// Re-export LanguageCode for global use
export type { LanguageCode };
