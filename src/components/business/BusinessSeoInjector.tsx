
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import BusinessSeoWrapper from './BusinessSeoWrapper';
import { adaptBusinessData } from '@/utils/businessDataAdapter';

interface BusinessSeoInjectorProps {
  children: React.ReactNode;
}

/**
 * This component automatically injects SEO elements for business detail pages.
 * It can be added to Layout.tsx to enable SEO without modifying protected BusinessDetail.tsx
 */
const BusinessSeoInjector: React.FC<BusinessSeoInjectorProps> = ({ children }) => {
  const { id } = useParams<{ id: string }>();
  const isBusinessDetailPage = !!id && window.location.pathname.includes('/businesses/');
  
  // Only fetch business data if we're on a business detail page
  const { data: business, isError } = useQuery({
    queryKey: ['business-seo', id],
    queryFn: async () => {
      if (!id || !isBusinessDetailPage) return null;
      
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('id', id)
        .maybeSingle(); // Use maybeSingle to handle missing data gracefully
        
      if (error) {
        console.error('Error fetching business for SEO:', error);
        return null;
      }
      
      // Adapt the data to ensure correct types, especially for JSONB fields
      return data ? adaptBusinessData(data) : null;
    },
    enabled: isBusinessDetailPage,
    retry: 1, // Only retry once
    staleTime: 10 * 60 * 1000, // 10 minutes cache for SEO data
  });
  
  useEffect(() => {
    // Update view count for the business if it exists
    const incrementViews = async () => {
      if (id && isBusinessDetailPage && business) {
        try {
          const { error } = await supabase
            .from('businesses')
            .update({ views: (business.views || 0) + 1 })
            .eq('id', id);
            
          if (error) {
            console.error('Error incrementing view count:', error);
          }
        } catch (error) {
          console.error('Error in view count update:', error);
        }
      }
    };
    
    incrementViews();
  }, [id, isBusinessDetailPage, business]);
  
  // If not on a business detail page, just render children
  if (!isBusinessDetailPage) {
    return <>{children}</>;
  }
  
  return (
    <BusinessSeoWrapper business={business}>
      {children}
    </BusinessSeoWrapper>
  );
};

export default BusinessSeoInjector;
