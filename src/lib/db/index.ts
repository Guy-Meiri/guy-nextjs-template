import { drizzle } from 'drizzle-orm/postgres-js'
import { count, eq } from 'drizzle-orm'
import postgres from 'postgres'
import { env } from '../env'
import * as schema from './schema'
import type { DashboardStats } from '../api.types'

// Create the connection
const connectionString = env.DATABASE_URL
if (!connectionString) {
  throw new Error('DATABASE_URL is required')
}

// Create postgres client with simpler configuration
const client = postgres(connectionString)

// Create drizzle instance
export const db = drizzle(client, { 
  schema,
  logger: env.NODE_ENV === 'development'
})

// Export the client for direct use if needed
export { client }

// Export schema for external use
export * from './schema'

// Database operations using Drizzle ORM
export const dbOperations = {
  // Get dashboard statistics
  async getStats(): Promise<DashboardStats> {
    try {
      // Count total users
      const [{ totalUsers }] = await db
        .select({ totalUsers: count() })
        .from(schema.users)
      
      return {
        totalUsers,
      }
    } catch (error) {
      console.error('Database error:', error)
      // Return fallback data
      return {
        totalUsers: 0,
      }
    }
  },

  // Get user by ID
  async getUserById(id: string) {
    try {
      const [user] = await db
        .select()
        .from(schema.users)
        .where(eq(schema.users.id, id))
        .limit(1)
      
      return user || null
    } catch (error) {
      console.error('Database error:', error)
      return null
    }
  },

  // Get all users (for admin purposes)
  async getAllUsers() {
    try {
      return await db.select().from(schema.users)
    } catch (error) {
      console.error('Database error:', error)
      return []
    }
  },

  // User Profile operations
  async getUserProfile(userId: string) {
    try {
      const [profile] = await db
        .select()
        .from(schema.userProfiles)
        .where(eq(schema.userProfiles.userId, userId))
        .limit(1)
      
      return profile || null
    } catch (error) {
      console.error('Database error:', error)
      return null
    }
  },

  async createUserProfile(data: typeof schema.userProfiles.$inferInsert) {
    try {
      const [profile] = await db
        .insert(schema.userProfiles)
        .values(data)
        .returning()
      
      return profile
    } catch (error) {
      console.error('Database error:', error)
      throw error
    }
  },

  async updateUserProfile(userId: string, data: Partial<typeof schema.userProfiles.$inferInsert>) {
    try {
      const [profile] = await db
        .update(schema.userProfiles)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(schema.userProfiles.userId, userId))
        .returning()
      
      return profile
    } catch (error) {
      console.error('Database error:', error)
      throw error
    }
  },
}
