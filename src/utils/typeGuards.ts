
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
    return [];
  }
  return value as T[];
}

// Type assertion for safely using object methods
export function assertObject<T>(value: unknown): T | null {
  if (value === null || value === undefined || typeof value !== 'object') {
    return null;
  }
  return value as T;
}
