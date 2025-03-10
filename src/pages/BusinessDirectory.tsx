
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Tabs } from '@/components/ui/tabs';
import BusinessFilterSidebar from '@/components/business/BusinessFilterSidebar';
import BusinessViewSelector from '@/components/business/BusinessViewSelector';
import BusinessList from '@/components/business/BusinessList';
import { useBusinessDirectory } from '@/hooks/useBusinessDirectory';

const BusinessDirectory = () => {
  const { t } = useLanguage();
  const {
    businesses,
    categories,
    businessesLoading,
    categoriesLoading,
    businessesError,
    view,
    searchTerm,
    selectedCategory,
    handleSearch,
    handleCategoryChange,
    handleViewChange
  } = useBusinessDirectory();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">{t('business.title')}</h1>
      <p className="text-gray-600 mb-8">{t('business.subtitle')}</p>
      
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <div className="w-full md:w-1/3">
          <BusinessFilterSidebar
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
            searchTerm={searchTerm}
            onSearchChange={handleSearch}
            isLoading={categoriesLoading}
          />
        </div>
        
        <div className="w-full md:w-2/3">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">
              {businesses?.length} {t('business.title')}
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
  );
};

export default BusinessDirectory;
