// Import necessary types and supabase client
import { supabase } from "@/integrations/supabase/client";
import { 
  Business, 
  BusinessCreate, 
  BusinessFilter, 
  BusinessStatus, 
  Category,
  Review,
  Profile,
  ProfileUpdate,
  Subcategory,
  LanguageCode
} from "@/types";

// Create business function
export const createBusiness = async (business: BusinessCreate): Promise<Business> => {
  try {
    // Fix: Cast business.status as BusinessStatus to match the type definition
    const { data, error } = await supabase
      .from('businesses')
      .insert({
        ...business,
        status: business.status as BusinessStatus // Type cast to match expected type
      })
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    
    // Cast the status properly
    return {
      ...data,
      status: data.status as BusinessStatus
    } as Business;
  } catch (error) {
    console.error('Error creating business:', error);
    throw error;
  }
};

// Reply to review function
export const replyToReview = async (reviewId: string, reply: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('reviews')
      .update({ reply: reply }) // Fix: Use explicit property assignment instead of shorthand
      .eq('id', reviewId);
    
    if (error) throw error;
  } catch (error) {
    console.error('Error replying to review:', error);
    throw error;
  }
};

// Add missing API functions that are being imported in other files
export const fetchBusinesses = async (filters?: BusinessFilter): Promise<Business[]> => {
  try {
    let query = supabase.from('businesses').select('*');
    
    if (filters) {
      if (filters.category_id) {
        query = query.eq('category_id', filters.category_id);
      }
      if (filters.subcategory_id) {
        query = query.eq('subcategory_id', filters.subcategory_id);
      }
      if (filters.country) {
        query = query.eq('country', filters.country);
      }
      if (filters.city) {
        query = query.eq('city', filters.city);
      }
      if (filters.rating) {
        query = query.gte('rating', filters.rating);
      }
      if (filters.search) {
        query = query.ilike('name', `%${filters.search}%`);
      }
      
      // Handle sorting
      if (filters.sort) {
        switch (filters.sort) {
          case 'name_asc':
            query = query.order('name', { ascending: true });
            break;
          case 'name_desc':
            query = query.order('name', { ascending: false });
            break;
          case 'rating_high':
            query = query.order('rating', { ascending: false });
            break;
          case 'rating_low':
            query = query.order('rating', { ascending: true });
            break;
          case 'newest':
            query = query.order('created_at', { ascending: false });
            break;
          case 'oldest':
            query = query.order('created_at', { ascending: true });
            break;
          case 'most_reviewed':
            query = query.order('review_count', { ascending: false });
            break;
          default:
            query = query.order('name', { ascending: true });
        }
      }
    }
    
    const { data, error } = await query;
    
    if (error) throw new Error(error.message);
    
    // Cast the status properly for each business
    return (data || []).map(item => ({
      ...item,
      status: item.status as BusinessStatus
    })) as Business[];
  } catch (error) {
    console.error('Error fetching businesses:', error);
    return [];
  }
};

export const fetchBusinessById = async (id: string): Promise<Business | null> => {
  try {
    const { data, error } = await supabase
      .from('businesses')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw new Error(error.message);
    
    // Cast the status properly
    return data ? {
      ...data,
      status: data.status as BusinessStatus
    } as Business : null;
  } catch (error) {
    console.error(`Error fetching business with ID ${id}:`, error);
    return null;
  }
};

export const fetchCategories = async (): Promise<Category[]> => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');
    
    if (error) throw new Error(error.message);
    return data || [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};

export const fetchSubcategories = async (categoryId?: number): Promise<Subcategory[]> => {
  try {
    let query = supabase.from('subcategories').select('*');
    
    if (categoryId) {
      query = query.eq('category_id', categoryId);
    }
    
    const { data, error } = await query.order('name');
    
    if (error) throw new Error(error.message);
    return data || [];
  } catch (error) {
    console.error('Error fetching subcategories:', error);
    return [];
  }
};

export const fetchReviewsByBusinessId = async (businessId: string): Promise<Review[]> => {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('business_id', businessId)
      .order('created_at', { ascending: false });
    
    if (error) throw new Error(error.message);
    return data || [];
  } catch (error) {
    console.error(`Error fetching reviews for business ${businessId}:`, error);
    return [];
  }
};

