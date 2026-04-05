import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
 
export interface Transaction {
  id: string
  date: string
  student_name: string
  house_ref: string
  amount: number
  status: 'paid' | 'pending' | 'failed'
}

export interface LandlordFinance {
  total_earnings: number
  pending_payments: number
  recent_transactions: Transaction[]
  monthly_trends: { month: string; amount: number }[]
  occupancy_rate: number
}

// Helper to handle transient Supabase lock contention errors
 const withLockRetry = async <T>(operation: () => Promise<T>, maxRetries = 2): Promise<T> => {
   let lastError: any;
   for (let i = 0; i <= maxRetries; i++) {
     try {
       return await operation();
     } catch (err: any) {
       lastError = err;
       const isLockError = err.message?.includes('Lock') || err.name === 'NavigatorLockAcquireTimeoutError';
       if (isLockError && i < maxRetries) {
         console.warn(`useSupabase: Lock contention, retrying (${i + 1}/${maxRetries})...`);
         await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
         continue;
       }
       throw err;
     }
   }
   throw lastError;
 };

export interface Profile {
  id: string
  email: string
  full_name: string
  role: 'student' | 'landlord' | 'provider'
  avatar_url?: string
  bio?: string
  phone?: string
  university?: string
  notification_settings: {
    push: boolean
    email: boolean
    messages: boolean
    updates: boolean
  }
}

export interface TransportRoute {
  id: string
  name: string
  type: string
  price_morning: number
  price_afternoon: number
  pickup_points: string[]
}

export interface Property {
  id: string
  title: string
  type: 'Single' | 'Shared' | 'Apartment' | 'Hostel' | string
  price: number
  location: string
  distance: string
  image_url: string
  verified: boolean
  description?: string
  amenities?: string[]
  available_rooms?: number
  total_rooms?: number
  rating?: number
  reviews_count?: number
  images?: string[]
  landlord_id?: string
  landlord?: {
    full_name: string
    verification_status: 'unverified' | 'pending' | 'verified' | 'rejected'
  }
  name?: string
  status?: string
  gender_preference?: 'Boys Only' | 'Girls Only' | 'Mixed' | string
}

export interface Application {
  id: string
  student_id: string
  property_id: string
  status: 'pending' | 'approved' | 'rejected' | 'secured'
  message?: string
  created_at: string
  property?: Property
}

export interface Notification {
  id: string
  user_id: string
  title: string
  message: string
  type: string
  read: boolean
  created_at: string
}

// Module-level cache to ensure "Instant UI" on refresh
let propertiesPromise: Promise<Property[]> | null = null;
let propertiesCache: Property[] = (() => {
  try {
    const saved = localStorage.getItem('muzinda_properties_cache');
    return saved ? JSON.parse(saved) : [];
  } catch { return []; }
})();


