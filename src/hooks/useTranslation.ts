
import { useState, useEffect } from 'react';
import { Language } from '@/types';

// Import all locales
const locales = {
  en: () => import('@/locales/en.json').then(module => module.default)
};

export function useTranslation() {
  const [language, setLanguage] = useState<Language>('en');
  const [translations, setTranslations] = useState<Record<string, any>>({});
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Try to get language from localStorage
    const savedLanguage = localStorage.getItem('language') as Language | null;
    
    // Or use browser language or default to 'en'
    const browserLanguage = navigator.language.split('-')[0] as Language;
    const detectedLanguage = savedLanguage || browserLanguage || 'en';
    
    // Make sure it's a supported language
    const finalLanguage: Language = Object.keys(locales).includes(detectedLanguage) 
      ? detectedLanguage as Language 
      : 'en';
    
    setLanguage(finalLanguage);
    
    // Load the translations
    const loadTranslations = async () => {
      try {
        const loadedTranslations = await locales[finalLanguage]();
        setTranslations(loadedTranslations);
        setIsLoaded(true);
      } catch (error) {
        console.error('Failed to load translations', error);
        // Fallback to English
        if (finalLanguage !== 'en') {
          const fallbackTranslations = await locales.en();
          setTranslations(fallbackTranslations);
        }
        setIsLoaded(true);
      }
    };
    
    loadTranslations();
  }, []);

  const changeLanguage = (newLanguage: Language) => {
    if (Object.keys(locales).includes(newLanguage)) {
      setLanguage(newLanguage);
      localStorage.setItem('language', newLanguage);
      
      // Load the new translations
      locales[newLanguage]().then(loadedTranslations => {
        setTranslations(loadedTranslations);
      });
    }
  };

  const t = (key: string): string => {
    if (!isLoaded) return key;
    
    // Split the key by dots to access nested properties
    const keys = key.split('.');
    let value = translations;
    
    // Navigate through the nested structure
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return key; // Key not found, return the key itself
      }
    }
    
    return typeof value === 'string' ? value : key;
  };

  return { t, language, changeLanguage, isLoaded };
}
