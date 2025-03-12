
export interface WikiEntry {
  id: number | string; // Allow both number and string IDs for flexibility
  slug: string;
  title: string;
  content: string;
  created_at?: string;
  updated_at?: string;
  category?: string | { id: number | string; name: string }; // Allow both number and string IDs
  tags?: string[];
}

export interface WikiSearchResult {
  id: number | string; // Allow both number and string IDs
  slug: string;
  title: string;
  excerpt: string;
  relevance: number;
}

export interface WikiServiceInterface {
  getEntry: (slug: string) => Promise<WikiEntry>;
  searchEntries: (query: string) => Promise<WikiSearchResult[]>;
  getEntries: () => Promise<WikiEntry[]>; 
  entries: WikiEntry[];
  loading: boolean;
  error: Error | null;
  getRelatedEntries: (currentEntry: WikiEntry) => WikiEntry[];
  
  // Add all the methods required by WikiContext with correct signatures
  canEditWiki?: () => boolean;
  getAllCategories?: () => Promise<WikiCategory[]>;
  getAllPages?: () => Promise<WikiPage[]>;
  searchPages?: (query: string) => Promise<WikiSearchResult[]>;
  getPageBySlug?: (slug: string) => Promise<WikiPage>;
  getPagesByCategory?: (categoryId: number | string) => Promise<WikiPage[]>;
  updatePage?: (page: WikiPage) => Promise<WikiPage>;
  createPage?: (page: Partial<WikiPage>) => Promise<WikiPage>;
  getPageReviewStatus?: (pageId: number | string) => Promise<string>;
  deletePage?: (pageId: number | string) => Promise<void>;
  reviewPage?: (pageId: number | string, status: string) => Promise<void>;
  getPendingReviews?: () => Promise<WikiPage[]>;
}

// Add additional Wiki types needed by WikiContext
export interface WikiPage {
  id: number | string; // Allow both number and string IDs
  slug: string;
  title: string;
  content: string;
  category_id: number | string; // Allow both number and string IDs
  created_at?: string;
  updated_at?: string;
}

export interface WikiCategory {
  id: number | string; // Allow both number and string IDs
  name: string;
  slug: string;
  description?: string;
}

// Create a proper wikiService default implementation that satisfies the interface
export const wikiService: WikiServiceInterface = {
  getEntry: async (slug: string): Promise<WikiEntry> => {
    return {
      id: 0,
      slug,
      title: '',
      content: ''
    };
  },
  searchEntries: async (query: string): Promise<WikiSearchResult[]> => {
    return [];
  },
  getEntries: async (): Promise<WikiEntry[]> => {
    return [];
  },
  entries: [],
  loading: false,
  error: null,
  getRelatedEntries: (currentEntry: WikiEntry): WikiEntry[] => {
    return [];
  },
  
  // Add implementations for the new methods
  canEditWiki: () => false,
  getAllCategories: async () => [],
  getAllPages: async () => [],
  searchPages: async (query: string) => [],
  getPageBySlug: async (slug: string) => ({
    id: 0,
    slug,
    title: '',
    content: '',
    category_id: 0
  }),
  getPagesByCategory: async (categoryId: number | string) => [],
  updatePage: async (page: WikiPage) => page,
  createPage: async (page: Partial<WikiPage>) => ({
    id: 0,
    slug: '',
    title: '',
    content: '',
    category_id: 0,
    ...page
  }),
  getPageReviewStatus: async (pageId: number | string) => 'pending',
  deletePage: async (pageId: number | string) => {},
  reviewPage: async (pageId: number | string, status: string) => {},
  getPendingReviews: async () => []
};

// Helper functions for ID type conversions
export const normalizeId = (id: number | string): string => {
  return id?.toString() || '';
};

export const compareIds = (id1: number | string | undefined, id2: number | string | undefined): boolean => {
  if (id1 === undefined || id2 === undefined) return false;
  return normalizeId(id1) === normalizeId(id2);
};
