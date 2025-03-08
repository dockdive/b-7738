
import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import { deepMerge } from "@/utils/deepMerge";
import { toast } from "@/hooks/use-toast";
import logger from "@/services/loggerService";

// List all translation categories that exist as subfolders
const categories = [
  "conditions",
  "faq",
  "match",
  "messages",
  "boat",
  "footer",
  "boatsearch",
  "auth",
  "home",
  "navigation",
  "favorites",
  "privacy",
  "cookies",
  "terms",
  "profile",
  "header",
  "boats",
  "subscription",
  "search",
  "common",
  "sell",
  "categories",
  "business",
  "bulkupload"
];

// Debug flag for translation debugging
const DEBUG_TRANSLATIONS = true;

// Dynamically load translations for a given language code
function loadTranslations(lang: string): Record<string, any> {
  const merged: Record<string, any> = {};
  let hasLoadedMainFile = false;
  let loadedCategories = 0;
  let failedCategories = 0;
  
  try {
    // First try to load the base language file
    const baseTranslation = require(`@/locales/${lang}.json`);
    Object.assign(merged, baseTranslation);
    hasLoadedMainFile = true;
    if (DEBUG_TRANSLATIONS) {
      logger.info(`✅ Successfully loaded base file for "${lang}"`);
    }
  } catch (e) {
    if (DEBUG_TRANSLATIONS) {
      logger.error(`❌ Failed to load base translation file for language "${lang}"`, e);
    }
    toast({
      title: "Translation Error",
      description: `Failed to load base translation file for ${lang}`,
      variant: "destructive",
    });
  }
  
  // Then load all category-specific files
  categories.forEach(category => {
    try {
      // Import the JSON file from the folder structure
      const translation = require(`@/locales/${category}/${lang}.json`);
      deepMerge(merged, translation);
      loadedCategories++;
      if (DEBUG_TRANSLATIONS) {
        logger.info(`✅ Loaded category "${category}" for language "${lang}"`);
      }
    } catch (e) {
      failedCategories++;
      if (DEBUG_TRANSLATIONS) {
        logger.warning(`⚠️ Missing translation file for category "${category}" and language "${lang}"`);
      }
    }
  });
  
  if (DEBUG_TRANSLATIONS) {
    logger.info(`📊 Translation loading stats for "${lang}": Base file: ${hasLoadedMainFile ? 'Loaded' : 'Failed'}, Categories: ${loadedCategories} loaded, ${failedCategories} failed`);
  }
  
  return merged;
}

// All supported languages (reduced from 110 for simplicity)
export const supportedLanguages = [
  { code: "en", name: "English" },
  { code: "nl", name: "Dutch" },
  { code: "de", name: "German" },
  { code: "fr", name: "French" },
  { code: "es", name: "Spanish" },
  { code: "it", name: "Italian" },
  { code: "pt", name: "Portuguese" },
  { code: "ru", name: "Russian" },
  { code: "zh", name: "Chinese" },
  { code: "ja", name: "Japanese" }
] as const;

export type LanguageCode = typeof supportedLanguages[number]["code"];

export interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  changeLanguage: (lang: LanguageCode) => void;
  t: (key: string, options?: Record<string, string>) => string;
  supportedLanguages: ReadonlyArray<{ code: LanguageCode; name: string }>;
  debug: {
    showTranslationKeys: boolean;
    toggleShowTranslationKeys: () => void;
    missingKeys: string[];
    resetMissingKeys: () => void;
  };
}

// Global cache for storing loaded translations
const translationCache: Record<string, Record<string, any>> = {};

// Pre-load all translations for all languages
logger.info("🌐 Preloading translations for all supported languages...");
supportedLanguages.forEach(langObj => {
  const lang = langObj.code;
  try {
    translationCache[lang] = loadTranslations(lang);
    logger.info(`✅ Successfully preloaded translations for "${lang}"`);
  } catch (error) {
    logger.error(`❌ Failed to preload translations for "${lang}"`, error);
    toast({
      title: "Translation Preload Error",
      description: `Failed to preload translations for ${lang}`,
      variant: "destructive",
    });
  }
});

// Ensure English translations are always available as fallback
if (!translationCache["en"]) {
  logger.error("❌ Critical error: English translations could not be loaded!");
  toast({
    title: "Critical Translation Error",
    description: "English translations could not be loaded. Some UI elements may not display correctly.",
    variant: "destructive",
  });
  // Set empty object to prevent runtime errors
  translationCache["en"] = {};
}

// Expose the translation cache for debugging purposes
if (typeof window !== 'undefined') {
  // @ts-ignore - This is for debugging only
  window.__DEBUG_TRANSLATION_CACHE__ = translationCache;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const detectBrowserLanguage = (): LanguageCode => {
  try {
    const browserLang = navigator.language.split("-")[0];
    if (browserLang && supportedLanguages.some(lang => lang.code === browserLang)) {
      return browserLang as LanguageCode;
    }
  } catch (e) {
    logger.error("Error detecting browser language:", e);
  }
  return "en";
};

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

  const getNestedValue = (obj: any, path: string): any => {
    if (!obj) return undefined;
    
    const keys = path.split(".");
    let current = obj;
    
    for (const key of keys) {
      if (current === undefined || current === null) return undefined;
      current = current[key];
    }
    
    return current;
  };

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
  const contextValue = useMemo(() => ({
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

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within a LanguageProvider");
  return context;
};
