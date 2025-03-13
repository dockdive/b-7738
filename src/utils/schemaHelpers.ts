
export const createWebPageSchema = (title: string, description: string, url: string) => {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": title,
    "description": description,
    "url": url
  };
};

export const createBusinessDirectorySchema = (
  name: string,
  description: string,
  url: string,
  businessCount: number
) => {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": name,
    "description": description,
    "url": url,
    "numberOfItems": businessCount,
    "itemListOrder": "Descending",
    "itemListElement": []
  };
};

export const createOrganizationSchema = (
  name: string,
  url: string,
  logo: string,
  description: string
) => {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": name,
    "url": url,
    "logo": logo,
    "description": description
  };
};
