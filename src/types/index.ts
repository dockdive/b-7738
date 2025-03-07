
export type Profile = {
  id: string;
  first_name: string;
  last_name: string;
  avatar_url: string | null;
  company_name: string | null;
  phone: string | null;
  country: string | null;
  language: string;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
};

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

export type Business = {
  id: string;
  owner_id: string;
  name: string;
  description: string | null;
  website: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  country: string | null;
  latitude: number | null;
  longitude: number | null;
  logo_url: string | null;
  category_id: number | null;
  subcategory_id: number | null;
  status: 'pending' | 'approved' | 'rejected';
  is_featured: boolean;
  rating: number;
  review_count: number;
  views: number;
  created_at: string;
  updated_at: string;
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

export type Review = {
  id: string;
  business_id: string;
  user_id: string;
  rating: number;
  comment: string | null;
  is_reported: boolean;
  reply: string | null;
  created_at: string;
  updated_at: string;
};

export type Language = 'en' | 'de' | 'fr' | 'es' | 'it' | 'nl';

export type Country = {
  code: string;
  name: string;
};
