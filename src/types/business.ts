
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
  owner_id?: string; // Make owner_id optional to match the database
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
  role?: string; // Add role property
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

// Export ProgressCallback for CSV operations
export type ProgressCallback = (progress: number) => void;

// Define result type for business operations
export interface BusinessResult {
  success: boolean;
  data?: any[];
  count?: number;
  error?: string;
}
