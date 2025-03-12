
import React, { createContext, useContext, useState, useEffect } from "react";
import { wikiService } from "@/types/wiki";
import { WikiEntry, WikiPage, WikiCategory, WikiSearchResult } from "@/types/wiki";
import { useLanguage } from "./LanguageContext";

interface WikiContextType {
  entries: WikiEntry[];
  categories: WikiCategory[];
  recentEntries: WikiEntry[];
  popularEntries: WikiEntry[];
  featuredEntry: WikiEntry | null;
  loading: boolean;
  error: Error | null;
  getEntry: (slug: string) => Promise<WikiEntry>;
  searchEntries: (query: string) => Promise<WikiSearchResult[]>;
  getCategoryEntries: (categoryId: number) => WikiEntry[];
}

// Default values for WikiContext
const defaultWikiContext: WikiContextType = {
  entries: [],
  categories: [],
  recentEntries: [],
  popularEntries: [],
  featuredEntry: null,
  loading: true,
  error: null,
  getEntry: async () => ({
    id: 0,
    slug: "",
    title: "",
    content: "",
  }),
  searchEntries: async () => [],
  getCategoryEntries: () => [],
};

const WikiContext = createContext<WikiContextType>(defaultWikiContext);

export const useWiki = () => useContext(WikiContext);

export const WikiProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { language } = useLanguage();
  const [entries, setEntries] = useState<WikiEntry[]>([]);
  const [categories, setCategories] = useState<WikiCategory[]>([]);
  const [recentEntries, setRecentEntries] = useState<WikiEntry[]>([]);
  const [popularEntries, setPopularEntries] = useState<WikiEntry[]>([]);
  const [featuredEntry, setFeaturedEntry] = useState<WikiEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        setLoading(true);
        const response = await wikiService.getEntries();
        setEntries(response);
        
        // Get recent entries (last 5)
        setRecentEntries(
          [...response]
            .sort((a, b) => {
              const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
              const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
              return dateB - dateA;
            })
            .slice(0, 5)
        );
        
        // Set featured entry (first one for now)
        if (response.length > 0) {
          setFeaturedEntry(response[0]);
        }
        
        // Set popular entries (random for now)
        setPopularEntries(
          [...response]
            .sort(() => Math.random() - 0.5)
            .slice(0, 5)
        );
        
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)));
        setLoading(false);
      }
    };
    
    fetchEntries();
  }, [language]);
  
  const getEntry = async (slug: string): Promise<WikiEntry> => {
    try {
      return await wikiService.getEntry(slug);
    } catch (err) {
      throw err instanceof Error ? err : new Error(String(err));
    }
  };
  
  const searchEntries = async (query: string): Promise<WikiSearchResult[]> => {
    try {
      return await wikiService.searchEntries(query);
    } catch (err) {
      throw err instanceof Error ? err : new Error(String(err));
    }
  };
  
  const getCategoryEntries = (categoryId: number): WikiEntry[] => {
    return entries.filter(entry => {
      if (typeof entry.category === 'string') {
        // Handle string category (legacy format)
        return false;
      } else if (typeof entry.category === 'object' && entry.category) {
        // Handle object category with id
        return entry.category.id === categoryId;
      }
      return false;
    });
  };
  
  return (
    <WikiContext.Provider
      value={{
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
      }}
    >
      {children}
    </WikiContext.Provider>
  );
};
