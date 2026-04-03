import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

// Types (You can move these to a separate types file later)
export interface Property {
  id: string;
  title: string;
  name?: string; 
  type: 'studio' | 'shared' | 'apartment' | 'hostel';
  price: number;
  currency: string;
  period: string;
  location: string;
  distance: string;
  image_url: string;
  images: string[];
  verified: boolean;
  landlord_id: string;
  description: string;
  amenities: string[];
  total_rooms: number;
  available_rooms: number;
  rating?: number; 
  reviews_count?: number;
  gender_preference?: 'Male Only' | 'Female Only' | 'Mixed';
  monthly_revenue?: number;
  occupancy_count?: number;
}

export interface TransportTrip {
  id: string;
  route_id: string;
  driver_id: string;
  vehicle_capacity: number;
  departure_time: string;
  trip_date: string;
  status: string;
  routes?: {
    name: string;
    type: string;
    price_morning: number;
    price_afternoon: number;
  };
  profiles?: {
    full_name: string;
    phone: string;
  };
  seatsLeft?: number;
}

export interface TransportBooking {
  id: string;
  trip_id: string;
  status: string;
  pickup_point: string;
  trips?: TransportTrip;
}

export const useProperties = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        console.log('useProperties: Fetching properties from Supabase...');
        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('useProperties: Supabase error', error);
          throw error;
        }
        console.log('useProperties: Successfully fetched', data?.length, 'properties');
        setProperties(data as Property[]);
      } catch (err: any) {
        console.error('useProperties: Error fetching properties', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  return { properties, loading, error };
};

export const useProperty = (id: string | undefined) => {
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetchProperty = async () => {
      try {
        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        setProperty(data as Property);
      } catch (err: any) {
        console.error('Error fetching property', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  return { property, loading, error };
};

export const useNeighborhoods = () => {
  const [neighborhoods, setNeighborhoods] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNeighborhoods = async () => {
      try {
        const { data, error } = await supabase
          .from('properties')
          .select('location');
        
        if (error) throw error;
        const unique = Array.from(new Set(data?.map(p => p.location)));
        setNeighborhoods(unique);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchNeighborhoods();
  }, []);

  return { neighborhoods, loading };
};

export const submitApplication = async (propertyId: string, message: string) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Auth required");

  // Get landlord_id first
  const { data: property, error: propError } = await supabase
    .from('properties')
    .select('landlord_id')
    .eq('id', propertyId)
    .single();
  
  if (propError) throw propError;

  const { data, error } = await supabase
    .from('applications')
    .insert({
      property_id: propertyId,
      student_id: user.id,
      message,
      status: 'pending'
    })
    .select()
    .single();

  if (error) throw error;

  // Also create an initial message in the messages table
  await supabase.from('messages').insert({
    sender_id: user.id,
    receiver_id: property.landlord_id,
    content: `New Property Application: ${message}`,
    property_id: propertyId
  });

  // Also create a notification for the landlord
  await supabase.from('notifications').insert({
    user_id: property.landlord_id,
    title: 'New Application',
    message: `A student has applied for your property.`,
    type: 'application'
  });

  return data;
};

export const useConversations = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      // Get all unique users we've messaged
      const { data, error } = await supabase
        .from('messages')
        .select('sender_id, receiver_id, content, created_at, profiles!messages_sender_id_fkey(full_name, avatar_url), receiver:profiles!messages_receiver_id_fkey(full_name, avatar_url)')
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (error) {
        console.error(error);
      } else {
        // Group by contact
        const contacts: any = {};
        data?.forEach(msg => {
          const contactId = msg.sender_id === user.id ? msg.receiver_id : msg.sender_id;
          if (!contacts[contactId]) {
            contacts[contactId] = {
              id: contactId,
              name: msg.sender_id === user.id ? (msg.receiver as any).full_name : (msg.profiles as any).full_name,
              avatar_url: msg.sender_id === user.id ? (msg.receiver as any).avatar_url : (msg.profiles as any).avatar_url,
              lastMessage: msg.content,
              time: new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              timestamp: new Date(msg.created_at).getTime()
            };
          }
        });
        setConversations(Object.values(contacts));
      }
      setLoading(false);
    };

    fetch();
  }, []);

  return { conversations, loading };
};

