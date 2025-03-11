
import logger from "@/services/loggerService";

// Translation cache
export const translationCache: { [key: string]: any } = {};

// Function to deep merge objects
export const deepMerge = (target: any, source: any): any => {
  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      if (typeof target[key] === "object" && typeof source[key] === "object") {
        deepMerge(target[key], source[key]);
      } else {
        target[key] = source[key];
      }
    }
  }
  return target;
};
