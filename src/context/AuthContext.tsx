import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { User as SupabaseUser } from '@supabase/supabase-js';

// Module-level guard to prevent multiple concurrent profile fetches across re-renders
let profilePromise: Promise<void> | null = null;
let currentProfileUserId: string | null = null;

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
    // Synchronously check localStorage on initialization
    const saved = localStorage.getItem('muzinda_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(() => {
    // If we have a cached user, we can start in a non-loading state (Stale-While-Revalidate)
    return !localStorage.getItem('muzinda_user');
  });

  const fetchProfile = async (sessionUser: SupabaseUser, retryCount = 0) => {
    // If a fetch is already in flight for THIS user, wait for it
    if (profilePromise && currentProfileUserId === sessionUser.id && retryCount === 0) {
      console.log("AuthContext: Profile fetch in progress, returning existing promise.");
      return profilePromise;
    }

    // Defensive: If there's an existing bundle for a DIFFERENT user, kill it
    if (profilePromise && currentProfileUserId !== sessionUser.id) {
       console.warn("AuthContext: User mismatch during fetch, resetting singleton...");
       profilePromise = null;
    }

    currentProfileUserId = sessionUser.id;

    const executeFetch = async (attempt: number): Promise<void> => {
      try {
        console.log(`AuthContext: Profile sync attempt ${attempt + 1} for ${sessionUser.email}`);
        
        // 30-second timeout guard per attempt
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Profile fetch timed out')), 30000)
        );

        const fetchOp = (async () => {
          let { data: profile, error: fetchError } = await supabase
            .from('profiles')
            .select('id, email, full_name, role, avatar_url, verification_status, phone, bio, gender')
            .eq('id', sessionUser.id)
            .maybeSingle();

          if (fetchError) throw fetchError;

          // ... (profile creation fallback logic)
          if (!profile) {
            console.warn(`AuthContext: Profile missing for ${sessionUser.email}, checking if in signup flow...`);
            await new Promise(resolve => setTimeout(resolve, 1500));
            const { data: retryProfile } = await supabase
              .from('profiles')
              .select('id, email, full_name, role, avatar_url, verification_status, phone, bio, gender')
              .eq('id', sessionUser.id)
              .maybeSingle();
              
            if (retryProfile) {
              profile = retryProfile;
            } else {
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
          }

          if (!profile) throw new Error('Failed to synchronize profile');
          const profileData = profile;

          let serviceCategory = undefined;
          if (profileData.role === 'provider') {
            const { data: service } = await supabase
              .from('services')
              .select('category')
              .eq('provider_id', sessionUser.id)
              .maybeSingle();
            serviceCategory = service?.category;
          }

          const newUser: User = {
            id: profileData.id,
            email: profileData.email,
            name: profileData.full_name,
            role: profileData.role as Role,
            avatar_url: profileData.avatar_url,
            verificationStatus: (profileData.verification_status as VerificationStatus) || 'unverified',
            gender: profileData.gender,
            category: serviceCategory,
            hasSecuredHousing: profileData.role === 'student' ? false : undefined,
            phone: profileData.phone,
            bio: profileData.bio,
          };

          setUser(newUser);
          localStorage.setItem('muzinda_user', JSON.stringify(newUser));
          console.log(`AuthContext: Profile sync success for ${sessionUser.email}`);
        })();

        await Promise.race([fetchOp, timeoutPromise]);
      } catch (error: any) {
        const isLockError = error.message?.includes('Lock') || error.name === 'NavigatorLockAcquireTimeoutError';
        
        if (isLockError && attempt < 2) {
          console.warn(`AuthContext: Lock contention (attempt ${attempt + 1}), retrying in 1.5s...`);
          await new Promise(resolve => setTimeout(resolve, 1500));
          return executeFetch(attempt + 1);
        }

        throw error;
      }
    };

    profilePromise = (async () => {
      try {
        await executeFetch(0);
      } catch (error: any) {
        console.warn(`AuthContext: Final profile sync failure for ${sessionUser.email}:`, error.message);
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
        profilePromise = null;
        setLoading(false);
      }
    })();

    return profilePromise;
  };

  useEffect(() => {
    let mounted = true;

    // Optimization: Combines 'Initial check' and 'Subscription' to avoid common 'NavigatorLock' fight on mount.
    // Relying on onAuthStateChange INITIAL_SESSION event which is bulletproof in Supabase v2.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event: string, session: any) => {
      if (!mounted) return;
      console.log(`AuthContext: Auth event fired - ${event}`);
      
      if (session?.user) {
        // De-couple from sync lock by using a non-blocking trigger
        fetchProfile(session.user).catch(err => {
          console.error("AuthContext: Async profile fetch failed", err);
        });
      } else {
        if (event === 'SIGNED_OUT' || event === 'INITIAL_SESSION') {
          profilePromise = null;
          currentProfileUserId = null;
          setUser(null);
          localStorage.removeItem('muzinda_user');
          setLoading(false);
        }
      }
    });

    // Cross-tab Synchronization: Listen for logout events from other tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'muzinda_user' && !e.newValue) {
        console.log("AuthContext: Logout detected in another tab, clearing session...");
        setUser(null);
        setLoading(false);
      }
    };
    window.addEventListener('storage', handleStorageChange);

    // Fail-safe: No matter what, stop loading after 15 seconds to prevent soft-locks
    const safetyTimer = setTimeout(() => {
      if (mounted) {
        setLoading(false);
      }
    }, 15000);

    return () => {
      mounted = false;
      clearTimeout(safetyTimer);
      subscription.unsubscribe();
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const login = async (email: string, password?: string) => {
    // Start locally managed loading state
    setLoading(true);
    if (!password) password = "default_test_password_123!";
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setLoading(false);
        throw error;
      }
      
      // Explicitly await the profile recognition for the user.
      if (data.user) {
        await Promise.race([
          fetchProfile(data.user),
          new Promise((_, reject) => setTimeout(() => reject(new Error("Profile synchronization timed out. Please try refreshing.")), 10000))
        ]);
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
      console.log("AuthContext: signup starting...");
      const { data, error: authError } = await supabase.auth.signUp({ email, password });
      
      if (authError) throw authError;
      if (!data.user) throw new Error("No user returned from signup");

      console.log("AuthContext: auth signup success, inserting profile...");
      const { error: profileError } = await supabase.from('profiles').insert([{
        id: data.user.id,
        email: email,
        full_name: userData?.name || email.split('@')[0],
        role: userData?.role || 'student',
        gender: userData?.gender
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

  const logout = async (scope: 'local' | 'global' = 'local') => {
    // Optimistic Logout: Clear UI immediately
    setUser(null);
    localStorage.removeItem('muzinda_user');
    setLoading(true);
    
    try {
      // Supabase Global SignOut invalidates all active tokens for the user account
      await supabase.auth.signOut({ scope });
      console.log(`AuthContext: Logout success (scope: ${scope})`);
    } catch (err) {
      console.warn("AuthContext: signOut error (non-fatal for UI)", err);
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
