
import { Button } from "@/components/ui/button";
import { categories } from "@/data/tools";
import { LucideIcon } from "lucide-react";

interface CategoryFilterProps {
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
}

const CategoryFilter = ({ selectedCategory, onSelectCategory }: CategoryFilterProps) => {
  return (
    <div className="sticky top-4 space-y-2">
      <h2 className="text-xl font-semibold mb-4">Categories</h2>
      {categories.map((category) => {
        const Icon = category.icon;
        return (
          <Button
            key={category.name}
            variant={selectedCategory === category.name ? "default" : "ghost"}
            className="w-full justify-start"
            onClick={() => onSelectCategory(category.name)}
          >
            <Icon className="mr-2 h-4 w-4" />
            {category.name}
          </Button>
        );
      })}
    </div>
  );
};

export default CategoryFilter;
