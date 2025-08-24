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

### NextAuth.js Authentication Flow
```
[Client] 
    ↓ Sign In Request
[NextAuth.js Handler] 
    ↓ OAuth Provider
[Google/GitHub] 
    ↓ User Data
[Supabase Adapter] 
    ↓ Store in next_auth schema
[Supabase Database]
    ↓ Session Token
[Client]
```

### Custom API Operations Flow
```
[Client Component] 
    ↓ HTTP Request + Session
[Next.js API Route] 
    ↓ Validate Session
[Database Service] 
    ↓ Supabase Admin Client
[Supabase Database]
    ↓ Response
[Client Component]
```

### Dashboard Data Flow
```
[Dashboard Page] 
    ↓ TanStack Query
[Stats API Route] 
    ↓ Database Service
[Supabase Database]
    ↓ Stats Data
[Dashboard Components]
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
- NextAuth.js session validation on protected routes
- Input validation with Zod schemas
- Rate limiting (implement with upstash/ratelimit if needed)
- SQL injection prevention through parameterized queries
- No custom role management needed - leverage OAuth provider data

### 3. Database Security
- Server-only database access through Service Role Key
- NextAuth.js handles all user authentication securely
- All custom data security handled at API route level
- Database connection pooling
- Type-safe database operations for custom tables

## 🚀 Implementation Phases

### ✅ Phase 4A: Database Foundation (Completed)
- [x] Install Supabase client dependencies
- [x] Create `lib/db.ts` with type-safe admin client
- [x] Set up NextAuth.js with Supabase adapter
- [x] Generate minimal TypeScript types
- [x] Create simplified database service class

### Phase 4B: API Layer (Optional - Add as needed)
- [ ] Create custom API routes for application features
- [ ] Add input validation with Zod for custom endpoints
- [ ] Implement rate limiting if needed
- [ ] Add custom business logic APIs

### Phase 4C: Extended Features (Optional)
- [ ] Add profiles table for extended user data
- [ ] Implement role-based access (if needed)
- [ ] Create admin interface for user management
- [ ] Add application-specific CRUD operations

### Phase 4D: Advanced Features (Optional)
- [ ] Add real-time subscriptions
- [ ] Implement file upload functionality
- [ ] Add search and filtering capabilities
- [ ] Create analytics and reporting

## 📝 Development Guidelines

### 1. Database Operations
- Use NextAuth.js for all user-related operations
- Use DatabaseService class for custom tables with full type safety
- Never expose Service Role Key to client
- Validate all inputs with Zod for custom APIs
- Leverage Supabase's generated TypeScript types for custom tables

### 2. Authentication
- Use NextAuth.js sessions for authentication state
- Access user data via `useSession()` hook
- Protect routes with NextAuth.js middleware
- Leverage OAuth provider data (no custom user management needed)

### 3. API Design
- Follow RESTful conventions for custom APIs
- Use consistent error handling
- Implement proper HTTP status codes
- Add request/response logging for debugging

### 4. Custom Features
- Add tables to `public` schema for application data
- Create corresponding API routes for CRUD operations
- Build TanStack Query hooks for data fetching
- Use Zod schemas for validation

### 5. Testing Strategy (Future Implementation)
- Unit tests for database service methods (planned)
- Integration tests for custom API routes (planned)  
- E2E tests for authentication flows (planned)
- Mock NextAuth.js and Supabase in test environment (planned)

### 6. Type Safety
- Generate types with: `npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/lib/database.types.ts`
- Update types after adding custom tables
- Use generated types throughout custom features
- NextAuth.js types are handled automatically

## 🔗 External Dependencies

### Required Packages
```json
{
  "@supabase/supabase-js": "^2.x.x",
  "next-auth": "^5.x.x",
  "@auth/supabase-adapter": "^1.x.x",
  "@tanstack/react-query": "^5.x.x",
  "zod": "^3.x.x"
}
```

### Optional Packages (Add as needed)
```json
{
  "@tanstack/react-table": "^8.x.x",
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

1. **✅ Architecture is complete and operational**
2. **Begin Phase 6: PWA Setup** with service workers and offline capabilities
3. **Add custom features as needed**:
   - Create custom tables in `public` schema
   - Build corresponding API routes
   - Add business logic and validation
4. **Enhance with advanced features**:
   - Real-time subscriptions
   - File upload capabilities
   - Search and analytics

---

*Last Updated: August 23, 2025*

**Note**: This architecture now reflects the completed implementation with NextAuth.js-first user management and a clean, extensible foundation for custom features.
