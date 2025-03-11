
import { LanguageCode, supportedLanguages, translationCategories } from "@/constants/languageConstants";
import logger from "@/services/loggerService";
import { translationCache, deepMerge } from "./translationCache";
import { getNestedValue } from "./translationHelpers";

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
      // Try from category folder structure
      const translation = require(`@/locales/${category}/${language}.json`);
      deepMerge(translationCache[language], translation);
      return true;
    } catch (e) {
      // If category has subpaths (e.g., sell/steps)
      if (category.includes('/')) {
        try {
          const translation = require(`@/locales/${category}/${language}.json`);
          deepMerge(translationCache[language], translation);
          return true;
        } catch (subE) {
          logger.debug(`No translation file for nested category "${category}" and language "${language}"`);
        }
      }
      
      // Try from root locale folder as fallback
      try {
        const rootTranslation = require(`@/locales/${language}.json`);
        const categoryPath = category.split('/');
        
        // If it's a nested category, try to extract that section from the root file
        if (categoryPath.length > 1) {
          const nestedValue = getNestedValue(rootTranslation, categoryPath.join('.'));
          if (nestedValue && typeof nestedValue === 'object') {
            // Create a new object with the nested structure
            const nestedObj = {};
            let current = nestedObj;
            for (let i = 0; i < categoryPath.length - 1; i++) {
              current[categoryPath[i]] = {};
              current = current[categoryPath[i]];
            }
            current[categoryPath[categoryPath.length - 1]] = nestedValue;
            deepMerge(translationCache[language], nestedObj);
            return true;
          }
        } else {
          // For non-nested categories, try to extract just that section
          const sectionValue = rootTranslation[category];
          if (sectionValue && typeof sectionValue === 'object') {
            const sectionObj = { [category]: sectionValue };
            deepMerge(translationCache[language], sectionObj);
            return true;
          } else {
            // If all else fails, just merge the entire root file
            deepMerge(translationCache[language], rootTranslation);
            return true;
          }
        }
      } catch (rootE) {
        logger.debug(`No translation file found for ${category}/${language}.json or ${language}.json`);
        return false;
      }
    }
    
    return false;
  } catch (error) {
    logger.error(`Error loading translation file for "${category}/${language}":`, error);
    return false;
  }
}

// Update the preloadTranslations function to be more robust
export function preloadTranslations(): void {
  // Prevent concurrent loading
  if (loadingInProgress) return;
  
  loadingInProgress = true;
  logger.info('🌍 Starting translation preload');
  
  try {
    let loadedCount = 0;
    let errorCount = 0;
    
    // First load required languages
    requiredLanguages.forEach(language => {
      if (!translationCache[language]) {
        translationCache[language] = {};
      }
      
      // First try to load the root language file
      try {
        const rootTranslation = require(`@/locales/${language}.json`);
        deepMerge(translationCache[language], rootTranslation);
        loadedCount++;
        logger.debug(`Loaded root translation file for ${language}`);
      } catch (e) {
        logger.debug(`No root translation file for ${language}.json`);
      }
      
      // Then load all categories
      translationCategories.forEach(category => {
        const loaded = loadTranslationFile(language, category);
        if (loaded) {
          loadedCount++;
        } else if (language === 'en') {
          // Only count missing English translations as errors
          errorCount++;
        }
      });
    });
    
    // Mark translations as loaded
    translationsLoaded = true;
    
    // Log results
    if (errorCount > 0) {
      logger.warning(`🌍 Translation preload completed with ${errorCount} missing English files. Loaded ${loadedCount} files.`);
    } else {
      logger.info(`🌍 Translation preload complete: loaded ${loadedCount} translation files`);
    }
    
    // Ensure we have some basic translations
    setupFallbackTranslations();
  } catch (error) {
    logger.error('Failed to preload translations:', error);
    
    // Set up fallbacks so the app doesn't break
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
    
    // Reset language cache
    translationCache[languageCode] = {};
    
    // First try to load the root language file
    try {
      const rootTranslation = require(`@/locales/${languageCode}.json`);
      deepMerge(translationCache[languageCode], rootTranslation);
      logger.debug(`Loaded root translation file for ${languageCode}`);
    } catch (e) {
      logger.debug(`No root translation file for ${languageCode}.json`);
    }
    
    // Then load all categories
    let loadedCount = 0;
    translationCategories.forEach(category => {
      const loaded = loadTranslationFile(languageCode, category);
      if (loaded) loadedCount++;
    });
    
    logger.info(`🔄 Translation reload complete for ${languageCode}: loaded ${loadedCount} files`);
  } catch (error) {
    logger.error(`Failed to reload translations for ${languageCode}:`, error);
  }
}

// Set up fallback translations for critical UI elements
function setupFallbackTranslations(): void {
  // Make sure English exists in cache
  if (!translationCache['en']) translationCache['en'] = {};
  
  // Ensure critical UI elements have translations
  const criticalPaths = {
    'general.loading': 'Loading...',
    'general.error': 'Error',
    'general.appName': 'Maritime Directory',
    'navigation.home': 'Home',
    'navigation.businesses': 'Businesses',
    'business.title': 'Business Directory',
    'business.filter.noResults': 'No results found',
    'business.mapViewComingSoon': 'Map view coming soon',
  };
  
  // Add fallbacks for any missing critical paths
  Object.entries(criticalPaths).forEach(([path, value]) => {
    if (!getNestedValue(translationCache['en'], path)) {
      // Split the path and create nested objects as needed
      const parts = path.split('.');
      let current = translationCache['en'];
      
      // Create nested objects for all but the last part
      for (let i = 0; i < parts.length - 1; i++) {
        if (!current[parts[i]]) {
          current[parts[i]] = {};
        }
        current = current[parts[i]];
      }
      
      // Set the value at the final path
      current[parts[parts.length - 1]] = value;
    }
  });
}

// Function to ensure required translation files exist
export function ensureRequiredTranslationFiles(): void {
  let missingCount = 0;
  
  requiredLanguages.forEach(lang => {
    // Check root language file
    try {
      require(`@/locales/${lang}.json`);
    } catch (e) {
      logger.error(`CRITICAL: Missing required root translation file for language "${lang}"`);
      missingCount++;
    }
    
    // Check essential category files
    ['common', 'general', 'navigation'].forEach(category => {
      try {
        require(`@/locales/${category}/${lang}.json`);
      } catch (e) {
        logger.error(`CRITICAL: Missing required translation file for category "${category}" and language "${lang}"`);
        missingCount++;
      }
    });
  });
  
  if (missingCount > 0) {
    logger.warning(`Missing ${missingCount} critical translation files`);
  } else {
    logger.info('All required translation files are present');
  }
}
