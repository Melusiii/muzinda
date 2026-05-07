import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../../lib/supabase'
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
            .select('id, title, type, price, location, distance, image_url, verified, likes_count, lat, lng')
            .order('likes_count', { ascending: false })
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

