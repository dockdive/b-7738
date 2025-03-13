
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useBusinessMap } from '@/hooks/useBusinessMap';
import LoadingIndicator from '@/components/ui/loading-indicator';

const BusinessMapInjector = () => {
  const { id } = useParams<{ id: string }>();
  const [mapRendered, setMapRendered] = useState(false);
  const { renderBusinessMap } = useBusinessMap();
  
  // Fetch business data for the map
  const { data: business, isLoading, error } = useQuery({
    queryKey: ['business-map', id],
    queryFn: async () => {
      if (!id) return null;
      
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('id', id)
        .maybeSingle(); // Use maybeSingle instead of single to handle missing businesses
        
      if (error) {
        console.error('Error fetching business for map:', error);
        return null;
      }
      
      return data;
    },
    enabled: !!id,
    retry: 1, // Only retry once to avoid excessive loading
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  useEffect(() => {
    // Only attempt to render if we have coordinates
    if (business && business.latitude && business.longitude && !mapRendered) {
      try {
        const mapContainer = document.getElementById('business-map-container');
        if (mapContainer) {
          mapContainer.innerHTML = ''; // Clear any previous map
          setMapRendered(true);
        }
      } catch (error) {
        console.error('Error preparing map container:', error);
      }
    }
  }, [business, mapRendered]);

  // Early return if no business or no location data
  if (isLoading) {
    return (
      <div id="business-map-container" className="my-4 h-64 bg-gray-100 rounded-lg flex items-center justify-center">
        <LoadingIndicator message="Loading map..." />
      </div>
    );
  }

  if (error || !business || (!business.latitude && !business.longitude)) {
    return (
      <div id="business-map-container" className="my-4 h-64 bg-gray-100 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">No location information available</p>
      </div>
    );
  }

  // Render the business map
  return (
    <div id="business-map-container" className="my-6 h-[400px] rounded-lg border">
      {renderBusinessMap(business, "h-full w-full rounded-lg")}
    </div>
  );
};

export default BusinessMapInjector;
