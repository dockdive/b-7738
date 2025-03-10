
import React from "react";
import { Button } from "@/components/ui/button";
import { Category } from "@/types";
import { useLanguage } from "@/contexts/LanguageContext";

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: number | null;
  onChange: (categoryId: number | null) => void;
}

const CategoryFilter = ({ categories, selectedCategory, onChange }: CategoryFilterProps) => {
  const { t } = useLanguage();
  
  const getCategoryName = (category: Category) => {
    const categoryKey = category.name.toLowerCase().replace(/\s+/g, '');
    const translatedName = t(`categories.${categoryKey}.name`);
    
    // If no translation is found, fall back to the original name
    return translatedName === `categories.${categoryKey}.name` ? category.name : translatedName;
  };
  
  return (
    <div className="space-y-2">
      <Button
        key="all-categories"
        variant={selectedCategory === null ? "default" : "ghost"}
        className="w-full justify-start"
        onClick={() => onChange(null)}
      >
        {t('categories.all')}
      </Button>
      
      {categories?.map((category) => (
        <Button
          key={category.id}
          variant={selectedCategory === category.id ? "default" : "ghost"}
          className="w-full justify-start"
          onClick={() => onChange(category.id)}
        >
          {getCategoryName(category)}
        </Button>
      ))}
    </div>
  );
};

export default CategoryFilter;
