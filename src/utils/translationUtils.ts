
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
  "categories",
  "boats",
  "boatsearch",
  "profile",
  "addBusiness",
  "bulkupload",
  "search"
];

// Function to detect the browser's language
export const detectBrowserLanguage = (): LanguageCode => {
  try {
    const browserLanguage = navigator.language || (navigator.languages && navigator.languages[0]);
    if (browserLanguage) {
      const languageCode = browserLanguage.split("-")[0] as LanguageCode;
      
      if (supportedLanguages.some(lang => lang.code === languageCode)) {
        return languageCode;
      }
    }
  } catch (e) {
    logger.error("Failed to detect browser language:", e);
  }
  
  return "en";
};

// Function to get a nested value from an object
export const getNestedValue = (obj: any, key: string): any => {
  try {
    return key.split(".").reduce((o, i) => o && typeof o === "object" ? o[i] : undefined, obj);
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

// Global flag to track translation loading status
let translationsLoaded = false;
let loadingInProgress = false;

// Add a function to check if translations are loaded
export function areTranslationsLoaded(): boolean {
  return translationsLoaded;
}

// Function to load a single translation file
export function loadTranslationFile(language: LanguageCode, category: string): boolean {
  try {
    // Initialize language in cache if needed
    if (!translationCache[language]) {
      translationCache[language] = {};
    }
    
    // Try to dynamically import the translation file
    try {
      const translation = require(`@/locales/${category}/${language}.json`);
      deepMerge(translationCache[language], translation);
      return true;
    } catch (e) {
      // Also try to load from category-nested structure (e.g., sell/steps)
      if (category.includes('/')) {
        try {
          const translation = require(`@/locales/${category}/${language}.json`);
          deepMerge(translationCache[language], translation);
          return true;
        } catch (subE) {
          // If not found in either place, log only in debug level
          logger.debug(`No translation file for category "${category}" and language "${language}"`);
          return false;
        }
      } else {
        // Try to load from root locale folder
        try {
          const translation = require(`@/locales/${language}.json`);
          deepMerge(translationCache[language], translation);
          return true;
        } catch (rootE) {
          logger.debug(`No translation file found for ${category}/${language}.json or ${language}.json`);
          return false;
        }
      }
    }
  } catch (error) {
    logger.error(`Error loading translation file for "${category}/${language}":`, error);
    return false;
  }
}

// Update the preloadTranslations function to be more robust and handle failures gracefully
export function preloadTranslations(): void {
  // Prevent concurrent loading
  if (loadingInProgress) return;
  
  loadingInProgress = true;
  
  try {
    logger.info('🌍 Starting translation preload');
    
    // Define primary languages that must be loaded (English is required)
    const requiredLanguages: LanguageCode[] = ['en', 'nl'];
    let loadedCount = 0;
    let errorCount = 0;
    
    // First load English as the baseline
    requiredLanguages.forEach(language => {
      if (!translationCache[language]) {
        translationCache[language] = {};
      }
      
      // Load all categories for each language
      categories.forEach(category => {
        const loaded = loadTranslationFile(language, category);
        if (loaded) {
          loadedCount++;
        } else if (language === 'en') {
          // Only increment error count for missing English translations
          errorCount++;
          logger.warning(`Missing critical translation: ${category}/${language}.json`);
        }
      });
      
      // Also try to load the root language file (e.g., nl.json)
      try {
        const rootTranslation = require(`@/locales/${language}.json`);
        deepMerge(translationCache[language], rootTranslation);
        loadedCount++;
      } catch (e) {
        // It's okay if the root file is missing
        logger.debug(`No root translation file for ${language}.json`);
      }
    });
    
    // Log results
    if (errorCount > 0) {
      logger.warning(`🌍 Translation preload completed with ${errorCount} missing critical files. Loaded ${loadedCount} files.`);
    } else {
      logger.info(`🌍 Translation preload complete: loaded ${loadedCount} translation files`);
    }
    
    // Ensure we have at least some basic translations for critical UI elements
    setupFallbackTranslations();
    
    // Mark translations as loaded
    translationsLoaded = true;
  } catch (error) {
    logger.error('Failed to preload translations:', error);
    
    // Initialize with empty translations for required languages
    requiredLanguages.forEach(lang => {
      if (!translationCache[lang]) {
        translationCache[lang] = {};
      }
    });
    
    // Set up fallbacks so the app doesn't break completely
    setupFallbackTranslations();
    
    // Mark as loaded even on error to prevent app from getting stuck
    translationsLoaded = true;
  } finally {
    loadingInProgress = false;
  }
}

// Reload translations for a specific language
export function reloadTranslations(languageCode: LanguageCode): void {
  try {
    logger.info(`🔄 Reloading translations for ${languageCode}`);
    
    // Initialize or reset language cache
    translationCache[languageCode] = {};
    
    // Load all categories for this language
    let loadedCount = 0;
    categories.forEach(category => {
      const loaded = loadTranslationFile(languageCode, category);
      if (loaded) loadedCount++;
    });
    
    // Try to load the root language file (e.g., nl.json)
    try {
      const rootTranslation = require(`@/locales/${languageCode}.json`);
      deepMerge(translationCache[languageCode], rootTranslation);
      loadedCount++;
    } catch (e) {
      // It's okay if the root file is missing
      logger.debug(`No root translation file for ${languageCode}.json`);
    }
    
    logger.info(`🔄 Translation reload complete for ${languageCode}: loaded ${loadedCount} files`);
  } catch (error) {
    logger.error(`Failed to reload translations for ${languageCode}:`, error);
  }
}

// Set up emergency fallback translations for critical UI elements
function setupFallbackTranslations(): void {
  // Make sure English has essential fallbacks
  if (!translationCache['en']) translationCache['en'] = {};
  
  // General fallbacks
  if (!getNestedValue(translationCache['en'], 'general.loading')) {
    translationCache['en'].general = translationCache['en'].general || {};
    translationCache['en'].general.loading = "Loading...";
    translationCache['en'].general.error = "Error";
    translationCache['en'].general.appName = "Maritime Directory";
  }
  
  // Navigation fallbacks
  if (!getNestedValue(translationCache['en'], 'navigation.home')) {
    translationCache['en'].navigation = translationCache['en'].navigation || {};
    translationCache['en'].navigation.home = "Home";
    translationCache['en'].navigation.businesses = "Businesses";
  }
  
  // Business directory fallbacks
  if (!getNestedValue(translationCache['en'], 'business.filter.noResults')) {
    if (!translationCache['en'].business) translationCache['en'].business = {};
    if (!translationCache['en'].business.filter) translationCache['en'].business.filter = {};
    translationCache['en'].business.filter.noResults = "No results found";
    translationCache['en'].business.mapViewComingSoon = "Map view coming soon";
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
    'footer.allRightsReserved': 'All Rights Reserved',
    'business.filter.noResults': 'No results found',
    'business.mapViewComingSoon': 'Map view coming soon',
    'business.title': 'Business Directory',
    'business.subtitle': 'Find maritime businesses worldwide'
  };
  
  return fallbacks[key] || key;
}

// Set up a helper to ensure all required translation files exist
export function ensureRequiredTranslationFiles(): void {
  const requiredCategories = ['common', 'general', 'navigation', 'footer'];
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

// Add the missing logMissingTranslations function
export function logMissingTranslations(): void {
  try {
    logger.info('🔍 Checking for missing translations');
    const missingTranslations: Record<string, string[]> = {};
    
    // Compare English translations with other languages
    const englishTranslations = translationCache['en'] || {};
    
    supportedLanguages.forEach(lang => {
      if (lang.code === 'en') return; // Skip English
      
      const langTranslations = translationCache[lang.code] || {};
      const missing: string[] = [];
      
      // Recursively find missing keys
      const findMissingKeys = (enObj: any, langObj: any, path: string = '') => {
        Object.keys(enObj).forEach(key => {
          const currentPath = path ? `${path}.${key}` : key;
          
          if (typeof enObj[key] === 'object' && enObj[key] !== null) {
            // If it's an object, recursively check its properties
            if (!langObj[key] || typeof langObj[key] !== 'object') {
              missing.push(currentPath);
            } else {
              findMissingKeys(enObj[key], langObj[key], currentPath);
            }
          } else if (langObj[key] === undefined) {
            // If the key doesn't exist in the language translation
            missing.push(currentPath);
          }
        });
      };
      
      findMissingKeys(englishTranslations, langTranslations);
      
      if (missing.length > 0) {
        missingTranslations[lang.code] = missing;
      }
    });
    
    // Log the results
    if (Object.keys(missingTranslations).length > 0) {
      logger.warning('Missing translations found:', missingTranslations);
    } else {
      logger.info('No missing translations found!');
    }
  } catch (error) {
    logger.error('Error while checking for missing translations:', error);
  }
}
