import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import type { ShuttleTicket, TransportRoute } from './types'

export const useUserTickets = () => {
  const { user } = useAuth()
  const [tickets, setTickets] = useState<ShuttleTicket[]>([])
  const [loading, setLoading] = useState(true)

  const fetchTickets = useCallback(async () => {
    if (!user) return
    try {
      const { data, error } = await supabase
        .from('transport_bookings')
        .select(`
          id, student_id, trip_id, pickup_point, status, created_at,
          trips:transport_trips(
            departure_time,
            trip_date,
            routes:transport_routes(name),
            profiles:profiles!driver_id(full_name)
          )
        `)
        .eq('student_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      
      setTickets(data || [])
    } catch (err) { console.error('Error fetching tickets', err) } finally { setLoading(false) }
  }, [user])

  useEffect(() => {
    if (!user) return;
    fetchTickets()
    const uniqueId = Math.random().toString(36).substring(7);
    const channel = supabase.channel(`user-tkts-${uniqueId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'transport_bookings', filter: `student_id=eq.${user?.id}` }, () => fetchTickets())
      .subscribe()
    return () => { channel.unsubscribe() }
  }, [user, fetchTickets])

  return { tickets, loading, refetch: fetchTickets }
}

export const useTransportTrips = () => {
  const [trips, setTrips] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const { data, error } = await supabase
          .from('transport_trips')
          .select(`
            id, departure_time, trip_date, status,
            routes:transport_routes(id, name, type, price_morning),
            profiles:profiles!driver_id(id, full_name, avatar_url)
          `)
          .in('status', ['scheduled', 'in_progress'])
          .order('departure_time', { ascending: true })

        if (error) throw error
        setTrips(data || [])
      } catch (err) { console.error(err) } finally { setLoading(false) }
    }
    fetchTrips()
  }, [])

  return { trips, loading }
}

export const useRoutes = () => {
  const [routes, setRoutes] = useState<TransportRoute[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const { data, error } = await supabase.from('transport_routes').select('*').eq('active', true)
        if (error) throw error
        setRoutes(data || [])
      } catch (err) { console.error(err) } finally { setLoading(false) }
    }
    fetchRoutes()
  }, [])

  return { routes, loading }
}

export const useProviderTrips = () => {
  const { user } = useAuth()
  const [trips, setTrips] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    const fetchTrips = async () => {
      try {
        const { data, error } = await supabase
          .from('transport_trips')
          .select(`
            id, departure_time, trip_date, status, vehicle_capacity, current_bookings,
            routes:transport_routes(id, name, type, price_morning)
          `)
          .eq('driver_id', user.id)
          .order('departure_time', { ascending: true })

        if (error) throw error
        setTrips(data || [])
      } catch (err) { console.error(err) } finally { setLoading(false) }
    }
    fetchTrips()
  }, [user])

  return { trips, loading }
}

export const createTrip = async (tripData: any) => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")
  
  const { data, error } = await supabase
    .from('transport_trips')
    .insert([{ ...tripData, driver_id: user.id, status: 'scheduled' }])
    .select()
    .single()
    
  if (error) throw error
  return data
}

export const deleteTrip = async (tripId: string) => {
  const { error } = await supabase.from('transport_trips').delete().eq('id', tripId)
  if (error) throw error
}

export const bookTrip = async (tripId: string, pickupPoint: string) => {
  const { error } = await supabase.rpc('book_shuttle', { 
    trip_id_uuid: tripId, 
    pickup_point_text: pickupPoint 
  });

  if (error) {
    if (error.message.includes('already full')) {
      throw new Error("This shuttle is now full. Please select another time.");
    }
    if (error.code === '23505' || error.message.includes('already booked')) {
      throw new Error("You already have a seat booked for this trip!");
    }
    throw error;
  }
}

export const cancelTicket = async (ticketId: string) => {
  const { error } = await supabase.from('transport_bookings').update({ status: 'cancelled' }).eq('id', ticketId)
  if (error) throw error
}

export const cancelTransportBooking = cancelTicket;