export const useMessages = (contactId: string | null) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!contactId || !user) return;
    const fetch = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${contactId}),and(sender_id.eq.${contactId},receiver_id.eq.${user.id})`)
        .order('created_at', { ascending: true });

      if (error) console.error(error);
      else setMessages(data || []);
      setLoading(false);
    };
    fetch();
  }, [contactId]);

  return { messages, loading, setMessages };
};

export const sendMessage = async (receiverId: string, content: string, propertyId?: string) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Auth required");

  const { data, error } = await supabase
    .from('messages')
    .insert({
      sender_id: user.id,
      receiver_id: receiverId,
      content,
      property_id: propertyId
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const useUserApplications = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('applications')
        .select(`
          *,
          property:properties(*)
        `)
        .eq('student_id', user.id);

      if (error) console.error(error);
      else setApplications(data || []);
      setLoading(false);
    };
    fetch();
  }, []);

  return { applications, loading };
};

export const useLandlordStats = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      const { data: props, error: pError } = await supabase
        .from('properties')
        .select('*')
        .eq('landlord_id', user.id);

      if (pError) {
        console.error(pError);
      } else {
        const totalRevenue = props.reduce((acc, p) => acc + (Number(p.monthly_revenue) || 0), 0);
        const occupancy = props.length > 0 
          ? (props.reduce((acc, p) => acc + p.occupancy_count, 0) / props.reduce((acc, p) => acc + p.total_rooms, 0)) * 100 
          : 0;
        
        setStats({
          revenue: totalRevenue,
          occupancy: Math.round(occupancy),
          listings: props.length,
          properties: props
        });
      }
      setLoading(false);
    };
    fetch();
  }, []);

  return { stats, loading };
};

export const useTransportTrips = () => {
  const [trips, setTrips] = useState<TransportTrip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        // We select the trip along with its joined route details and driver profile
        const { data, error } = await supabase
          .from('transport_trips')
          .select(`
            *,
            routes:transport_routes(name, type, price_morning, price_afternoon),
            profiles:profiles(full_name, phone)
          `)
          .in('status', ['scheduled', 'in_progress']); // Only active trips

        if (error) throw error;

        // Optionally, we could fetch bookings to calculate exact seatsLeft, but for now we mock the seatsLeft or set it to capacity
        const tripsWithSeats = (data as any[]).map(trip => ({
            ...trip,
            seatsLeft: trip.vehicle_capacity // Ideal: subtract booked seats
        }));

        setTrips(tripsWithSeats);
      } catch (err: any) {
        console.error('Error fetching trips', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, []);

  return { trips, loading, error };
};

export const useUserTickets = () => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<TransportBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTickets = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('transport_bookings')
          .select(`
            *,
            trips:transport_trips(
              *,
              routes:transport_routes(name, type)
            )
          `)
          .eq('student_id', user.id)
          .in('status', ['booked', 'picked_up']);

        if (error) throw error;
        setTickets(data as any[]);
      } catch (err: any) {
        console.error('Error fetching user tickets', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [user]);

  return { tickets, loading, error };
};

export const useProviders = (category?: string) => {
    const [providers, setProviders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const fetchProviders = async () => {
            try {
                let query = supabase.from('profiles').select('*, services(*)').eq('role', 'provider');
                if (category) {
                   // This joins services and we could filter, but let's do simple fetching
                   const { data, error } = await supabase.from('services').select('*, profiles(full_name, avatar_url, phone)').eq('category', category);
                   if (error) throw error;
                   setProviders(data);
                   return;
                }
                const { data, error } = await query;
                if (error) throw error;
                setProviders(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        fetchProviders();
    }, [category]);

    return { providers, loading };
}

export function useFavorites() {
  const { user } = useAuth()
  const [favorites, setFavorites] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setFavorites([])
      setLoading(false)
      return
    }

    const fetchFavorites = async () => {
      try {
        const { data, error } = await supabase
          .from('favorites')
          .select('*, property:properties(*)')
          .eq('user_id', user.id)

        if (error) {
          console.error("Error fetching favorites:", error)
          return
        }

        if (data) {
          setFavorites(data)
        }
      } catch (err) {
        console.error("Unexpected error in useFavorites:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchFavorites()

    // Real-time subscription
    const subscription = supabase
      .channel(`favorites-${user.id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'favorites', filter: `user_id=eq.${user.id}` }, () => {
        fetchFavorites()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(subscription)
    }
  }, [user])

  return { favorites, loading, refetch: () => setLoading(true) }
}
