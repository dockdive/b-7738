
import React, { createContext, useContext, useEffect, useState } from 'react';
import { WikiEntry, WikiSearchResult, WikiServiceInterface, wikiService, compareIds } from '@/types/wiki';

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
    if (!currentEntry) return [];
    
    // Using our helper function for ID comparison to avoid type issues
    return entries
      .filter(entry => {
        // Skip the current entry
        if (compareIds(entry.id, currentEntry.id)) return false;
        
        // Get category id (either from object or directly)
        const currentCategoryId = typeof currentEntry.category === 'object' && currentEntry.category 
          ? currentEntry.category.id 
          : typeof currentEntry.category === 'string' 
            ? currentEntry.category 
            : null;
            
        const entryCategoryId = typeof entry.category === 'object' && entry.category 
          ? entry.category.id 
          : typeof entry.category === 'string' 
            ? entry.category 
            : null;
        
        // Compare category IDs safely
        if (currentCategoryId !== null && entryCategoryId !== null) {
          return compareIds(currentCategoryId, entryCategoryId);
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
