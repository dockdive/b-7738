
import { deepMerge } from '@/utils/deepMerge';

export interface Category {
  id?: string | number;
  name: string;
  icon?: string;
  description: string;
  created_at?: string;
}

/**
 * Ensures a category object has a description field
 * @param category The category object to adapt
 * @returns Category with guaranteed description field
 */
export function adaptCategory(category: any): Category {
  const defaultValues = {
    description: '' // Provide default description if missing
  };
  
  return deepMerge({}, defaultValues, category);
}

/**
 * Adapts an array of categories to ensure they all have description fields
 */
export function adaptCategories(categories: any[]): Category[] {
  return categories.map(adaptCategory);
}
