
export interface Business {
  id: string;
  name: string;
  description: string;
  category_id: number;
  subcategory_id?: number;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone: string;
  email: string;
  website: string;
  logo_url: string;
  is_featured: boolean;
  owner_id: string;
  status: string;
  created_at: string;
  updated_at?: string;
  latitude: number;
  longitude: number;
  
  // Additional properties that were missing
  rating?: number;
  review_count?: number;
  images?: string[];
  opening_hours?: Record<string, string>;
  services?: string[];
  postal_code?: string; // Alternative to zip
  user_id?: string; // Added to match database usage
}

// Add a type for form data used in business components
export interface BusinessFormData {
  name: string;
  description: string;
  category_id: number | null;
  subcategory_id?: number | null;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postal_code?: string;
  zip?: string;
  email?: string;
  phone?: string;
  website?: string;
  opening_hours?: Record<string, string>;
  services?: any[];
  logo_url?: string;
  logo?: File;
}

export type BusinessCreate = Omit<Business, 'id' | 'created_at' | 'updated_at'> & {
  id?: string;
  created_at?: string;
  updated_at?: string;
  logo?: File;
  owner_id?: string; // Make this optional as it might be set by the backend
};

export type BusinessUpdate = Partial<BusinessCreate>;

export enum BusinessStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected'
}

// Add progress callback type
export type ProgressCallback = (progress: number) => void;
