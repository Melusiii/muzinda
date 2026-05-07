import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import type { User as SupabaseUser } from '@supabase/supabase-js';

type Role = 'student' | 'landlord' | 'provider' | 'none';
type VerificationStatus = 'unverified' | 'pending' | 'verified';

interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  avatar_url?: string;
  verificationStatus: VerificationStatus;
  gender?: 'male' | 'female' | 'preferred_not_to_say';
  hasSecuredHousing?: boolean;
  category?: 'handyman' | 'transport'; // Specific for providers
  phone?: string;
  bio?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password?: string) => Promise<void>;
  signup: (email: string, password?: string, userData?: Omit<User, 'id' | 'email' | 'verificationStatus'>) => Promise<void>;
  logout: (scope?: 'local' | 'global') => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('muzinda_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(!localStorage.getItem('muzinda_user'));

  // Use refs for locks to ensure they are tied to the provider lifecycle, not the module
  const profilePromiseRef = useRef<Promise<void> | null>(null);
  const currentProfileUserIdRef = useRef<string | null>(null);

  const fetchProfile = async (sessionUser: SupabaseUser) => {
    // If a fetch is already in flight for THIS user, wait for it
    if (profilePromiseRef.current && currentProfileUserIdRef.current === sessionUser.id) {
      return profilePromiseRef.current;
    }

    currentProfileUserIdRef.current = sessionUser.id;

    profilePromiseRef.current = (async () => {
      try {
        let { data: profile, error: fetchError } = await supabase
          .from('profiles')
          .select('id, email, full_name, role, avatar_url, verification_status, phone, bio, gender')
          .eq('id', sessionUser.id)
          .maybeSingle();

        if (fetchError) throw fetchError;

        // Auto-create profile if missing (common in local dev or quick-start flows)
        if (!profile) {
          console.warn(`AuthContext: Profile missing for ${sessionUser.email}, auto-creating...`);
          const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .insert([{ 
                id: sessionUser.id, 
                email: sessionUser.email, 
                full_name: sessionUser.email?.split('@')[0] || 'User',
                role: 'student' 
            }])
            .select()
            .single();
          if (createError) throw createError;
          profile = newProfile;
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

        const userData: User = {
          id: profile.id,
          email: profile.email,
          name: profile.full_name,
          role: profile.role as Role,
          avatar_url: profile.avatar_url,
          verificationStatus: (profile.verification_status as VerificationStatus) || 'unverified',
          gender: profile.gender,
          category: serviceCategory,
          hasSecuredHousing: profile.role === 'student' ? false : undefined,
          phone: profile.phone,
          bio: profile.bio,
        };

        setUser(userData);
        localStorage.setItem('muzinda_user', JSON.stringify(userData));
      } catch (error: any) {
        console.error("AuthContext: Profile sync failure:", error.message);
        // Fallback user state so app remains usable
        if (!user) {
          setUser({
            id: sessionUser.id,
            email: sessionUser.email || '',
            name: sessionUser.email?.split('@')[0] || 'User',
            role: 'student',
            verificationStatus: 'unverified'
          });
        }
      } finally {
        profilePromiseRef.current = null;
        setLoading(false);
      }
    })();

    return profilePromiseRef.current;
  };

  useEffect(() => {
    let mounted = true;

    // Use onAuthStateChange as the primary source of truth for sessions
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event: string, session: any) => {
      if (!mounted) return;
      
      if (session?.user) {
        fetchProfile(session.user).catch(err => {
          console.error("AuthContext: Async profile fetch failed", err);
        });
      } else {
        if (event === 'SIGNED_OUT' || event === 'INITIAL_SESSION') {
          profilePromiseRef.current = null;
          currentProfileUserIdRef.current = null;
          setUser(null);
          localStorage.removeItem('muzinda_user');
          setLoading(false);
        }
      }
    });

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'muzinda_user' && !e.newValue) {
        setUser(null);
        setLoading(false);
      }
    };
    window.addEventListener('storage', handleStorageChange);

    return () => {
      mounted = false;
      subscription.unsubscribe();
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const login = async (email: string, password?: string) => {
    setLoading(true);
    if (!password) password = "default_test_password_123!";
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setLoading(false);
        throw error;
      }
      if (data.user) {
        await fetchProfile(data.user);
      }
    } catch (err) {
      setLoading(false);
      throw err;
    }
  };

  const signup = async (email: string, password?: string, userData?: Omit<User, 'id' | 'email' | 'verificationStatus'>) => {
    if (!password) password = "default_test_password_123!";
    setLoading(true);
    
    try {
      const { data, error: authError } = await supabase.auth.signUp({ email, password });
      if (authError) throw authError;
      if (!data.user) throw new Error("No user returned from signup");

      // Use upsert to avoid race conditions with the onAuthStateChange observer
      const { error: profileError } = await supabase.from('profiles').upsert([{
        id: data.user.id,
        email: email,
        full_name: userData?.name || email.split('@')[0],
        role: userData?.role || 'student',
        gender: userData?.gender
      }]);
      
      if (profileError) throw profileError;

      if (userData?.role === 'provider' && userData?.category) {
        await supabase.from('services').insert([{
          provider_id: data.user.id,
          name: `${userData.name}'s Service`,
          category: userData.category,
          price: 0
        }]);
      }
    } catch (error: any) {
      console.error("AuthContext: signup error", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  const logout = async (scope: 'local' | 'global' = 'local') => {
    setUser(null);
    localStorage.removeItem('muzinda_user');
    setLoading(true);
    
    try {
      await supabase.auth.signOut({ scope });
    } catch (err) {
      console.warn("AuthContext: signOut error (non-fatal)", err);
    } finally {
      setLoading(false);
    }
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
