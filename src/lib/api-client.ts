// Type-safe API client for frontend requests
// This client handles HTTP requests to our Next.js API routes


// Define the API endpoints structure with both runtime and type information
const API_ENDPOINTS = {
  stats: {
    dashboard: {
      method: 'GET' as const,
      path: '/api/stats' as const,
      response: {} as {
        totalUsers: number
      }
    }
  }
  // Add more endpoints here as you create them
  // users: {
  //   profile: {
  //     method: 'GET' as const,
  //     path: '/api/users/profile' as const,
  //     response: {} as UserProfile
  //   }
  // }
} as const

// Extract the type from the const object
export type ApiEndpoints = typeof API_ENDPOINTS

// Generic API error type
export type ApiError = {
  error: string
  status?: number
}

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
        getDashboard: () => 
      this.request<ApiEndpoints['stats']['dashboard']['response']>(
        API_ENDPOINTS.stats.dashboard.path
      ),
  }

  // Add more endpoint groups here
  // users = {
  //   getProfile: () => 
  //     this.request<ApiEndpoints['users']['profile']['response']>(
  //       '/api/users/profile'
  //     ),
  // }
}

// Export singleton instance
export const apiClient = new ApiClient()

// Export types for use in components
export type DashboardStats = ApiEndpoints['stats']['dashboard']['response']
