'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useUserProfile } from '@/hooks/use-user-profile'
import { useSession } from 'next-auth/react'
import { userProfileFormSchema, type UserProfileFormData } from '@/lib/api.types'

export function UserProfileForm() {
  const { data: session } = useSession()
  const { 
    profile, 
    isLoading, 
    createProfile, 
    updateProfile, 
    isCreating, 
    isUpdating 
  } = useUserProfile()
  
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const form = useForm<UserProfileFormData>({
    resolver: zodResolver(userProfileFormSchema),
    defaultValues: {
      nickname: profile?.nickname || '',
      dateOfBirth: profile?.dateOfBirth 
        ? (profile.dateOfBirth instanceof Date 
            ? profile.dateOfBirth.toISOString().split('T')[0] 
            : new Date(profile.dateOfBirth).toISOString().split('T')[0]
          )
        : '',
    },
  })

  // Update form values when profile data loads
  useEffect(() => {
    if (profile) {
      form.reset({
        nickname: profile.nickname || '',
        dateOfBirth: profile.dateOfBirth 
          ? (profile.dateOfBirth instanceof Date 
              ? profile.dateOfBirth.toISOString().split('T')[0] 
              : new Date(profile.dateOfBirth).toISOString().split('T')[0]
            )
          : '',
      })
    }
  }, [profile, form])

  const onSubmit = async (data: UserProfileFormData) => {
    try {
      setMessage(null)
      
      if (profile) {
        // Update existing profile
        await updateProfile({
          nickname: data.nickname,
          dateOfBirth: data.dateOfBirth, // Already a string from the form
        })
        setMessage({ type: 'success', text: 'Profile updated successfully!' })
      } else {
        // Create new profile
        if (!session?.user?.id) {
          throw new Error('User session not available')
        }
        await createProfile({
          nickname: data.nickname,
          dateOfBirth: data.dateOfBirth, // Already a string from the form
        })
        setMessage({ type: 'success', text: 'Profile created successfully!' })
      }
    } catch (error) {
      console.error('Profile operation failed:', error)
      setMessage({ 
        type: 'error', 
        text: profile ? 'Failed to update profile' : 'Failed to create profile' 
      })
    }
  }

  if (!session) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">Please sign in to manage your profile.</p>
        </CardContent>
      </Card>
    )
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">Loading profile...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{profile ? 'Update Profile' : 'Create Profile'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nickname">Nickname</Label>
            <Input
              id="nickname"
              type="text"
              placeholder="Enter your nickname"
              {...form.register('nickname')}
            />
            {form.formState.errors.nickname && (
              <p className="text-sm text-destructive">
                {form.formState.errors.nickname.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="dateOfBirth">Date of Birth</Label>
            <Input
              id="dateOfBirth"
              type="date"
              {...form.register('dateOfBirth')}
            />
            {form.formState.errors.dateOfBirth && (
              <p className="text-sm text-destructive">
                {form.formState.errors.dateOfBirth.message}
              </p>
            )}
          </div>

          {message && (
            <div className={`p-3 rounded-md text-sm ${
              message.type === 'success' 
                ? 'bg-green-50 text-green-700 border border-green-200' 
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {message.text}
            </div>
          )}

          <Button 
            type="submit" 
            disabled={isCreating || isUpdating}
            className="w-full"
          >
            {isCreating || isUpdating 
              ? (profile ? 'Updating...' : 'Creating...') 
              : (profile ? 'Update Profile' : 'Create Profile')
            }
          </Button>
        </form>

        {profile && (
          <div className="mt-6 pt-6 border-t">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Current Profile</h3>
            <div className="space-y-1 text-sm">
              <p><strong>Nickname:</strong> {profile.nickname || 'Not set'}</p>
              <p><strong>Date of Birth:</strong> {
                profile.dateOfBirth 
                  ? (profile.dateOfBirth instanceof Date 
                      ? profile.dateOfBirth.toLocaleDateString() 
                      : new Date(profile.dateOfBirth).toLocaleDateString()
                    )
                  : 'Not set'
              }</p>
              <p><strong>Created:</strong> {
                profile.createdAt instanceof Date 
                  ? profile.createdAt.toLocaleDateString() 
                  : new Date(profile.createdAt).toLocaleDateString()
              }</p>
              <p><strong>Updated:</strong> {
                profile.updatedAt instanceof Date 
                  ? profile.updatedAt.toLocaleDateString() 
                  : new Date(profile.updatedAt).toLocaleDateString()
              }</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
