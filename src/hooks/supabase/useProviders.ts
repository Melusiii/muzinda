import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'

export const useProviders = (type?: string) => {
  const [providers, setProviders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        let query = supabase.from('profiles').select('*').eq('role', 'provider')
        if (type) {
          query = query.eq('provider_type', type)
        }
        const { data, error } = await query
        if (error) throw error
        setProviders(data || [])
      } catch (err) { console.error(err) } finally { setLoading(false) }
    }
    fetchProviders()
  }, [type])

  return { providers, loading }
}

export const useProviderService = (category = 'transport') => {
  const { user } = useAuth()
  const [service, setService] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const fetchService = useCallback(async () => {
    if (!user) return
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*, approved_count:service_applications!service_id(count)')
        .eq('provider_id', user.id)
        .eq('category', category)
        .eq('service_applications.status', 'approved')
        .maybeSingle()
      if (error) throw error
      setService(data)
    } catch (err) { console.error(err) } finally { setLoading(false) }
  }, [user, category])

  useEffect(() => { fetchService() }, [fetchService])

  return { service, loading, refetch: fetchService }
}

export const updateProviderService = async (serviceId: string, updates: any) => {
  const { error } = await supabase.from('services').update(updates).eq('id', serviceId)
  if (error) throw error
}

export const createService = async (service: any) => {
  const { data, error } = await supabase
    .from('services')
    .insert([service])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export const deleteService = async (id: string) => {
  const { error } = await supabase
    .from('services')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export const uploadServiceImage = async (file: File) => {
  const fileExt = file.name.split('.').pop()
  const fileName = `${Math.random()}.${fileExt}`
  const filePath = `services/${fileName}`

  const { error: uploadError } = await supabase.storage
    .from('property-images')
    .upload(filePath, file)

  if (uploadError) throw uploadError

  const { data } = supabase.storage
    .from('property-images')
    .getPublicUrl(filePath)

  return data.publicUrl
}

export const useServiceApplications = (serviceId?: string) => {
  const [applications, setApplications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchApps = useCallback(async () => {
    if (!serviceId) return
    try {
      const { data, error } = await supabase
        .from('service_applications')
        .select('*, student:profiles!student_id(full_name, avatar_url, email)')
        .eq('service_id', serviceId)
        .order('created_at', { ascending: false })
      if (error) throw error
      setApplications(data || [])
    } catch (err) { console.error(err) } finally { setLoading(false) }
  }, [serviceId])

  useEffect(() => { fetchApps() }, [fetchApps])

  return { applications, loading, refetch: fetchApps }
}

export const useStudentServiceApplications = () => {
  const { user } = useAuth()
  const [applications, setApplications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchApps = useCallback(async () => {
    if (!user) return
    try {
      const { data, error } = await supabase
        .from('service_applications')
        .select(`
          *,
          approved_at,
          service:services(
            *,
            provider:profiles!provider_id(full_name, avatar_url, phone)
          )
        `)
        .eq('student_id', user.id)
        .order('created_at', { ascending: false })
      if (error) throw error
      setApplications(data || [])
    } catch (err) { console.error(err) } finally { setLoading(false) }
  }, [user])

  useEffect(() => { fetchApps() }, [fetchApps])

  return { applications, loading, refetch: fetchApps }
}

export const applyToService = async (serviceId: string, residence: string, message?: string) => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")
  
  const { error } = await supabase.from('service_applications').insert([{
    service_id: serviceId,
    student_id: user.id,
    student_residing_at: residence,
    message: message || '',
    status: 'pending'
  }])
  if (error) throw error
}

export const updateServiceApplicationStatus = async (applicationId: string, status: string) => {
  const updates: any = { status }
  if (status === 'approved') {
    updates.approved_at = new Date().toISOString()
  }
  const { error } = await supabase.from('service_applications').update(updates).eq('id', applicationId)
  if (error) throw error
}

export const useServices = (category = 'transport') => {
  const [services, setServices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data, error } = await supabase
          .from('services')
          .select(`
            *,
            profiles!provider_id(full_name, avatar_url, phone),
            approved_count:service_applications!service_id(count)
          `)
          .eq('category', category)
          // Filtering out in code to maintain parity with original's complex filter
          .eq('service_applications.status', 'approved')
        if (error) throw error
        setServices(data || [])
      } catch (err) { console.error(err) } finally { setLoading(false) }
    }
    fetchServices()
  }, [category])

  return { services, loading }
}
