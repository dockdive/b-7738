
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
