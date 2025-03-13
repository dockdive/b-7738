
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
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

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error getting session:', error);
          return;
        }
        
        console.log("Initial session:", data.session);
        setSession(data.session);
        setUser(data.session?.user || null);
      } catch (error) {
        console.error('Error in getInitialSession:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log(`Auth event: ${event}`, session);
        setSession(session);
        setUser(session?.user || null);
        setLoading(false);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    try {
      console.log("Attempting to sign in with:", email);
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        console.error("Sign in error:", error);
        toast.error(error.message);
        return { error };
      }
      
      console.log("Sign in successful:", data);
      toast.success('Signed in successfully');
      return { error: null };
    } catch (error: any) {
      console.error('Error signing in:', error);
      toast.error(error.message || 'Error signing in');
      return { error };
    }
  };

  // Sign up with email and password
  const signUp = async (email: string, password: string, metadata: UserMetadata = {}) => {
    try {
      console.log("Signing up user:", email, metadata);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
        },
      });

      if (error) {
        console.error("Sign up error:", error);
        toast.error(error.message);
        return { error };
      }

      console.log("Sign up successful:", data);

      // Create profile after signup
      if (data.user) {
        console.log("Creating profile for user:", data.user.id);
        
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([{ 
            id: data.user.id,
            first_name: metadata.first_name || '',
            last_name: metadata.last_name || '',
          }]);

        if (profileError) {
          console.error('Error creating profile:', profileError);
          // Don't return error here, as the signup was successful
        } else {
          console.log("Profile created successfully");
        }
      }
      
      toast.success('Signed up successfully. Please check your email for confirmation.');
      return { error: null, data };
    } catch (error: any) {
      console.error('Error signing up:', error);
      toast.error(error.message || 'Error signing up');
      return { error };
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      console.log("Signing out user");
      await supabase.auth.signOut();
      toast.success('Signed out successfully');
    } catch (error: any) {
      console.error('Error signing out:', error);
      toast.error(error.message || 'Error signing out');
    }
  };

  // Reset password
  const resetPassword = async (email: string) => {
    try {
      console.log("Sending password reset to:", email);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) {
        console.error("Password reset error:", error);
        toast.error(error.message);
        return { error };
      }

      toast.success('Password reset email sent');
      return { error: null };
    } catch (error: any) {
      console.error('Error resetting password:', error);
      toast.error(error.message || 'Error resetting password');
      return { error };
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
