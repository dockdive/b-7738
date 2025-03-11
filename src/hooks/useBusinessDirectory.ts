
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchBusinesses, fetchCategories } from '@/services/apiService';
import { Business, Category } from '@/types';

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
  
  // Fetch all businesses with improved error handling
  const { 
    data: businesses,
    isLoading: businessesLoading,
    error: businessesError,
    refetch: refetchBusinesses
  } = useQuery({
    queryKey: ['businesses', selectedCategory],
    queryFn: () => fetchBusinesses({ category_id: selectedCategory }),
    retry: 2,
    staleTime: 60000 // 1 minute
  });
  
  // Fetch all categories
  const {
    data: categories,
    isLoading: categoriesLoading,
    error: categoriesError
  } = useQuery({
    queryKey: ['categories'],
    queryFn: () => fetchCategories(),
    staleTime: 300000 // 5 minutes
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
  const handleViewChange = (value: string) => {
    setView(value as 'grid' | 'list' | 'map');
  };
  
  // Handle search term change
  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };
  
  // Handle category selection
  const handleCategoryChange = (categoryId: number | null) => {
    setSelectedCategory(categoryId);
    // Refetch businesses if category changes
    refetchBusinesses();
  };
  
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
