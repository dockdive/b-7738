
import React from 'react';
import Header from './Header';
import Footer from './Footer';
import BusinessSeoInjector from '../business/BusinessSeoInjector';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <BusinessSeoInjector>
        <main className="flex-grow container mx-auto px-4 py-8 max-w-screen-xl">
          {children}
        </main>
      </BusinessSeoInjector>
      <Footer />
    </div>
  );
};

export default Layout;
