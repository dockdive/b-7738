
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Business } from '@/types';

interface BusinessCardProps {
  business: Business;
}

const BusinessCard = ({ business }: BusinessCardProps) => {
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

export default BusinessCard;
