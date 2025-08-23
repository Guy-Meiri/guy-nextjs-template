import { db } from './db'
import type { DatabaseStats } from './db'

// Generic API response wrapper
export async function apiWrapper<T>(
  operation: () => Promise<T>
): Promise<{ success: true; data: T } | { success: false; error: string }> {
  try {
    const data = await operation()
    return { success: true, data }
  } catch (error) {
    console.error('API Error:', error)
    const message = error instanceof Error ? error.message : 'An unexpected error occurred'
    return { success: false, error: message }
  }
}

// Stats API functions
export const statsApi = {
  // Get dashboard statistics
  async getDashboardStats(): Promise<DatabaseStats> {
    return await db.getStats()
  },
}

// Export all APIs
export const api = {
  stats: statsApi,
  wrapper: apiWrapper,
}

// Note: User management is handled by NextAuth.js
// If you need custom user operations, create a profiles table and add userApi back
