
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
  
  return (
    <div className="space-y-2">
      <Button
        key="all-categories"
        variant={selectedCategory === null ? "default" : "ghost"}
        className="w-full justify-start"
        onClick={() => onChange(null)}
      >
        {t('categories.all', 'All Categories')}
      </Button>
      
      {categories?.map((category) => (
        <Button
          key={category.id}
          variant={selectedCategory === category.id ? "default" : "ghost"}
          className="w-full justify-start"
          onClick={() => onChange(category.id)}
        >
          {t(`categories.${category.name.toLowerCase().replace(/\s+/g, '')}.name`, category.name)}
        </Button>
      ))}
    </div>
  );
};

export default CategoryFilter;
