import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import type { LandlordFinance, Transaction } from './types'
import { createNotification } from './shared'

export const useLandlordFinance = () => {
  const { user } = useAuth();
  const [finance, setFinance] = useState<LandlordFinance | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchFinance = useCallback(async () => {
    if (!user) return;
    try {
      // 1. Get properties to calculate occupancy
      const { data: props } = await supabase.from('properties').select('id, price, title').eq('landlord_id', user.id);
      const propIds = (props || []).map((p: any) => p.id);

      if (propIds.length === 0) {
        setFinance({
            total_earnings: 0,
            pending_payments: 0,
            recent_transactions: [],
            monthly_trends: [],
            occupancy_rate: 0
        });
        return;
      }

      // 2. Fetch Real Transactions
      const { data: txs, error: txError } = await supabase
        .from('transactions')
        .select('*, student:profiles!student_id(full_name), property:properties(title)')
        .in('property_id', propIds)
        .order('created_at', { ascending: false });

      if (txError) throw txError;

      // 3. Fetch Pending Apps for "Expected" Revenue
      const { data: pendingApps } = await supabase
        .from('applications')
        .select('property_id')
        .in('property_id', propIds)
        .eq('status', 'pending');

      const totalEarnings = (txs || []).reduce((acc: number, tx: any) => acc + (Number(tx.amount) || 0), 0);
      
      const pendingPayments = (pendingApps || []).reduce((acc: number, app: any) => {
        const prop = props?.find((p: any) => p.id === app.property_id);
        return acc + (prop?.price || 0);
      }, 0);

      // 4. Map Transactions for UI
      const transactions: Transaction[] = (txs || []).map((tx: any) => ({
        id: tx.id,
        date: new Date(tx.created_at).toLocaleDateString(),
        student_name: tx.student?.full_name || 'Resident',
        house_ref: tx.property?.title || 'Property',
        amount: Number(tx.amount) || 0,
        status: tx.status as any
      }));

      // 5. Generate Monthly Trends from real data
      const last6Months = [...Array(6)].map((_, i) => {
        const d = new Date();
        d.setMonth(d.getMonth() - (5 - i));
        return d.toLocaleString('default', { month: 'short' });
      });

      const monthlyTrends = last6Months.map(month => {
        const amount = (txs || []).filter((tx: any) => {
          const txMonth = new Date(tx.created_at).toLocaleString('default', { month: 'short' });
          return txMonth === month;
        }).reduce((acc: number, tx: any) => acc + (Number(tx.amount) || 0), 0);
        return { month, amount };
      });

      // 6. Calculate occupancy based on secured apps
      const { data: securedApps } = await supabase
        .from('applications')
        .select('id')
        .in('property_id', propIds)
        .eq('status', 'secured');

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
    } catch (err) { console.error('Finance Fetch Error:', err); } finally { setLoading(false); }
  }, [user]);

  useEffect(() => { fetchFinance() }, [fetchFinance]);

  return { finance, loading, refetch: fetchFinance };
}

export const useLandlordStats = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const fetchStats = useCallback(async () => {
    if (!user) return
    setLoading(true)
    try {
      const { data: properties, error: propError } = await supabase
        .from('properties')
        .select('id, title, price, image_url, location, description, amenities, type, gender_preference')
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
  }, [user])

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  return { stats, loading, refetch: fetchStats } 
}

export const useLandlordApplications = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchApplications = useCallback(async () => {
    if (!user) return;
    try {
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
    if (!user) return;
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
    .select('student_id, property_id, property:properties(title, price, available_rooms)')
    .eq('id', applicationId)
    .single();

  if (fetchError) throw fetchError;

  const { error } = await supabase.from('applications').update({ status }).eq('id', applicationId);
  if (error) throw error;

  // Auto-Occupancy & Transaction Logic
  if (status === 'approved' || status === 'secured') {
    // 1. Decrement rooms
    if (appData.property?.available_rooms > 0) {
      const newCount = appData.property.available_rooms - 1;
      await supabase.from('properties').update({ 
        available_rooms: newCount
      }).eq('id', appData.property_id);
    }

    // 2. Generate Transaction if Secured (Paid)
    if (status === 'secured') {
      await supabase.from('transactions').insert([{
        student_id: appData.student_id,
        property_id: appData.property_id,
        application_id: applicationId,
        amount: appData.property?.price || 0,
        status: 'paid',
        type: 'rent',
        description: `Initial Rent for ${appData.property?.title}`
      }]);
    }
  }

  // Notify Student
  await createNotification(
    appData.student_id,
    `Application ${status.charAt(0).toUpperCase() + status.slice(1)}`,
    `Your application for "${appData.property?.title}" has been ${status}. Check your portal for status updates!`,
    'app_status'
  );
}

export const createProperty = async (property: any) => {
  const { data, error } = await supabase
    .from('properties')
    .insert([property])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export const updateProperty = async (id: string, updates: any) => {
  const { data, error } = await supabase
    .from('properties')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export const deleteProperty = async (id: string) => {
  const { error } = await supabase
    .from('properties')
    .delete()
    .eq('id', id);

  if (error) throw error;
}
