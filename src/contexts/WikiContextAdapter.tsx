
import React, { createContext, useContext, useState, useEffect } from 'react';
import { WikiEntry, WikiPage, WikiCategory, WikiSearchResult } from '@/types';
import { wikiService } from '@/types/wiki';

// Interface for the WikiContext
interface WikiContextType {
  getEntry: (slug: string) => Promise<WikiEntry>;
  searchEntries: (query: string) => Promise<WikiSearchResult[]>;
  entries: WikiEntry[];
  loading: boolean;
  error: Error | null;
  pages: WikiPage[];
  categories: WikiCategory[];
  getPageById: (id: number) => WikiPage | undefined;
  getCategoryById: (id: number) => WikiCategory | undefined;
}

// Create the context with a default value
const WikiContext = createContext<WikiContextType | undefined>(undefined);

// Provider component
export const WikiContextAdapter: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [pages, setPages] = useState<WikiPage[]>([]);
  const [categories, setCategories] = useState<WikiCategory[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Fetch pages and categories here if needed
    // For now, we'll use empty arrays
  }, []);

  // Safe type conversion helpers
  const ensureNumber = (value: any): number => {
    if (typeof value === 'string') {
      return parseInt(value, 10);
    }
    return typeof value === 'number' ? value : 0;
  };

  // Type-safe lookup functions
  const getPageById = (id: number): WikiPage | undefined => {
    return pages.find(page => ensureNumber(page.id) === ensureNumber(id));
  };

  const getCategoryById = (id: number): WikiCategory | undefined => {
    return categories.find(category => ensureNumber(category.id) === ensureNumber(id));
  };

  // Provide the context value
  const contextValue: WikiContextType = {
    ...wikiService, // Use methods from wikiService
    pages,
    categories,
    getPageById,
    getCategoryById,
    loading,
    error
  };

  return <WikiContext.Provider value={contextValue}>{children}</WikiContext.Provider>;
};

// Custom hook for consuming the context
export const useWikiAdapter = () => {
  const context = useContext(WikiContext);
  if (!context) {
    throw new Error('useWikiAdapter must be used within a WikiContextAdapter');
  }
  return context;
};

export default WikiContextAdapter;
