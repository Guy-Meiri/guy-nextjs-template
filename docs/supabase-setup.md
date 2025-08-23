# Supabase Setup Guide

This guide walks you through setting up Supabase for the Next.js Golden Template with NextAuth.js integration.

## Prerequisites

- A Supabase account (sign up at [supabase.com](https://supabase.com))
- Node.js and npm installed

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Choose your organization
4. Fill in your project details:
   - **Name**: Choose a meaningful name (e.g., "my-nextjs-app")
   - **Database Password**: Generate a strong password (save this!)
   - **Region**: Choose the region closest to your users
5. Click "Create new project"
6. Wait for the project to be created (usually takes 1-2 minutes)

## Step 2: Get Your Environment Variables

Once your project is ready:

1. Go to your project dashboard
2. Click on **Settings** (gear icon) in the sidebar
3. Click on **API** in the settings menu
4. Copy the following values:

   ```bash
   # From "Project URL"
   SUPABASE_URL=https://your-project-id.supabase.co
   
   # From "Project API keys" -> "anon public" 
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
   
   # From "Project API keys" -> "service_role" (click reveal)
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
   ```

## Step 3: Add Environment Variables

1. In your project root, copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Open `.env.local` and add your Supabase credentials:
   ```bash
   # Database
   SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
   
   # Authentication (generate a secure secret)
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_nextauth_secret_here
   
   # OAuth Providers (see OAuth setup guides)
   GITHUB_CLIENT_ID=your_github_client_id
   GITHUB_CLIENT_SECRET=your_github_client_secret
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   ```

## Step 4: Set Up the Database Schema

Run the SQL schema to create the required tables for NextAuth.js and your application:

1. Go to your Supabase project dashboard
2. Click on **SQL Editor** in the sidebar
3. Click **New Query**
4. Copy and paste the contents of `supabase/schema.sql`
5. Click **Run** to execute the schema

The schema includes:
- NextAuth.js tables (`next_auth` schema)
- Application users table (`public` schema)
- Proper permissions and indexes

## Step 5: Configure Schema Exposure

To use the NextAuth.js tables with the Supabase adapter:

### For Production (Supabase Dashboard)
1. Go to **Settings** → **API**
2. Scroll down to **Schema Settings**
3. In **Exposed schemas**, add `next_auth` to the list
4. Click **Save**

### For Local Development (Supabase CLI)
If you're using the Supabase CLI for local development:

1. In your `supabase/config.toml` file, find the `[api]` section
2. Add `next_auth` to the schemas array:
   ```toml
   [api]
   enabled = true
   port = 54321
   schemas = ["public", "next_auth", "graphql_public"]
   ```

## Step 6: Generate TypeScript Types (Optional)

Generate TypeScript types for your database:

```bash
# Install Supabase CLI if you haven't already
npm install -g supabase

# Login to Supabase
supabase login

# Link your project (you'll need your project reference ID)
supabase link --project-ref your-project-ref

# Generate types
supabase gen types typescript --local > src/lib/database.types.ts
```

## Step 7: Test Your Setup

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Visit `http://localhost:3000` and try to sign in with your configured OAuth providers

3. Check your Supabase dashboard → **Authentication** → **Users** to see if users are being created

## Troubleshooting

### Common Issues

**1. "Invalid JWT" errors**
- Make sure your `SUPABASE_SERVICE_ROLE_KEY` is correct
- Ensure the `next_auth` schema is exposed in your API settings

**2. "Table doesn't exist" errors**
- Run the SQL schema from `supabase/schema.sql`
- Make sure all tables are created in the correct schemas

**3. OAuth provider errors**
- Check your OAuth provider setup (see `howTo/` folder for guides)
- Ensure your redirect URLs are correctly configured

**4. Permission errors**
- Verify that the service role has the correct permissions
- Check that the schema grants are applied correctly

### Getting Help

- Check the [Supabase Documentation](https://supabase.com/docs)
- Visit the [NextAuth.js Documentation](https://authjs.dev)
- Join the [Supabase Discord](https://discord.supabase.com)

## Security Notes

⚠️ **Important Security Reminders:**

1. **Never commit your `.env.local` file** - it contains sensitive keys
2. **Use strong passwords** for your database
3. **Rotate your service role key** if it's ever compromised
4. **Use Row Level Security (RLS)** policies for production data protection
5. **Generate a secure NEXTAUTH_SECRET** for production:
   ```bash
   openssl rand -base64 32
   ```

## Next Steps

Once your Supabase setup is complete:

1. Configure your OAuth providers (see `howTo/` guides)
2. Set up Row Level Security policies
3. Deploy to production
4. Configure production environment variables

Your Next.js app should now be fully integrated with Supabase for authentication and database operations!
