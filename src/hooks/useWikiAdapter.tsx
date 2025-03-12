
import { useContext, createContext } from 'react';
import { 
  WikiEntry, 
  WikiPage, 
  WikiCategory, 
  WikiSearchResult,
  WikiServiceInterface
} from '@/types/wiki';

// Create a proper adapter interface that matches the WikiContext
interface WikiAdapterContextType {
  entries: WikiEntry[];
  categories: WikiCategory[];
  recentEntries: WikiEntry[];
  popularEntries: WikiEntry[];
  featuredEntry: WikiEntry | null;
  loading: boolean;
  error: Error | null;
  getEntry: (slug: string) => Promise<WikiEntry>;
  searchEntries: (query: string) => Promise<WikiSearchResult[]>;
  getCategoryEntries: (categoryId: number | string) => WikiEntry[];
  
  // Admin functions
  canEditWiki: () => boolean;
  getAllCategories: () => Promise<WikiCategory[]>;
  getAllPages: () => Promise<WikiPage[]>;
  searchPages: (query: string) => Promise<WikiSearchResult[]>;
  getPageBySlug: (slug: string) => Promise<WikiPage>;
  getPagesByCategory: (categoryId: number | string) => Promise<WikiPage[]>;
  updatePage: (page: WikiPage) => Promise<WikiPage>;
  createPage: (page: Partial<WikiPage>) => Promise<WikiPage>;
  getPageReviewStatus: (pageId: number | string) => Promise<string>;
  deletePage: (pageId: number | string) => Promise<void>;
  reviewPage: (pageId: number | string, status: string) => Promise<void>;
  getPendingReviews: () => Promise<WikiPage[]>;
}

// Create an empty context with default values
const WikiAdapterContext = createContext<WikiAdapterContextType | null>(null);

// Hook to use the Wiki adapter
export const useWikiAdapter = () => {
  const context = useContext(WikiAdapterContext);
  if (!context) {
    throw new Error('useWikiAdapter must be used within a WikiAdapterProvider');
  }
  return context;
};

// Adapter hook for backward compatibility
export const useWiki = () => {
  return useWikiAdapter();
};

// Helper function to convert WikiEntry to WikiPage
export const convertEntryToPage = (entry: WikiEntry): WikiPage => {
  return {
    id: entry.id,
    slug: entry.slug,
    title: entry.title,
    content: entry.content,
    category_id: typeof entry.category === 'string' 
      ? entry.category 
      : entry.category?.id || 0,
    created_at: entry.created_at,
    updated_at: entry.updated_at
  };
};

// Helper function to convert WikiPage to WikiEntry
export const convertPageToEntry = (page: WikiPage, categoryName?: string): WikiEntry => {
  return {
    id: page.id,
    slug: page.slug,
    title: page.title,
    content: page.content,
    category: categoryName 
      ? { id: page.category_id, name: categoryName }
      : page.category_id,
    created_at: page.created_at,
    updated_at: page.updated_at
  };
};
