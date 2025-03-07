
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from '@/hooks/useTranslation';
import { Sailboat, Menu, X, User, LogOut } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

const Header = () => {
  const { user, signOut } = useAuth();
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <Sailboat className="h-8 w-8 text-primary" />
          <span className="text-xl font-semibold">{t('general.appName')}</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-gray-700 hover:text-primary transition-colors">
            {t('navigation.home')}
          </Link>
          <Link to="/businesses" className="text-gray-700 hover:text-primary transition-colors">
            {t('navigation.businesses')}
          </Link>
          <Link to="/about" className="text-gray-700 hover:text-primary transition-colors">
            {t('navigation.about')}
          </Link>
          <Link to="/contact" className="text-gray-700 hover:text-primary transition-colors">
            {t('navigation.contact')}
          </Link>
          
          <a 
            href="https://dockdive.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <Sailboat className="mr-1 h-4 w-4" />
            {t('navigation.sellYourBoat')}
          </a>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="ml-2">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link to="/profile">{t('navigation.profile')}</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/dashboard">{t('navigation.dashboard')}</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/my-businesses">{t('navigation.myBusinesses')}</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut}>
                  <LogOut className="h-4 w-4 mr-2" />
                  {t('auth.signOut')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex space-x-2">
              <Button asChild variant="ghost" size="sm">
                <Link to="/auth?mode=signin">{t('auth.signIn')}</Link>
              </Button>
              <Button asChild size="sm">
                <Link to="/auth?mode=signup">{t('auth.signUp')}</Link>
              </Button>
            </div>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button onClick={toggleMenu} className="md:hidden text-gray-600">
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden py-4 px-4 bg-white shadow-md">
          <nav className="flex flex-col space-y-4">
            <Link 
              to="/" 
              className="text-gray-700 hover:text-primary py-2" 
              onClick={closeMenu}
            >
              {t('navigation.home')}
            </Link>
            <Link 
              to="/businesses" 
              className="text-gray-700 hover:text-primary py-2" 
              onClick={closeMenu}
            >
              {t('navigation.businesses')}
            </Link>
            <Link 
              to="/about" 
              className="text-gray-700 hover:text-primary py-2" 
              onClick={closeMenu}
            >
              {t('navigation.about')}
            </Link>
            <Link 
              to="/contact" 
              className="text-gray-700 hover:text-primary py-2" 
              onClick={closeMenu}
            >
              {t('navigation.contact')}
            </Link>
            
            <a 
              href="https://dockdive.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center text-blue-600 hover:text-blue-800 py-2"
              onClick={closeMenu}
            >
              <Sailboat className="mr-2 h-4 w-4" />
              {t('navigation.sellYourBoat')}
            </a>

            {user ? (
              <>
                <Link 
                  to="/profile" 
                  className="text-gray-700 hover:text-primary py-2" 
                  onClick={closeMenu}
                >
                  {t('navigation.profile')}
                </Link>
                <Link 
                  to="/dashboard" 
                  className="text-gray-700 hover:text-primary py-2" 
                  onClick={closeMenu}
                >
                  {t('navigation.dashboard')}
                </Link>
                <Link 
                  to="/my-businesses" 
                  className="text-gray-700 hover:text-primary py-2" 
                  onClick={closeMenu}
                >
                  {t('navigation.myBusinesses')}
                </Link>
                <button 
                  onClick={() => {
                    signOut();
                    closeMenu();
                  }} 
                  className="flex items-center text-red-600 hover:text-red-800 py-2"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  {t('auth.signOut')}
                </button>
              </>
            ) : (
              <div className="flex flex-col space-y-2">
                <Button asChild variant="outline" onClick={closeMenu}>
                  <Link to="/auth?mode=signin">{t('auth.signIn')}</Link>
                </Button>
                <Button asChild onClick={closeMenu}>
                  <Link to="/auth?mode=signup">{t('auth.signUp')}</Link>
                </Button>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
