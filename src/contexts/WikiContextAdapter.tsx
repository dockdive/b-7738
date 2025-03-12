
import React, { createContext, useContext, useState, useEffect } from 'react';
import { WikiEntry, WikiPage, WikiCategory, WikiSearchResult, wikiService } from '@/types/wiki';

// Define a specialized context for handling wiki data with proper type conversion
export interface WikiContextAdapterType {
  entries: WikiEntry[];
  loading: boolean;
  error: Error | null;
  getEntry: (slug: string) => Promise<WikiEntry>;
  searchEntries: (query: string) => Promise<WikiSearchResult[]>;
  // Type-safe methods for comparing IDs, handling string/number conversions
  compareIds: (id1: number | string, id2: number | string) => boolean;
}

const WikiContextAdapter = createContext<WikiContextAdapterType | undefined>(undefined);

export const WikiContextAdapterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [entries, setEntries] = useState<WikiEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Helper function to safely convert and compare IDs that might be string or number
  const compareIds = (id1: number | string, id2: number | string): boolean => {
    return String(id1) === String(id2);
  };

  // Adapter for the original getEntry method
  const getEntry = async (slug: string): Promise<WikiEntry> => {
    try {
      return await wikiService.getEntry(slug);
    } catch (error) {
      setError(error instanceof Error ? error : new Error('Unknown error getting wiki entry'));
      throw error;
    }
  };

  // Adapter for the original searchEntries method
  const searchEntries = async (query: string): Promise<WikiSearchResult[]> => {
    try {
      return await wikiService.searchEntries(query);
    } catch (error) {
      setError(error instanceof Error ? error : new Error('Unknown error searching wiki entries'));
      throw error;
    }
  };

  // Initial data loading, if needed
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        // Here you might want to load initial data if needed
        setEntries(wikiService.entries);
      } catch (error) {
        setError(error instanceof Error ? error : new Error('Unknown error loading wiki data'));
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  return (
    <WikiContextAdapter.Provider
      value={{
        entries,
        loading,
        error,
        getEntry,
        searchEntries,
        compareIds
      }}
    >
      {children}
    </WikiContextAdapter.Provider>
  );
};

export const useWikiAdapter = () => {
  const context = useContext(WikiContextAdapter);
  if (!context) {
    throw new Error('useWikiAdapter must be used within a WikiContextAdapterProvider');
  }
  return context;
};
