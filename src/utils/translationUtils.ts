import { LanguageCode, supportedLanguages } from "@/constants/languageConstants";
import logger from "@/services/loggerService";

// Translation cache
export const translationCache: { [key: string]: any } = {};

// List of categories to load translations from
const categories = [
  "common",
  "general",
  "home",
  "navigation",
  "footer",
  "auth",
  "business",
];

// Function to detect the browser's language
export const detectBrowserLanguage = (): LanguageCode => {
  const browserLanguage = navigator.language || navigator.languages[0];
  const languageCode = browserLanguage.split("-")[0] as LanguageCode;
  
  if (supportedLanguages.some(lang => lang.code === languageCode)) {
    return languageCode;
  }
  
  return "en";
};

// Function to get a nested value from an object
export const getNestedValue = (obj: any, key: string): any => {
  try {
    return key.split(".").reduce((o, i) => o[i], obj);
  } catch (e) {
    return undefined;
  }
};

// Function to deep merge objects
export const deepMerge = (target: any, source: any): any => {
  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      if (typeof target[key] === "object" && typeof source[key] === "object") {
        deepMerge(target[key], source[key]);
      } else {
        target[key] = source[key];
      }
    }
  }
  return target;
};

// Update the preloadTranslations function to be more robust
export function preloadTranslations(): void {
  try {
    logger.info('🌍 Starting translation preload');
    
    // Define which languages to preload (at minimum English and Dutch)
    const languagesToPreload: LanguageCode[] = ['en', 'nl'];
    let loadedCount = 0;
    
    // Load each language synchronously to ensure they're ready
    languagesToPreload.forEach(lang => {
      if (!translationCache[lang]) {
        translationCache[lang] = {};
      }
      
      // Load all categories for this language
      categories.forEach(category => {
        try {
          // Dynamic import using require
          const translation = require(`@/locales/${category}/${lang}.json`);
          deepMerge(translationCache[lang], translation);
          loadedCount++;
        } catch (e) {
          // Only log as warning for non-English languages
          if (lang === 'en') {
            logger.error(`Missing critical translation file for category "${category}" and language "${lang}"`);
          } else {
            logger.warning(`Missing translation file for category "${category}" and language "${lang}"`);
          }
        }
      });
    });
    
    logger.info(`🌍 Translation preload complete: loaded ${loadedCount} translation files`);
    translationsLoaded = true;
  } catch (error) {
    logger.error('Failed to preload translations:', error);
    // Initialize with empty translations so the app doesn't crash
    supportedLanguages.forEach(lang => {
      if (!translationCache[lang.code]) {
        translationCache[lang.code] = {};
      }
    });
    translationsLoaded = true;
  }
}

// Add a flag to track translation loading status
let translationsLoaded = false;

// Add a function to check if translations are loaded
export function areTranslationsLoaded(): boolean {
  return translationsLoaded;
}

// Improve the reload translations function
export function reloadTranslations(languageCode: LanguageCode): void {
  try {
    logger.info(`🔄 Reloading translations for ${languageCode}`);
    
    // Only reload specific language
    if (!translationCache[languageCode]) {
      translationCache[languageCode] = {};
    }
    
    // Load all categories for this language
    let loadedCount = 0;
    categories.forEach(category => {
      try {
        // Dynamic import using require
        const translation = require(`@/locales/${category}/${languageCode}.json`);
        deepMerge(translationCache[languageCode], translation);
        loadedCount++;
      } catch (e) {
        // This is expected for some languages/categories
        logger.debug(`No translation file for category "${category}" and language "${languageCode}"`);
      }
    });
    
    logger.info(`🔄 Translation reload complete for ${languageCode}: loaded ${loadedCount} files`);
  } catch (error) {
    logger.error(`Failed to reload translations for ${languageCode}:`, error);
  }
}

// Add fallback translation functionality
export function getFallbackTranslation(key: string): string {
  // Default English fallback values for common keys
  const fallbacks: Record<string, string> = {
    'general.loading': 'Loading...',
    'general.appName': 'Maritime Directory',
    'navigation.home': 'Home',
    'navigation.businesses': 'Businesses',
    'navigation.about': 'About',
    'navigation.contact': 'Contact',
    'auth.signIn': 'Sign In',
    'footer.allRightsReserved': 'All Rights Reserved'
  };
  
  return fallbacks[key] || key;
}

// Set up a helper to ensure all required translation files exist
export function ensureRequiredTranslationFiles(): void {
  const requiredCategories = ['common', 'general', 'home', 'navigation', 'footer'];
  const requiredLanguages = ['en', 'nl'];
  
  requiredLanguages.forEach(lang => {
    requiredCategories.forEach(category => {
      try {
        require(`@/locales/${category}/${lang}.json`);
      } catch (e) {
        logger.error(`CRITICAL: Missing required translation file for category "${category}" and language "${lang}"`);
      }
    });
  });
}
