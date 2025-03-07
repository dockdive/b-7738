
import React, { createContext, useContext, useState, useEffect } from "react";
import { deepMerge } from "@/utils/deepMerge";

// List all translation categories that exist as subfolders
const categories = [
  "common",
  "navigation",
  "auth",
  "profile",
  "business",
  "search",
  "reviews",
  "categories",
  "filters",
  "validation",
  "alerts",
  "bulkupload",
  "footer"
];

// Supported languages - expanded based on requirements
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
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Global cache for storing loaded translations
const translationCache: Record<string, Record<string, any>> = {};

// Preload all translations synchronously using require
supportedLanguages.forEach(lang => {
  try {
    // First load the base translations
    const baseTranslations = require(`@/locales/${lang.code}.json`);
    translationCache[lang.code] = { ...baseTranslations };
    
    // Then try to load category-specific translations
    categories.forEach(category => {
      try {
        const categoryTranslations = require(`@/locales/${category}/${lang.code}.json`);
        if (categoryTranslations) {
          deepMerge(translationCache[lang.code], categoryTranslations);
        }
      } catch (e) {
        // Silently fail if category translation doesn't exist
      }
    });
  } catch (e) {
    console.warn(`Could not load translations for language: ${lang.code}`);
    translationCache[lang.code] = {};
  }
});

const detectBrowserLanguage = (): LanguageCode => {
  try {
    const browserLang = navigator.language.split("-")[0];
    if (browserLang && supportedLanguages.some(lang => lang.code === browserLang)) {
      return browserLang as LanguageCode;
    }
  } catch (e) {
    console.error("Error detecting browser language:", e);
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
      console.error("Error getting initial language:", e);
      return "en";
    }
  };

  const [language, setLanguageState] = useState<LanguageCode>(getInitialLanguage());

  const setLanguage = (lang: LanguageCode) => {
    try {
      localStorage.setItem("maritime-language", lang);
      setLanguageState(lang);
      document.documentElement.lang = lang;
    } catch (e) {
      console.error("Error setting language:", e);
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
    // Get translation from current language
    let text = getNestedValue(translationCache[language], key);
    
    // Fallback to English if translation is missing
    if (text === undefined && language !== "en") {
      text = getNestedValue(translationCache["en"], key);
    }
    
    // Return key if translation is still missing
    if (text === undefined) {
      console.warn(`Missing translation key: ${key}`);
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

  return (
    <LanguageContext.Provider value={{ 
      language, 
      setLanguage, 
      changeLanguage: setLanguage,
      t, 
      supportedLanguages 
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within a LanguageProvider");
  return context;
};
