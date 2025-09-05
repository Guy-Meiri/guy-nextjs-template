// API response and request types
// This file contains all the data types returned from API endpoints

import { z } from 'zod'

export type DashboardStats = {
  totalUsers: number
}

// User Profile types
export type UserProfile = {
  id: string
  userId: string
  nickname: string | null
  dateOfBirth: Date | null
  createdAt: Date
  updatedAt: Date
}

export type CreateUserProfileRequest = {
  nickname?: string
  dateOfBirth?: string // ISO string format
}

export type UpdateUserProfileRequest = {
  nickname?: string
  dateOfBirth?: string // ISO string format
}

// Form validation schemas
export const userProfileFormSchema = z.object({
  nickname: z.string().min(1, 'Nickname is required').max(50, 'Nickname must be less than 50 characters'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
})

// Form types
export type UserProfileFormData = z.infer<typeof userProfileFormSchema>
