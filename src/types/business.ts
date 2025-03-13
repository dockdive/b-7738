
// Types for the business entity
export interface Business {
  id: string;
  name: string;
  description: string;
  address: string;
  city: string;
  country: string;
  postal_code?: string;
  zip?: string; // Some places might use zip instead of postal_code
  latitude: number;
  longitude: number;
  email: string;
  phone: string;
  website: string;
  logo_url: string;
  category_id: number;
  user_id?: string;
  owner_id?: string;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
  opening_hours?: Record<string, any>;
  services?: string[];
  status?: string;
  state?: string;
}

// Types for user profiles
export interface UserProfile {
  id: string;
  user_id: string;
  name?: string;
  avatar_url?: string;
  email?: string;
  role?: string;
  created_at?: string;
  updated_at?: string;
}

// Extend the import to include missing properties
export interface BusinessFormData {
  name: string;
  description: string;
  category_id: number;
  address: string;
  city: string;
  country: string;
  postal_code?: string;
  zip?: string;
  email: string;
  phone: string;
  website: string;
  logo_url?: string;
  opening_hours?: Record<string, any>;
  services?: string[];
  state?: string;
}
