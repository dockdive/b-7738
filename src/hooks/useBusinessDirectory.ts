
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchBusinesses, fetchCategories } from '@/services/apiService';
import { Business, Category } from '@/types';

export const useBusinessDirectory = () => {
  const [view, setView] = useState<'grid' | 'list' | 'map'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [filteredBusinesses, setFilteredBusinesses] = useState<Business[]>([]);
  
  // Fetch all businesses
  const { 
    data: businesses,
    isLoading: businessesLoading,
    error: businessesError
  } = useQuery({
    queryKey: ['businesses'],
    queryFn: () => fetchBusinesses()
  });
  
  // Fetch all categories
  const {
    data: categories,
    isLoading: categoriesLoading
  } = useQuery({
    queryKey: ['categories'],
    queryFn: () => fetchCategories()
  });
  
  // Filter businesses based on search term and selected category
  useEffect(() => {
    if (businesses) {
      let filtered = [...businesses];
      
      // Filter by search term - improve search to check multiple fields
      if (searchTerm.trim() !== '') {
        const terms = searchTerm.toLowerCase().split(' ');
        filtered = filtered.filter(business => {
          const searchFields = [
            business.name || '',
            business.description || '',
            business.city || '',
            business.country || '',
            ...(business.services || [])
          ].map(field => String(field).toLowerCase());
          
          // Check if ANY of the terms match ANY of the fields
          return terms.some(term => 
            searchFields.some(field => field.includes(term))
          );
        });
      }
      
      // Filter by category
      if (selectedCategory !== null) {
        filtered = filtered.filter(business => 
          business.category_id === selectedCategory
        );
      }
      
      setFilteredBusinesses(filtered);
    }
  }, [businesses, searchTerm, selectedCategory]);
  
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
  };
  
  return {
    businesses: filteredBusinesses,
    categories: categories || [],
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
