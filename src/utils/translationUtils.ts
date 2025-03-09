
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
  
  try {
    // First try to load the base language file
    const baseTranslation = require(`@/locales/${lang}.json`);
    Object.assign(merged, baseTranslation);
    hasLoadedMainFile = true;
    logger.info(`✅ Successfully loaded base file for "${lang}"`);
  } catch (e) {
    logger.error(`❌ Failed to load base translation file for language "${lang}"`, e);
    if (typeof window !== 'undefined') {
      toast({
        title: "Translation Error",
        description: `Failed to load base translation file for ${lang}`,
        variant: "destructive",
      });
    }
  }
  
  // Then load all category-specific files
  translationCategories.forEach(category => {
    try {
      // Import the JSON file from the folder structure
      const translation = require(`@/locales/${category}/${lang}.json`);
      deepMerge(merged, translation);
      loadedCategories++;
      logger.info(`✅ Loaded category "${category}" for language "${lang}"`);
    } catch (e) {
      failedCategories++;
      failedCategoryNames.push(category);
      logger.warning(`⚠️ Missing translation file for category "${category}" and language "${lang}"`);
    }
  });
  
  if (failedCategories > 0) {
    logger.error(`❌ Failed to load ${failedCategories} translation categories for "${lang}": ${failedCategoryNames.join(', ')}`);
    if (typeof window !== 'undefined' && typeof document !== 'undefined' && document.readyState === 'complete') {
      // Only show toast when document is fully loaded to avoid too many toasts during initial load
      toast({
        title: "Translation Warning",
        description: `Failed to load ${failedCategories} translation categories for ${lang}`,
        variant: "default",
      });
    }
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
        if (typeof window !== 'undefined') {
          toast({
            title: "Translation Preload Error",
            description: `Failed to preload translations for ${lang}`,
            variant: "destructive",
          });
        }
      }
    });

    // Ensure English translations are always available as fallback
    if (!translationCache["en"]) {
      logger.error("❌ Critical error: English translations could not be loaded!");
      if (typeof window !== 'undefined') {
        toast({
          title: "Critical Translation Error",
          description: "English translations could not be loaded. Some UI elements may not display correctly.",
          variant: "destructive",
        });
      }
      // Set empty object to prevent runtime errors
      translationCache["en"] = {};
    }

    // Debug info
    logger.debug("📚 Translation cache content:", translationCache);

    // Expose the translation cache for debugging purposes
    if (typeof window !== 'undefined') {
      // @ts-ignore - This is for debugging only
      window.__DEBUG_TRANSLATION_CACHE__ = translationCache;
    }
  } catch (error) {
    logger.error("❌ Unhandled error in preloadTranslations:", error);
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
    const expectedTopLevelKeys = ['general', 'common', 'navigation', 'home', 'business', 'addBusiness'];
    const availableKeys = Object.keys(translationCache[lang]);
    
    expectedTopLevelKeys.forEach(key => {
      if (!availableKeys.includes(key)) {
        missingTranslations[lang].push(key);
      }
    });
  });
  
  logger.info("🔍 Missing translation report:", missingTranslations);
}
