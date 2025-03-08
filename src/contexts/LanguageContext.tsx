
import React, { createContext, useContext, useState, useEffect } from "react";
import { deepMerge } from "@/utils/deepMerge";

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
  "business"
];

// Dynamically load and merge JSON files for a given language code
function loadTranslations(lang: string): Record<string, any> {
  const merged: Record<string, any> = {};
  
  // First try to load base language file
  try {
    const baseTranslation = require(`@/locales/${lang}.json`);
    Object.assign(merged, baseTranslation);
  } catch (e) {
    console.warn(`Missing base translation file for language "${lang}"`);
  }
  
  // Then load all category-specific files
  categories.forEach(category => {
    try {
      // Import the JSON file from the folder structure
      const translation = require(`@/locales/${category}/${lang}.json`);
      deepMerge(merged, translation);
    } catch (e) {
      console.warn(`Missing translation file for category "${category}" and language "${lang}"`);
    }
  });
  
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
}

// Global cache for storing loaded translations
const translationCache: Record<string, Record<string, any>> = {};

// Preload all translations
for (const lang of supportedLanguages) {
  translationCache[lang.code] = loadTranslations(lang.code);
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
