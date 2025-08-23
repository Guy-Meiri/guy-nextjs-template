import { createClient } from '@supabase/supabase-js'
import { Database } from './database.types'

// Type-safe server-side Supabase client with Service Role Key
export const supabaseAdmin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
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
  // User operations with full type safety
  async getUsers() {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  }
  
  async getUserById(id: string) {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  }
  
  async getUserByEmail(email: string) {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', email)
      .single()
    
    if (error) throw error
    return data
  }
  
  async createUser(userData: Database['public']['Tables']['users']['Insert']) {
    const { data, error } = await supabaseAdmin
      .from('users')
      .insert(userData)
      .select()
      .single()
    
    if (error) throw error
    return data
  }
  
  async updateUser(id: string, userData: Database['public']['Tables']['users']['Update']) {
    const { data, error } = await supabaseAdmin
      .from('users')
      .update({
        ...userData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  }
  
  async deleteUser(id: string) {
    const { error } = await supabaseAdmin
      .from('users')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
  
  // Posts operations with full type safety
  async getPosts() {
    const { data, error } = await supabaseAdmin
      .from('posts')
      .select(`
        *,
        author:users(id, name, email)
      `)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  }
  
  async getPostById(id: string) {
    const { data, error } = await supabaseAdmin
      .from('posts')
      .select(`
        *,
        author:users(id, name, email)
      `)
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  }
  
  async getPostsByAuthor(authorId: string) {
    const { data, error } = await supabaseAdmin
      .from('posts')
      .select(`
        *,
        author:users(id, name, email)
      `)
      .eq('author_id', authorId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  }
  
  async getPublishedPosts() {
    const { data, error } = await supabaseAdmin
      .from('posts')
      .select(`
        *,
        author:users(id, name, email)
      `)
      .eq('published', true)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  }
  
  async createPost(postData: Database['public']['Tables']['posts']['Insert']) {
    const { data, error } = await supabaseAdmin
      .from('posts')
      .insert(postData)
      .select(`
        *,
        author:users(id, name, email)
      `)
      .single()
    
    if (error) throw error
    return data
  }
  
  async updatePost(id: string, postData: Database['public']['Tables']['posts']['Update']) {
    const { data, error } = await supabaseAdmin
      .from('posts')
      .update({
        ...postData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select(`
        *,
        author:users(id, name, email)
      `)
      .single()
    
    if (error) throw error
    return data
  }
  
  async deletePost(id: string) {
    const { error } = await supabaseAdmin
      .from('posts')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
  
  // Statistics for admin dashboard
  async getStats() {
    const [usersResult, postsResult, publishedPostsResult] = await Promise.all([
      supabaseAdmin.from('users').select('id', { count: 'exact', head: true }),
      supabaseAdmin.from('posts').select('id', { count: 'exact', head: true }),
      supabaseAdmin.from('posts').select('id', { count: 'exact', head: true }).eq('published', true)
    ])
    
    if (usersResult.error) throw usersResult.error
    if (postsResult.error) throw postsResult.error
    if (publishedPostsResult.error) throw publishedPostsResult.error
    
    return {
      totalUsers: usersResult.count || 0,
      totalPosts: postsResult.count || 0,
      publishedPosts: publishedPostsResult.count || 0,
      draftPosts: (postsResult.count || 0) - (publishedPostsResult.count || 0)
    }
  }
}

// Export singleton instance
export const db = new DatabaseService()

// Type exports for use in API routes and components
export type User = Database['public']['Tables']['users']['Row']
export type NewUser = Database['public']['Tables']['users']['Insert']
export type UpdateUser = Database['public']['Tables']['users']['Update']

export type Post = Database['public']['Tables']['posts']['Row']
export type NewPost = Database['public']['Tables']['posts']['Insert']
export type UpdatePost = Database['public']['Tables']['posts']['Update']

// Enhanced types with relations
export type PostWithAuthor = Post & {
  author: {
    id: string
    name: string | null
    email: string
  } | null
}

export type DatabaseStats = {
  totalUsers: number
  totalPosts: number
  publishedPosts: number
  draftPosts: number
}
