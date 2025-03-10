
import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchCategories } from '@/services/apiService';
import { Category } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

const CategoryLinks = () => {
  const { t } = useLanguage();
  const { data: categories, isLoading, error } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories
  });

  // Function to get translated category information
  const getCategoryInfo = (category: Category) => {
    const categoryKey = category.name.toLowerCase().replace(/\s+/g, '');
    const translatedName = t(`categories.${categoryKey}.name`);
    const translatedDescription = t(`categories.${categoryKey}.description`);
    
    // If no translation is found, fall back to the original values
    return {
      name: translatedName !== `categories.${categoryKey}.name` ? translatedName : category.name,
      description: translatedDescription !== `categories.${categoryKey}.description` ? translatedDescription : (category.description || '')
    };
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !categories) {
    return null;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {categories.slice(0, 8).map((category: Category) => {
        const { name, description } = getCategoryInfo(category);
        return (
          <Link 
            key={category.id} 
            to={`/category/${category.name.toLowerCase().replace(/\s+/g, '-')}`}
            className="no-underline"
          >
            <Card className="p-6 text-center h-full hover:bg-gray-50 transition-colors cursor-pointer flex flex-col justify-center items-center">
              <h3 className="font-semibold mb-2">{name}</h3>
              <p className="text-sm text-gray-500 line-clamp-2">{description}</p>
            </Card>
          </Link>
        );
      })}
    </div>
  );
};

export default CategoryLinks;
