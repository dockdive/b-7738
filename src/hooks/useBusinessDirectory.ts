
import { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchBusinesses, fetchCategories } from '@/services/apiService';
import { Business, Category } from '@/types';
import logger from '@/services/loggerService';

export const useBusinessDirectory = (initialCategoryId: number | null = null) => {
  const [view, setView] = useState<'grid' | 'list' | 'map'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(initialCategoryId);
  const [filteredBusinesses, setFilteredBusinesses] = useState<Business[]>([]);
  
  // Update selectedCategory when initialCategoryId changes
  useEffect(() => {
    if (initialCategoryId !== null) {
      setSelectedCategory(initialCategoryId);
    }
  }, [initialCategoryId]);
  
  // Fetch all businesses with improved error handling and shorter timeout
  const { 
    data: businesses,
    isLoading: businessesLoading,
    error: businessesError,
    refetch: refetchBusinesses
  } = useQuery({
    queryKey: ['businesses', selectedCategory],
    queryFn: async () => {
      try {
        logger.info('Fetching businesses for category:', selectedCategory);
        const data = await fetchBusinesses({ category_id: selectedCategory });
        logger.info(`Fetched ${data?.length || 0} businesses`);
        return data;
      } catch (error) {
        logger.error('Error fetching businesses:', error);
        throw error;
      }
    },
    retry: 1,
    staleTime: 60000, // 1 minute
    refetchOnWindowFocus: false,
    gcTime: 300000 // 5 minutes
  });
  
  // Fetch all categories
  const {
    data: categories,
    isLoading: categoriesLoading,
    error: categoriesError
  } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      try {
        logger.info('Fetching categories');
        const data = await fetchCategories();
        logger.info(`Fetched ${data?.length || 0} categories`);
        return data;
      } catch (error) {
        logger.error('Error fetching categories:', error);
        throw error;
      }
    },
    staleTime: 300000, // 5 minutes
    retry: 1,
    refetchOnWindowFocus: false
  });
  
  // Filter businesses based on search term and selected category
  useEffect(() => {
    if (businesses) {
      let filtered = [...businesses];
      
      // Filter by search term
      if (searchTerm.trim() !== '') {
        const terms = searchTerm.toLowerCase().split(' ');
        filtered = filtered.filter(business => {
          const searchFields = [
            business.name || '',
            business.description || '',
            business.city || '',
            business.state || '',
            business.country || '',
            ...(business.services || [])
          ].map(field => String(field).toLowerCase());
          
          // Check if ANY of the terms match ANY of the fields
          return terms.some(term => 
            searchFields.some(field => field.includes(term))
          );
        });
      }
      
      setFilteredBusinesses(filtered);
    } else {
      setFilteredBusinesses([]);
    }
  }, [businesses, searchTerm]);
  
  // Handle view change
  const handleViewChange = useCallback((value: string) => {
    setView(value as 'grid' | 'list' | 'map');
  }, []);
  
  // Handle search term change
  const handleSearch = useCallback((value: string) => {
    setSearchTerm(value);
  }, []);
  
  // Handle category selection
  const handleCategoryChange = useCallback((categoryId: number | null) => {
    setSelectedCategory(categoryId);
  }, []);
  
  // Force refetch to update data
  useEffect(() => {
    if (selectedCategory !== initialCategoryId && initialCategoryId !== null) {
      logger.info('Category changed, refetching businesses');
      refetchBusinesses();
    }
  }, [selectedCategory, initialCategoryId, refetchBusinesses]);
  
  return {
    businesses: filteredBusinesses,
    categories: categories || [],
    businessesLoading,
    categoriesLoading,
    businessesError,
    categoriesError,
    view,
    searchTerm,
    selectedCategory,
    handleSearch,
    handleCategoryChange,
    handleViewChange,
    refetchBusinesses
  };
};
