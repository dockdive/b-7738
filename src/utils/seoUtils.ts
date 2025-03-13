
/**
 * SEO utilities for managing meta tags, title, and OG data in the application
 */

interface OpenGraphData {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
}

/**
 * Sets the document title with a consistent format
 */
export const setDocumentTitle = (title: string, siteName = "DockDive"): void => {
  document.title = title ? `${title} | ${siteName}` : siteName;
};

/**
 * Updates meta description
 */
export const setMetaDescription = (description: string): void => {
  let metaDescription = document.querySelector('meta[name="description"]');
  
  if (!metaDescription) {
    metaDescription = document.createElement('meta');
    metaDescription.setAttribute('name', 'description');
    document.head.appendChild(metaDescription);
  }
  
  metaDescription.setAttribute('content', description);
};

/**
 * Updates canonical URL
 */
export const setCanonicalUrl = (url: string): void => {
  let canonicalLink = document.querySelector('link[rel="canonical"]');
  
  if (!canonicalLink) {
    canonicalLink = document.createElement('link');
    canonicalLink.setAttribute('rel', 'canonical');
    document.head.appendChild(canonicalLink);
  }
  
  canonicalLink.setAttribute('href', url);
};

/**
 * Updates Open Graph and Twitter meta tags
 */
export const setOpenGraphData = (data: OpenGraphData): void => {
  const tags = [
    { property: 'og:title', content: data.title },
    { property: 'og:description', content: data.description },
    { property: 'og:image', content: data.image },
    { property: 'og:url', content: data.url },
    { property: 'og:type', content: data.type || 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: data.title },
    { name: 'twitter:description', content: data.description },
    { name: 'twitter:image', content: data.image }
  ];
  
  tags.forEach(tag => {
    if (!tag.content) return;
    
    let metaTag;
    if (tag.property) {
      metaTag = document.querySelector(`meta[property="${tag.property}"]`);
      if (!metaTag) {
        metaTag = document.createElement('meta');
        metaTag.setAttribute('property', tag.property);
        document.head.appendChild(metaTag);
      }
    } else if (tag.name) {
      metaTag = document.querySelector(`meta[name="${tag.name}"]`);
      if (!metaTag) {
        metaTag = document.createElement('meta');
        metaTag.setAttribute('name', tag.name);
        document.head.appendChild(metaTag);
      }
    }
    
    if (metaTag) {
      metaTag.setAttribute('content', tag.content);
    }
  });
};

/**
 * Sets up alternate language tags for internationalization
 */
export const setupAlternateLanguages = (currentLang: string): void => {
  // Base URL
  const baseUrl = 'https://yourdomain.com';
  
  // Remove existing alternate tags - now with proper type handling
  const alternateTags = document.querySelectorAll('link[rel="alternate"][hreflang]');
  alternateTags.forEach(el => {
    if (el instanceof HTMLLinkElement) {
      el.remove();
    } else if (el.parentNode) {
      // Fallback for browsers where HTMLLinkElement might not be recognized
      el.parentNode.removeChild(el);
    }
  });
  
  // Supported languages
  const supportedLangs = ['en', 'nl'];
  
  // Create new alternate language tags
  supportedLangs.forEach(lang => {
    const link = document.createElement('link');
    link.rel = 'alternate';
    link.hreflang = lang;
    link.href = `${baseUrl}${lang === 'en' ? '' : `/${lang}`}${window.location.pathname}`;
    document.head.appendChild(link);
  });
  
  // Set x-default (usually points to English or a language selector page)
  const defaultLink = document.createElement('link');
  defaultLink.rel = 'alternate';
  defaultLink.hreflang = 'x-default';
  defaultLink.href = `${baseUrl}${window.location.pathname}`;
  document.head.appendChild(defaultLink);
};

/**
 * Set page metadata all at once - convenience function
 */
export const setPageMetadata = (title: string, description: string, url: string, image?: string): void => {
  setDocumentTitle(title);
  setMetaDescription(description);
  setCanonicalUrl(url);
  setOpenGraphData({
    title,
    description,
    url,
    image: image || 'https://yourdomain.com/default-og-image.jpg'
  });
};