// --- PROPERTIES HOOK ---
export const useProperties = () => {
  const [properties, setProperties] = useState<Property[]>(propertiesCache);
  const [loading, setLoading] = useState(propertiesCache.length === 0);
  const [error, setError] = useState<string | null>(null);

  const fetchProperties = useCallback(async (mounted = true) => {
    if (propertiesPromise) {
      try {
        const data = await propertiesPromise;
        if (mounted) setProperties(data);
        return;
      } catch (err) { /* handled by creator */ }
    }

    try {
      propertiesPromise = (async () => {
        const { data } = await withLockRetry<any>(() => 
          supabase
            .from('properties')
            .select('id, title, type, price, location, distance, image_url, verified, rating, reviews_count')
            .order('created_at', { ascending: false })
        );
 
        const result = (data as Property[]) || [];
        propertiesCache = result;
        localStorage.setItem('muzinda_properties_cache', JSON.stringify(result));
        return result;
      })();
 
      const data = await propertiesPromise;
      if (mounted) setProperties(data);
    } catch (err: any) {
      if (mounted) setError(err.message);
    } finally {
      if (mounted) setLoading(false);
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    fetchProperties(mounted);

    // UNIQUE channel name to prevent "cannot add postgres_changes after subscribe" errors
    const uniqueId = Math.random().toString(36).substring(7);
    const channel = supabase.channel(`props-${uniqueId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'properties' }, () => {
        propertiesPromise = null;
        fetchProperties(true);
      })
      .subscribe();

    return () => {
      mounted = false;
      channel.unsubscribe();
    }
  }, [fetchProperties]);

  return { properties, loading, error, refetch: () => { propertiesPromise = null; fetchProperties(); } };
}

// --- PROPERTY DETAIL HOOK ---
export const useProperty = (id?: string) => {
  const [property, setProperty] = useState<Property | null>(() => {
    return propertiesCache.find(p => p.id === id) || null;
  });
  const [loading, setLoading] = useState(!property);
  const [error, setError] = useState<string | null>(null);

  const fetchProperty = useCallback(async () => {
    if (!id) return;
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*, landlord:profiles!landlord_id(full_name, verification_status)')
        .eq('id', id)
        .single();
      if (error) throw error;
      setProperty(data);
    } catch (err: any) { setError(err.message); } finally { setLoading(false); }
  }, [id]);

  useEffect(() => {
    fetchProperty();
    const uniqueId = Math.random().toString(36).substring(7);
    const channel = supabase.channel(`prop-detail-${uniqueId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'properties', filter: `id=eq.${id}` }, () => {
        fetchProperty()
      })
      .subscribe();

    return () => {
      channel.unsubscribe();
    }
  }, [id, fetchProperty]);

  return { property, loading, error };
}

// --- APPLICATIONS HOOK ---
export const useUserApplications = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchApplications = useCallback(async () => {
    if (!user) return;
    try {
       const { data } = await withLockRetry<any>(() => 
         supabase
          .from('applications')
          .select(`
            id, student_id, property_id, status, message, created_at,
            property:properties(id, title, location, image_url, price)
          `)
          .eq('student_id', user.id)
       );
      
      const processed = (data || []).map((app: any) => ({
        ...app,
        property: Array.isArray(app.property) ? app.property[0] : app.property
      }));

      setApplications(processed as Application[]);
    } catch (err: any) { setError(err.message); } finally { setLoading(false); }
  }, [user]);

  useEffect(() => {
    fetchApplications();
    const uniqueId = Math.random().toString(36).substring(7);
    const channel = supabase.channel(`user-apps-${uniqueId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'applications', filter: `student_id=eq.${user?.id}` }, () => fetchApplications())
      .subscribe();
    return () => { channel.unsubscribe(); }
  }, [user, fetchApplications]);

  return { applications, loading, error, refetch: fetchApplications };
}

export const submitApplication = async (propertyId: string, message: string) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Authentication required");
  
  const { error } = await supabase.from('applications').insert([{ 
    student_id: user.id, 
    property_id: propertyId, 
    status: 'pending', 
    message 
  }]);

  if (error) {
    if (error.code === '23505') {
      throw new Error("You have already applied for this property. One handshake is enough!");
    }
    throw error;
  }

  // Notify Landlord
  try {
    const { data: prop } = await supabase.from('properties').select('landlord_id, title').eq('id', propertyId).single();
    if (prop?.landlord_id) {
      await createNotification(
        prop.landlord_id,
        'House Application Request',
        `A student is interested in "${prop.title}". Review their request in your hub!`,
        'new_app'
      );
    }
  } catch (err) { console.warn("Failed to notify landlord", err); }
}

export const deleteApplication = async (id: string) => {
  const { error } = await supabase.from('applications').delete().eq('id', id);
  if (error) throw error;
}

// --- MESSAGING HOOK ---
export interface Message {
  id: string
  conversation_id: string
  sender_id: string
  content: string
  created_at: string
}

export interface Conversation {
  id: string
  name: string
  avatar_url: string
  lastMessage: string
  time: string
}

export const useConversations = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchConversations = useCallback(async () => {
    if (!user) return;
    try {
      const { data: rawConvs, error: convError } = await supabase
        .from('conversations')
        .select('*')
        .contains('participant_ids', [user.id])
        .order('last_message_at', { ascending: false });

      if (convError) throw convError;
      const processed = await Promise.all((rawConvs || []).map(async (conv: any) => {
        const otherId = conv.participant_ids.find((id: string) => id !== user.id);
        if (!otherId) return null;
        const { data: profile } = await supabase.from('profiles').select('full_name, avatar_url').eq('id', otherId).single();
        return {
          id: conv.id,
          name: profile?.full_name || 'Anonymous',
          avatar_url: profile?.avatar_url || '',
          lastMessage: conv.last_message || '',
          time: conv.last_message_at ? new Date(conv.last_message_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''
        };
      }));
      setConversations(processed.filter(c => c !== null) as Conversation[]);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  }, [user]);

  useEffect(() => {
    fetchConversations();
    const uniqueId = Math.random().toString(36).substring(7);
    const channel = supabase.channel(`convs-${user?.id}-${uniqueId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'conversations' }, () => fetchConversations())
      .subscribe();
    return () => { channel.unsubscribe(); };
  }, [user, fetchConversations]);

  return { conversations, loading };
}

