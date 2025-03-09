
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
  "steps",
  "favorites",
  "privacy",
  "cookies",
  "terms",
  "profile",
  "header",
  "about",
  "statistics",
  "boats",
  "subscription",
  "search",
  "common",
  "sell",
  "categories",
  "business",
  "bulkupload",
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
