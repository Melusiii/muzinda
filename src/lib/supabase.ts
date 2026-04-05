import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Supabase environment variables are missing. Please check your .env.local file.");
}

// Singleton pattern to prevent multiple clients (and the 'NavigatorLock' fight)
// during local development (React HMR / Fast Refresh / Strict Mode)
const getSupabase = () => {
    const globalVar = typeof window !== 'undefined' ? (window as any) : (globalThis as any);
    
    if (globalVar.__MUZINDA_SUPABASE_CLIENT__) {
        return globalVar.__MUZINDA_SUPABASE_CLIENT__;
    }

    const client = createClient(
        supabaseUrl || '',
        supabaseAnonKey || '',
        {
          auth: {
            autoRefreshToken: true,
            persistSession: true,
            detectSessionInUrl: true,
            flowType: 'pkce',
            storageKey: 'sb-muzinda-auth-token'
          }
        }
    );

    globalVar.__MUZINDA_SUPABASE_CLIENT__ = client;
    return client;
}

export const supabase = getSupabase();
