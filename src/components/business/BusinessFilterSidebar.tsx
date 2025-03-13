
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import CategoryFilter from '@/components/CategoryFilter';
import SearchBar from '@/components/SearchBar';
import { Category } from '@/types';

interface BusinessFilterSidebarProps {
  categories: Category[];
  selectedCategory: number | null;
  onCategoryChange: (categoryId: number | null) => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  isLoading: boolean;
}

const BusinessFilterSidebar = ({
  categories,
  selectedCategory,
  onCategoryChange,
  searchTerm,
  onSearchChange,
  isLoading
}: BusinessFilterSidebarProps) => {
  const { t } = useLanguage();

  return (
    <div className="sticky top-4">
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-bold mb-4">{t('business.filter.title')}</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                {t('business.filter.category')}
              </label>
              {isLoading ? (
                <p className="text-gray-500 text-sm">{t('general.loading')}</p>
              ) : (
                <CategoryFilter 
                  categories={categories} 
                  selectedCategory={selectedCategory}
                  onChange={onCategoryChange}
                />
              )}
            </div>
            
            <SearchBar 
              value={searchTerm}
              onChange={onSearchChange}
              placeholder={t('search.searchBusinesses')}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BusinessFilterSidebar;
