// Type definitions for the API client
// This file contains all type definitions and endpoint configurations

import { DashboardStats, UserProfile, CreateUserProfileRequest, UpdateUserProfileRequest } from './api.types'

// Define the API endpoints structure with both runtime and type information
export const API_ENDPOINTS = {
  stats: {
    dashboard: {
      method: 'GET' as const,
      path: '/api/stats' as const,
      response: {} as DashboardStats
    }
  },
  userProfile: {
    create: {
      method: 'POST' as const,
      path: '/api/user-profile' as const,
      request: {} as CreateUserProfileRequest,
      response: {} as UserProfile
    },
    get: {
      method: 'GET' as const,
      path: (userId: string) => `/api/user-profile/${userId}` as const,
      response: {} as UserProfile
    },
    update: {
      method: 'PUT' as const,
      path: (userId: string) => `/api/user-profile/${userId}` as const,
      request: {} as UpdateUserProfileRequest,
      response: {} as UserProfile
    }
  }
} as const

// Extract the type from the const object
export type ApiEndpoints = typeof API_ENDPOINTS

// Generic API error type
export type ApiError = {
  error: string
  status?: number
}



