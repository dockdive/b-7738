
import { deepMerge } from "@/utils/deepMerge";
import { translationCategories, LanguageCode } from "@/constants/languageConstants";
import logger from "@/services/loggerService";
import { toast } from "@/hooks/use-toast";

// Global cache for storing loaded translations
export const translationCache: Record<string, Record<string, any>> = {};

/**
 * Detects the user's browser language
 */
export const detectBrowserLanguage = (): LanguageCode => {
  try {
    const browserLang = navigator.language.split("-")[0];
    if (browserLang && ["en", "nl"].includes(browserLang)) {
      return browserLang as LanguageCode;
    }
  } catch (e) {
    logger.error("Error detecting browser language:", e);
  }
  return "en";
};

/**
 * Gets a value from a nested object using a dot-separated path
 */
export const getNestedValue = (obj: any, path: string): any => {
  if (!obj) return undefined;
  
  const keys = path.split(".");
  let current = obj;
  
  for (const key of keys) {
    if (current === undefined || current === null) return undefined;
    current = current[key];
  }
  
  return current;
};

/**
 * Loads translations for a given language code
 */
export function loadTranslations(lang: string): Record<string, any> {
  const merged: Record<string, any> = {};
  let hasLoadedMainFile = false;
  let loadedCategories = 0;
  let failedCategories = 0;
  let failedCategoryNames: string[] = [];
  
  // Force-load some critical categories first to ensure core translations are available
  const criticalCategories = ["general", "common", "navigation", "errors"];
  
  try {
    // First try to load the base language file
    try {
      const baseTranslation = require(`@/locales/${lang}.json`);
      Object.assign(merged, baseTranslation);
      hasLoadedMainFile = true;
      logger.info(`✅ Successfully loaded base file for "${lang}"`);
    } catch (e) {
      logger.warning(`❌ Failed to load base translation file for language "${lang}"`, e);
    }
    
    // Then load all category-specific files
    [...criticalCategories, ...translationCategories.filter(c => !criticalCategories.includes(c))].forEach(category => {
      try {
        // Import the JSON file from the folder structure
        const translation = require(`@/locales/${category}/${lang}.json`);
        // Merge the content
        deepMerge(merged, translation);
        loadedCategories++;
        logger.info(`✅ Loaded category "${category}" for language "${lang}"`);
      } catch (e) {
        // Only log as warning for non-critical categories
        if (criticalCategories.includes(category)) {
          logger.warning(`⚠️ Missing critical translation file for category "${category}" and language "${lang}"`);
        } else {
          logger.info(`ℹ️ No translation file for category "${category}" and language "${lang}"`);
        }
        failedCategories++;
        failedCategoryNames.push(category);
      }
    });
  } catch (e) {
    logger.error(`❌ Unexpected error loading translations for "${lang}"`, e);
  }
  
  logger.info(`📊 Translation loading stats for "${lang}": Base file: ${hasLoadedMainFile ? 'Loaded' : 'Failed'}, Categories: ${loadedCategories} loaded, ${failedCategories} failed`);
  
  return merged;
}

/**
 * Preloads translations for all supported languages
 */
export function preloadTranslations(): void {
  logger.info("🌐 Starting preload of translations for all supported languages...");
  
  try {
    ["en", "nl"].forEach(lang => {
      try {
        translationCache[lang] = loadTranslations(lang);
        logger.info(`✅ Successfully preloaded translations for "${lang}"`);

        // Log what translations are available for debugging
        const availableKeys = Object.keys(translationCache[lang]);
        logger.info(`📚 Available top-level translation keys for "${lang}": ${availableKeys.join(', ')}`);
        
        // Check for common expected keys as a health check
        const expectedKeys = ['general', 'common', 'navigation', 'home'];
        const missingExpectedKeys = expectedKeys.filter(key => !availableKeys.includes(key));
        
        if (missingExpectedKeys.length > 0) {
          logger.warning(`⚠️ Missing expected top-level translation keys for "${lang}": ${missingExpectedKeys.join(', ')}`);
        }
      } catch (error) {
        logger.error(`❌ Failed to preload translations for "${lang}"`, error);
      }
    });

    // Ensure English translations are always available as fallback
    if (!translationCache["en"]) {
      logger.error("❌ Critical error: English translations could not be loaded!");
      // Set empty object to prevent runtime errors
      translationCache["en"] = {};
    }
  } catch (error) {
    logger.error("❌ Unhandled error in preloadTranslations:", error);
  }
}

/**
 * Reloads translations for a specific language
 */
export function reloadTranslations(lang: string): void {
  logger.info(`🔄 Reloading translations for "${lang}"...`);
  try {
    translationCache[lang] = loadTranslations(lang);
    logger.info(`✅ Successfully reloaded translations for "${lang}"`);
  } catch (error) {
    logger.error(`❌ Failed to reload translations for "${lang}"`, error);
  }
}

/**
 * Helper function to log missing translations for debugging
 */
export function logMissingTranslations(): void {
  const missingTranslations: Record<string, string[]> = {};
  
  Object.keys(translationCache).forEach(lang => {
    missingTranslations[lang] = [];
    
    // Check for missing expected top-level keys
    const expectedTopLevelKeys = ['general', 'common', 'navigation', 'home', 'business', 'errors'];
    const availableKeys = Object.keys(translationCache[lang]);
    
    expectedTopLevelKeys.forEach(key => {
      if (!availableKeys.includes(key)) {
        missingTranslations[lang].push(key);
      }
    });
  });
  
  logger.info("🔍 Missing translation report:", missingTranslations);
}
