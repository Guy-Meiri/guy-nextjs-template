# Database Architecture & Integration Plan

## 🎯 Overview

This document outlines the database integration strategy for the Next.js Golden Template, focusing on security-first architecture with server-side only database access and comprehensive admin capabilities.

## 🏗️ Architecture Principles

### 1. Server-Side Only Database Access
- **No direct client-to-database connections**
- All database operations happen through Next.js API routes
- Client communicates only with Next.js backend via HTTP/REST APIs
- Supabase client used exclusively on the server-side

### 2. Admin Interface Requirements
- Full CRUD operations on all database entities
- Role-based access control (Admin, User roles)
- Data visualization and management dashboard
- Audit logging for all admin actions

### 3. Security First
- Service Role Key used only on server-side
- Row Level Security (RLS) policies in Supabase
- Input validation with Zod schemas
- Rate limiting on API endpoints

## 🗄️ Database Schema Design

### Core Tables

```sql
-- Users table (extends NextAuth users)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  image TEXT,
  role VARCHAR(50) DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Example: Posts table for demo CRUD operations
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  content TEXT,
  author_id UUID REFERENCES users(id),
  published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Type-Safe Database Setup

For a type-safe Supabase client, we'll use Supabase's built-in TypeScript generation:

```sql
-- Database setup (no RLS for now - simplified approach)
-- Tables are created without Row Level Security policies
-- All security will be handled at the API route level
```

## 🛠️ Implementation Architecture

### 1. Database Layer (`lib/db.ts`)

```typescript
// First, generate TypeScript types from your Supabase schema
// Run: npx supabase gen types typescript --project-id YOUR_PROJECT_ID > srclib/database.types.ts

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
      .update(userData)
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
      .update(postData)
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
```

### 2. Type Generation Setup (`lib/database.types.ts`)

The Supabase CLI will generate this file automatically based on your database schema:

```typescript
// This file is auto-generated by Supabase CLI
// Run: npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/lib/database.types.ts

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string | null
          image: string | null
          role: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name?: string | null
          image?: string | null
          role?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          image?: string | null
          role?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      posts: {
        Row: {
          id: string
          title: string
          content: string | null
          author_id: string | null
          published: boolean | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          content?: string | null
          author_id?: string | null
          published?: boolean | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          content?: string | null
          author_id?: string | null
          published?: boolean | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "posts_author_id_fkey"
            columns: ["author_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

### 2. API Routes Structure
```
app/api/
├── admin/                 # Admin-only endpoints
│   ├── users/
│   │   ├── route.ts      # GET /api/admin/users (list all users)
│   │   └── [id]/
│   │       └── route.ts  # GET/PUT/DELETE /api/admin/users/[id]
│   └── posts/
│       ├── route.ts      # GET /api/admin/posts (list all posts)
│       └── [id]/
│           └── route.ts  # GET/PUT/DELETE /api/admin/posts/[id]
├── users/                # User endpoints
│   └── posts/
│       ├── route.ts      # GET/POST /api/users/posts (user's own posts)
│       └── [id]/
│           └── route.ts  # GET/PUT/DELETE /api/users/posts/[id] (own posts only)
└── public/               # Public endpoints
    └── posts/
        ├── route.ts      # GET /api/public/posts (published posts only)
        └── [id]/
            └── route.ts  # GET /api/public/posts/[id] (published post)
```

### 3. Admin Dashboard Pages
```
app/admin/
├── layout.tsx           # Admin layout with navigation
├── page.tsx            # Admin dashboard overview
├── users/
│   ├── page.tsx        # Users management
│   └── [id]/
│       └── page.tsx    # User details/edit
├── posts/
│   ├── page.tsx        # Posts management
│   └── [id]/
│       └── page.tsx    # Post details/edit
└── components/
    ├── data-table.tsx  # Reusable admin data table
    ├── crud-form.tsx   # Generic CRUD form
    └── stats-cards.tsx # Dashboard statistics
```

### 4. Middleware & Authorization
```typescript
// middleware.ts - Enhanced with admin route protection
export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request })
  
  // Admin routes protection
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!token || token.role !== 'admin') {
      return NextResponse.redirect(new URL('/auth/signin', request.url))
    }
  }
  
  // API routes protection
  if (request.nextUrl.pathname.startsWith('/api/admin')) {
    if (!token || token.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }
  
  // User API routes protection
  if (request.nextUrl.pathname.startsWith('/api/users')) {
    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }
  }
}
```

## 📊 Data Flow

### Client → Server → Database
```
[Client Component] 
    ↓ HTTP Request
[Next.js API Route] 
    ↓ Validate Auth + Input
[Database Service] 
    ↓ Supabase Admin Client
[Supabase Database]
    ↓ Response
[Client Component]
```

### Admin Operations Flow
```
[Admin Dashboard] 
    ↓ Admin Action
[Admin API Route] 
    ↓ Validate Admin Role
[Database Service] 
    ↓ Execute Operation
[Supabase Database]
    ↓ Response
[Admin Dashboard]
```

## 🔐 Security Measures

### 1. Environment Variables Security
```bash
# Server-side only (NEVER expose to client)
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
SUPABASE_DATABASE_PASSWORD=your_db_password

# Client-safe (public)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### 2. API Route Security
- JWT token validation on all protected routes
- Role-based access control for admin endpoints
- Input validation with Zod schemas
- Rate limiting (implement with upstash/ratelimit)
- SQL injection prevention through parameterized queries

### 3. Database Security
- Server-only database access through Service Role Key
- All security handled at API route level (no RLS for simplicity)
- Database connection pooling
- Type-safe database operations

## 🚀 Implementation Phases

### Phase 4A: Database Foundation (Current)
- [ ] Install Supabase client dependencies
- [ ] Create `lib/db.ts` with type-safe admin client
- [ ] Set up database schema and migrations
- [ ] Generate TypeScript types with Supabase CLI
- [ ] Create type-safe database service class

### Phase 4B: API Layer
- [ ] Create admin API routes structure
- [ ] Implement user CRUD operations
- [ ] Add posts CRUD operations
- [ ] Add input validation with Zod
- [ ] Add rate limiting

### Phase 4C: Admin Interface
- [ ] Create admin layout and navigation
- [ ] Build admin dashboard overview
- [ ] Implement users management interface
- [ ] Implement posts management interface
- [ ] Add generic data table component

### Phase 4D: User Interface
- [ ] Create user posts API and pages
- [ ] Add public posts display
- [ ] Create user dashboard

## 📝 Development Guidelines

### 1. Database Operations
- Always use the DatabaseService class with full type safety
- Never expose Service Role Key to client
- Validate all inputs with Zod
- Use Supabase's generated TypeScript types

### 2. API Design
- Follow RESTful conventions
- Use consistent error handling
- Implement proper HTTP status codes
- Add request/response logging

### 3. Admin Interface
- Implement responsive design
- Add loading states and error handling
- Use TanStack Table for data display
- Provide bulk operations where appropriate

### 4. Testing Strategy
- Unit tests for database service methods
- Integration tests for API routes
- E2E tests for admin workflows
- Mock Supabase in test environment

### 5. Type Safety
- Generate types with: `npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/lib/database.types.ts`
- Update types after schema changes
- Use generated types throughout the application

## 🔗 External Dependencies

### Required Packages
```json
{
  "@supabase/supabase-js": "^2.x.x",
  "@tanstack/react-query": "^5.x.x",
  "@tanstack/react-table": "^8.x.x",
  "zod": "^3.x.x",
  "@upstash/ratelimit": "^1.x.x",
  "@upstash/redis": "^1.x.x"
}
```

### Development Tools
```json
{
  "supabase": "^1.x.x",
  "@types/node": "^20.x.x"
}
```

---

## 📚 Next Steps

1. **Review and approve this architecture plan**
2. **Set up Supabase project and obtain credentials**
3. **Begin Phase 4A implementation**
4. **Create database schema and migrations**
5. **Implement basic database service layer**

---

*Last Updated: August 23, 2025*
