
import { useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface DocumentTitleProps {
  title: string;
  description?: string;
}

const DocumentTitle = ({ title, description }: DocumentTitleProps) => {
  const { language } = useLanguage();
  
  useEffect(() => {
    // Update document title
    const previousTitle = document.title;
    document.title = `${title} | Maritime Directory`;
    
    // Update meta description if provided
    if (description) {
      let metaDescription = document.querySelector('meta[name="description"]');
      
      if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.setAttribute('name', 'description');
        document.head.appendChild(metaDescription);
      }
      
      metaDescription.setAttribute('content', description);
    }
    
    // Update language attribute
    document.documentElement.lang = language;
    
    return () => {
      document.title = previousTitle;
    };
  }, [title, description, language]);
  
  return null;
};

export default DocumentTitle;
