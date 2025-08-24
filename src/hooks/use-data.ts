'use client'

import { useQuery, useQueryClient } from '@tanstack/react-query'

// Query keys for caching
export const queryKeys = {
  stats: {
    dashboard: ['stats', 'dashboard'] as const,
  },
}

// Stats hooks
export function useDashboardStats() {
  return useQuery({
    queryKey: queryKeys.stats.dashboard,
    queryFn: async () => {
      const response = await fetch('/api/stats')
      
      if (!response.ok) {
        throw new Error(`Failed to fetch stats: ${response.statusText}`)
      }
      
      return response.json()
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  })
}

// Utility hook for optimistic updates
export function useOptimisticUpdate<T>(
  queryKey: unknown[],
  updateFn: (oldData: T | undefined, newData: Partial<T>) => T | undefined
) {
  const queryClient = useQueryClient()
  
  return (newData: Partial<T>) => {
    queryClient.setQueryData(queryKey, (oldData: T | undefined) => 
      updateFn(oldData, newData)
    )
  }
}

// Note: User hooks removed since NextAuth.js handles user management
// If you need custom user profiles, add a profiles table and corresponding hooks here
