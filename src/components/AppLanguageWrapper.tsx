
import React from 'react';
import { LanguageAdapterProvider } from '@/hooks/useLanguageAdapter';

interface AppLanguageWrapperProps {
  children: React.ReactNode;
}

const AppLanguageWrapper: React.FC<AppLanguageWrapperProps> = ({ children }) => {
  return (
    <LanguageAdapterProvider>
      {children}
    </LanguageAdapterProvider>
  );
};

export default AppLanguageWrapper;
