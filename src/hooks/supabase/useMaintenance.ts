import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import { createNotification } from './shared'
import type { MaintenanceTicket } from './types'

export const useMaintenance = () => {
  const { user } = useAuth()
  const [tickets, setTickets] = useState<MaintenanceTicket[]>([])
  const [loading, setLoading] = useState(true)

  const fetchTickets = useCallback(async () => {
    if (!user) return
    try {
      const query = supabase
        .from('maintenance_tickets')
        .select('*, property:properties(title, location)')
        .order('created_at', { ascending: false })

      // Filter based on role
      if (user.role === 'student') {
        query.eq('student_id', user.id)
      } else if (user.role === 'landlord') {
        const { data: props } = await supabase.from('properties').select('id').eq('landlord_id', user.id)
        const propIds = props?.map((p: any) => p.id) || []
        query.in('property_id', propIds)
      }

      const { data, error } = await query
      if (error) throw error
      setTickets(data || [])
    } catch (err) { console.error('Error fetching maintenance tickets', err) } finally { setLoading(false) }
  }, [user])

  useEffect(() => {
    fetchTickets()
    const channel = supabase.channel('maintenance-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'maintenance_tickets' }, () => fetchTickets())
      .subscribe()
    return () => { channel.unsubscribe() }
  }, [fetchTickets])

  return { tickets, loading, refetch: fetchTickets }
}

export const useMaintenanceMarketplace = () => {
  const [requests, setRequests] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchMarketplace = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('maintenance_requests')
        .select(`
          *,
          property:properties(title, location, image_url),
          landlord:profiles!landlord_id(full_name, avatar_url)
        `)
        .eq('status', 'open')
        .order('created_at', { ascending: false })
      if (error) throw error
      setRequests(data || [])
    } catch (err) { console.error('Marketplace Fetch Error:', err) } finally { setLoading(false) }
  }, [])

  useEffect(() => {
    fetchMarketplace()
    const autoRefresh = setInterval(fetchMarketplace, 30000) // 30s auto-refresh
    
    const channel = supabase.channel('marketplace-live')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'maintenance_requests' }, () => fetchMarketplace())
      .subscribe()
    return () => { 
      clearInterval(autoRefresh)
      channel.unsubscribe() 
    }
  }, [fetchMarketplace])

  return { requests, loading, refetch: fetchMarketplace }
}

export const useProviderJobs = () => {
  const { user } = useAuth()
  const [jobs, setJobs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchJobs = useCallback(async () => {
    if (!user) return
    try {
      // Fetch bids by this provider to find their jobs
      const { data: bids, error } = await supabase
        .from('maintenance_bids')
        .select(`
          *,
          request:maintenance_requests(
            *,
            property:properties(title, location),
            landlord:profiles!landlord_id(full_name, phone)
          )
        `)
        .eq('provider_id', user.id)
        .order('created_at', { ascending: false })
      if (error) throw error
      setJobs(bids || [])
    } catch (err) { console.error('Provider Jobs Error:', err) } finally { setLoading(false) }
  }, [user])

  useEffect(() => { fetchJobs() }, [fetchJobs])

  return { jobs, loading, refetch: fetchJobs }
}

export const postMaintenanceMarketplaceRequest = async (propertyId: string, data: any) => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { data: request, error } = await supabase
    .from('maintenance_requests')
    .insert([{
      issue_type: data.title || data.issue_type,
      description: data.description,
      starting_price: data.budget || data.starting_price,
      is_emergency: data.is_emergency || false,
      landlord_id: user.id,
      property_id: propertyId,
      status: 'open' // Standardize to 'open' so it shows in the marketplace feed
    }])
    .select()
    .single()

  if (error) throw error

  // Create notification for all handymen
  const { data: handymen } = await supabase.from('profiles').select('id').eq('provider_type', 'handyman')
  if (handymen) {
    for (const h of handymen) {
      await createNotification(
        h.id,
        'New Job in Marketplace',
        `A new maintenance request is available at ${data.location || 'a nearby property'}.`,
        'marketplace'
      )
    }
  }

  return request
}

