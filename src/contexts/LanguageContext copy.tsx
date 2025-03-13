// contexts/LanguageContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { deepMerge } from "@/utils/deepMerge";

// List of translation categories as folders
const categories = [
  "",
  "auth",
  "navigation",
  "general",
  "search",
  "addBusiness",
  "bulkupload",
  "business",
  "business/filter",
  "categories",
  "common",
  "footer",
  "general",
  "home",
  "home/featured",
  "home/categories",
  "home/cta",
  "profile",
  "search",
];

// Use Vite’s import.meta.glob to preload all JSON files under src/locales
const translationFiles = import.meta.glob<Record<string, any>>('@/locales/**/**/*.json', { eager: true });

// This function finds and merges all JSON files for a given language code
function loadTranslations(lang: string): Record<string, any> {
  const merged: Record<string, any> = {};
  Object.keys(translationFiles).forEach((path) => {
    // Expect paths like /src/locales/{category}/{lang}.json (or deeper)
    if (path.includes(`/${lang}.json`)) {
      // Optionally, you can check if the file is in one of the expected categories.
      categories.forEach(category => {
        if (path.includes(`/${category}/`)) {
          const translation = translationFiles[path] as Record<string, any>;
          deepMerge(merged, translation);
        }
      });
    }
  });
  return merged;
}

// All 110 languages
export const supportedLanguages = [
  { code: "af", name: "Afrikaans" },
  { code: "sq", name: "Albanian" },
  { code: "am", name: "Amharic" },
  { code: "ar", name: "Arabic" },
  { code: "hy", name: "Armenian" },
  { code: "as", name: "Assamese" },
  { code: "az", name: "Azerbaijani" },
  { code: "bn", name: "Bangla" },
  { code: "ba", name: "Bashkir" },
  { code: "eu", name: "Basque" },
  { code: "bs", name: "Bosnian" },
  { code: "bg", name: "Bulgarian" },
  { code: "yue", name: "Cantonese Traditional" },
  { code: "ca", name: "Catalan" },
  { code: "lzh", name: "Chinese Literary" },
  { code: "zh-Hans", name: "Chinese Simplified" },
  { code: "zh-Hant", name: "Chinese Traditional" },
  { code: "hr", name: "Croatian" },
  { code: "cs", name: "Czech" },
  { code: "da", name: "Danish" },
  { code: "prs", name: "Dari" },
  { code: "dv", name: "Divehi" },
  { code: "nl", name: "Dutch" },
  { code: "en", name: "English" },
  { code: "et", name: "Estonian" },
  { code: "fo", name: "Faroese" },
  { code: "fj", name: "Fijian" },
  { code: "fil", name: "Filipino" },
  { code: "fi", name: "Finnish" },
  { code: "fr", name: "French" },
  { code: "fr-CA", name: "French (Canada)" },
  { code: "gl", name: "Galician" },
  { code: "ka", name: "Georgian" },
  { code: "de", name: "German" },
  { code: "el", name: "Greek" },
  { code: "gu", name: "Gujarati" },
  { code: "ht", name: "Haitian Creole" },
  { code: "he", name: "Hebrew" },
  { code: "hi", name: "Hindi" },
  { code: "mww", name: "Hmong Daw" },
  { code: "hu", name: "Hungarian" },
  { code: "is", name: "Icelandic" },
  { code: "id", name: "Indonesian" },
  { code: "ikt", name: "Inuinnaqtun" },
  { code: "iu", name: "Inuktitut" },
  { code: "iu-Latn", name: "Inuktitut (Latin)" },
  { code: "ga", name: "Irish" },
  { code: "it", name: "Italian" },
  { code: "ja", name: "Japanese" },
  { code: "kn", name: "Kannada" },
  { code: "kk", name: "Kazakh" },
  { code: "km", name: "Khmer" },
  { code: "tlh-Latn", name: "Klingon (Latin)" },
  { code: "ko", name: "Korean" },
  { code: "ku", name: "Kurdish (Central)" },
  { code: "kmr", name: "Kurdish (Northern)" },
  { code: "ky", name: "Kyrgyz" },
  { code: "lo", name: "Lao" },
  { code: "lv", name: "Latvian" },
  { code: "lt", name: "Lithuanian" },
  { code: "mk", name: "Macedonian" },
  { code: "mg", name: "Malagasy" },
  { code: "ms", name: "Malay" },
  { code: "ml", name: "Malayalam" },
  { code: "mt", name: "Maltese" },
  { code: "mr", name: "Marathi" },
  { code: "mn-Cyrl", name: "Mongolian (Cyrillic)" },
  { code: "mn-Mong", name: "Mongolian (Traditional)" },
  { code: "my", name: "Myanmar (Burmese)" },
  { code: "mi", name: "Māori" },
  { code: "ne", name: "Nepali" },
  { code: "nb", name: "Norwegian" },
  { code: "or", name: "Odia" },
  { code: "ps", name: "Pashto" },
  { code: "fa", name: "Persian" },
  { code: "pl", name: "Polish" },
  { code: "pt", name: "Portuguese (Brazil)" },
  { code: "pt-PT", name: "Portuguese (Portugal)" },
  { code: "pa", name: "Punjabi" },
  { code: "otq", name: "Querétaro Otomi" },
  { code: "ro", name: "Romanian" },
  { code: "ru", name: "Russian" },
  { code: "sm", name: "Samoan" },
  { code: "sr-Cyrl", name: "Serbian (Cyrillic)" },
  { code: "sr-Latn", name: "Serbian (Latin)" },
  { code: "sk", name: "Slovak" },
  { code: "sl", name: "Slovenian" },
  { code: "so", name: "Somali" },
  { code: "es", name: "Spanish" },
  { code: "sw", name: "Swahili" },
  { code: "sv", name: "Swedish" },
  { code: "ty", name: "Tahitian" },
  { code: "ta", name: "Tamil" },
  { code: "tt", name: "Tatar" },
  { code: "te", name: "Telugu" },
  { code: "th", name: "Thai" },
  { code: "bo", name: "Tibetan" },
  { code: "ti", name: "Tigrinya" },
  { code: "to", name: "Tongan" },
  { code: "tr", name: "Turkish" },
  { code: "tk", name: "Turkmen" },
  { code: "uk", name: "Ukrainian" },
  { code: "hsb", name: "Upper Sorbian" },
  { code: "ur", name: "Urdu" },
  { code: "ug", name: "Uyghur" },
  { code: "uz", name: "Uzbek (Latin)" },
  { code: "vi", name: "Vietnamese" },
  { code: "cy", name: "Welsh" },
  { code: "yua", name: "Yucatec Maya" },
  { code: "zu", name: "Zulu" }
] as const;

