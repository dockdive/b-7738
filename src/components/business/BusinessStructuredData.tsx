
import React from 'react';
import { Helmet } from 'react-helmet';

interface BusinessStructuredDataProps {
  name: string;
  description: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  phone?: string;
  email?: string;
  website?: string;
  openingHours?: Record<string, string>;
  categories?: string[];
  rating?: number;
  reviewCount?: number;
  imageUrl?: string;
}

const BusinessStructuredData: React.FC<BusinessStructuredDataProps> = ({
  name,
  description,
  address,
  phone,
  email,
  website,
  openingHours,
  categories,
  rating,
  reviewCount,
  imageUrl
}) => {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name,
    description,
    ...(address && {
      address: {
        '@type': 'PostalAddress',
        ...(address.street && { streetAddress: address.street }),
        ...(address.city && { addressLocality: address.city }),
        ...(address.state && { addressRegion: address.state }),
        ...(address.zipCode && { postalCode: address.zipCode }),
        ...(address.country && { addressCountry: address.country })
      }
    }),
    ...(phone && { telephone: phone }),
    ...(email && { email }),
    ...(website && { url: website }),
    ...(openingHours && { openingHours: Object.values(openingHours) }),
    ...(categories && { category: categories.join(', ') }),
    ...(rating && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: rating.toString(),
        reviewCount: (reviewCount || 0).toString()
      }
    }),
    ...(imageUrl && { image: imageUrl })
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
};

export default BusinessStructuredData;
