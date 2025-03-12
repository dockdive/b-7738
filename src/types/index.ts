
import { LanguageCode } from '@/constants/languageConstants';

// This file adds or updates types needed by the application

export interface Category {
  id: number;
  name: string;
  icon: string;
  description: string; // Required description field
  created_at?: string;
}

export interface Business {
  id: string;
  name: string;
  description: string;
  logo?: string;
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

export interface Review {
  id: string;
  business_id: string;
  user_id: string;
  rating: number;
  comment: string;
  created_at?: string;
  updated_at?: string;
}

// Re-export wiki types for easy access
export * from './wiki';
