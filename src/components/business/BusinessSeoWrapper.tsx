
import React from 'react';
import { Helmet } from 'react-helmet';

interface Business {
  id?: string;
  name?: string;
  description?: string;
  category?: string;
  subcategory?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postal_code?: string;
  latitude?: number | null;
  longitude?: number | null;
  phone?: string;
  email?: string;
  website?: string;
  logo_url?: string;
  cover_image_url?: string;
  founded_year?: number;
  employees_count?: number;
  rating?: number;
  reviews_count?: number;
  is_verified?: boolean;
  is_featured?: boolean;
  opening_hours?: Record<string, string> | null;
  services?: string[];
  [key: string]: any;
}

interface BusinessSeoWrapperProps {
  business: Business | null;
  children: React.ReactNode;
}

const BusinessSeoWrapper: React.FC<BusinessSeoWrapperProps> = ({ business, children }) => {
  if (!business) {
    return <>{children}</>;
  }

  const {
    name,
    description,
    category,
    address,
    city,
    state,
    country,
    phone,
    website,
    rating,
    reviews_count = 0,
    logo_url,
  } = business;

  const fullAddress = [address, city, state, country].filter(Boolean).join(', ');
  const businessTitle = name ? `${name} - Maritime Directory` : 'Business Details - Maritime Directory';
  const businessDescription = description || `View details about ${name || 'this maritime business'}, including services, contact information, and location.`;
  
  // Structured data for the business (LocalBusiness)
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: name || 'Maritime Business',
    description: description,
    image: logo_url || '',
    address: {
      '@type': 'PostalAddress',
      streetAddress: address || '',
      addressLocality: city || '',
      addressRegion: state || '',
      addressCountry: country || '',
    },
    telephone: phone || '',
    url: website || window.location.href,
    aggregateRating: rating ? {
      '@type': 'AggregateRating',
      ratingValue: rating,
      reviewCount: reviews_count,
    } : undefined,
    category: category || 'Maritime Business',
  };
  
  return (
    <>
      <Helmet>
        <title>{businessTitle}</title>
        <meta name="description" content={businessDescription} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="business.business" />
        <meta property="og:title" content={businessTitle} />
        <meta property="og:description" content={businessDescription} />
        <meta property="og:url" content={window.location.href} />
        {logo_url && <meta property="og:image" content={logo_url} />}
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={businessTitle} />
        <meta name="twitter:description" content={businessDescription} />
        {logo_url && <meta name="twitter:image" content={logo_url} />}
        
        {/* Add structured data */}
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
        
        {/* Canonical URL */}
        <link rel="canonical" href={window.location.href} />
      </Helmet>
      {children}
    </>
  );
};

export default BusinessSeoWrapper;
