
import React from 'react';
import { useEffect, useRef, useState } from 'react';

// Define prop types
interface BusinessLocationMapProps {
  latitude?: number | null;
  longitude?: number | null;
  businessName?: string;
  address?: string;
  className?: string;
}

const BusinessLocationMap: React.FC<BusinessLocationMapProps> = ({
  latitude,
  longitude,
  businessName = 'Business Location',
  address = '',
  className = 'h-72 w-full rounded-lg overflow-hidden'
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    // Don't attempt to create a map if we don't have coordinates
    if (!latitude || !longitude || !mapRef.current) return;

    // Use a dynamic import to load Leaflet only when needed
    const loadMap = async () => {
      try {
        // Dynamically load Leaflet scripts and CSS
        const L = await import('leaflet');
        
        // Load CSS
        if (!document.querySelector('link[href*="leaflet.css"]')) {
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
          link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
          link.crossOrigin = '';
          document.head.appendChild(link);
        }
        
        console.log("Creating map with coordinates:", latitude, longitude);
        
        // Initialize the map only once
        if (!mapLoaded) {
          // Create the map instance
          const map = L.map(mapRef.current).setView([latitude, longitude], 15);
          
          // Add the OpenStreetMap tile layer
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          }).addTo(map);
          
          // Add a marker for the business location
          const marker = L.marker([latitude, longitude]).addTo(map);
          
          // Add a popup with business info
          if (businessName || address) {
            const popupContent = `
              <strong>${businessName}</strong>
              ${address ? `<br>${address}` : ''}
            `;
            marker.bindPopup(popupContent).openPopup();
          }
          
          setMapLoaded(true);
          
          // Clean up the map when component unmounts
          return () => {
            map.remove();
          };
        }
      } catch (error) {
        console.error("Error loading map:", error);
      }
    };
    
    loadMap();
  }, [latitude, longitude, businessName, address, mapLoaded]);

  // Display a placeholder if no coordinates
  if (!latitude || !longitude) {
    return (
      <div className={`${className} bg-gray-100 flex items-center justify-center text-gray-500`}>
        <p>No location data available</p>
      </div>
    );
  }

  return <div ref={mapRef} className={className} />;
};

export default BusinessLocationMap;
