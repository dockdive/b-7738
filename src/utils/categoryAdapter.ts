
import { Category } from '@/types';

export const adaptCategory = (category: any): Category => {
  return {
    id: category.id || 0,
    name: category.name || '',
    icon: category.icon || '',
    description: category.description || `Category for ${category.name || 'unknown'}`
  };
};

export const adaptCategories = (categories: any[]): Category[] => {
  return categories.map(cat => adaptCategory(cat));
};

export default {
  adaptCategory,
  adaptCategories
};
