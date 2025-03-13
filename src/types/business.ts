
// Types for the business entity
export interface Business {
  id: string;
  name: string;
  description: string;
  address: string;
  city: string;
  country: string;
  postal_code?: string; // Add for compatibility with EditBusiness.tsx
  zip?: string; // Some places might use zip instead of postal_code
  latitude: number;
  longitude: number;
  email: string;
  phone: string;
  website: string;
  logo_url: string;
  category_id: number;
  user_id?: string; // Add for compatibility with EditBusiness.tsx
  is_featured: boolean;
  created_at: string;
  updated_at: string;
  opening_hours?: Record<string, any>; // Add for compatibility with EditBusiness.tsx
  services?: string[]; // Add for compatibility with EditBusiness.tsx
}

// Types for user profiles
export interface UserProfile {
  id: string;
  user_id: string;
  name?: string;
  avatar_url?: string;
  email?: string;
  role?: string; // Add for compatibility with EditBusiness.tsx
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
  logo_url: string;
  opening_hours?: Record<string, any>;
  services?: string[];
}
