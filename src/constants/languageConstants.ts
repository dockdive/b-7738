
// List all translation categories that exist as subfolders
export const translationCategories = [
  "conditions",
  "faq",
  "match",
  "messages",
  "boat",
  "footer",
  "boatsearch",
  "auth",
  "home",
  "navigation",
  "favorites",
  "privacy",
  "cookies",
  "terms",
  "profile",
  "header",
  "boats",
  "subscription",
  "search",
  "common",
  "sell",
  "categories",
  "business",
  "bulkupload"
];

// Debug flag for translation debugging
export const DEBUG_TRANSLATIONS = true;

// All supported languages
export const supportedLanguages = [
  { code: "en", name: "English" },
  { code: "nl", name: "Dutch" },
  { code: "de", name: "German" },
  { code: "fr", name: "French" },
  { code: "es", name: "Spanish" },
  { code: "it", name: "Italian" },
  { code: "pt", name: "Portuguese" },
  { code: "ru", name: "Russian" },
  { code: "zh", name: "Chinese" },
  { code: "ja", name: "Japanese" }
] as const;

export type LanguageCode = typeof supportedLanguages[number]["code"];
