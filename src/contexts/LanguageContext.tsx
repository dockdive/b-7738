
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
  "bulkupload"
];

// Cache for storing loaded translations
const translationCache: Record<string, Record<string, any>> = {};

// Dynamically load and merge JSON files for a given language code
function loadTranslations(lang: string): Record<string, any> {
  // Check if we've already loaded this language
  if (translationCache[lang]) {
    return translationCache[lang];
  }

  const merged: Record<string, any> = {};
  
  try {
    // First load the base translations
    const baseTranslation = require(`@/locales/${lang}.json`);
    deepMerge(merged, baseTranslation);
  } catch (e) {
    console.warn(`Missing base translation file for language "${lang}"`);
  }

  // Then try to load category-specific translations if they exist
  categories.forEach(category => {
    try {
      // Import the JSON file from the folder structure: e.g. src/locales/category/en.json
      const translation = require(`@/locales/${category}/${lang}.json`);
      deepMerge(merged, translation);
    } catch (e) {
      // It's okay if individual category files don't exist
      // console.debug(`No translations found for category "${category}" and language "${lang}"`);
    }
  });

  // Store in cache for future use
  translationCache[lang] = merged;
  return merged;
}

// Supported languages - you can expand this list as needed
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
  const [translations, setTranslations] = useState<Record<string, any>>({});

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
    
    // Load translations for current language
    const loadedTranslations = loadTranslations(language);
    setTranslations(loadedTranslations);
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
    let text = getNestedValue(translations, key);
    
    // Fallback to English if translation is missing
    if (text === undefined && language !== "en") {
      const enTranslations = loadTranslations("en");
      text = getNestedValue(enTranslations, key);
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
