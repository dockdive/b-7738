
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { TabsContent } from '@/components/ui/tabs';
import BusinessCard from '@/components/business/BusinessCard';
import { Business } from '@/types';
import { AlertCircle, Loader2 } from 'lucide-react';

interface BusinessListProps {
  businesses: Business[] | undefined;
  isLoading: boolean;
  error: Error | null;
  view: 'grid' | 'list' | 'map';
}

const BusinessList = ({ businesses, isLoading, error, view }: BusinessListProps) => {
  const { t } = useLanguage();

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
        <p className="text-gray-500">{t('general.loading')}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-8 w-8 mx-auto mb-4 text-red-500" />
        <p className="text-red-500">{error.message || t('general.error')}</p>
      </div>
    );
  }

  if (!businesses || businesses.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">{t('business.filter.noResults')}</p>
      </div>
    );
  }

  return (
    <div>
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
          <p className="text-gray-500">{t('business.mapViewComingSoon')}</p> {/* Fixed: removed second parameter */}
        </div>
      </TabsContent>
    </div>
  );
};

export default BusinessList;
