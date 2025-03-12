
import { useContext, createContext, useState, ReactNode } from 'react';
import { 
  WikiEntry, 
  WikiPage, 
  WikiCategory, 
  WikiSearchResult,
  WikiServiceInterface,
  wikiService
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

// Create the provider component
interface WikiAdapterProviderProps {
  children: ReactNode;
}

export const WikiAdapterProvider: React.FC<WikiAdapterProviderProps> = ({ children }) => {
  const [entries, setEntries] = useState<WikiEntry[]>([]);
  const [categories, setCategories] = useState<WikiCategory[]>([]);
  const [recentEntries, setRecentEntries] = useState<WikiEntry[]>([]);
  const [popularEntries, setPopularEntries] = useState<WikiEntry[]>([]);
  const [featuredEntry, setFeaturedEntry] = useState<WikiEntry | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  // Implement all the required methods
  const getEntry = async (slug: string): Promise<WikiEntry> => {
    return await wikiService.getEntry(slug);
  };

  const searchEntries = async (query: string): Promise<WikiSearchResult[]> => {
    return await wikiService.searchEntries(query);
  };

  const getCategoryEntries = (categoryId: number | string): WikiEntry[] => {
    return entries.filter(entry => {
      if (typeof entry.category === 'object') {
        return String(entry.category.id) === String(categoryId);
      } else if (typeof entry.category === 'string') {
        return entry.category === String(categoryId);
      }
      return false;
    });
  };

  // Admin functions implementation
  const canEditWiki = (): boolean => {
    return wikiService.canEditWiki ? wikiService.canEditWiki() : false;
  };

  const getAllCategories = async (): Promise<WikiCategory[]> => {
    return wikiService.getAllCategories ? await wikiService.getAllCategories() : [];
  };

  const getAllPages = async (): Promise<WikiPage[]> => {
    return wikiService.getAllPages ? await wikiService.getAllPages() : [];
  };

  const searchPages = async (query: string): Promise<WikiSearchResult[]> => {
    return wikiService.searchPages ? await wikiService.searchPages(query) : [];
  };

  const getPageBySlug = async (slug: string): Promise<WikiPage> => {
    return wikiService.getPageBySlug ? await wikiService.getPageBySlug(slug) : {
      id: 0,
      slug,
      title: '',
      content: '',
      category_id: 0
    };
  };

  const getPagesByCategory = async (categoryId: number | string): Promise<WikiPage[]> => {
    return wikiService.getPagesByCategory ? await wikiService.getPagesByCategory(categoryId) : [];
  };

  const updatePage = async (page: WikiPage): Promise<WikiPage> => {
    return wikiService.updatePage ? await wikiService.updatePage(page) : page;
  };

  const createPage = async (page: Partial<WikiPage>): Promise<WikiPage> => {
    return wikiService.createPage ? await wikiService.createPage(page) : {
      id: 0,
      slug: '',
      title: '',
      content: '',
      category_id: 0,
      ...page
    };
  };

  const getPageReviewStatus = async (pageId: number | string): Promise<string> => {
    return wikiService.getPageReviewStatus ? await wikiService.getPageReviewStatus(pageId) : 'pending';
  };

  const deletePage = async (pageId: number | string): Promise<void> => {
    if (wikiService.deletePage) {
      await wikiService.deletePage(pageId);
    }
  };

  const reviewPage = async (pageId: number | string, status: string): Promise<void> => {
    if (wikiService.reviewPage) {
      await wikiService.reviewPage(pageId, status);
    }
  };

  const getPendingReviews = async (): Promise<WikiPage[]> => {
    return wikiService.getPendingReviews ? await wikiService.getPendingReviews() : [];
  };

  return (
    <WikiAdapterContext.Provider value={{
      entries,
      categories,
      recentEntries,
      popularEntries,
      featuredEntry,
      loading,
      error,
      getEntry,
      searchEntries,
      getCategoryEntries,
      canEditWiki,
      getAllCategories,
      getAllPages,
      searchPages,
      getPageBySlug,
      getPagesByCategory,
      updatePage,
      createPage,
      getPageReviewStatus,
      deletePage,
      reviewPage,
      getPendingReviews
    }}>
      {children}
    </WikiAdapterContext.Provider>
  );
};

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
      : (entry.category?.id || 0),
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
      : String(page.category_id), // Convert to string to fix the type error
    created_at: page.created_at,
    updated_at: page.updated_at
  };
};
