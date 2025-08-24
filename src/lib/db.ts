import { createClient } from '@supabase/supabase-js'
import { Database } from './database.types'

// Type-safe server-side Supabase client with Service Role Key
export const supabaseAdmin = createClient<Database>(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!, // Server-side only!
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

// Type-safe database operations interface
export class DatabaseService {
  // Note: With NextAuth.js + Supabase adapter, user data is managed automatically
  // in the next_auth schema. For most applications, you'll access users via NextAuth.js sessions
  
  // Statistics for admin dashboard
  async getStats() {
    // Since we're using NextAuth.js for user management, we don't have direct access
    // to user tables in our Database type. Return placeholder stats.
    // In a real application, you might create a database function or view for this.
    
    return {
      totalUsers: 3, // Placeholder - would need RPC function or view to access next_auth.users
    }
  }
  
  // Example: If you add a profiles table for extended user data
  // async getUserProfile(userId: string) {
  //   const { data, error } = await supabaseAdmin
  //     .from('profiles')
  //     .select('*')
  //     .eq('user_id', userId)
  //     .single()
  //   
  //   if (error) throw error
  //   return data
  // }
}

// Export singleton instance
export const db = new DatabaseService()

// NextAuth.js user types (these come from next_auth schema)
export type NextAuthUser = {
  id: string
  name: string | null
  email: string | null
  emailVerified: string | null
  image: string | null
}

// Enhanced types
export type DatabaseStats = {
  totalUsers: number
}
