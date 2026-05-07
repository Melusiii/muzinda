import { supabase } from '../../lib/supabase'

export const changePassword = async (newPassword: string) => {
  const { error } = await supabase.auth.updateUser({ password: newPassword })
  if (error) throw error
}

export const globalLogout = async () => {
  const { error } = await supabase.auth.signOut({ scope: 'global' })
  if (error) throw error
}

export const submitProviderApplication = async (data: any) => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { error } = await supabase
    .from('verification_requests')
    .insert([{ ...data, user_id: user.id, status: 'pending' }])

  if (error) throw error
}
