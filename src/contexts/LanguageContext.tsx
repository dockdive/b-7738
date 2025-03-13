
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
import deepMerge from "@/utils/deepMerge";

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
    
    // Force reload translations when language changes
    try {
      // Clear the cache for the current language to ensure fresh loading
      delete translationCache[language];
      
      // Load base language file
      try {
        const baseTranslations = require(`@/locales/${language}.json`);
        translationCache[language] = baseTranslations;
      } catch (e) {
        logger.error(`Failed to load base translation file for ${language}`, e);
      }
      
      // Get all category folders
      const categories = [
        "business", "footer", "home", "bulkupload", 
        "conditions", "faq", "match", "messages", 
        "boat", "boatsearch", "auth", "navigation", 
        "favorites", "privacy", "cookies", "terms", 
        "profile", "header", "boats", "subscription", 
        "search", "common", "sell", "general"
      ];
      
      // Load translation files from category folders
      for (const category of categories) {
        try {
          const categoryTranslation = require(`@/locales/${category}/${language}.json`);
          if (categoryTranslation && Object.keys(categoryTranslation).length > 0) {
            if (!translationCache[language]) {
              translationCache[language] = {};
            }
            translationCache[language] = deepMerge(translationCache[language], categoryTranslation);
          }
        } catch (e) {
          logger.warning(`No translation file found for category ${category} and language ${language}`);
        }
      }
      
      logger.info(`Reloaded translations for ${language}`);
    } catch (e) {
      logger.error(`Failed to reload translations for ${language}`, e);
    }
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
