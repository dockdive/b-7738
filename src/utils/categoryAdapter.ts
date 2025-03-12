
import { Category } from '@/types';

/**
 * Ensures a category object has all required fields including the description field
 * @param category The potentially incomplete category object
 * @returns A complete category object with all required fields
 */
export const ensureCategoryHasDescription = (category: any): Category => {
  if (!category) {
    return {
      id: 0,
      name: '',
      icon: '',
      description: ''
    };
  }

  // If the category doesn't have a description, add a default one
  if (!category.description) {
    return {
      ...category,
      description: category.name ? `Category for ${category.name}` : 'Default category description'
    };
  }

  return category as Category;
};

/**
 * Processes an array of categories to ensure they all have descriptions
 * @param categories Array of potentially incomplete category objects
 * @returns Array of complete category objects
 */
export const ensureAllCategoriesHaveDescriptions = (categories: any[]): Category[] => {
  if (!categories || !Array.isArray(categories)) {
    return [];
  }
  
  return categories.map(category => ensureCategoryHasDescription(category));
};

export default {
  ensureCategoryHasDescription,
  ensureAllCategoriesHaveDescriptions
};