export const submitMaintenanceBid = async (requestId: string, amount: number, message?: string) => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { error } = await supabase.from('maintenance_bids').insert([{
    request_id: requestId,
    provider_id: user.id,
    amount,
    message: message || '',
    status: 'pending'
  }])

  if (error) throw error
}

export const updateBidStatus = async (bidId: string, status: 'accepted' | 'declined') => {
  const { data: bid, error: fetchError } = await supabase
    .from('maintenance_bids')
    .select('*, request:maintenance_requests(*)')
    .eq('id', bidId)
    .single()

  if (fetchError) throw fetchError

  const { error } = await supabase.from('maintenance_bids').update({ status }).eq('id', bidId)
  if (error) throw error

  if (status === 'accepted') {
    // Also update the request status
    await supabase.from('maintenance_requests').update({ 
      status: 'assigned',
      assigned_provider_id: bid.provider_id 
    }).eq('id', bid.request_id)
    
    // Notify Provider
    await createNotification(
        bid.provider_id,
        'Bid Accepted!',
        'Your bid for the maintenance job has been accepted. Contact the landlord to start.',
        'job_status'
    )

    // Notify Student if this was a student ticket
    if (bid.request && bid.request.student_id) {
        await createNotification(
            bid.request.student_id,
            'Handyman Assigned!',
            `A professional has been assigned to your repair request.`,
            'maintenance'
        )
    }
  }
}

// Hook to fetch the student's accepted property
export const useStudentResidency = () => {
  const { user } = useAuth()
  const [residency, setResidency] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const fetchResidency = useCallback(async () => {
    if (!user) return
    try {
      // Find the property where the student is accepted
      const { data, error } = await supabase
        .from('applications')
        .select(`
          id,
          status,
          property:properties(*)
        `)
        .eq('student_id', user.id)
        .in('status', ['accepted', 'secured'])
        .maybeSingle()

      if (error) throw error
      setResidency(data)
    } catch (err) {
      console.error('Residency Fetch Error:', err)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    fetchResidency()
  }, [fetchResidency])

  return { residency, loading, refetch: fetchResidency }
}

export const submitMaintenanceRequest = async (propertyId: string, data: any) => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  // Verify residency before submitting
  const { data: residency, error: resError } = await supabase
    .from('applications')
    .select('id')
    .eq('student_id', user.id)
    .eq('property_id', propertyId)
    .in('status', ['accepted', 'secured'])
    .maybeSingle()

  if (resError || !residency) {
    throw new Error("Access Denied: You must be an approved resident of this property to report issues.")
  }

  const { error } = await supabase.from('maintenance_tickets').insert([{
    ...data,
    student_id: user.id,
    property_id: propertyId,
    status: 'pending'
  }])

  if (error) throw error
}

export const updateTicketStatus = async (ticketId: string, status: string) => {
  const { error } = await supabase.from('maintenance_tickets').update({ status }).eq('id', ticketId)
  if (error) throw error
}

export const dispatchTicketToMarketplace = async (ticketId: string, budget: number) => {
  const { data: ticket, error: fetchError } = await supabase
    .from('maintenance_tickets')
    .select('*, property:properties(*)')
    .eq('id', ticketId)
    .single()

  if (fetchError) throw fetchError

  // 1. Create the marketplace request
  const { data: request, error: reqError } = await supabase
    .from('maintenance_requests')
    .insert([{
      issue_type: ticket.category,
      description: ticket.description,
      starting_price: budget,
      is_emergency: ticket.priority === 'emergency',
      landlord_id: ticket.property.landlord_id,
      property_id: ticket.property_id,
      student_id: ticket.student_id,
      ticket_id: ticket.id,
      status: 'open'
    }])
    .select()
    .single()

  if (reqError) throw reqError

  // 2. Update the student ticket status
  await supabase.from('maintenance_tickets').update({ status: 'in_progress' }).eq('id', ticketId)

  // 3. Notify student
  await createNotification(
    ticket.student_id,
    'Issue Dispatched!',
    `Your report for "${ticket.description.substring(0, 20)}..." has been sent to the Handyman Marketplace.`,
    'maintenance'
  )

  return request
}
