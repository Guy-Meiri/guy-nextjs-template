# Database Architecture & Integration Plan

## 🎯 Overview

This document outlines the database integration strategy for the Next.js Golden Template, focusing on NextAuth.js-first architecture with server-side database access and extensible foundation for custom features.

## 🏗️ Architecture Principles

### 1. NextAuth.js-First User Management
- **NextAuth.js handles all user authentication and session management**
- User data stored in `next_auth` schema (automatically created by Supabase adapter)
- No custom user tables needed - NextAuth.js provides complete user management
- OAuth-based authentication (Google, GitHub) as primary sign-in method

### 2. Server-Side Only Database Access
- **No direct client-to-database connections**
- All database operations happen through Next.js API routes
- Client communicates only with Next.js backend via HTTP/REST APIs
- Supabase client used exclusively on the server-side

### 3. Extensible Foundation
- Minimal initial schema focused on authentication
- Easy to extend with custom tables in `public` schema
- Type-safe database operations for custom features
- Modular architecture for adding business logic

### 4. Security First
- Service Role Key used only on server-side
- All security handled at API route level
- Input validation with Zod schemas
- Protected routes via NextAuth.js middleware

## 🗄️ Database Schema Design

### NextAuth.js Schema (Automatic)

The Supabase adapter for NextAuth.js automatically creates these tables in the `next_auth` schema:

```sql
-- Automatically created by NextAuth.js Supabase adapter
-- Located in next_auth schema

next_auth.users (
  id UUID PRIMARY KEY,
  name TEXT,
  email TEXT UNIQUE,
  email_verified TIMESTAMPTZ,
  image TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
)

next_auth.accounts (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES next_auth.users(id),
  type TEXT NOT NULL,
  provider TEXT NOT NULL,
  provider_account_id TEXT NOT NULL,
  -- OAuth provider specific fields
)

next_auth.sessions (
  id UUID PRIMARY KEY,
  session_token TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES next_auth.users(id),
  expires TIMESTAMPTZ NOT NULL
)

next_auth.verification_tokens (
  token TEXT PRIMARY KEY,
  identifier TEXT NOT NULL,
  expires TIMESTAMPTZ NOT NULL
)
```

### Custom Schema (Optional)

For application-specific data, you can add tables to the `public` schema:

```sql
-- Example: User profiles table for extended user data
CREATE TABLE public.profiles (
  id UUID REFERENCES next_auth.users(id) PRIMARY KEY,
  display_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Example: Application-specific data
CREATE TABLE public.posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT,
  author_id UUID REFERENCES next_auth.users(id),
  published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Type-Safe Database Setup

Currently using minimal database types since NextAuth.js handles user management:

## 🛠️ Implementation Architecture

### 1. Database Layer (`lib/db.ts`)

```typescript
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
      totalUsers: 0, // Placeholder - would need RPC function or view to access next_auth.users
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
```

### 2. Type Generation Setup (`lib/database.types.ts`)

Currently minimal since NextAuth.js manages user data. Generated by Supabase CLI:

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
      // Add your custom tables here as you create them
      // Example:
      // profiles: {
      //   Row: {
      //     id: string
      //     user_id: string
      //     display_name: string | null
      //     bio: string | null
      //     avatar_url: string | null
      //     created_at: string
      //     updated_at: string
      //   }
      //   Insert: {
      //     id?: string
      //     user_id: string
      //     display_name?: string | null
      //     bio?: string | null
      //     avatar_url?: string | null
      //     created_at?: string
      //     updated_at?: string
      //   }
      //   Update: {
      //     id?: string
      //     user_id?: string
      //     display_name?: string | null
      //     bio?: string | null
      //     avatar_url?: string | null
      //     created_at?: string
      //     updated_at?: string
      //   }
      //   Relationships: [
      //     {
      //       foreignKeyName: "profiles_user_id_fkey"
      //       columns: ["user_id"]
      //       referencedRelation: "users"
      //       referencedColumns: ["id"]
      //     }
      //   ]
      // }
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
```

### 2. API Routes Structure
```
app/api/
├── auth/
│   └── [...nextauth]/    # NextAuth.js authentication endpoint
│       └── route.ts
├── stats/                # Dashboard statistics
│   └── route.ts         # GET /api/stats (dashboard data)
└── [custom]/            # Add your custom API routes here
    ├── profiles/
    │   ├── route.ts     # GET/POST /api/profiles
    │   └── [id]/
    │       └── route.ts # GET/PUT/DELETE /api/profiles/[id]
    └── posts/           # Example custom resource
        ├── route.ts     # GET/POST /api/posts
        └── [id]/
            └── route.ts # GET/PUT/DELETE /api/posts/[id]
```

### 3. Dashboard Pages Structure
```
app/
├── dashboard/           # Protected user dashboard
│   └── page.tsx        # Dashboard overview with stats
├── auth/               # Authentication pages
│   ├── signin/
│   │   └── page.tsx   # Sign in page
│   └── error/
│       └── page.tsx   # Auth error page
└── [custom]/          # Add your custom pages here
    ├── profile/
    │   └── page.tsx   # User profile management
    └── admin/         # Admin interface (if roles are implemented)
        └── page.tsx   # Admin dashboard
```

### 4. Middleware & Authorization
```typescript
// middleware.ts - Enhanced with protected route handling
import { withAuth } from "next-auth/middleware"

export default withAuth(
  function middleware(req) {
    // Additional middleware logic can go here
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Protect dashboard routes
        if (req.nextUrl.pathname.startsWith('/dashboard')) {
          return !!token
        }
        
        // Protect API routes that require authentication
        if (req.nextUrl.pathname.startsWith('/api/') && 
            !req.nextUrl.pathname.startsWith('/api/auth/')) {
          return !!token
        }
        
        // Example: Admin route protection (if you implement roles)
        // if (req.nextUrl.pathname.startsWith('/admin')) {
        //   return token?.role === 'admin'
        // }
        
        return true
      },
    },
  }
)

export const config = {
  matcher: ['/dashboard/:path*', '/api/:path*']
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
SUPABASE_URL=https://your-project.supabase.co
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
