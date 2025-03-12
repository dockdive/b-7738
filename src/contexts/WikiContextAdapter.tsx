
import React, { createContext, useContext, useEffect, useState } from 'react';
import { WikiEntry, WikiSearchResult, WikiServiceInterface, wikiService } from '@/types/wiki';

// Create a context with the right types
interface WikiContextType extends WikiServiceInterface {
  getRelatedEntries: (currentEntry: WikiEntry) => WikiEntry[];
}

const WikiContext = createContext<WikiContextType | undefined>(undefined);

// Adapter component that fixes type issues
export const WikiContextAdapter: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [entries, setEntries] = useState<WikiEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        setLoading(true);
        const data = await wikiService.getEntries();
        setEntries(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    };

    fetchEntries();
  }, []);

  const getEntry = async (slug: string): Promise<WikiEntry> => {
    try {
      return await wikiService.getEntry(slug);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error fetching entry'));
      throw err;
    }
  };

  const searchEntries = async (query: string): Promise<WikiSearchResult[]> => {
    try {
      return await wikiService.searchEntries(query);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error searching entries'));
      throw err;
    }
  };

  const getEntries = async (): Promise<WikiEntry[]> => {
    try {
      return await wikiService.getEntries();
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error fetching entries'));
      throw err;
    }
  };

  const getRelatedEntries = (currentEntry: WikiEntry): WikiEntry[] => {
    // Make sure we're comparing IDs of the same type
    // Convert string IDs to numbers if needed
    const currentEntryId = typeof currentEntry.id === 'string' ? parseInt(currentEntry.id, 10) : currentEntry.id;
    
    // Get category id (either from object or directly)
    const currentCategoryId = typeof currentEntry.category === 'object' && currentEntry.category 
      ? currentEntry.category.id 
      : typeof currentEntry.category === 'string' 
        ? currentEntry.category 
        : null;
    
    return entries
      .filter(entry => {
        // Skip the current entry
        const entryId = typeof entry.id === 'string' ? parseInt(entry.id, 10) : entry.id;
        if (entryId === currentEntryId) return false;
        
        // Check if categories match
        const entryCategoryId = typeof entry.category === 'object' && entry.category 
          ? entry.category.id 
          : typeof entry.category === 'string' 
            ? entry.category 
            : null;
        
        // Only include if categories match (both need to be strings or both need to be numbers)
        if (currentCategoryId !== null && entryCategoryId !== null) {
          // If both are numbers or both are strings, compare them directly
          return currentCategoryId === entryCategoryId;
        }
        
        return false;
      })
      .slice(0, 3); // Limit to 3 related entries
  };

  const value: WikiContextType = {
    entries,
    loading,
    error,
    getEntry,
    searchEntries,
    getEntries,
    getRelatedEntries
  };

  return (
    <WikiContext.Provider value={value}>
      {children}
    </WikiContext.Provider>
  );
};

export const useWiki = (): WikiContextType => {
  const context = useContext(WikiContext);
  if (!context) {
    throw new Error('useWiki must be used within a WikiContextAdapter');
  }
  return context;
};

export default WikiContextAdapter;
