
import { createContext, useContext } from "react";
import { LanguageCode, supportedLanguages } from "@/constants/languageConstants";

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

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within a LanguageProvider");
  return context;
};
