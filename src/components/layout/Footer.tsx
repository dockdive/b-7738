
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white py-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">DockDive</h3>
            <p className="text-gray-300">
              The leading maritime business directory connecting boat owners with service providers.
            </p>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-4">{t('footer.categories')}</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/directory" className="text-gray-300 hover:text-white">
                  Marine Services
                </Link>
              </li>
              <li>
                <Link to="/directory" className="text-gray-300 hover:text-white">
                  Boat Sales
                </Link>
              </li>
              <li>
                <Link to="/directory" className="text-gray-300 hover:text-white">
                  Maintenance & Repair
                </Link>
              </li>
              <li>
                <Link to="/directory" className="text-gray-300 hover:text-white">
                  Marine Equipment
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-4">{t('footer.legal')}</h3>
            <ul className="space-y-2">
              <li>
                <a href="https://dockdive.com/terms" className="text-gray-300 hover:text-white">
                  {t('footer.terms')}
                </a>
              </li>
              <li>
                <a href="https://dockdive.com/privacy" className="text-gray-300 hover:text-white">
                  {t('footer.privacy')}
                </a>
              </li>
              <li>
                <a href="https://dockdive.com/cookies" className="text-gray-300 hover:text-white">
                  {t('footer.cookies')}
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <a href="https://dockdive.com/about" className="text-gray-300 hover:text-white">
                  {t('footer.aboutUs')}
                </a>
              </li>
              <li>
                <a href="https://dockdive.com/contact" className="text-gray-300 hover:text-white">
                  {t('footer.contactUs')}
                </a>
              </li>
              <li>
                <Link to="/faq" className="text-gray-300 hover:text-white">
                  {t('footer.faq')}
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            &copy; {currentYear} DockDive. {t('footer.allRightsReserved')}.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
