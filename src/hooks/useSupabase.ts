/**
 * useSupabase.ts - Central Export Portal
 * 
 * This file has been refactored from a 1,200-line monolith into domain-specific hooks.
 * Individual hooks are now located in src/hooks/supabase/ folder.
 */

export * from './supabase/types'
export * from './supabase/shared'
export * from './supabase/useProperties'
export * from './supabase/useApplications'
export * from './supabase/useMessaging'
export * from './supabase/useTransport'
export * from './supabase/useLandlord'
export * from './supabase/useMaintenance'
export * from './supabase/useProviders'
export * from './supabase/useProfile'
export * from './supabase/useAuthActions'
export * from './supabase/useNotifications'
