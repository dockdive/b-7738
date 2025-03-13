
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import logger from '@/services/loggerService';
import { useLanguage } from '@/contexts/LanguageContext';

interface AuthRequiredProps {
  children: React.ReactNode;
  redirectTo?: string;
}

/**
 * Component to protect routes that require authentication
 * Redirects to login if user is not authenticated
 */
const AuthRequired: React.FC<AuthRequiredProps> = ({ 
  children, 
  redirectTo = '/auth' 
}) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();

  useEffect(() => {
    // Skip redirect during initial loading
    if (loading) return;
    
    if (!user) {
      logger.info('User not authenticated, redirecting to login', { 
        from: location.pathname,
        redirectTo
      });
      
      toast.error(
        t('auth.authRequired') || 'Please log in to access this page'
      );
      
      navigate(redirectTo, { 
        state: { from: location.pathname }
      });
    }
  }, [user, loading, navigate, location.pathname, redirectTo, t]);

  // Show nothing while checking authentication
  if (loading) return null;
  
  // If authenticated, render children
  return user ? <>{children}</> : null;
};

export default AuthRequired;
