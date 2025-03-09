
/**
 * Type guard utility functions to check and assert types
 */

// Check if value is an array
export function isArray<T>(value: unknown): value is T[] {
  return Array.isArray(value);
}

// Check if value exists (not null or undefined)
export function isDefined<T>(value: unknown): value is T {
  return value !== null && value !== undefined;
}

// Type assertion for safely using array methods
export function assertArray<T>(value: unknown): T[] {
  if (!Array.isArray(value)) {
    console.warn('Expected array but received:', typeof value);
    return [];
  }
  return value as T[];
}

// Type assertion for safely using object methods
export function assertObject<T>(value: unknown): T | null {
  if (value === null || value === undefined || typeof value !== 'object') {
    console.warn('Expected object but received:', typeof value);
    return null;
  }
  return value as T;
}

// Check if an object has the required properties for a specific type
export function hasRequiredProperties<T>(obj: unknown, requiredProps: (keyof T)[]): obj is T {
  if (!obj || typeof obj !== 'object') {
    return false;
  }
  
  return requiredProps.every(prop => prop in obj);
}
