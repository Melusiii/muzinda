import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import type { Profile } from './types'

export const useProfile = () => {
  const { user } = useAuth()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProfile = useCallback(async () => {
    if (!user) return
    try {
      const { data, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (profileError) throw profileError
      setProfile(data as Profile)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    fetchProfile()
    if (!user) return

    const channel = supabase.channel(`profile-${user.id}`)
      .on('postgres_changes', { 
        event: 'UPDATE', 
        schema: 'public', 
        table: 'profiles', 
        filter: `id=eq.${user.id}` 
      }, (payload: any) => {
        setProfile(payload.new as Profile)
      })
      .subscribe()

    return () => { channel.unsubscribe() }
  }, [user, fetchProfile])

  return { profile, loading, error, refetch: fetchProfile }
}

export const updateProfile = async (updates: Partial<Profile>) => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', user.id)

  if (error) throw error
}

export const uploadAvatar = async (file: File) => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const fileExt = file.name.split('.').pop()
  const filePath = `avatars/${user.id}-${Math.random()}.${fileExt}`

  const { error: uploadError } = await supabase.storage
    .from('property-images') // Reusing existing bucket
    .upload(filePath, file)

  if (uploadError) throw uploadError

  const { data } = supabase.storage
    .from('property-images')
    .getPublicUrl(filePath)

  await updateProfile({ avatar_url: data.publicUrl })
  return data.publicUrl
}
