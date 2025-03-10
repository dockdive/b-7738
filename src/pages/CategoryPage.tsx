
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Tabs } from '@/components/ui/tabs';
import BusinessFilterSidebar from '@/components/business/BusinessFilterSidebar';
import BusinessViewSelector from '@/components/business/BusinessViewSelector';
import BusinessList from '@/components/business/BusinessList';
import { useBusinessDirectory } from '@/hooks/useBusinessDirectory';
import DocumentTitle from '@/components/DocumentTitle';
import { useQuery } from '@tanstack/react-query';
import { fetchCategories } from '@/services/apiService';
import { Category } from '@/types';
import { AlertCircle } from 'lucide-react';

const CategoryPage = () => {
  const { categoryName } = useParams<{ categoryName: string }>();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [categoryId, setCategoryId] = useState<number | null>(null);
  
  // Fetch all categories
  const { data: categories, isLoading: categoriesLoading, error: categoriesError } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories
  });
  
  // Find the matching category ID based on the URL parameter
  useEffect(() => {
    if (!categoriesLoading && categories && categoryName) {
      // Normalize the category name for comparison
      const normalizedUrlName = categoryName.toLowerCase().replace(/-/g, ' ');
      
      // Find the matching category
      const matchingCategory = categories.find((category: Category) => {
        const normalizedCategoryName = category.name.toLowerCase();
        return normalizedCategoryName === normalizedUrlName;
      });
      
      if (matchingCategory) {
        setCategoryId(matchingCategory.id);
      }
    }
  }, [categories, categoriesLoading, categoryName]);
  
  const {
    businesses,
    businessesLoading,
    businessesError,
    view,
    searchTerm,
    handleSearch,
    handleViewChange
  } = useBusinessDirectory(categoryId);
  
  // Redirect to 404 if category not found
  useEffect(() => {
    if (!categoriesLoading && categories && categories.length > 0 && categoryName && !categoryId) {
      navigate('/not-found', { replace: true });
    }
  }, [categories, categoriesLoading, categoryName, categoryId, navigate]);
  
  if (categoriesError) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <AlertCircle className="h-12 w-12 mx-auto text-red-500 mb-4" />
        <h1 className="text-2xl font-bold mb-2">{t('errors.unexpectedError')}</h1>
        <p className="text-gray-600">{(categoriesError as Error).message}</p>
      </div>
    );
  }

  if (categoriesLoading || !categoryId) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-12"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-1">
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
            <div className="col-span-2">
              <div className="grid grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-48 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Find category object for the title
  const currentCategory = categories?.find((cat: Category) => cat.id === categoryId);
  
  // Function to get translated category information
  const getCategoryInfo = (category: Category) => {
    if (!category) return { name: '', description: '' };
    
    const categoryKey = category.name.toLowerCase().replace(/\s+/g, '');
    const translatedName = t(`categories.${categoryKey}.name`);
    const translatedDescription = t(`categories.${categoryKey}.description`);
    
    return {
      name: translatedName !== `categories.${categoryKey}.name` ? translatedName : category.name,
      description: translatedDescription !== `categories.${categoryKey}.description` ? translatedDescription : (category.description || '')
    };
  };
  
  const { name, description } = getCategoryInfo(currentCategory as Category);
  
  return (
    <>
      <DocumentTitle 
        title={name || t('business.title')} 
        description={description || t('business.subtitle')}
      />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">{name}</h1>
        <p className="text-gray-600 mb-8">{description}</p>
        
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          <div className="w-full md:w-1/3 lg:w-1/4">
            <BusinessFilterSidebar
              categories={categories || []}
              selectedCategory={categoryId}
              onCategoryChange={(id) => {
                if (id === null) {
                  navigate('/businesses');
                } else if (id !== categoryId) {
                  const selectedCategory = categories?.find((cat: Category) => cat.id === id);
                  if (selectedCategory) {
                    navigate(`/category/${selectedCategory.name.toLowerCase().replace(/\s+/g, '-')}`);
                  }
                }
              }}
              searchTerm={searchTerm}
              onSearchChange={handleSearch}
              isLoading={categoriesLoading}
            />
          </div>
          
          <div className="w-full md:w-2/3 lg:w-3/4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
              <h2 className="text-xl font-bold">
                {businesses?.length || 0} {name}
              </h2>
              
              <div className="flex space-x-2">
                <BusinessViewSelector view={view} onChange={handleViewChange} />
              </div>
            </div>
            
            <Tabs value={view}>
              <BusinessList
                businesses={businesses}
                isLoading={businessesLoading}
                error={businessesError}
                view={view}
              />
            </Tabs>
          </div>
        </div>
      </div>
    </>
  );
};

export default CategoryPage;
