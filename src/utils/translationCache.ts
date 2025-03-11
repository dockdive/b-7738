
import logger from "@/services/loggerService";

// Translation cache
export const translationCache: { [key: string]: any } = {};

// Function to deep merge objects
export function deepMerge(target: Record<string, any>, ...sources: Record<string, any>[]): Record<string, any> {
  sources.forEach(source => {
    Object.keys(source).forEach(key => {
      if (source[key] && typeof source[key] === "object" && !Array.isArray(source[key])) {
        if (!target[key]) target[key] = {};
        deepMerge(target[key], source[key]);
      } else {
        target[key] = source[key];
      }
    });
  });
  return target;
}
