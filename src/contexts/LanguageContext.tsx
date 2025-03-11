
import React, { useState, useEffect, useMemo } from "react";
import { toast } from "@/hooks/use-toast";
import logger from "@/services/loggerService";
import { LanguageCode, supportedLanguages } from "@/constants/languageConstants";
import { 
  translationCache, 
  detectBrowserLanguage, 
  getNestedValue, 
  preloadTranslations,
  reloadTranslations
} from "@/utils/translationUtils";
import { LanguageContext, LanguageContextType } from "@/hooks/useLanguageContext";

// Export the hook and types
export type { LanguageCode } from "@/constants/languageConstants";
export { supportedLanguages } from "@/constants/languageConstants";
export { useLanguage } from "@/hooks/useLanguageContext";

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isTranslationsLoaded, setIsTranslationsLoaded] = useState<boolean>(false);
  
  // Preload translations on first mount
  useEffect(() => {
    // Check if translations are already initialized
    if (Object.keys(translationCache).length === 0) {
      logger.info("🌐 Initializing translations...");
      preloadTranslations();
    }
    
    // Mark translations as loaded
    setIsTranslationsLoaded(true);
  }, []);
  
  const getInitialLanguage = (): LanguageCode => {
    try {
      const savedLang = localStorage.getItem("maritime-language") as LanguageCode | null;
      if (savedLang && supportedLanguages.some(lang => lang.code === savedLang)) {
        return savedLang;
      }
      return detectBrowserLanguage();
    } catch (e) {
      logger.error("Error getting initial language:", e);
      return "en";
    }
  };

  const [language, setLanguageState] = useState<LanguageCode>(getInitialLanguage());
  const [showTranslationKeys, setShowTranslationKeys] = useState(false);
  const [missingKeys, setMissingKeys] = useState<string[]>([]);

  const setLanguage = (lang: LanguageCode) => {
    try {
      localStorage.setItem("maritime-language", lang);
      setLanguageState(lang);
      document.documentElement.lang = lang;
      
      // Reload translations when language changes
      reloadTranslations(lang);
      
      toast({
        title: "Language Changed",
        description: `Language switched to ${supportedLanguages.find(l => l.code === lang)?.name || lang}`,
      });
    } catch (e) {
      logger.error("Error setting language:", e);
      toast({
        title: "Error",
        description: "Failed to change language",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    // Ensure document language is set
    document.documentElement.lang = language;
    
    // Reload translations when language changes
    if (isTranslationsLoaded) {
      reloadTranslations(language);
    }
  }, [language, isTranslationsLoaded]);

  const t = (key: string, options?: Record<string, string>): string => {
    // If translations aren't loaded yet, show loading indicator
    if (!isTranslationsLoaded) {
      return key === 'general.loading' ? 'Loading...' : `...`;
    }
    
    // If showing translation keys for debugging, return the key itself
    if (showTranslationKeys) {
      return `[${key}]`;
    }
    
    // Get translation from current language
    let text = getNestedValue(translationCache[language], key);
    
    // Fallback to English if translation is missing
    if (text === undefined && language !== "en") {
      text = getNestedValue(translationCache["en"], key);
    }
    
    // Return key if translation is still missing
    if (text === undefined) {
      // Log missing key for debugging
      logger.warning(`Missing translation key: ${key}`);
      
      // Add to missing keys list if not already present
      setMissingKeys(prev => {
        if (!prev.includes(key)) {
          return [...prev, key];
        }
        return prev;
      });
      
      return key;
    }
    
    // Replace variables in the translation if options are provided
    if (options) {
      Object.entries(options).forEach(([k, v]) => {
        const regex = new RegExp(`\\{${k}\\}`, "g");
        text = text.replace(regex, v);
      });
    }
    
    return text;
  };

  const toggleShowTranslationKeys = () => {
    setShowTranslationKeys(prev => !prev);
    toast({
      title: "Developer Mode",
      description: showTranslationKeys ? "Translation keys hidden" : "Showing translation keys instead of values",
    });
  };

  const resetMissingKeys = () => {
    setMissingKeys([]);
    toast({
      title: "Developer Mode",
      description: "Missing keys list reset",
    });
  };

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo<LanguageContextType>(() => ({
    language, 
    setLanguage, 
    changeLanguage: setLanguage,
    t, 
    supportedLanguages,
    debug: {
      showTranslationKeys,
      toggleShowTranslationKeys,
      missingKeys,
      resetMissingKeys
    }
  }), [language, showTranslationKeys, missingKeys, isTranslationsLoaded]);

  // If translations aren't loaded yet, show a simple loading indicator
  if (!isTranslationsLoaded) {
    return (
      <div className="flex items-center justify-center h-screen w-screen">
        <div className="text-center">
          <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-lg">Loading translations...</p>
        </div>
      </div>
    );
  }

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};
