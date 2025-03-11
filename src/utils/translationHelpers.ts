
import { LanguageCode, supportedLanguages } from "@/constants/languageConstants";
import logger from "@/services/loggerService";
import { translationCache } from "./translationCache";

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