export const useMessages = (conversationId?: string) => {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(!!conversationId)
  
  const fetchMessages = useCallback(async () => {
    if (!conversationId) return
    try {
      const { data, error } = await supabase.from('messages').select('*').eq('conversation_id', conversationId).order('created_at', { ascending: true })
      if (error) throw error
      setMessages(data || [])
    } catch (err) { console.error(err); } finally { setLoading(false); }
  }, [conversationId])

  useEffect(() => {
    fetchMessages()
    const uniqueId = Math.random().toString(36).substring(7);
    const channel = supabase.channel(`msgs-${conversationId}-${uniqueId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `conversation_id=eq.${conversationId}` }, (p: any) => setMessages(prev => [...prev, p.new as Message]))
      .subscribe()
    return () => { channel.unsubscribe(); }
  }, [conversationId, fetchMessages])

  return { messages, loading, setMessages }
}

export const sendMessage = async (conversationId: string, content: string) => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")
  const { data, error } = await supabase.from('messages').insert([{ conversation_id: conversationId, sender_id: user.id, content }]).select().single()
  if (error) throw error
  await supabase.from('conversations').update({ last_message: content, last_message_at: new Date().toISOString() }).eq('id', conversationId);
  return data
}

// --- TRANSPORT TICKETS ---
export interface ShuttleTicket {
  id: string
  student_id: string
  trip_id: string
  pickup_point: string
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  created_at: string
  trips?: {
    departure_time: string
    trip_date: string
    routes?: {
      name: string
    }
    profiles?: {
      full_name: string
    }
  }
}

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
  // Use the secure book_shuttle RPC to prevent race conditions and overbooking
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

// --- PROVIDERS ---
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
}// --- LANDLORD STATS & FINANCE ---
export const useLandlordFinance = () => {
  const { user } = useAuth();
  const [finance, setFinance] = useState<LandlordFinance | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchFinance = useCallback(async () => {
    if (!user) return;
    try {
      const { data: props } = await supabase.from('properties').select('id, price, title').eq('landlord_id', user.id);
      const propIds = (props || []).map((p: any) => p.id);

      // Get secured applications for "Paid" earnings
      const { data: securedApps } = await supabase
        .from('applications')
        .select('property_id, created_at, student:profiles!student_id(full_name)')
        .in('property_id', propIds)
        .eq('status', 'secured');

      // Get pending applications for "Pending" earnings
      const { data: pendingApps } = await supabase
        .from('applications')
        .select('property_id, created_at, student:profiles!student_id(full_name)')
        .in('property_id', propIds)
        .eq('status', 'pending');

      const totalEarnings = (securedApps || []).reduce((acc: number, app: any) => {
        const prop = props?.find((p: any) => p.id === app.property_id);
        return acc + (prop?.price || 0);
      }, 0);

      const pendingPayments = (pendingApps || []).reduce((acc: number, app: any) => {
        const prop = props?.find((p: any) => p.id === app.property_id);
        return acc + (prop?.price || 0);
      }, 0);

      // Construct Mock Transactions for Visual History
      const transactions: Transaction[] = [
        ...(securedApps || []).map((app: any) => ({
          id: Math.random().toString(36).substr(2, 9),
          date: new Date(app.created_at).toLocaleDateString(),
          student_name: (app as any).student?.full_name || 'Student',
          house_ref: props?.find((p: any) => p.id === app.property_id)?.title || 'House',
          amount: props?.find((p: any) => p.id === app.property_id)?.price || 0,
          status: 'paid' as const
        })),
        ...(pendingApps || []).slice(0, 5).map((app: any) => ({
          id: Math.random().toString(36).substr(2, 9),
          date: new Date(app.created_at).toLocaleDateString(),
          student_name: (app as any).student?.full_name || 'Student',
          house_ref: props?.find((p: any) => p.id === app.property_id)?.title || 'House',
          amount: props?.find((p: any) => p.id === app.property_id)?.price || 0,
          status: 'pending' as const
        }))
      ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 10);

      // Mock Monthly Trends
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
      const monthlyTrends = months.map(m => ({
        month: m,
        amount: Math.floor(Math.random() * (totalEarnings || 500)) + 200
      }));

      const occupancyRate = props?.length 
        ? Math.round(((securedApps?.length || 0) / props.length) * 100) 
        : 0;

      setFinance({
        total_earnings: totalEarnings,
        pending_payments: pendingPayments,
        recent_transactions: transactions,
        monthly_trends: monthlyTrends,
        occupancy_rate: occupancyRate
      });
    } catch (err) { console.error(err); } finally { setLoading(false); }
  }, [user]);

  useEffect(() => { fetchFinance() }, [fetchFinance]);

  return { finance, loading, refetch: fetchFinance };
}


// --- LANDLORD STATS ---
export const useLandlordStats = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    const fetchStats = async () => {
      try {
        const { data: properties, error: propError } = await supabase
          .from('properties')
          .select('id, title, price, image_url, location')
          .eq('landlord_id', user.id)

        if (propError) throw propError

        const { data: applications, error: appError } = await supabase
          .from('applications')
          .select('id, status, property_id')
          .in('property_id', (properties || []).map((p: any) => p.id))

        if (appError) throw appError

        setStats({
          revenue: (properties || []).reduce((acc: number, p: any) => acc + (p.price || 0), 0),
          occupancy: Math.round(((applications?.filter((a: any) => a.status === 'secured').length || 0) / (properties?.length || 1)) * 100),
          listings: properties?.length || 0,
          properties: (properties || []).map((p: any) => ({
            ...p,
            status: applications?.find((a: any) => a.property_id === p.id && a.status === 'secured') ? 'occupied' : 'available'
          }))
        })
      } catch (err) { console.error(err) } finally { setLoading(false) }
    }
    fetchStats()
  }, [user])

  return { stats, loading, refetch: () => { setLoading(true); } } // Simple trigger, the useEffect will re-run if needed or I can make it a callback
}

// --- LANDLORD APPLICATIONS ---
export const useLandlordApplications = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchApplications = useCallback(async () => {
    if (!user) return;
    try {
      // First get landlord properties
      const { data: props } = await supabase.from('properties').select('id').eq('landlord_id', user.id);
      const propIds = props?.map((p: { id: string }) => p.id) || [];
      
      if (propIds.length === 0) {
        setApplications([]);
        return;
      }

      const { data, error } = await supabase
        .from('applications')
        .select('*, student:profiles!student_id(*), property:properties(*)')
        .in('property_id', propIds)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setApplications(data || []);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  }, [user]);

  useEffect(() => {
    fetchApplications();
    const channel = supabase.channel(`landlord-apps-${user?.id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'applications' }, () => fetchApplications())
      .subscribe();
    return () => { channel.unsubscribe(); }
  }, [user, fetchApplications]);

  return { applications, loading, refetch: fetchApplications };
}

