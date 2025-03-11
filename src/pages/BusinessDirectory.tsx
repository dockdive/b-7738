
import React, { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Grid, List, Map } from 'lucide-react';
import { Business, Category } from '@/types';
import SearchBar from '@/components/SearchBar';
import CategoryFilter from '@/components/CategoryFilter';
import logger from '@/services/loggerService';
import { populateSampleBusinesses } from '@/services/testDataService';

// Business card component
const BusinessCard = ({ business }: { business: Business }) => {
  const { t } = useLanguage();
  
  return (
    <Card className="h-full">
      <CardContent className="p-6">
        <div className="flex items-center space-x-4">
          {business.logo_url ? (
            <img 
              src={business.logo_url} 
              alt={business.name} 
              className="w-16 h-16 object-cover rounded-full"
            />
          ) : (
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-xl font-bold text-gray-400">
                {business.name.charAt(0)}
              </span>
            </div>
          )}
          <div>
            <h3 className="font-bold">{business.name}</h3>
            <p className="text-sm text-gray-500">{business.city}, {business.country}</p>
          </div>
        </div>
        
        <p className="mt-4 text-sm line-clamp-3">{business.description}</p>
        
        <div className="mt-4 flex items-center justify-between">
          <button className="text-primary text-sm font-medium hover:underline">
            {t('business.businessCard.viewDetails')}
          </button>
          
          {business.is_featured && (
            <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
              {t('business.businessCard.featured')}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const BusinessDirectory = () => {
  const { t } = useLanguage();
  const [view, setView] = useState<'grid' | 'list' | 'map'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  // Fetch businesses
  const fetchBusinesses = async () => {
    let query = supabase
      .from('businesses')
      .select('*')
      .eq('status', 'approved');
    
    if (selectedCategory) {
      query = query.eq('category_id', selectedCategory);
    }
    
    if (searchTerm) {
      query = query.ilike('name', `%${searchTerm}%`);
    }
    
    const { data, error } = await query;
    
    if (error) {
      logger.error('Error fetching businesses:', error);
      throw error;
    }
    
    return data || [];
  };

  // Fetch categories
  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');
    
    if (error) {
      logger.error('Error fetching categories:', error);
      throw error;
    }
    
    return data || [];
  };

  const { 
    data: businesses, 
    isLoading: businessesLoading, 
    error: businessesError,
    refetch: refetchBusinesses
  } = useQuery({
    queryKey: ['businesses', searchTerm, selectedCategory],
    queryFn: fetchBusinesses,
    meta: {
      onError: (error: Error) => {
        toast({
          title: "Error",
          description: `Failed to load businesses: ${error.message}`,
          variant: "destructive",
        });
      }
    }
  });

  const { 
    data: categories, 
    isLoading: categoriesLoading 
  } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
    meta: {
      onError: (error: Error) => {
        toast({
          title: "Error",
          description: `Failed to load categories: ${error.message}`,
          variant: "destructive",
        });
      }
    }
  });

  // Check if we need to populate sample data
  useEffect(() => {
    const checkForBusinesses = async () => {
      try {
        const { data, error } = await supabase
          .from('businesses')
          .select('id')
          .limit(1);
          
        if (error) {
          logger.error('Error checking for businesses:', error);
          return;
        }
        
        // If no businesses exist and we aren't loading, populate sample data
        if ((!data || data.length === 0) && !businessesLoading) {
          const success = await populateSampleBusinesses();
          if (success) {
            toast({
              title: "Sample Data Added",
              description: "Sample businesses have been added to the database",
              variant: "default",
            });
            // Refetch businesses after adding sample data
            refetchBusinesses();
          }
        }
      } catch (error) {
        logger.error('Error in checkForBusinesses:', error);
      }
    };
    
    checkForBusinesses();
  }, [businessesLoading, refetchBusinesses]);

  // Handle search
  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  // Handle category filter
  const handleCategoryChange = (categoryId: number | null) => {
    setSelectedCategory(categoryId);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">{t('business.title')}</h1>
      <p className="text-gray-600 mb-8">{t('business.subtitle')}</p>
      
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <div className="w-full md:w-1/3">
          <div className="sticky top-4">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4">{t('business.filter.title')}</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {t('business.filter.category')}
                    </label>
                    {categoriesLoading ? (
                      <p className="text-gray-500 text-sm">{t('general.loading')}</p>
                    ) : (
                      <CategoryFilter 
                        categories={categories as Category[]} 
                        selectedCategory={selectedCategory}
                        onChange={handleCategoryChange}
                      />
                    )}
                  </div>
                  
                  <SearchBar 
                    value={searchTerm}
                    onChange={handleSearch}
                    placeholder={t('search.searchBusinesses')}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <div className="w-full md:w-2/3">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">
              {businesses?.length} {t('business.title')}
            </h2>
            
            <div className="flex space-x-2">
              <Tabs value={view} onValueChange={(value) => setView(value as 'grid' | 'list' | 'map')}>
                <TabsList>
                  <TabsTrigger value="grid" title={t('business.view.grid')}>
                    <Grid className="h-4 w-4" />
                  </TabsTrigger>
                  <TabsTrigger value="list" title={t('business.view.list')}>
                    <List className="h-4 w-4" />
                  </TabsTrigger>
                  <TabsTrigger value="map" title={t('business.view.map')}>
                    <Map className="h-4 w-4" />
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
          
          {businessesLoading ? (
            <div className="text-center py-12">
              <p className="text-gray-500">{t('general.loading')}</p>
            </div>
          ) : businessesError ? (
            <div className="text-center py-12">
              <p className="text-red-500">Error loading businesses</p>
            </div>
          ) : businesses?.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">{t('business.filter.noResults')}</p>
            </div>
          ) : (
            <div>
              <TabsContent value="grid" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {businesses?.map((business) => (
                    <BusinessCard key={business.id} business={business} />
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="list" className="mt-0">
                <div className="space-y-4">
                  {businesses?.map((business) => (
                    <BusinessCard key={business.id} business={business} />
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="map" className="mt-0">
                <div className="bg-gray-100 rounded-lg h-96 flex items-center justify-center">
                  <p className="text-gray-500">Map view coming soon</p>
                </div>
              </TabsContent>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BusinessDirectory;
