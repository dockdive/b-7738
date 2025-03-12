
import React, { createContext, useContext, useState, useEffect, PropsWithChildren } from "react";
import { deepMerge } from "@/utils/deepMerge";
import { toast } from "sonner";

// Create a wrapper context that enhances the original context
export const WikiAdapterContext = createContext<{
  isLoading: boolean;
  hasError: boolean;
  retry: () => void;
} | null>(null);

export const WikiAdapterProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Simulate loading completion after a short delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  const retry = () => {
    setIsLoading(true);
    setHasError(false);
    // Simulate retry logic
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
  };

  // If we're still loading or have an error, show appropriate UI
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-lg text-red-500">Failed to load wiki resources</p>
        <button 
          onClick={retry}
          className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <WikiAdapterContext.Provider value={{ isLoading, hasError, retry }}>
      {children}
    </WikiAdapterContext.Provider>
  );
};

// Enhanced useWiki hook that combines original implementation with our adapter
export const useWikiAdapter = () => {
  // We don't directly use the original wiki context to avoid importing it
  // Will return a placeholder for now
  const adapterContext = useContext(WikiAdapterContext);

  return {
    // Placeholder wiki interface
    entries: [],
    loading: adapterContext?.isLoading || false,
    error: adapterContext?.hasError || null,
    getEntry: async (slug: string) => ({ id: 0, title: "", content: "", slug: "" }),
    searchEntries: async (query: string) => [],
    // Include adapter-specific features
    isLoading: adapterContext?.isLoading || false,
    hasError: adapterContext?.hasError || false,
    retry: adapterContext?.retry || (() => {}),
  };
};