export const fetchFeaturedBusinesses = async (): Promise<Business[]> => {
  try {
    const { data, error } = await supabase
      .from('businesses')
      .select('*')
      .eq('is_featured', true)
      .order('rating', { ascending: false })
      .limit(6);
    
    if (error) throw new Error(error.message);
    
    // Cast the status properly for each featured business
    return (data || []).map(item => ({
      ...item,
      status: item.status as BusinessStatus
    })) as Business[];
  } catch (error) {
    console.error('Error fetching featured businesses:', error);
    return [];
  }
};

export const fetchProfile = async (userId: string): Promise<Profile> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) throw new Error(error.message);
    
    // Cast the language properly to ensure it matches LanguageCode type
    return {
      ...data,
      language: data.language as LanguageCode
    } as Profile;
  } catch (error) {
    console.error(`Error fetching profile for user ${userId}:`, error);
    throw error;
  }
};

export const updateProfile = async (userId: string, updates: ProfileUpdate): Promise<Profile> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    
    // Cast the language properly to ensure it matches LanguageCode type
    return {
      ...data,
      language: data.language as LanguageCode
    } as Profile;
  } catch (error) {
    console.error(`Error updating profile for user ${userId}:`, error);
    throw error;
  }
};

export const uploadImage = async (userId: string, file: File): Promise<string> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `avatars/${fileName}`;
    
    const { error } = await supabase.storage
      .from('user-files')
      .upload(filePath, file);
    
    if (error) throw new Error(error.message);
    
    const { data } = supabase.storage
      .from('user-files')
      .getPublicUrl(filePath);
    
    return data.publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

