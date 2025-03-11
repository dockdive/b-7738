import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { wikiService } from "@/services/wikiService";
import { WikiPage, WikiCategory } from "@/types/wiki";
import { apiLogger } from "@/utils/apiLogger";

// Helper to map Supabase user to local User type (ensuring email is defined)
const mapUser = (user: any) => ({
  ...user,
  email: user.email || ""
});

interface WikiContextType {
  pages: WikiPage[];
  categories: WikiCategory[];
  currentPage: WikiPage | null;
  isLoading: boolean;
  error: string | null;
  searchResults: WikiPage[];
  searchQuery: string;
  canEdit: boolean;
  // Methods
  searchPages: (query: string) => Promise<void>;
  getPageBySlug: (slug: string) => Promise<WikiPage | null>;
  getPagesByCategory: (category: string) => Promise<WikiPage[]>;
  savePage: (page: Partial<WikiPage>) => Promise<WikiPage | null>;
  deletePage: (id: string) => Promise<boolean>;
  setCurrentPage: React.Dispatch<React.SetStateAction<WikiPage | null>>;
  reviewPage: (pageId: string, approved: boolean, user: any) => Promise<any>;
  getPendingReviews: (user: any) => Promise<WikiPage[]>;
  getPageReviewStatus: (pageId: string) => any;
}

const WikiContext = createContext<WikiContextType | undefined>(undefined);

