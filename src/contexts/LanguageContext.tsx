
import React, { useState, useEffect, useMemo } from "react";
import { toast } from "@/hooks/use-toast";
import logger from "@/services/loggerService";
import { LanguageCode, supportedLanguages } from "@/constants/languageConstants";
import { 
  translationCache, 
  detectBrowserLanguage, 
  getNestedValue, 
  preloadTranslations 
} from "@/utils/translationUtils";
import { LanguageContext, LanguageContextType } from "@/hooks/useLanguageContext";

// Preload all translations for all languages
preloadTranslations();

export type { LanguageCode } from "@/constants/languageConstants";
export { supportedLanguages } from "@/constants/languageConstants";
export { useLanguage } from "@/hooks/useLanguageContext";

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: string, options?: Record<string, string>): string => {
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
  }), [language, showTranslationKeys, missingKeys]);

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};