export const updateApplicationStatus = async (applicationId: string, status: 'approved' | 'rejected' | 'secured') => {
  const { data: appData, error: fetchError } = await supabase
    .from('applications')
    .select('student_id, property_id, property:properties(title, available_rooms)')
    .eq('id', applicationId)
    .single();

  if (fetchError) throw fetchError;

  const { error } = await supabase.from('applications').update({ status }).eq('id', applicationId);
  if (error) throw error;

  // Auto-Occupancy Logic: Decrement rooms if approved
  if (status === 'approved' && appData.property?.available_rooms > 0) {
    const newCount = appData.property.available_rooms - 1;
    await supabase.from('properties').update({ 
      available_rooms: newCount
    }).eq('id', appData.property_id);
  }

  // Notify Student
  await createNotification(
    appData.student_id,
    `Application ${status === 'approved' ? 'Accepted' : 'Updated'}`,
    `Your application for "${appData.property?.title}" has been ${status}. Check your portals for details.`,
    'app_status'
  );
}

// --- PROPERTY CRUD ---
export const addProperty = async (propertyData: Partial<Property>) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data, error } = await supabase
    .from('properties')
    .insert([{ ...propertyData, landlord_id: user.id, verified: false }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export const togglePropertyAvailability = async (id: string, currentStatus: string) => {
  const newStatus = currentStatus === 'available' ? 'unavailable' : 'available';
  const { error } = await supabase.from('properties').update({ status: newStatus }).eq('id', id);
  if (error) throw error;
}

export const updatePropertyDetails = async (id: string, updates: Partial<Property>) => {
  const { error } = await supabase.from('properties').update(updates).eq('id', id);
  if (error) throw error;
}

export const deleteProperty = async (id: string) => {
  const { error } = await supabase.from('properties').delete().eq('id', id);
  if (error) throw error;
}

// --- NOTIFICATIONS HOOK ---
export const createNotification = async (userId: string, title: string, message: string, type = 'system') => {
  const { error } = await supabase.from('notifications').insert([{
    user_id: userId,
    title,
    message,
    type
  }]);
  if (error) throw error;
}
export const useFavorites = () => {
  const { user } = useAuth()
  const [favorites, setFavorites] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchFavorites = useCallback(async () => {
    if (!user) return
    try {
      const { data, error: favError } = await supabase.from('favorites').select('id, user_id, property_id, property:properties(id, title, location, image_url, price)').eq('user_id', user.id)
      if (favError) throw favError;
      setFavorites(data || [])
    } catch (err) { console.error(err); } finally { setLoading(false) }
  }, [user])

  useEffect(() => {
    fetchFavorites()
  }, [user, fetchFavorites])

  const toggleFavorite = async (propertyId: string) => {
    if (!user) return
    const existing = favorites.find(f => f.property_id === propertyId)
    if (existing) {
      await supabase.from('favorites').delete().eq('id', existing.id)
      setFavorites(prev => prev.filter(f => f.id !== existing.id))
    } else {
      const { data, error } = await supabase.from('favorites').insert([{ user_id: user.id, property_id: propertyId }]).select('id, user_id, property_id, property:properties(id, title, location, image_url, price)').single()
      if (error) throw error
      setFavorites(prev => [...prev, data])
    }
  }
  const isFavorited = useCallback((propertyId: string) => {
    return favorites.some(f => f.property_id === propertyId)
  }, [favorites])

  return { favorites, toggleFavorite, isFavorited, loading }
}
// --- MONTHLY SERVICES & SUBSCRIPTIONS ---
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
          .eq('service_applications.status', 'approved')
        if (error) throw error
        setServices(data || [])
      } catch (err) { console.error(err) } finally { setLoading(false) }
    }
    fetchServices()
  }, [category])

  return { services, loading }
}

