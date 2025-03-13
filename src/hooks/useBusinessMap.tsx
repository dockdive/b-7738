
import React from 'react';
import BusinessLocationMap from '../components/business/BusinessLocationMap';

interface BusinessLocation {
  latitude?: number | null;
  longitude?: number | null;
  name?: string;
  address?: string;
}

export const useBusinessMap = () => {
  const renderBusinessMap = (business: BusinessLocation | null, className?: string) => {
    if (!business) return null;
    
    const { latitude, longitude, name } = business;
    
    // Format address from business object
    const formatAddress = (business: BusinessLocation) => {
      const parts = [
        business.address,
        // Add any other address parts if available in your business object
      ].filter(Boolean);
      
      return parts.join(', ');
    };
    
    return (
      <BusinessLocationMap
        latitude={latitude}
        longitude={longitude}
        businessName={name}
        address={formatAddress(business)}
        className={className}
      />
    );
  };
  
  return { renderBusinessMap };
};

export default useBusinessMap;
