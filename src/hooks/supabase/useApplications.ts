import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import type { Application } from './types'
import { withLockRetry, createNotification } from './shared'

export const useUserApplications = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchApplications = useCallback(async () => {
    if (!user) return;
    try {
       const { data, error } = await withLockRetry<any>(() => 
         supabase
          .from('applications')
          .select(`
            id, student_id, property_id, status, message, created_at,
            property:properties(id, title, location, image_url, price)
          `)
          .eq('student_id', user.id)
       );
      
      if (error) throw error;
      const processed = (data || []).map((app: any) => ({
        ...app,
        property: Array.isArray(app.property) ? app.property[0] : app.property
      }));

      setApplications(processed as Application[]);
    } catch (err: any) { setError(err.message); } finally { setLoading(false); }
  }, [user]);

  useEffect(() => {
    if (!user) return;
    fetchApplications();
    const uniqueId = Math.random().toString(36).substring(7);
    const channel = supabase.channel(`user-apps-${uniqueId}`)
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'applications', 
        filter: `student_id=eq.${user.id}` 
      }, () => fetchApplications())
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
      throw new Error("You have already applied for this property. One application is enough!");
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