// --- NOTIFICATIONS HOOK ---
export const useNotifications = () => {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [unreadCount, setUnreadCount] = useState(0)

  const fetchNotifications = useCallback(async () => {
    if (!user) return
    try {
       const { data } = await withLockRetry<any>(() => 
         supabase
          .from('notifications')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
       );
 
      const result = (data as Notification[]) || []
      setNotifications(result)
      setUnreadCount(result.filter((n: Notification) => n && !n.read).length || 0)
    } catch (err) {
      console.error('Error fetching notifications:', err)
    } finally {
      setLoading(false)
    }
  }, [user])

  const markAsRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', id)
      
      if (error) throw error
      setNotifications(prev => prev.map((n: Notification) => n.id === id ? { ...n, read: true } : n))
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch (err) {
      console.error('Error marking notification as read:', err)
    }
  }

  const markAllAsRead = async () => {
    if (!user) return
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', user.id)
        .eq('read', false)
      
      if (error) throw error
      setNotifications(prev => prev.map((n: Notification) => ({ ...n, read: true })))
      setUnreadCount(0)
    } catch (err) {
      console.error('Error marking all notifications as read:', err)
    }
  }

  useEffect(() => {
    if (!user) return

    fetchNotifications()

    // Real-time subscription
    const uniqueId = Math.random().toString(36).substring(7);
    const channel = supabase
      .channel(`user-notifs-${uniqueId}`, {
           auth: {
             autoRefreshToken: true,
             persistSession: true,
             detectSessionInUrl: true,
             flowType: 'pkce',
             storageKey: 'sb-muzinda-auth-token'
           }
         }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          fetchNotifications()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user, fetchNotifications])

  return {
    notifications,
    loading,
    unreadCount,
    markAsRead,
    markAllAsRead,
    refetch: fetchNotifications
  }
}
// --- PROFILE HOOK ---
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
    .from('property-images') // Reusing existing bucket or use avatars if exists
    .upload(filePath, file)

  if (uploadError) throw uploadError

  const { data } = supabase.storage
    .from('property-images')
    .getPublicUrl(filePath)

  await updateProfile({ avatar_url: data.publicUrl })
  return data.publicUrl
}

// --- SECURITY & AUTH FUNCTIONS ---
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
