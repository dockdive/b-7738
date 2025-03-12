
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
  getRelatedEntries?: (currentEntry: WikiEntry) => WikiEntry[];
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
  }
};

// Helper functions for ID type conversions
export const normalizeId = (id: number | string): string => {
  return id?.toString() || '';
};

export const compareIds = (id1: number | string | undefined, id2: number | string | undefined): boolean => {
  if (id1 === undefined || id2 === undefined) return false;
  return normalizeId(id1) === normalizeId(id2);
};
