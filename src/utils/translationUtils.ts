
// Re-export everything from our specialized utility files
export { 
  detectBrowserLanguage,
  getNestedValue, 
  getFallbackTranslation
} from './translationHelpers';

export {
  translationCache,
  deepMerge
} from './translationCache';

export {
  requiredLanguages,
  areTranslationsLoaded,
  loadTranslationFile,
  preloadTranslations,
  reloadTranslations,
  ensureRequiredTranslationFiles
} from './translationLoader';

export {
  logMissingTranslations
} from './translationDebug';
