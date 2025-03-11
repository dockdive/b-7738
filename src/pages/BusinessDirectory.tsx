
import React, { useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Tabs } from '@/components/ui/tabs';
import BusinessFilterSidebar from '@/components/business/BusinessFilterSidebar';
import BusinessViewSelector from '@/components/business/BusinessViewSelector';
import BusinessList from '@/components/business/BusinessList';
import { useBusinessDirectory } from '@/hooks/useBusinessDirectory';
import DocumentTitle from '@/components/DocumentTitle';
import logger from '@/services/loggerService';

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
    handleViewChange,
    refetchBusinesses
  } = useBusinessDirectory();

  // Log component mounting and data status
  useEffect(() => {
    logger.info('BusinessDirectory component mounted');
    return () => {
      logger.info('BusinessDirectory component unmounted');
    };
  }, []);

  // Force refetch if empty data but not loading
  useEffect(() => {
    if (!businessesLoading && (!businesses || businesses.length === 0) && !businessesError) {
      logger.info('No businesses loaded, trying to refetch');
      refetchBusinesses();
    }
  }, [businesses, businessesLoading, businessesError, refetchBusinesses]);

  const title = "Business Directory";
  const subtitle = "Find maritime businesses worldwide";

  return (
    <>
      <DocumentTitle 
        title={title} 
        description={subtitle}
        translationPrefix="business"
      />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">{title}</h1>
        <p className="text-gray-600 mb-8">{subtitle}</p>
        
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          <div className="w-full md:w-1/3 lg:w-1/4">
            <BusinessFilterSidebar
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={handleCategoryChange}
              searchTerm={searchTerm}
              onSearchChange={handleSearch}
              isLoading={categoriesLoading}
            />
          </div>
          
          <div className="w-full md:w-2/3 lg:w-3/4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
              <h2 className="text-xl font-bold">
                {businesses?.length || 0} Businesses
              </h2>
              
              <div className="flex space-x-2">
                <BusinessViewSelector view={view} onChange={handleViewChange} />
              </div>
            </div>
            
            <Tabs value={view} defaultValue="grid">
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

export default BusinessDirectory;
