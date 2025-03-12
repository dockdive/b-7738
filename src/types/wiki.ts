
export interface WikiEntry {
  id: number;
  slug: string;
  title: string;
  content: string;
  created_at?: string;
  updated_at?: string;
  category?: string;
  tags?: string[];
}

export interface WikiSearchResult {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  relevance: number;
}

export interface WikiServiceInterface {
  getEntry: (slug: string) => Promise<WikiEntry>;
  searchEntries: (query: string) => Promise<WikiSearchResult[]>;
  getEntries?: () => Promise<WikiEntry[]>; // Add this method to the interface
  entries: WikiEntry[];
  loading: boolean;
  error: Error | null;
}

// Add additional Wiki types needed by WikiContext
export interface WikiPage {
  id: number;
  slug: string;
  title: string;
  content: string;
  category_id: number;
  created_at?: string;
  updated_at?: string;
}

export interface WikiCategory {
  id: number;
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
  error: null
};
