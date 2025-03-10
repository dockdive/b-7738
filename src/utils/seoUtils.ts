
/**
 * Generates structured data for a business listing
 */
export const generateBusinessStructuredData = (business: any) => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": business.name,
    "description": business.description,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": business.address,
      "addressLocality": business.city,
      "postalCode": business.zip,
      "addressCountry": business.country
    },
    "telephone": business.phone,
    "email": business.email,
    "url": business.website,
    "image": business.logo_url || business.images?.[0],
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": business.latitude,
      "longitude": business.longitude
    },
    "openingHours": business.opening_hours,
    "priceRange": business.price_range || "$$"
  };

  return JSON.stringify(structuredData);
};

/**
 * Adds structured data to the page
 */
export const addStructuredData = (data: string) => {
  // Remove any existing structured data
  const existingScript = document.getElementById('structured-data');
  if (existingScript) {
    existingScript.remove();
  }

  // Add the new structured data
  const script = document.createElement('script');
  script.id = 'structured-data';
  script.type = 'application/ld+json';
  script.text = data;
  document.head.appendChild(script);
};

/**
 * Updates the canonical URL
 */
export const updateCanonicalUrl = (path: string) => {
  // Base URL
  const baseUrl = 'https://yourdomain.com';
  const url = `${baseUrl}${path}`;
  
  // Look for existing canonical tag
  let canonical = document.querySelector('link[rel="canonical"]');
  
  if (!canonical) {
    // Create new canonical tag if it doesn't exist
    canonical = document.createElement('link');
    canonical.rel = 'canonical';
    document.head.appendChild(canonical);
  }
  
  // Update the href attribute
  canonical.setAttribute('href', url);
};

/**
 * Sets up alternate language tags for SEO
 */
export const setupAlternateLanguages = (path: string, supportedLanguages: string[]) => {
  // Base URL
  const baseUrl = 'https://yourdomain.com';
  
  // Remove existing alternate tags - now with proper typing
  const alternateTags = document.querySelectorAll('link[rel="alternate"][hreflang]');
  alternateTags.forEach((el: Element) => {
    if (el instanceof HTMLLinkElement) {
      el.remove();
    } else if (el.parentNode) {
      el.parentNode.removeChild(el);
    }
  });
  
  // Add alternate tags for each supported language
  supportedLanguages.forEach(lang => {
    const link = document.createElement('link');
    link.rel = 'alternate';
    link.hreflang = lang;
    link.href = `${baseUrl}/${lang}${path}`;
    document.head.appendChild(link);
  });
};
