// Type-safe API client for frontend requests
// This client handles HTTP requests to our Next.js API routes

import { API_ENDPOINTS, ApiError } from './api-client.types'
import { DashboardStats, UserProfile } from './api.types'

// Type-safe API client class
export class ApiClient {
  private baseUrl: string

  constructor(baseUrl = '') {
    this.baseUrl = baseUrl
  }

  // Generic request method with full type safety
  private async request<T>(
    path: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${path}`
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    })

    if (!response.ok) {
      const errorData: ApiError = await response.json().catch(() => ({
        error: response.statusText,
        status: response.status,
      }))
      
      throw new Error(errorData.error || `Request failed: ${response.statusText}`)
    }

    return response.json()
  }

  // Stats endpoints
  stats = {
    getDashboard: (): Promise<typeof API_ENDPOINTS.stats.dashboard.response> => 
      this.request<DashboardStats>(
        API_ENDPOINTS.stats.dashboard.path
      ),
  }

  // User Profile endpoints
  userProfile = {
    get: async (userId: string): Promise<typeof API_ENDPOINTS.userProfile.get.response> => {
      const profile = await this.request<UserProfile>(
        API_ENDPOINTS.userProfile.get.path(userId)
      )
      // Transform date strings back to Date objects
      return {
        ...profile,
        dateOfBirth: profile.dateOfBirth ? new Date(profile.dateOfBirth) : null,
        createdAt: new Date(profile.createdAt),
        updatedAt: new Date(profile.updatedAt),
      }
    },

    create: async (data: typeof API_ENDPOINTS.userProfile.create.request): Promise<typeof API_ENDPOINTS.userProfile.create.response> => {
      const profile = await this.request<UserProfile>(
        API_ENDPOINTS.userProfile.create.path,
        {
          method: API_ENDPOINTS.userProfile.create.method,
          body: JSON.stringify(data),
        }
      )
      // Transform date strings back to Date objects
      return {
        ...profile,
        dateOfBirth: profile.dateOfBirth ? new Date(profile.dateOfBirth) : null,
        createdAt: new Date(profile.createdAt),
        updatedAt: new Date(profile.updatedAt),
      }
    },

    update: async (userId: string, data: typeof API_ENDPOINTS.userProfile.update.request): Promise<typeof API_ENDPOINTS.userProfile.update.response> => {
      const profile = await this.request<UserProfile>(
        API_ENDPOINTS.userProfile.update.path(userId),
        {
          method: API_ENDPOINTS.userProfile.update.method,
          body: JSON.stringify(data),
        }
      )
      // Transform date strings back to Date objects
      return {
        ...profile,
        dateOfBirth: profile.dateOfBirth ? new Date(profile.dateOfBirth) : null,
        createdAt: new Date(profile.createdAt),
        updatedAt: new Date(profile.updatedAt),
      }
    },
  }
}

// Export singleton instance
export const apiClient = new ApiClient()
