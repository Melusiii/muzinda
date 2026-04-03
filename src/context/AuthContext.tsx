import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { User as SupabaseUser } from '@supabase/supabase-js';

// Module-level guard to prevent multiple concurrent profile fetches across re-renders
let globalFetchingId: string | null = null;

type Role = 'student' | 'landlord' | 'provider' | 'none';
type VerificationStatus = 'unverified' | 'pending' | 'verified';

interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  avatar_url?: string;
  verificationStatus: VerificationStatus;
  hasSecuredHousing?: boolean;
  category?: 'handyman' | 'transport'; // Specific for providers
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password?: string) => Promise<void>;
  signup: (email: string, password?: string, userData?: Omit<User, 'id' | 'email' | 'verificationStatus'>) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (sessionUser: SupabaseUser) => {
    if (globalFetchingId === sessionUser.id) {
      console.log("AuthContext: Profile fetch already in progress for", sessionUser.id);
      return;
    }
    
    try {
      globalFetchingId = sessionUser.id;
      console.log("AuthContext: fetchProfile starting for", sessionUser.id);
      setLoading(true);
      
      let profile = null;
      let retries = 5;
      
      while (retries > 0 && !profile) {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', sessionUser.id)
          .maybeSingle();

        if (error) {
          console.error("AuthContext: Profile select error", error);
          break;
        }
        
        if (data) {
          profile = data;
          break;
        }
        
        console.log(`AuthContext: Profile ${sessionUser.id} not found, retrying...`);
        await new Promise(r => setTimeout(r, 1000));
        retries--;
      }
      
      if (!profile) {
        console.warn("AuthContext: Profile never appeared for", sessionUser.id);
        setUser(null);
        return;
      }

      let serviceCategory = undefined;
      if (profile.role === 'provider') {
        const { data: service } = await supabase
          .from('services')
          .select('category')
          .eq('provider_id', sessionUser.id)
          .maybeSingle();
        serviceCategory = service?.category;
      }

      const newUser: User = {
        id: profile.id,
        email: profile.email,
        name: profile.full_name,
        role: profile.role as Role,
        avatar_url: profile.avatar_url,
        verificationStatus: 'verified',
        category: serviceCategory,
        hasSecuredHousing: profile.role === 'student' ? false : undefined,
      };

      console.log("AuthContext: Active user set:", newUser.role);
      setUser(newUser);
    } catch (error) {
      console.error("AuthContext: Critical error:", error);
    } finally {
      globalFetchingId = null;
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;

    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session && mounted) {
        setLoading(false);
      }
    };
    checkSession();

    // Supabase onAuthStateChange fires on mount with the current session
    // so we don't need a separate initialize() call.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;
      
      console.log("AuthContext: Auth event:", event, session?.user?.id);
      
      if (session?.user) {
        await fetchProfile(session.user);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password?: string) => {
    if (!password) password = "default_test_password_123!"; // Fallback for pure frontend prototyping where password isn't filled. In prod use real password.
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setLoading(false);
      throw error;
    }
    setLoading(false);
  };

  const signup = async (email: string, password?: string, userData?: Omit<User, 'id' | 'email' | 'verificationStatus'>) => {
    if (!password) password = "default_test_password_123!";
    setLoading(true);
    
    try {
      console.log("AuthContext: signup starting...");
      const { data, error: authError } = await supabase.auth.signUp({ email, password });
      
      if (authError) throw authError;
      if (!data.user) throw new Error("No user returned from signup");

      console.log("AuthContext: auth signup success, inserting profile...");
      const { error: profileError } = await supabase.from('profiles').insert([{
        id: data.user.id,
        email: email,
        full_name: userData?.name || email.split('@')[0],
        role: userData?.role || 'student'
      }]);
      
      if (profileError) {
        console.error("AuthContext: profile insert error", profileError);
        throw profileError;
      }

      if (userData?.role === 'provider' && userData?.category) {
        await supabase.from('services').insert([{
          provider_id: data.user.id,
          name: `${userData.name}'s Service`,
          category: userData.category,
          price: 0
        }]);
      }

      console.log("AuthContext: signup logic complete");
    } catch (error: any) {
      console.error("AuthContext: signup error", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  const logout = async () => {
    setLoading(true);
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
