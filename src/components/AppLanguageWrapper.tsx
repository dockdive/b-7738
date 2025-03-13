
import React from 'react';
import { LanguageAdapterProvider } from '@/hooks/useLanguageAdapter';
import { WikiAdapterProvider } from '@/hooks/useWikiAdapter';

interface AppLanguageWrapperProps {
  children: React.ReactNode;
}

const AppLanguageWrapper: React.FC<AppLanguageWrapperProps> = ({ children }) => {
  return (
    <LanguageAdapterProvider>
      <WikiAdapterProvider>
        {children}
      </WikiAdapterProvider>
    </LanguageAdapterProvider>
  );
};

export default AppLanguageWrapper;
