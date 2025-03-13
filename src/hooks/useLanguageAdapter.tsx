
import React, { createContext, useContext, useState, useEffect, PropsWithChildren } from "react";
import { useLanguage as useOriginalLanguage } from "@/contexts/LanguageContext";
import { LanguageCode, supportedLanguages } from "@/constants/languageConstants";

// Create a wrapper context that enhances the original context
export const LanguageAdapterContext = createContext<{
  isLoading: boolean;
  hasError: boolean;
  retry: () => void;
} | null>(null);

export const LanguageAdapterProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const originalLanguageContext = useOriginalLanguage();
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Simulate loading completion after a short delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const retry = () => {
    setIsLoading(true);
    setHasError(false);
    // Simulate retry logic
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
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
        <p className="text-lg text-red-500">Failed to load language resources</p>
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
    <LanguageAdapterContext.Provider value={{ isLoading, hasError, retry }}>
      {children}
    </LanguageAdapterContext.Provider>
  );
};

// Enhanced useLanguage hook that combines original implementation with our adapter
export const useLanguageAdapter = () => {
  const originalContext = useOriginalLanguage();
  const adapterContext = useContext(LanguageAdapterContext);

  return {
    ...originalContext,
    isLoading: adapterContext?.isLoading || false,
    hasError: adapterContext?.hasError || false,
    retry: adapterContext?.retry || (() => {}),
  };
};
