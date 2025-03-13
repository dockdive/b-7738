
import React, { createContext, useContext, useState, useEffect } from 'react';
import { wikiService } from '@/types/wiki';
import { WikiEntry, WikiPage, WikiCategory, WikiSearchResult } from '@/types/wiki';

// Create a proper context with the fixed types
interface WikiContextType {
  entries: WikiEntry[];
  pages: WikiPage[];
  categories: WikiCategory[];
  loading: boolean;
  error: Error | null;
  getEntry: (slug: string) => Promise<WikiEntry | null>;
  searchEntries: (query: string) => Promise<WikiSearchResult[]>;
  getCategoryById: (id: number) => WikiCategory | undefined;
  getPageById: (id: number) => WikiPage | undefined;
  getPagesByCategory: (categoryId: number) => WikiPage[];
}

const defaultContext: WikiContextType = {
  entries: [],
  pages: [],
  categories: [],
  loading: false,
  error: null,
  getEntry: async () => null,
  searchEntries: async () => [],
  getCategoryById: () => undefined,
  getPageById: () => undefined,
  getPagesByCategory: () => []
};

const WikiContext = createContext<WikiContextType>(defaultContext);

export const useWiki = () => useContext(WikiContext);

export const WikiContextAdapter: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [entries, setEntries] = useState<WikiEntry[]>([]);
  const [pages, setPages] = useState<WikiPage[]>([]);
  const [categories, setCategories] = useState<WikiCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchEntries = async () => {
      setLoading(true);
      try {
        // Use the getEntries method if available, otherwise use the entries property
        if (wikiService.getEntries) {
          const fetchedEntries = await wikiService.getEntries();
          setEntries(fetchedEntries);
        } else {
          setEntries(wikiService.entries);
        }
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error fetching wiki entries'));
      } finally {
        setLoading(false);
      }
    };

    fetchEntries();
  }, []);

  const getEntry = async (slug: string): Promise<WikiEntry | null> => {
    try {
      return await wikiService.getEntry(slug);
    } catch (error) {
      console.error('Error fetching wiki entry:', error);
      return null;
    }
  };

  const searchEntries = async (query: string): Promise<WikiSearchResult[]> => {
    try {
      return await wikiService.searchEntries(query);
    } catch (error) {
      console.error('Error searching wiki entries:', error);
      return [];
    }
  };

  // Fix the type comparisons by ensuring IDs are compared as numbers
  const getCategoryById = (id: number): WikiCategory | undefined => {
    return categories.find(category => Number(category.id) === Number(id));
  };

  // Fix the type comparisons by ensuring IDs are compared as numbers
  const getPageById = (id: number): WikiPage | undefined => {
    return pages.find(page => Number(page.id) === Number(id));
  };

  // Fix the type comparisons by ensuring IDs are compared as numbers
  const getPagesByCategory = (categoryId: number): WikiPage[] => {
    return pages.filter(page => Number(page.category_id) === Number(categoryId));
  };

  const contextValue: WikiContextType = {
    entries,
    pages,
    categories,
    loading,
    error,
    getEntry,
    searchEntries,
    getCategoryById,
    getPageById,
    getPagesByCategory
  };

  return (
    <WikiContext.Provider value={contextValue}>
      {children}
    </WikiContext.Provider>
  );
};

export default WikiContextAdapter;
