import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import type { Message, Conversation } from './types'

export const useConversations = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchConversations = useCallback(async () => {
    if (!user) return;
    try {
      // 1. Fetch conversations where user is a participant
      const { data: rawConvs, error: convError } = await supabase
        .from('conversations')
        .select('*')
        .contains('participant_ids', [user.id])
        .order('last_message_at', { ascending: false });

      if (convError) throw convError;
      if (!rawConvs || rawConvs.length === 0) {
        setConversations([]);
        return;
      }

      // 2. Optimization: Collect all 'other' participant IDs to fetch profiles in bulk (Fixing N+1)
      const otherParticipantIds = Array.from(new Set(
        rawConvs.map((conv: any) => conv.participant_ids.find((id: string) => id !== user.id)).filter((id: string) => !!id)
      )) as string[];

      if (otherParticipantIds.length === 0) {
        setConversations([]);
        return;
      }

      // 3. Fetch all relevant profiles in a single query
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url')
        .in('id', otherParticipantIds);

      if (profileError) throw profileError;

      // 4. Map profiles back to conversations
      interface ParticipantProfile {
        id: string;
        full_name: string;
        avatar_url: string | null;
      }
      
      const profileMap = new Map<string, ParticipantProfile>(
        (profiles as ParticipantProfile[])?.map(p => [p.id, p]) || []
      );
      
      const processed = rawConvs.map((conv: any) => {
        const otherId = conv.participant_ids.find((id: string) => id !== user.id);
        const profile = otherId ? profileMap.get(otherId) : null;
        
        return {
          id: conv.id,
          name: profile?.full_name || 'Anonymous',
          avatar_url: profile?.avatar_url || '',
          lastMessage: conv.last_message || '',
          time: conv.last_message_at ? new Date(conv.last_message_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''
        };
      });

      setConversations(processed as Conversation[]);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  }, [user]);

  useEffect(() => {
    if (!user) return;
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
    if (!conversationId) return;
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
