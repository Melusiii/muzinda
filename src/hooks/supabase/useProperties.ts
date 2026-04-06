import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import type { Property } from './types'
import { withLockRetry } from './shared'

// Module-level cache to ensure "Instant UI" on refresh
let propertiesPromise: Promise<Property[]> | null = null;
let propertiesCache: Property[] = (() => {
  try {
    const saved = localStorage.getItem('muzinda_properties_cache');
    return saved ? JSON.parse(saved) : [];
  } catch { return []; }
})();

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
        const { data, error: fetchError } = await withLockRetry<any>(() => 
          supabase
            .from('properties')
            .select('id, title, type, price, location, distance, image_url, verified, rating, reviews_count, likes_count')
            .order('likes_count', { ascending: false })
            .order('created_at', { ascending: false })
        );
 
        if (fetchError) throw fetchError;
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
    if (!id) return;
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

export const useFavorites = () => {
  const { user } = useAuth()
  const [favorites, setFavorites] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchFavorites = useCallback(async () => {
    if (!user) return
    try {
      const { data, error: favError } = await supabase
        .from('favorites')
        .select('id, user_id, property_id, property:properties(id, title, location, image_url, price, likes_count)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
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
    
    try {
      if (existing) {
        const { error } = await supabase.from('favorites').delete().eq('id', existing.id)
        if (error) throw error
        setFavorites(prev => prev.filter(f => f.id !== existing.id))
      } else {
        const { data, error } = await supabase.from('favorites')
          .insert([{ user_id: user.id, property_id: propertyId }])
          .select('id, user_id, property_id, property:properties(id, title, location, image_url, price, likes_count)')
          .single()
        if (error) throw error
        setFavorites(prev => [data, ...prev])
      }
    } catch (err) {
      console.error('Favorite Toggle Error:', err)
      // Allow parent components to handle if needed
      throw err;
    }
  }

  const isFavorited = useCallback((propertyId: string) => {
    return favorites.some(f => f.property_id === propertyId)
  }, [favorites])

  return { favorites, toggleFavorite, isFavorited, loading, refetch: fetchFavorites }
}

/**
 * Sync function to handle 'Liking' which is unified with 'Favoriting' in Phase 6.
 * The database trigger 'favorite_count_trigger' takes care of the atomic count.
 */
export const likeProperty = async (propertyId: string) => {
  // Since likes and favorites are unified, we trigger the favorite toggle.
  // This function is kept for backward compatibility and to signal 'Like' intent.
  // In the unified UI, this will be called by toggleFavorite.
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const { data: existing } = await supabase
    .from('favorites')
    .select('id')
    .eq('user_id', user.id)
    .eq('property_id', propertyId)
    .single()

  if (existing) {
    await supabase.from('favorites').delete().eq('id', existing.id)
  } else {
    await supabase.from('favorites').insert([{ user_id: user.id, property_id: propertyId }])
  }
}