export type LanguageCode = typeof supportedLanguages[number]["code"];

export interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string, options?: Record<string, string>) => string;
  supportedLanguages: ReadonlyArray<{ code: LanguageCode; name: string }>;
}

// Preload translations synchronously into a cache using our loadTranslations function.
const translationCache: Record<LanguageCode, Record<string, any>> = {} as any;
supportedLanguages.forEach(langObj => {
  const lang = langObj.code;
  translationCache[lang] = loadTranslations(lang);
});

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
      const savedLang = localStorage.getItem("dockdive-language") as LanguageCode | null;
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
      localStorage.setItem("dockdive-language", lang);
      setLanguageState(lang);
      document.documentElement.lang = lang;
    } catch (e) {
      console.error("Error setting language:", e);
    }
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const getNestedValue = (obj: any, path: string) =>
    path.split(".").reduce((current, key) => (current ? current[key] : undefined), obj);

  const t = (key: string, options?: Record<string, string>): string => {
    let text = getNestedValue(translationCache[language], key);
    if (text === undefined && language !== "en") {
      text = getNestedValue(translationCache["en"], key);
    }
    if (text === undefined) {
      console.warn(`Missing translation key: ${key}`);
      return key;
    }
    if (options) {
      Object.entries(options).forEach(([k, v]) => {
        const regex = new RegExp(`\\{${k}\\}`, "g");
        text = text.replace(regex, v);
      });
    }
    return text;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, supportedLanguages }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
// SourceTag: "29202152"
