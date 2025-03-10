
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { HomeIcon } from 'lucide-react';

const NotFound = () => {
  const { t } = useLanguage();

  return (
    <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center text-center">
      <h1 className="text-5xl font-bold text-gray-900 mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        {t('errors.pageNotFound', 'Page Not Found')}
      </h2>
      <p className="text-gray-600 max-w-md mb-8">
        {t('errors.pageNotFoundDescription', 
           'The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.')}
      </p>
      <div className="flex gap-4">
        <Link to="/">
          <Button className="flex items-center gap-2">
            <HomeIcon className="h-4 w-4" />
            {t('navigation.backToHome', 'Back to Home')}
          </Button>
        </Link>
        <Link to="/businesses">
          <Button variant="outline">
            {t('navigation.browseBusinesses', 'Browse Businesses')}
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
