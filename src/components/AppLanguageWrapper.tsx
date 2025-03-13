
import React, { ReactNode, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface AppLanguageWrapperProps {
  children: ReactNode;
}

const AppLanguageWrapper: React.FC<AppLanguageWrapperProps> = ({ children }) => {
  const { language } = useLanguage();
  
  // Effect to set the language on the document element
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = ['ar', 'he', 'fa', 'ur', 'ps', 'ug'].includes(language) ? 'rtl' : 'ltr';
  }, [language]);
  
  return <>{children}</>;
};

export default AppLanguageWrapper;
