
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

// Import from business.ts to ensure consistency
import { Business as BusinessType, BusinessFormData } from './business';

// Re-export for backward compatibility
export type Business = BusinessType;
export type { BusinessFormData };

// Update BusinessCreate to ensure it matches the API requirements
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
  postal_code?: string; // Alias for zip
  country?: string;
  category_id: number;
  subcategory_id?: number;
  owner_id?: string; // Make owner_id optional to match database
  user_id?: string;
  status?: BusinessStatusUnion;
  opening_hours?: Record<string, string>;
  is_featured?: boolean;
  services?: string[];
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
  role?: string; // Add role for backward compatibility
}

// Update Profile to make it fully compatible with API and User
export interface Profile {
  id: string;
  email: string; // Required email
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
  is_admin?: boolean;
  role?: string; // Add role for backward compatibility
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
  email?: string;
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

// Wiki types to address the WikiContext errors
export interface WikiPage {
  id: string;
  title: string;
  content: string;
  category_id: number;
  created_at?: string;
  updated_at?: string;
  author_id?: string;
  status?: 'draft' | 'published' | 'archived';
  tags?: string[];
}

export interface WikiSearchResult {
  id: string;
  title: string;
  excerpt: string;
  created_at?: string;
  author_id?: string;
}

// Re-export LanguageCode for global use
export type { LanguageCode };

// CSV and Progress-related types
export type ProgressCallback = (progress: number) => void;

export interface CSVResult {
  success: boolean;
  data?: any[] | string[][];
  count?: number;
  error?: string;
}
