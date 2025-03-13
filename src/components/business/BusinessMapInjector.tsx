
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';

/**
 * This component injects the map into the BusinessDetail page without directly 
 * modifying the protected BusinessDetail.tsx file.
 */
const BusinessMapInjector: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isBusinessDetailPage = !!id && window.location.pathname.includes('/businesses/');

  useEffect(() => {
    if (!isBusinessDetailPage) return;

    // Function to inject the map
    const injectMap = () => {
      // Find the container where we want to inject the map
      const contactInfoSection = document.querySelector('[data-section="contact-info"]');
      const locationSection = document.querySelector('[data-section="location"]');
      const detailsContainer = document.querySelector('[data-container="business-details"]');
      
      // Target container - try to find the most appropriate location
      const targetContainer = locationSection || contactInfoSection || detailsContainer;
      
      if (!targetContainer) {
        console.log('Could not find a suitable container for the map');
        return;
      }
      
      // Check if map already exists to avoid duplicates
      if (document.getElementById('business-location-map')) {
        return;
      }
      
      // Create map container
      const mapContainer = document.createElement('div');
      mapContainer.id = 'business-location-map';
      mapContainer.className = 'mt-4 rounded-lg overflow-hidden shadow-md';
      mapContainer.style.height = '300px';
      mapContainer.style.width = '100%';
      
      // Insert the map container
      targetContainer.appendChild(mapContainer);
      
      // Get business coordinates from the page
      // This assumes the coordinates are stored in data attributes or can be extracted from the page
      const latElement = document.querySelector('[data-lat]');
      const lngElement = document.querySelector('[data-lng]');
      
      const lat = latElement?.getAttribute('data-lat') || null;
      const lng = lngElement?.getAttribute('data-lng') || null;
      
      if (!lat || !lng) {
        mapContainer.innerHTML = '<div class="flex items-center justify-center h-full bg-gray-100 text-gray-500">No location data available</div>';
        return;
      }
      
      // Dynamically load Leaflet and create the map
      import('leaflet').then((L) => {
        // Load CSS if not already loaded
        if (!document.querySelector('link[href*="leaflet.css"]')) {
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
          link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
          link.crossOrigin = '';
          document.head.appendChild(link);
        }
        
        // Initialize map
        const map = L.map(mapContainer).setView([parseFloat(lat), parseFloat(lng)], 15);
        
        // Add tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
        
        // Add marker
        const marker = L.marker([parseFloat(lat), parseFloat(lng)]).addTo(map);
        
        // Extract business name for popup
        const businessName = document.querySelector('h1')?.textContent || 'Business Location';
        
        // Get address from the page if available
        const addressElement = document.querySelector('[data-address]');
        const address = addressElement?.getAttribute('data-address') || '';
        
        // Add popup
        const popupContent = `
          <strong>${businessName}</strong>
          ${address ? `<br>${address}` : ''}
        `;
        marker.bindPopup(popupContent).openPopup();
      }).catch(error => {
        console.error('Error loading Leaflet:', error);
        mapContainer.innerHTML = '<div class="flex items-center justify-center h-full bg-gray-100 text-gray-500">Error loading map</div>';
      });
    };

    // Try to inject map after a short delay to ensure the page has loaded
    setTimeout(injectMap, 1000);
    
    // Also attempt to inject when DOM changes, as the page may load dynamically
    const observer = new MutationObserver((mutations) => {
      injectMap();
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    
    return () => {
      observer.disconnect();
    };
  }, [id, isBusinessDetailPage]);

  // This component doesn't render anything visible
  return null;
};

export default BusinessMapInjector;
