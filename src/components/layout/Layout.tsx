
import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import logger from "@/services/loggerService";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { t } = useLanguage();
  
  // Error boundary to prevent blank pages if child components fail
  const [hasError, setHasError] = React.useState(false);
  
  React.useEffect(() => {
    // Log layout render for debugging
    logger.debug("Layout component rendered");
    
    // Reset error state on mount
    setHasError(false);
  }, []);
  
  // Handle errors in children components
  if (hasError) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center p-8">
            <h1 className="text-2xl font-bold text-red-600 mb-4">
              {t("general.error")}
            </h1>
            <p className="mb-6">
              {t("general.errorMessage")}
            </p>
            <button 
              onClick={() => {
                setHasError(false);
                window.location.reload();
              }}
              className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
            >
              {t("general.retry")}
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        {React.Children.map(children, child => {
          if (!React.isValidElement(child)) return null;
          
          return React.cloneElement(child as React.ReactElement, {
            onError: () => {
              logger.error("Error in child component of Layout");
              setHasError(true);
            }
          });
        })}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
