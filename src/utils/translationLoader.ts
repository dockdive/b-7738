
import { LanguageCode } from "@/constants/languageConstants";
import deepMerge from "@/utils/deepMerge";

// Helper function to load translations dynamically
export async function loadTranslationFiles(language: LanguageCode, categories: string[]): Promise<Record<string, any>> {
  try {
    const mergedTranslations: Record<string, any> = {};
    
    for (const category of categories) {
      try {
        // Dynamically import the translation file
        const module = await import(`@/locales/${category}/${language}.json`);
        deepMerge(mergedTranslations, module.default || module);
      } catch (error) {
        console.warn(`Could not load translation for ${category}/${language}.json`);
      }
    }
    
    return mergedTranslations;
  } catch (error) {
    console.error("Failed to load translations:", error);
    return {};
  }
}

// Helper to get a nested translation value
export function getTranslationValue(obj: any, path: string): string {
  const keys = path.split('.');
  let current = obj;
  
  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = current[key];
    } else {
      return path; // Return the path as fallback
    }
  }
  
  return typeof current === 'string' ? current : path;
}
