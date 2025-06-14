
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface Profile {
  id: string;
  user_type: 'startup' | 'investor';
  email: string;
  name: string;
  company: string;
  sector: string;
  stage: string;
  ticket_size: string;
  description: string;
  location: string;
}

interface AuthContextType {
  user: User | null;
  userProfile: Profile | null;
  loading: boolean;
  signUp: (email: string, password: string, userData: any) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('AuthProvider: Setting up auth state listener');
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('AuthProvider: Auth state changed', { event, userId: session?.user?.id });
        
        if (session?.user) {
          setUser(session.user);
          // Fetch user profile
          setTimeout(async () => {
            try {
              const { data: profile, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single();

              if (error) {
                console.error('AuthProvider: Error fetching profile:', error);
              } else {
                console.log('AuthProvider: Profile fetched successfully');
                setUserProfile(profile);
              }
            } catch (err) {
              console.error('AuthProvider: Profile fetch error:', err);
            } finally {
              setLoading(false);
            }
          }, 0);
        } else {
          console.log('AuthProvider: No user session, clearing state');
          setUser(null);
          setUserProfile(null);
          setLoading(false);
        }
      }
    );

    // Check for existing session
    console.log('AuthProvider: Checking for existing session');
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('AuthProvider: Error getting session:', error);
        setLoading(false);
        return;
      }
      
      console.log('AuthProvider: Session check complete', { hasSession: !!session });
      
      if (!session) {
        setLoading(false);
      }
      // If there is a session, the onAuthStateChange will handle it
    });

    return () => {
      console.log('AuthProvider: Cleaning up auth subscription');
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, userData: any) => {
    console.log('AuthProvider: Attempting sign up');
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData,
          emailRedirectTo: `${window.location.origin}/`
        }
      });

      if (error) {
        console.error('AuthProvider: Sign up error:', error);
      } else {
        console.log('AuthProvider: Sign up successful');
      }

      return { error };
    } catch (err) {
      console.error('AuthProvider: Sign up exception:', err);
      return { error: err };
    }
  };

  const signIn = async (email: string, password: string) => {
    console.log('AuthProvider: Attempting sign in');
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('AuthProvider: Sign in error:', error);
      } else {
        console.log('AuthProvider: Sign in successful');
      }

      return { error };
    } catch (err) {
      console.error('AuthProvider: Sign in exception:', err);
      return { error: err };
    }
  };

  const signOut = async () => {
    console.log('AuthProvider: Signing out');
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('AuthProvider: Sign out error:', error);
      } else {
        console.log('AuthProvider: Sign out successful');
      }
    } catch (err) {
      console.error('AuthProvider: Sign out exception:', err);
    }
  };

  console.log('AuthProvider: Rendering with state', { hasUser: !!user, hasProfile: !!userProfile, loading });

  return (
    <AuthContext.Provider value={{
      user,
      userProfile,
      loading,
      signUp,
      signIn,
      signOut
    }}>
      {children}
    </AuthContext.Provider>
  );
};