export const WikiProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const [pages, setPages] = useState<WikiPage[]>([]);
  const [categories, setCategories] = useState<WikiCategory[]>([]);
  const [currentPage, setCurrentPage] = useState<WikiPage | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<WikiPage[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Check if user can edit
  const canEdit = useMemo(() => {
    return user ? wikiService.canEditWiki(mapUser(user)) : false;
  }, [user]);

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Load categories and pages
        const [allCategories, allPages] = await Promise.all([
          wikiService.getAllCategories(),
          wikiService.getAllPages(language)
        ]);
        
        setCategories(allCategories);
        setPages(allPages);
        
        apiLogger.info("WikiContext initialized", { 
          categoriesCount: allCategories.length,
          pagesCount: allPages.length
        });
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Unknown error loading wiki data";
        setError(errorMessage);
        apiLogger.error("Error initializing WikiContext", { error: err });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [language]);

  // Search wiki pages with memoized callback
  const searchPages = useCallback(async (query: string) => {
    setIsLoading(true);
    setSearchQuery(query);
    
    try {
      if (query.trim() === "") {
        setSearchResults([]);
        return;
      }
      
      const results = await wikiService.searchPages(query, language);
      setSearchResults(results);
      
      apiLogger.info("Wiki search performed", { 
        query, 
        resultsCount: results.length,
        language
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error searching wiki";
      setError(errorMessage);
      apiLogger.error("Error searching wiki", { error: err, query });
    } finally {
      setIsLoading(false);
    }
  }, [language]);

  // Get a page by slug with memoized callback
  const getPageBySlug = useCallback(async (slug: string): Promise<WikiPage | null> => {
    setIsLoading(true);
    
    try {
      const page = await wikiService.getPageBySlug(slug, language);
      setCurrentPage(page || null);
      return page;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error fetching wiki page";
      setError(errorMessage);
      apiLogger.error("Error fetching wiki page by slug", { error: err, slug });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [language]);

  // Get pages by category with memoized callback
  const getPagesByCategory = useCallback(async (category: string): Promise<WikiPage[]> => {
    setIsLoading(true);
    
    try {
      const categoryPages = await wikiService.getPagesByCategory(category, language);
      return categoryPages;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error fetching wiki category";
      setError(errorMessage);
      apiLogger.error("Error fetching wiki pages by category", { error: err, category });
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [language]);

  // Save a wiki page (create or update)
  const savePage = async (page: Partial<WikiPage>): Promise<WikiPage | null> => {
    if (!user) {
      setError("You must be logged in to save a wiki page");
      return null;
    }
    
    if (!canEdit) {
      setError("You don't have permission to edit the wiki");
      return null;
    }
    
    setIsLoading(true);
    
    try {
      let result: WikiPage;
      
      if (page.id) {
        // Update existing page
        result = await wikiService.updatePage(page.id, page, mapUser(user));
        setPages(prev => prev.map(p => p.id === result.id ? result : p));
        if (currentPage && currentPage.id === result.id) {
          setCurrentPage(result);
        }
        
        apiLogger.info("Wiki page updated", { 
          pageId: result.id,
          title: result.title,
          userId: user.id
        });
      } else {
        // Create new page
        result = await wikiService.createPage(page, mapUser(user));
        const isApproved = wikiService.getPageReviewStatus(result.id).isApproved;
        if (isApproved) {
          setPages(prev => [...prev, result]);
        }
        
        apiLogger.info("Wiki page created", { 
          pageId: result.id,
          title: result.title,
          userId: user.id
        });
      }
      
      const updatedCategories = await wikiService.getAllCategories();
      setCategories(updatedCategories);
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error saving wiki page";
      setError(errorMessage);
      apiLogger.error("Error saving wiki page", { error: err, pageTitle: page.title });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Delete a wiki page
  const deletePage = async (id: string): Promise<boolean> => {
    if (!user) {
      setError("You must be logged in to delete a wiki page");
      return false;
    }
    
    if (!canEdit) {
      setError("You don't have permission to delete wiki pages");
      return false;
    }
    
    setIsLoading(true);
    
    try {
      const success = await wikiService.deletePage(id, mapUser(user));
      
      if (success) {
        setPages(prev => prev.filter(p => p.id !== id));
        if (currentPage && currentPage.id === id) {
          setCurrentPage(null);
        }
        const updatedCategories = await wikiService.getAllCategories();
        setCategories(updatedCategories);
        
        apiLogger.info("Wiki page deleted", { 
          pageId: id,
          userId: user.id
        });
      }
      
      return success;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error deleting wiki page";
      setError(errorMessage);
      apiLogger.error("Error deleting wiki page", { error: err, pageId: id });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Review a wiki page
  const reviewPage = async (pageId: string, approved: boolean, reviewUser: any): Promise<any> => {
    setIsLoading(true);
    
    try {
      const result = await wikiService.reviewPage(pageId, approved, mapUser(reviewUser));
      
      if (result.approved) {
        const pageExists = pages.some(p => p.id === pageId);
        if (!pageExists) {
          const allPages = await wikiService.getAllPages(language);
          setPages(allPages);
        }
      }
      
      apiLogger.info("Wiki page reviewed", {
        pageId,
        approved,
        userId: reviewUser.id,
        approvalCount: result.approvalCount
      });
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error reviewing wiki page";
      setError(errorMessage);
      apiLogger.error("Error reviewing wiki page", { error: err, pageId });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Get pending reviews
  const getPendingReviews = async (reviewUser: any): Promise<WikiPage[]> => {
    try {
      return await wikiService.getPendingReviews(mapUser(reviewUser));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error getting pending reviews";
      setError(errorMessage);
      apiLogger.error("Error getting pending wiki reviews", { error: err });
      return [];
    }
  };

  // Get page review status
  const getPageReviewStatus = (pageId: string): any => {
    return wikiService.getPageReviewStatus(pageId);
  };

  return (
    <WikiContext.Provider
      value={{
        pages,
        categories,
        currentPage,
        isLoading,
        error,
        searchResults,
        searchQuery,
        canEdit,
        searchPages,
        getPageBySlug,
        getPagesByCategory,
        savePage,
        deletePage,
        setCurrentPage,
        reviewPage,
        getPendingReviews,
        getPageReviewStatus
      }}
    >
      {children}
    </WikiContext.Provider>
  );
};

export const useWiki = () => {
  const context = useContext(WikiContext);
  if (context === undefined) {
    throw new Error("useWiki must be used within a WikiProvider");
  }
  return context;
};
