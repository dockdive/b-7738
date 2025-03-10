
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Business, BusinessStatus, Category } from '@/types';
import logger from '@/services/loggerService';
import { populateSampleBusinesses } from '@/services/testDataService';

export const useBusinessDirectory = () => {
  const [view, setView] = useState<'grid' | 'list' | 'map'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

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
    
    return (data || []).map(business => ({
      ...business,
      status: business.status as BusinessStatus
    }));
  };

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
        
        if ((!data || data.length === 0) && !businessesLoading) {
          const success = await populateSampleBusinesses();
          if (success) {
            toast({
              title: "Sample Data Added",
              description: "Sample businesses have been added to the database",
              variant: "default",
            });
            refetchBusinesses();
          }
        }
      } catch (error) {
        logger.error('Error in checkForBusinesses:', error);
      }
    };
    
    checkForBusinesses();
  }, [businessesLoading, refetchBusinesses]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const handleCategoryChange = (categoryId: number | null) => {
    setSelectedCategory(categoryId);
  };

  const handleViewChange = (value: string) => {
    setView(value as 'grid' | 'list' | 'map');
  };

  return {
    businesses,
    categories: categories as Category[],
    businessesLoading,
    categoriesLoading,
    businessesError,
    view,
    searchTerm,
    selectedCategory,
    handleSearch,
    handleCategoryChange,
    handleViewChange
  };
};
