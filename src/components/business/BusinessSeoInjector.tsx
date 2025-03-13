
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import BusinessSeoWrapper from './BusinessSeoWrapper';

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
  const { data: business } = useQuery({
    queryKey: ['business', id],
    queryFn: async () => {
      if (!id || !isBusinessDetailPage) return null;
      
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) {
        console.error('Error fetching business:', error);
        return null;
      }
      
      return data;
    },
    enabled: isBusinessDetailPage,
  });
  
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
