
import { LanguageCode, supportedLanguages } from "@/constants/languageConstants";
import logger from "@/services/loggerService";
import { translationCache, deepMerge } from "./translationCache";

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

// Define the required languages that must be loaded
export const requiredLanguages: LanguageCode[] = ['en', 'nl'];

// Global flag to track translation loading status
let translationsLoaded = false;
let loadingInProgress = false;

// Function to check if translations are loaded
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

// Set up a helper to ensure all required translation files exist
export function ensureRequiredTranslationFiles(): void {
  const requiredCategories = ['common', 'general', 'navigation', 'footer'];
  
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

// Import getNestedValue from translationHelpers.ts for use in this file
import { getNestedValue } from './translationHelpers';
