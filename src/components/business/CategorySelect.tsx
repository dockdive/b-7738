
import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { adaptCategories } from '@/utils/categoryAdapter';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Category } from '@/types';
import LoadingIndicator from '@/components/ui/loading-indicator';
import logger from '@/services/loggerService';

interface CategorySelectProps {
  value: number | string | null;
  onChange: (value: number | null) => void;
  placeholder?: string;
  className?: string;
}

const CategorySelect: React.FC<CategorySelectProps> = ({
  value,
  onChange,
  placeholder = "Select a category",
  className = ""
}) => {
  const { t } = useLanguage();
  const [selectedValue, setSelectedValue] = useState<string>(value ? String(value) : '');

  // Fetch categories from Supabase
  const { data: categories, isLoading, error } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      logger.info('Fetching categories from Supabase');
      
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');
        
      if (error) {
        logger.error('Error fetching categories:', error);
        throw error;
      }
      
      logger.info(`Fetched ${data?.length || 0} categories`);
      return adaptCategories(data || []);
    },
  });

  useEffect(() => {
    // Update the selected value when the value prop changes
    setSelectedValue(value ? String(value) : '');
  }, [value]);

  const handleValueChange = (newValue: string) => {
    logger.info(`Category selected: ${newValue}`);
    setSelectedValue(newValue);
    onChange(newValue ? parseInt(newValue, 10) : null);
  };

  if (isLoading) {
    return <LoadingIndicator size="sm" variant="inline" />;
  }

  if (error) {
    logger.error('Error loading categories:', error);
    return <p className="text-red-500">Error loading categories</p>;
  }

  // Log if we have no categories to help with debugging
  if (!categories || categories.length === 0) {
    logger.warn('No categories available to display');
    return <p className="text-gray-500">No categories available. Please check the database.</p>;
  }

  return (
    <Select value={selectedValue} onValueChange={handleValueChange}>
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder || t('categories.selectCategory')} />
      </SelectTrigger>
      <SelectContent>
        {categories.map((category: Category) => (
          <SelectItem key={category.id} value={String(category.id)}>
            {category.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default CategorySelect;
