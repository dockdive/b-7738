
/**
 * Creates meta tags for SEO optimization
 * @param title The page title
 * @param description The page description
 * @param imageUrl Optional image URL for social sharing
 * @param type The page type (default: website)
 * @returns An object with meta tag properties
 */
export const createMetaTags = (
  title: string,
  description: string,
  imageUrl?: string,
  type: string = 'website'
) => {
  const baseUrl = window.location.origin;
  const url = window.location.href;
  
  return {
    title,
    description,
    
    // Open Graph tags for Facebook, etc.
    'og:title': title,
    'og:description': description,
    'og:url': url,
    'og:type': type,
    'og:image': imageUrl || `${baseUrl}/og-image.png`,
    
    // Twitter tags
    'twitter:card': 'summary_large_image',
    'twitter:title': title,
    'twitter:description': description,
    'twitter:image': imageUrl || `${baseUrl}/og-image.png`,
  };
};

/**
 * Creates structured data for a business
 * @param business The business object
 * @returns Structured data object ready to be stringified
 */
export const createBusinessStructuredData = (business: any) => {
  const { 
    name, 
    description, 
    address, 
    city, 
    state, 
    country, 
    postal_code, 
    phone, 
    email, 
    website, 
    latitude, 
    longitude, 
    rating, 
    reviews_count, 
    logo_url 
  } = business;
  
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: name || 'Maritime Business',
    description: description,
    image: logo_url,
    telephone: phone,
    email: email,
    url: website || window.location.href,
    address: {
      '@type': 'PostalAddress',
      streetAddress: address,
      addressLocality: city,
      addressRegion: state,
      postalCode: postal_code,
      addressCountry: country,
    },
    geo: latitude && longitude ? {
      '@type': 'GeoCoordinates',
      latitude,
      longitude,
    } : undefined,
    aggregateRating: rating ? {
      '@type': 'AggregateRating',
      ratingValue: rating,
      reviewCount: reviews_count || 0,
    } : undefined,
  };
};

/**
 * Creates structured data for a business listing page
 * @returns Structured data object for a business directory
 */
export const createDirectoryStructuredData = () => {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Maritime Business Directory',
    description: 'Directory of maritime businesses worldwide',
    url: window.location.href,
  };
};
