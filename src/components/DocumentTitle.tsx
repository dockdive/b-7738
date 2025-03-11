
import { useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface DocumentTitleProps {
  title: string;
  description?: string;
  translationPrefix?: string;
}

const DocumentTitle = ({ title, description, translationPrefix }: DocumentTitleProps) => {
  const { language, t } = useLanguage();
  
  useEffect(() => {
    let translatedTitle = title;
    let translatedDescription = description;
    
    // If a translation prefix is provided, try to translate the title and description
    if (translationPrefix) {
      const titleKey = `${translationPrefix}.title`;
      const descriptionKey = `${translationPrefix}.subtitle`;
      
      const translatedTitleValue = t(titleKey);
      if (translatedTitleValue !== titleKey) {
        translatedTitle = translatedTitleValue;
      }
      
      if (description) {
        const translatedDescriptionValue = t(descriptionKey);
        if (translatedDescriptionValue !== descriptionKey) {
          translatedDescription = translatedDescriptionValue;
        }
      }
    }
    
    // Update document title
    document.title = `${translatedTitle} | Maritime Directory`;
    
    // Update meta description if provided
    if (translatedDescription) {
      let metaDescription = document.querySelector('meta[name="description"]');
      
      if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.setAttribute('name', 'description');
        document.head.appendChild(metaDescription);
      }
      
      metaDescription.setAttribute('content', translatedDescription);
    }
    
    // Update language attribute
    document.documentElement.lang = language;
    
  }, [title, description, language, translationPrefix, t]);
  
  return null;
};

export default DocumentTitle;
