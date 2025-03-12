
import React, { createContext, useContext, useState, useEffect } from 'react';
import { WikiEntry, WikiSearchResult, WikiPage, WikiCategory } from '@/types';

interface WikiContextAdapterType {
  entries: WikiEntry[];
  pages: WikiPage[];
  categories: WikiCategory[];
  loading: boolean;
  error: Error | null;
  getEntry: (slug: string) => Promise<WikiEntry>;
  searchEntries: (query: string) => Promise<WikiSearchResult[]>;
  getPagesByCategory: (categoryId: number) => WikiPage[];
}

const WikiContextAdapter = createContext<WikiContextAdapterType>({
  entries: [],
  pages: [],
  categories: [],
  loading: false,
  error: null,
  getEntry: async () => ({ id: 0, slug: '', title: '', content: '' }),
  searchEntries: async () => [],
  getPagesByCategory: () => [],
});

export const WikiContextAdapterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [entries, setEntries] = useState<WikiEntry[]>([]);
  const [pages, setPages] = useState<WikiPage[]>([]);
  const [categories, setCategories] = useState<WikiCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Safe implementation of getPagesByCategory that avoids string/number comparison issues
  const getPagesByCategory = (categoryId: number): WikiPage[] => {
    // Ensure we're comparing numbers with numbers
    return pages.filter(page => {
      const pageCategory = typeof page.category_id === 'string' 
        ? parseInt(page.category_id, 10) 
        : page.category_id;
      
      return pageCategory === categoryId;
    });
  };

  const getEntry = async (slug: string): Promise<WikiEntry> => {
    try {
      setLoading(true);
      // Mock implementation
      const entry = entries.find(e => e.slug === slug) || { 
        id: 0, 
        slug, 
        title: 'Not Found', 
        content: 'The requested entry was not found.' 
      };
      
      return entry;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error in getEntry'));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const searchEntries = async (query: string): Promise<WikiSearchResult[]> => {
    try {
      setLoading(true);
      // Mock implementation
      return entries
        .filter(entry => 
          entry.title.toLowerCase().includes(query.toLowerCase()) || 
          entry.content.toLowerCase().includes(query.toLowerCase())
        )
        .map(entry => ({
          id: entry.id,
          slug: entry.slug,
          title: entry.title,
          excerpt: entry.content.substring(0, 100) + '...',
          relevance: 1
        }));
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error in searchEntries'));
      return [];
    } finally {
      setLoading(false);
    }
  };

  return (
    <WikiContextAdapter.Provider 
      value={{ 
        entries, 
        pages, 
        categories, 
        loading, 
        error, 
        getEntry, 
        searchEntries, 
        getPagesByCategory 
      }}
    >
      {children}
    </WikiContextAdapter.Provider>
  );
};

export const useWikiContextAdapter = () => useContext(WikiContextAdapter);
