
import React, { useState, useEffect, useMemo } from "react";
import { toast } from "@/hooks/use-toast";
import logger from "@/services/loggerService";
import { LanguageCode, supportedLanguages } from "@/constants/languageConstants";
import { 
  translationCache, 
  detectBrowserLanguage, 
  getNestedValue, 
  preloadTranslations,
  reloadTranslations,
  areTranslationsLoaded,
  getFallbackTranslation,
  logMissingTranslations
} from "@/utils/translationUtils";
import { LanguageContext, LanguageContextType } from "@/hooks/useLanguageContext";

// Export the hook and types
export type { LanguageCode } from "@/constants/languageConstants";
export { supportedLanguages } from "@/constants/languageConstants";
export { useLanguage } from "@/hooks/useLanguageContext";

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isTranslationsLoaded, setIsTranslationsLoaded] = useState<boolean>(areTranslationsLoaded());
  
  // Ensure translations are loaded
  useEffect(() => {
    if (!areTranslationsLoaded()) {
      logger.info("🌐 Initializing translations...");
      preloadTranslations();
      
      // Check periodically if translations are loaded
      const checkInterval = setInterval(() => {
        if (areTranslationsLoaded()) {
          setIsTranslationsLoaded(true);
          clearInterval(checkInterval);
          logger.info("🌐 Translations loaded successfully");
          
          // Log missing translations in development
          if (process.env.NODE_ENV === 'development') {
            logMissingTranslations();
          }
        }
      }, 100);
      
      // Cleanup interval
      return () => clearInterval(checkInterval);
    } else {
      setIsTranslationsLoaded(true);
      logger.info("🌐 Translations already loaded");
    }
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
  }, [language]);

  const t = (key: string, options?: Record<string, string>): string => {
    // If showing translation keys for debugging, return the key itself
    if (showTranslationKeys) {
      return `[${key}]`;
    }
    
    // Get translation from current language
    let text = translationCache[language] ? getNestedValue(translationCache[language], key) : undefined;
    
    // Fallback to English if translation is missing
    if (text === undefined && language !== "en") {
      text = translationCache["en"] ? getNestedValue(translationCache["en"], key) : undefined;
    }
    
    // Use fallback system if still missing
    if (text === undefined) {
      // Log missing key for debugging (limit frequency to avoid console spam)
      if (!missingKeys.includes(key)) {
        logger.warning(`Missing translation key: ${key}`);
        setMissingKeys(prev => [...prev, key]);
      }
      
      return getFallbackTranslation(key);
    }
    
    // Replace variables in the translation if options are provided
    if (options) {
      Object.entries(options).forEach(([k, v]) => {
        const regex = new RegExp(`\\{${k}\\}`, "g");
        text = text.replace(regex, v || '');
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
  }), [language, showTranslationKeys, missingKeys]);

  // If translations aren't loaded yet, show a loading indicator
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
