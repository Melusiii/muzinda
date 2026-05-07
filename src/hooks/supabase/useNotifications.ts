import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import type { Notification } from './types'
import { withLockRetry } from './shared'

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

    const uniqueId = Math.random().toString(36).substring(7);
    const channel = supabase.channel(`user-notifs-${uniqueId}`)
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'notifications', 
        filter: `user_id=eq.${user.id}` 
      }, () => fetchNotifications())
      .subscribe()

    return () => { channel.unsubscribe() }
  }, [user, fetchNotifications])

  return { notifications, loading, unreadCount, markAsRead, markAllAsRead, refetch: fetchNotifications }
}
