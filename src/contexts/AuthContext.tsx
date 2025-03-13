
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, supabaseFallback } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
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
  const [usingFallback, setUsingFallback] = useState(false);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        // Try first with Supabase
        try {
          const { data, error } = await supabase.auth.getSession();
          if (error) throw error;
          
          setSession(data.session);
          setUser(data.session?.user || null);
          setUsingFallback(false);
          return;
        } catch (supabaseError) {
          console.error('Error getting session from Supabase:', supabaseError);
          
          // Fall back to local storage
          const { data } = await supabaseFallback.auth.getSession();
          setSession(data.session);
          setUser(data.session?.user || null);
          
          if (data.session) {
            setUsingFallback(true);
            toast.warning('Using offline mode. Some features may be limited.');
          }
        }
      } catch (error) {
        console.error('Error in getInitialSession:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const setupAuthListener = () => {
      try {
        const { data: authListener } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            console.log(`Auth event: ${event}`, session);
            setSession(session);
            setUser(session?.user || null);
            setLoading(false);
            setUsingFallback(false);
          }
        );
        
        return () => {
          authListener.subscription.unsubscribe();
        };
      } catch (error) {
        console.error('Error setting up Supabase auth listener, using fallback:', error);
        
        // Using fallback mechanism as there was an error with Supabase listener
        setUsingFallback(true);
        toast.warning('Using offline mode. Some features may be limited.');
        
        return () => {}; // No cleanup needed for the fallback
      }
    };

    const cleanupListener = setupAuthListener();
    return cleanupListener;
  }, []);

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      try {
        // Try Supabase first
        const { data, error } = await supabase.auth.signInWithPassword({ 
          email, 
          password 
        });
        
        if (error) throw error;
        
        toast.success('Signed in successfully');
        setUsingFallback(false);
        return { error: null };
      } catch (supabaseError: any) {
        console.error("Sign in error with Supabase:", supabaseError);
        
        // Try fallback
        const { data, error } = await supabaseFallback.auth.signInWithPassword({ 
          email, 
          password 
        });
        
        if (error) {
          toast.error(error.message || 'Failed to sign in. Please try again.');
          return { error };
        }
        
        toast.success('Signed in successfully (offline mode)');
        setUsingFallback(true);
        return { error: null };
      }
    } catch (error: any) {
      console.error('Unexpected error signing in:', error);
      toast.error(error.message || 'An unexpected error occurred during sign in');
      return { error };
    } finally {
      setLoading(false);
    }
  };

  // Sign up with email and password
  const signUp = async (email: string, password: string, metadata: UserMetadata = {}) => {
    try {
      setLoading(true);
      
      try {
        // Try Supabase first
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: metadata,
            emailRedirectTo: `${window.location.origin}/auth?redirect=profile`
          },
        });

        if (error) throw error;

        toast.success('Signed up successfully. Please check your email for confirmation.');
        setUsingFallback(false);
        return { error: null, data };
      } catch (supabaseError: any) {
        console.error("Sign up error with Supabase:", supabaseError);
        
        // Try fallback
        const { data, error } = await supabaseFallback.auth.signUp({
          email,
          password,
          options: { data: metadata }
        });
        
        if (error) {
          toast.error(error.message || 'Failed to sign up. Please try again.');
          return { error };
        }
        
        toast.success('Signed up successfully (offline mode)');
        setUsingFallback(true);
        return { error: null, data };
      }
    } catch (error: any) {
      console.error('Unexpected error signing up:', error);
      toast.error(error.message || 'An unexpected error occurred during sign up');
      return { error };
    } finally {
      setLoading(false);
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      setLoading(true);
      
      if (usingFallback) {
        await supabaseFallback.auth.signOut();
      } else {
        await supabase.auth.signOut();
      }
      
      toast.success('Signed out successfully');
    } catch (error: any) {
      console.error('Error signing out:', error);
      toast.error(error.message || 'Error signing out');
    } finally {
      setLoading(false);
    }
  };

  // Reset password
  const resetPassword = async (email: string) => {
    try {
      setLoading(true);
      
      if (usingFallback) {
        toast.error('Password reset is not available in offline mode');
        return { error: new Error('Password reset is not available in offline mode') };
      }
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) {
        console.error("Password reset error:", error);
        toast.error(error.message || 'Failed to send password reset email');
        return { error };
      }

      toast.success('Password reset email sent');
      return { error: null };
    } catch (error: any) {
      console.error('Error resetting password:', error);
      toast.error(error.message || 'An unexpected error occurred');
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
