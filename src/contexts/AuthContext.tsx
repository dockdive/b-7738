import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, supabaseFallback } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import logger from '@/services/loggerService';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, metadata?: UserMetadata) => Promise<{ error: any, data?: any }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any }>;
}

interface UserMetadata {
  first_name?: string;
  last_name?: string;
  [key: string]: any;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usingFallback, setUsingFallback] = useState(false);

  useEffect(() => {
    const getInitialSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;
        setSession(data.session);
        setUser(data.session?.user || null);
        setUsingFallback(false);
      } catch (supabaseError) {
        logger.error('Supabase session fetch error:', supabaseError);
        setError('Failed to fetch session from Supabase');
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        logger.info(`Auth event: ${event}`, session);
        setSession(session);
        setUser(session?.user || null);
        setError(null);
      }
    );

    return () => authListener.subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      toast.success('Signed in successfully');
      return { error: null };
    } catch (error: any) {
      logger.error('Sign in error:', error);
      toast.error(error.message || 'Failed to sign in');
      setError(error.message || 'Unknown error');
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, metadata: UserMetadata = {}) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({ email, password, options: { data: metadata } });
      if (error) throw error;
      toast.success('Signed up successfully. Check your email for confirmation.');
      return { error: null, data };
    } catch (error: any) {
      logger.error('Sign up error:', error);
      toast.error(error.message || 'Failed to sign up');
      setError(error.message || 'Unknown error');
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
      toast.success('Signed out successfully');
      setUser(null);
      setSession(null);
    } catch (error: any) {
      logger.error('Sign out error:', error);
      toast.error(error.message || 'Failed to sign out');
      setError(error.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });
      if (error) throw error;
      toast.success('Password reset email sent');
      return { error: null };
    } catch (error: any) {
      logger.error('Password reset error:', error);
      toast.error(error.message || 'Failed to send password reset email');
      setError(error.message || 'Unknown error');
      return { error };
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, error, signIn, signUp, signOut, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
