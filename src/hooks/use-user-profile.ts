import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { apiClient } from '@/lib/api-client'
import type { CreateUserProfileRequest, UpdateUserProfileRequest } from '@/lib/api.types'

export function useUserProfile() {
  const { data: session } = useSession()
  const queryClient = useQueryClient()
  const userId = session?.user?.id

  // Query for fetching user profile
  const profileQuery = useQuery({
    queryKey: ['userProfile', userId],
    queryFn: () => apiClient.userProfile.get(userId!),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  // Mutation for creating user profile
  const createProfileMutation = useMutation({
    mutationFn: (data: CreateUserProfileRequest) => apiClient.userProfile.create(data),
    onSuccess: (data) => {
      // Update the cache with the new profile
      queryClient.setQueryData(['userProfile', userId], data)
    },
  })

  // Mutation for updating user profile
  const updateProfileMutation = useMutation({
    mutationFn: (data: UpdateUserProfileRequest) => 
      apiClient.userProfile.update(userId!, data),
    onSuccess: (data) => {
      // Update the cache with the updated profile
      queryClient.setQueryData(['userProfile', userId], data)
    },
  })

  return {
    profile: profileQuery.data,
    isLoading: profileQuery.isLoading,
    error: profileQuery.error,
    createProfile: createProfileMutation.mutateAsync,
    updateProfile: updateProfileMutation.mutateAsync,
    isCreating: createProfileMutation.isPending,
    isUpdating: updateProfileMutation.isPending,
    refetch: profileQuery.refetch,
  }
}
