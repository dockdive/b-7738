
import React, { createContext, useContext, useState, useEffect } from 'react';
import { WikiEntry, WikiSearchResult, WikiServiceInterface, WikiPage, WikiCategory, wikiService } from '@/types/wiki';

// Create a proper adapter to fix type issues
interface WikiContextType {
  entries: WikiEntry[];
  categories: WikiCategory[];
  getEntry: (slug: string) => Promise<WikiEntry>;
  searchEntries: (query: string) => Promise<WikiSearchResult[]>;
  loading: boolean;
  error: Error | null;
}

const WikiContext = createContext<WikiContextType | undefined>(undefined);

export const WikiProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [entries, setEntries] = useState<WikiEntry[]>([]);
  const [categories, setCategories] = useState<WikiCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Safe number comparison helper to deal with string/number comparison errors
  const safeIdCompare = (id1: number | string, id2: number | string): boolean => {
    return String(id1) === String(id2);
  };

  const getEntry = async (slug: string): Promise<WikiEntry> => {
    try {
      setLoading(true);
      const entry = await wikiService.getEntry(slug);
      setLoading(false);
      return entry;
    } catch (error) {
      setLoading(false);
      setError(error instanceof Error ? error : new Error(String(error)));
      throw error;
    }
  };

  const searchEntries = async (query: string): Promise<WikiSearchResult[]> => {
    try {
      setLoading(true);
      const results = await wikiService.searchEntries(query);
      setLoading(false);
      return results;
    } catch (error) {
      setLoading(false);
      setError(error instanceof Error ? error : new Error(String(error)));
      throw error;
    }
  };

  // Initialize entries
  useEffect(() => {
    if (wikiService.entries && wikiService.entries.length > 0) {
      setEntries(wikiService.entries);
    }
  }, []);

  const contextValue: WikiContextType = {
    entries,
    categories,
    getEntry,
    searchEntries,
    loading,
    error
  };

  return <WikiContext.Provider value={contextValue}>{children}</WikiContext.Provider>;
};

export const useWiki = (): WikiContextType => {
  const context = useContext(WikiContext);
  if (!context) {
    throw new Error('useWiki must be used within a WikiProvider');
  }
  return context;
};
