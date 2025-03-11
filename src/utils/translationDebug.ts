
import { LanguageCode, supportedLanguages } from "@/constants/languageConstants";
import logger from "@/services/loggerService";
import { translationCache } from "./translationCache";
import { getNestedValue } from "./translationHelpers";

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
