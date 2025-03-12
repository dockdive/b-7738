
// utils/deepMerge.ts
export function deepMerge(target: Record<string, any>, ...sources: Record<string, any>[]) {
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

export default deepMerge; // Add default export to resolve the import error
