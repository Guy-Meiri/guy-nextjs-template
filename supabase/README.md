# Database Setup Guide

This guide will help you set up Supabase database for the Next.js Golden Template.

## 🚀 Quick Setup

### 1. Create Supabase Project

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - **Name**: `nextjs-golden-template` (or your preferred name)
   - **Database Password**: Generate a secure password
   - **Region**: Choose closest to your users
5. Click "Create new project"

### 2. Get Environment Variables

Once your project is created:

1. Go to **Settings** (gear icon in the left sidebar)
2. Click **API** from the settings menu
3. In the **Project API keys** section, you'll see two keys:

#### API Keys to Copy:
- **Project URL** (at the top) → `SUPABASE_URL`
  - Example: `https://your-project-id.supabase.co`

- **anon** `public` key → `SUPABASE_ANON_KEY`
  - This is the first key shown
  - Safe for client-side use
  - Starts with `eyJ...`

- **service_role** `secret` key → `SUPABASE_SERVICE_ROLE_KEY`
  - ⚠️ **CRITICAL**: This is the second key (below the anon key)
  - **Never expose this to client-side code**
  - Has full database access, bypasses all security rules
  - Also starts with `eyJ...` but is much longer
  - Click the "Reveal" or eye icon to show the full key
  - Copy the entire JWT token

### 3. Set Up Database Schema

NextAuth.js with Supabase adapter will automatically create the required authentication tables when you first sign in. No manual schema setup is required for basic authentication.

If you want to add custom tables for your application:

1. Go to **SQL Editor** in your Supabase dashboard
2. Create your custom tables (see Database Schema section for examples)
3. Set up Row Level Security (RLS) policies if needed

### 4. Update Environment Variables

Create a `.env.local` file in your project root:

```bash
# Copy from .env.example and update with your actual values
cp .env.example .env.local
```

Update `.env.local` with your Supabase credentials:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

### 5. Generate TypeScript Types (Optional)

To generate up-to-date TypeScript types from your database:

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Generate types
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/lib/database.types.ts
```

## 🗄️ Database Schema

### Tables

The project uses **NextAuth.js with Supabase adapter** for user management, which automatically creates the necessary authentication tables in the `next_auth` schema:

- `next_auth.users` - User accounts
- `next_auth.accounts` - OAuth account connections  
- `next_auth.sessions` - User sessions
- `next_auth.verification_tokens` - Email verification

### Custom Tables

Currently, the project uses a minimal schema focused on authentication. You can add custom tables in the `public` schema for your application-specific data:

```sql
-- Example: User profiles table (optional)
CREATE TABLE public.profiles (
  id UUID REFERENCES next_auth.users(id) PRIMARY KEY,
  display_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Sample Data

The NextAuth.js adapter will automatically manage user data. No manual user creation is needed - users are created when they sign in via OAuth providers.

## 🔐 Security Notes

### Environment Variables
- **`SUPABASE_SERVICE_ROLE_KEY`** - Server-side only, never expose to client
  - This is **NOT** your database password
  - It's a JWT token that looks like: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
  - Found in Supabase Dashboard → Settings → API → service_role secret key
  - Has complete database access, bypasses Row Level Security (RLS)
- **`NEXT_PUBLIC_*`** - Safe for client-side use
- **Database Password** - Only used for direct PostgreSQL connections, not in your app

### Database Access Pattern
- **Client** → **Next.js API Routes** → **Supabase**
- No direct client-to-database connections
- All security handled at API route level
- Type-safe operations with generated TypeScript types

## 🛠️ Development Workflow

1. **Make schema changes** in Supabase SQL Editor
2. **Re-generate types** with Supabase CLI
3. **Update API routes** to use new schema
4. **Test changes** in development environment

## 📊 Admin Features

Once set up, you'll have access to:
- Authentication via OAuth providers (Google, GitHub)
- Protected routes and middleware
- Session management
- Dashboard with basic statistics
- Extensible architecture for custom features

### Adding Custom Features

To extend the application:
1. **Create custom tables** in the `public` schema
2. **Add API routes** in `src/app/api/`
3. **Create React hooks** for data fetching in `src/hooks/`
4. **Add validation schemas** in `src/lib/validations.ts`

## 🔍 Troubleshooting

### Connection Issues
- Verify environment variables are set correctly
- Check Supabase project is active
- Ensure API keys are valid

### Finding the Service Role Key
1. **Go to Supabase Dashboard** → Your Project
2. **Click Settings** (gear icon in left sidebar)
3. **Click API** from settings menu
4. **Look for "service_role" key** (the second key, marked as "secret")
5. **Click the eye/reveal icon** to show the full key
6. **Copy the entire JWT token** (starts with `eyJ` and is very long)

### Common Mistakes
- ❌ Using database password instead of service role key
- ❌ Using anon key instead of service role key
- ❌ Not revealing/copying the full service role key
- ❌ Exposing service role key in client-side code

### Type Errors
- Re-generate types after schema changes
- The default `database.types.ts` is minimal since NextAuth.js manages user tables
- Add custom table types as you create new tables

### Permission Errors
- Ensure you're using Service Role Key for server-side operations
- Check OAuth provider configuration
- Verify middleware is protecting routes correctly

## 📚 Next Steps

After database setup:
1. Start development server: `npm run dev`
2. Test authentication by signing in with OAuth providers
3. Explore the dashboard to see session information
4. Add custom tables and features as needed

---

For more information, see the [Database Architecture documentation](../docs/database-architecture.md).
