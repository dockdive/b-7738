
// List all translation categories that exist as subfolders
export const translationCategories = [
  "addBusiness",
  "auth",
  "boat",
  "boats",
  "boatsearch",
  "bulkupload",
  "business",
  "categories",
  "common",
  "conditions",
  "cookies",
  "faq",
  "favorites",
  "footer",
  "general",
  "header",
  "home",
  "match",
  "messages",
  "navigation",
  "privacy",
  "profile",
  "search",
  "statistics",
  "steps",
  "subscription",
  "terms",
  // Nested categories
  "sell/steps",
  "sell/navigation",
  "sell/checkout",
  "sell/conditions"
];

// Debug flag for translation debugging
export const DEBUG_TRANSLATIONS = true;

// All supported languages
export const supportedLanguages = [
  { code: "en", name: "English" },
  { code: "nl", name: "Dutch" }
] as const;

export type LanguageCode = typeof supportedLanguages[number]["code"];
