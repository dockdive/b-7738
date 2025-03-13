
/**
 * Deeply merges objects together
 * @param target The target object to merge into
 * @param sources One or more source objects to merge from
 * @returns The merged target object
 */
export function deepMerge<T extends Record<string, any>>(
  target: T,
  ...sources: Record<string, any>[]
): T {
  if (!sources.length) return target;

  const source = sources.shift();

  if (source === undefined) return target;

  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        
        // Recursively merge deep objects
        deepMerge(target[key], source[key]);
      } else {
        // Handle arrays properly (replace instead of merging)
        if (Array.isArray(source[key])) {
          Object.assign(target, { [key]: [...source[key]] });
        } else {
          Object.assign(target, { [key]: source[key] });
        }
      }
    });
  }

  return deepMerge(target, ...sources);
}

/**
 * Checks if a value is an object (not null, not array, actually an object)
 */
function isObject(item: any): item is Record<string, any> {
  return (
    item && 
    typeof item === 'object' && 
    !Array.isArray(item) && 
    item !== null
  );
}

export default deepMerge;
