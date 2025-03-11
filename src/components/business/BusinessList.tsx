
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { TabsContent } from '@/components/ui/tabs';
import BusinessCard from '@/components/business/BusinessCard';
import { Business } from '@/types';
import { AlertCircle, Loader2 } from 'lucide-react';
import logger from '@/services/loggerService';

interface BusinessListProps {
  businesses: Business[] | undefined;
  isLoading: boolean;
  error: Error | null;
  view: 'grid' | 'list' | 'map';
}

const BusinessList = ({ businesses, isLoading, error, view }: BusinessListProps) => {
  const { t } = useLanguage();

  // Log the current state for debugging
  React.useEffect(() => {
    logger.debug('BusinessList render state:', { 
      isLoading, 
      hasError: !!error, 
      businessCount: businesses?.length 
    });
  }, [businesses, isLoading, error]);

  if (isLoading) {
    return (
      <div className="text-center py-12" data-testid="business-loading">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
        <p className="text-gray-500">{t('general.loading') || 'Loading...'}</p>
      </div>
    );
  }

  if (error) {
    logger.error('Business list error:', error);
    return (
      <div className="text-center py-12" data-testid="business-error">
        <AlertCircle className="h-8 w-8 mx-auto mb-4 text-red-500" />
        <p className="text-red-500 mb-2">{t('general.error') || 'An error occurred'}</p>
        <p className="text-sm text-red-400">{error.message}</p>
      </div>
    );
  }

  if (!businesses || businesses.length === 0) {
    return (
      <div className="text-center py-12" data-testid="business-empty">
        <p className="text-gray-500">{t('business.filter.noResults') || 'No results found'}</p>
      </div>
    );
  }

  return (
    <div data-testid="business-content">
      <TabsContent value="grid" className="mt-0">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {businesses.map((business) => (
            <BusinessCard key={business.id} business={business} />
          ))}
        </div>
      </TabsContent>
      
      <TabsContent value="list" className="mt-0">
        <div className="space-y-4">
          {businesses.map((business) => (
            <BusinessCard key={business.id} business={business} />
          ))}
        </div>
      </TabsContent>
      
      <TabsContent value="map" className="mt-0">
        <div className="bg-gray-100 rounded-lg h-96 flex items-center justify-center">
          <p className="text-gray-500">{t('business.mapViewComingSoon') || 'Map view coming soon'}</p>
        </div>
      </TabsContent>
    </div>
  );
};

export default BusinessList;
