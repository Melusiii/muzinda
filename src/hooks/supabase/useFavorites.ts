import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../useAuth'
import { toast } from 'sonner'

export const useFavorites = () => {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  // Get full favorites list
  const { data: favorites = [], isLoading: isListLoading } = useQuery({
    queryKey: ['favorites-list', user?.id],
    queryFn: async () => {
      if (!user) return []
      const { data, error } = await supabase
        .from('favorites')
        .select('id, user_id, property_id, property:properties(id, title, location, image_url, price, likes_count)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data
    },
    enabled: !!user,
  })

  // Get favorite property IDs (for fast lookup)
  const { data: favoriteIds = [], isLoading: isIdsLoading } = useQuery({
    queryKey: ['favorites-ids', user?.id],
    queryFn: async () => {
      if (!user) return []
      const { data, error } = await supabase
        .from('favorites')
        .select('property_id')
        .eq('user_id', user.id)
      
      if (error) throw error
      return data.map((f: any) => f.property_id)
    },
    enabled: !!user,
  })

  const isLoading = isListLoading || isIdsLoading

  // Toggle favorite
  const toggleFavoriteMutation = useMutation({
    mutationFn: async ({ propertyId, isFavorited }: { propertyId: string, isFavorited: boolean }) => {
      if (!user) throw new Error('Unauthorized')

      if (isFavorited) {
        // Remove from favorites
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('property_id', propertyId)
        
        if (error) throw error
      } else {
        // Add to favorites
        const { error } = await supabase
          .from('favorites')
          .insert([{ user_id: user.id, property_id: propertyId }])
        
        if (error) throw error
      }
    },
    onMutate: async ({ propertyId, isFavorited }) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: ['favorites-ids', user?.id] })
      const previousIds = queryClient.getQueryData<string[]>(['favorites-ids', user?.id])

      queryClient.setQueryData(['favorites-ids', user?.id], (old: string[] | undefined) => {
        if (!old) return isFavorited ? [] : [propertyId]
        return isFavorited ? old.filter(id => id !== propertyId) : [...old, propertyId]
      })

      return { previousIds }
    },
    onError: (_err: any, _variables: any, context: any) => {
      if (context?.previousIds) {
        queryClient.setQueryData(['favorites-ids', user?.id], context.previousIds)
      }
      toast.error('Failed to update favorites.')
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites-ids', user?.id] })
      queryClient.invalidateQueries({ queryKey: ['favorites-list', user?.id] })
      // Also invalidate properties to update like counts
      queryClient.invalidateQueries({ queryKey: ['properties'] })
    },
  })

  return {
    favorites,
    isLoading,
    toggleFavorite: (propertyId: string) => {
      const isFavorited = favoriteIds.includes(propertyId)
      toggleFavoriteMutation.mutate({ propertyId, isFavorited })
    },
    isFavorited: (propertyId: string) => favoriteIds.includes(propertyId),
  }
}