// Add 20 boat manufacturer businesses for display
const sampleBusinesses: Business[] = [
  {
    id: "b001",
    name: "Beneteau",
    description: "Founded in 1884, Beneteau is one of the world's leading yacht builders, producing sailing yachts, motorboats, and custom yacht lines. Known for innovative design and exceptional quality in recreational boating.",
    logo_url: "https://images.unsplash.com/photo-1647401989367-b0a7a6d87850?ixlib=rb-4.0.3&auto=format&fit=crop&w=640&q=80",
    category_id: 1,
    subcategory_id: 1,
    rating: 4.9,
    review_count: 238,
    city: "Saint-Hilaire-de-Riez",
    country: "France",
    services: ["Sailboat Manufacturing", "Powerboat Manufacturing", "Custom Design", "International Shipping"],
    address: "16 Boulevard de la Mer",
    zip: "85270",
    phone: "+33 2 51 60 50 00",
    email: "contact@beneteau.com",
    website: "https://www.beneteau.com",
    is_featured: true,
    status: "approved" as BusinessStatus,
    created_at: "2018-05-15T00:00:00Z",
    updated_at: "2023-08-01T00:00:00Z",
    images: [
      "https://images.unsplash.com/photo-1584188834841-4f0adb6e76e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=640&q=80",
      "https://images.unsplash.com/photo-1592742272072-c31cd5e33fcf?ixlib=rb-4.0.3&auto=format&fit=crop&w=640&q=80"
    ]
  },
  {
    id: "b002",
    name: "Brunswick Marine",
    description: "A global leader in recreational marine products, Brunswick Corporation manufactures engines, boats, and marine parts. Offers a wide range of vessels from fishing boats to luxury yachts.",
    logo_url: "https://images.unsplash.com/photo-1631091434246-3e8d0080508a?ixlib=rb-4.0.3&auto=format&fit=crop&w=640&q=80",
    category_id: 1,
    subcategory_id: 2,
    rating: 4.7,
    review_count: 189,
    city: "Mettawa",
    country: "USA",
    services: ["Engine Manufacturing", "Boat Manufacturing", "Marine Accessories", "Service Network"],
    address: "26125 N Riverwoods Blvd",
    zip: "60045",
    phone: "+1 847-735-4700",
    email: "info@brunswick.com",
    website: "https://www.brunswick.com",
    is_featured: true,
    status: "approved" as BusinessStatus,
    created_at: "2017-02-10T00:00:00Z",
    updated_at: "2023-07-12T00:00:00Z",
    images: [
      "https://images.unsplash.com/photo-1572495425710-0a81e675048e?ixlib=rb-4.0.3&auto=format&fit=crop&w=640&q=80",
      "https://images.unsplash.com/photo-1569263900347-06b1e8c825ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=640&q=80"
    ]
  },
  {
    id: "b003",
    name: "Azimut Yachts",
    description: "Founded in 1969, Azimut Yachts designs and builds luxury yachts renowned for their innovative technology, contemporary design, and superior comfort. A leader in the luxury yacht market.",
    logo_url: "https://images.unsplash.com/photo-1570463662416-7d8e39e5cbf1?ixlib=rb-4.0.3&auto=format&fit=crop&w=640&q=80",
    category_id: 1,
    subcategory_id: 3,
    rating: 4.8,
    review_count: 156,
    city: "Avigliana",
    country: "Italy",
    services: ["Luxury Yacht Building", "Custom Design", "Maintenance", "Used Boat Sales"],
    address: "Via Martin Luther King 9/11",
    zip: "10051",
    phone: "+39 011 93161",
    email: "info@azimutyachts.com",
    website: "https://www.azimutyachts.com",
    is_featured: true,
    status: "approved" as BusinessStatus,
    created_at: "2016-09-08T00:00:00Z",
    updated_at: "2023-06-15T00:00:00Z",
    images: [
      "https://images.unsplash.com/photo-1589288415562-6ff3a09726cf?ixlib=rb-4.0.3&auto=format&fit=crop&w=640&q=80",
      "https://images.unsplash.com/photo-1569629743714-4d51aedcb891?ixlib=rb-4.0.3&auto=format&fit=crop&w=640&q=80"
    ]
  },
  {
    id: "b004",
    name: "Princess Yachts",
    description: "Established in 1965, Princess Yachts builds luxury motor yachts in Plymouth, England. Known for exceptional craftsmanship, innovative design, and seamless performance across their range of luxury vessels.",
    logo_url: "https://images.unsplash.com/photo-1627731952161-112eed6d7a20?ixlib=rb-4.0.3&auto=format&fit=crop&w=640&q=80",
    category_id: 1,
    subcategory_id: 3,
    rating: 4.9,
    review_count: 143,
    city: "Plymouth",
    country: "United Kingdom",
    services: ["Luxury Yacht Manufacturing", "Custom Build", "Refit & Restoration", "Brokerage"],
    address: "Newport Street",
    zip: "PL1 3QG",
    phone: "+44 1752 203888",
    email: "info@princessyachts.com",
    website: "https://www.princessyachts.com",
    is_featured: false,
    status: "approved" as BusinessStatus,
    created_at: "2017-05-20T00:00:00Z",
    updated_at: "2023-05-28T00:00:00Z",
    images: [
      "https://images.unsplash.com/photo-1610523137946-34c7165bf8d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=640&q=80",
      "https://images.unsplash.com/photo-1563296291-28f8814112dc?ixlib=rb-4.0.3&auto=format&fit=crop&w=640&q=80"
    ]
  },
  {
    id: "b005",
    name: "Jeanneau",
    description: "Part of Groupe Beneteau, Jeanneau has been crafting boats since 1957. Specializes in sailboats and powerboats that combine performance, elegance, and comfort for enthusiasts and families.",
    logo_url: "https://images.unsplash.com/photo-1589219137639-3c7b23aeef8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=640&q=80",
    category_id: 1,
    subcategory_id: 1,
    rating: 4.6,
    review_count: 210,
    city: "Les Herbiers",
    country: "France",
    services: ["Sailboat Manufacturing", "Powerboat Manufacturing", "Service & Maintenance", "Parts Supply"],
    address: "Route de la Roche Sur Yon",
    zip: "85500",
    phone: "+33 2 51 64 20 20",
    email: "info@jeanneau.com",
    website: "https://www.jeanneau.com",
    is_featured: false,
    status: "approved" as BusinessStatus,
    created_at: "2018-01-12T00:00:00Z",
    updated_at: "2023-04-18T00:00:00Z",
    images: [
      "https://images.unsplash.com/photo-1516132006923-6cf348e5dee2?ixlib=rb-4.0.3&auto=format&fit=crop&w=640&q=80",
      "https://images.unsplash.com/photo-1591180290025-5d7e35430e9e?ixlib=rb-4.0.3&auto=format&fit=crop&w=640&q=80"
    ]
  },
  {
    id: "b006",
    name: "Viking Yachts",
    description: "Family-owned and operated since 1964, Viking Yachts is one of America's leading luxury sportfishing and motor yacht manufacturers. Known for performance, innovation, and engineering excellence.",
    logo_url: "https://images.unsplash.com/photo-1546445317-29f4545e9d53?ixlib=rb-4.0.3&auto=format&fit=crop&w=640&q=80",
    category_id: 1,
    subcategory_id: 2,
    rating: 4.7,
    review_count: 178,
    city: "New Gretna",
    country: "USA",
    services: ["Sportfishing Yacht Building", "Motor Yacht Construction", "Service & Repair", "Custom Outfitting"],
    address: "Route 9, Bass River",
    zip: "08224",
    phone: "+1 609-296-6000",
    email: "sales@vikingyachts.com",
    website: "https://www.vikingyachts.com",
    is_featured: false,
    status: "approved" as BusinessStatus,
    created_at: "2019-03-02T00:00:00Z",
    updated_at: "2023-08-10T00:00:00Z",
    images: [
      "https://images.unsplash.com/photo-1539797838992-a31f9c1cfad4?ixlib=rb-4.0.3&auto=format&fit=crop&w=640&q=80",
      "https://images.unsplash.com/photo-1570863160264-28ce9fd47b88?ixlib=rb-4.0.3&auto=format&fit=crop&w=640&q=80"
    ]
  },
  {
    id: "b007",
    name: "Sunseeker",
    description: "Founded in 1969, Sunseeker International produces luxury motor yachts from its shipyards in Poole, UK. Renowned for sleek designs, cutting-edge technology, and appearances in James Bond films.",
    logo_url: "https://images.unsplash.com/photo-1572442736475-7b57342669c6?ixlib=rb-4.0.3&auto=format&fit=crop&w=640&q=80",
    category_id: 1,
    subcategory_id: 3,
    rating: 4.8,
    review_count: 195,
    city: "Poole",
    country: "United Kingdom",
    services: ["Luxury Yacht Building", "Custom Interiors", "Brokerage", "Charter Services"],
    address: "27-31 West Quay Road",
    zip: "BH15 1HX",
    phone: "+44 1202 381111",
    email: "info@sunseeker.com",
    website: "https://www.sunseeker.com",
    is_featured: true,
    status: "approved" as BusinessStatus,
    created_at: "2017-06-28T00:00:00Z",
    updated_at: "2023-05-31T00:00:00Z",
    images: [
      "https://images.unsplash.com/photo-1639462701508-0b7969af0c41?ixlib=rb-4.0.3&auto=format&fit=crop&w=640&q=80",
      "https://images.unsplash.com/photo-1640276922909-fe221e33fb26?ixlib=rb-4.0.3&auto=format&fit=crop&w=640&q=80"
    ]
  },
  {
    id: "b008",
    name: "Ferretti Group",
    description: "A leading global luxury yacht manufacturer founded in 1968, the Ferretti Group encompasses prestigious brands including Ferretti Yachts, Riva, Pershing, and Custom Line, offering a diverse range of high-end vessels.",
    logo_url: "https://images.unsplash.com/photo-1563298258-e1e5c6b1b78f?ixlib=rb-4.0.3&auto=format&fit=crop&w=640&q=80",
    category_id: 1,
    subcategory_id: 3,
    rating: 4.9,
    review_count: 220,
    city: "Forlì",
    country: "Italy",
    services: ["Luxury Yacht Construction", "Design & Engineering", "Refit Services", "After-Sales Support"],
    address: "Via Ansaldo 7",
    zip: "47122",
    phone: "+39 0543 474411",
    email: "info@ferrettigroup.com",
    website: "https://www.ferrettigroup.com",
    is_featured: true,
    status: "approved" as BusinessStatus,
    created_at: "2016-11-05T00:00:00Z",
    updated_at: "2023-07-22T00:00:00Z",
    images: [
      "https://images.unsplash.com/photo-1533692328991-4061what the f*ck3b6?ixlib=rb-4.0.3&auto=format&fit=crop&w=640&q=80",
      "https://images.unsplash.com/photo-1593351415075-3bac95314fbe?ixlib=rb-4.0.3&auto=format&fit=crop&w=640&q=80"
    ]
  },
  {
    id: "b009",
    name: "Fountaine Pajot",
    description: "Founded in 1976, Fountaine Pajot specializes in luxury sailing and power catamarans. Known for innovative designs that maximize space, comfort, and performance for blue water cruising.",
    logo_url: "https://images.unsplash.com/photo-1592771451003-78ccd2814514?ixlib=rb-4.0.3&auto=format&fit=crop&w=640&q=80",
    category_id: 1,
    subcategory_id: 1,
    rating: 4.7,
    review_count: 168,
    city: "Aigrefeuille d'Aunis",
    country: "France",
    services: ["Sailing Catamaran Building", "Power Catamaran Building", "Custom Options", "Owner's Program"],
    address: "Zone Industrielle",
    zip: "17290",
    phone: "+33 5 46 35 70 40",
    email: "contact@fountaine-pajot.com",
    website: "https://www.fountaine-pajot.com",
    is_featured: false,
    status: "approved" as BusinessStatus,
    created_at: "2018-07-14T00:00:00Z",
    updated_at: "2023-06-30T00:00:00Z",
    images: [
      "https://images.unsplash.com/photo-1566926462053-5476cf83f1d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=640&q=80",
      "https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?ixlib=rb-4.0.3&auto=format&fit=crop&w=640&q=80"
    ]
  },
  {
    id: "b010",
    name: "Boston Whaler",
    description: "Established in 1958, Boston Whaler is renowned for building 'unsinkable' boats with superior design, construction, and performance. Specializes in center console, dual console, and outboard boats.",
    logo_url: "https://images.unsplash.com/photo-1571850744325-a34e581290a8?ixlib=rb-4.0.3&auto=format&fit=crop&w=640&q=80",
    category_id: 1,
    subcategory_id: 2,
    rating: 4.6,
    review_count: 253,
    city: "Edgewater",
    country: "USA",
    services: ["Recreational Boat Building", "Center Console Boats", "Fishing Boats", "Dealer Network"],
    address: "100 Whaler Way",
    zip: "32141",
    phone: "+1 386-428-0057",
    email: "info@bostonwhaler.com",
    website: "https://www.bostonwhaler.com",
    is_featured: false,
    status: "approved" as BusinessStatus,
    created_at: "2019-01-22T00:00:00Z",
    updated_at: "2023-08-05T00:00:00Z",
    images: [
      "https://images.unsplash.com/photo-1575457180622-9ca8cbfde32f?ixlib=rb-4.0.3&auto=format&fit=crop&w=640&q=80",
      "https://images.unsplash.com/photo-1529080504353-6b280eebc3f2?ixlib=rb-4.0.3&auto=format&fit=crop&w=640&q=80"
    ]
  },
  {
    id: "b011",
    name: "Lagoon Catamarans",
    description: "Founded in 1984, Lagoon is a world leader in cruising catamaran construction. Part of Groupe Beneteau, they offer innovative, comfortable, and reliable sailing and power catamarans for global cruising.",
    logo_url: "https://images.unsplash.com/photo-1521214798576-ae523fcd485a?ixlib=rb-4.0.3&auto=format&fit=crop&w=640&q=80",
    category_id: 1,
    subcategory_id: 1,
    rating: 4.8,
    review_count: 187,
    city: "Bordeaux",
    country: "France",
    services: ["Sailing Catamaran Manufacturing", "Power Catamaran Manufacturing", "Global Service Network", "Custom Interiors"],
    address: "162 quai de Brazza",
    zip: "33100",
    phone: "+33 5 57 80 92 80",
    email: "info@cata-lagoon.com",
    website: "https://www.cata-lagoon.com",
    is_featured: false,
    status: "approved" as BusinessStatus,
    created_at: "2018-04-17T00:00:00Z",
    updated_at: "2023-07-19T00:00:00Z",
    images: [
      "https://images.unsplash.com/photo-1542202229-7d93c33f5d07?ixlib=rb-4.0.3&auto=format&fit=crop&w=640&q=80",
      "https://images.unsplash.com/photo-1542397284385-6010376c5337?ixlib=rb-4.0.3&auto=format&fit=crop&w=640&q=80"
    ]
  },
  {
    id: "b012",
    name: "Grady-White Boats",
    description: "Since 1959, Grady-White has built exceptional offshore and coastal fishing boats. Known for exceptional attention to detail, reliability, and customer satisfaction in their center console, dual console, and walkaround cabin boats.",
    logo_url: "https://images.unsplash.com/photo-1605281317010-fe5ffe798166?ixlib=rb-4.0.3&auto=format&fit=crop&w=640&q=80",
    category_id: 1,
    subcategory_id: 2,
    rating: 4.7,
    review_count: 203,
    city: "Greenville",
    country: "USA",
    services: ["Fishing Boat Manufacturing", "Center Console Boats", "Dual Console Boats", "Customer Support"],
    address: "5121 Martin Luther King Jr Highway",
    zip: "27834",
    phone: "+1 252-752-2111",
    email: "custserv@gradywhite.com",
    website: "https://www.gradywhite.com",
    is_featured: false,
    status: "approved" as BusinessStatus,
    created_at: "2017-09-30T00:00:00Z",
    updated_at: "2023-0
