# Database Setup Guide

This guide walks you through setting up a PostgreSQL database for the Next.js Golden Template with Drizzle ORM and NextAuth.js integration.

## Prerequisites

- Node.js and npm installed
- A PostgreSQL database (local or hosted)

## Database Providers

You can use any PostgreSQL provider. Here are some popular options:

### 1. Supabase (Recommended for beginners)
- **Free tier**: 500MB database, 50MB file storage
- **Features**: Built-in auth, storage, edge functions, dashboard
- **Good for**: Full-stack applications, real-time features
- [Sign up at supabase.com](https://supabase.com)

### 2. Neon (Serverless PostgreSQL)
- **Free tier**: 3 projects, 512MB storage  
- **Features**: Branching, autoscaling, modern developer experience
- **Good for**: Modern applications, CI/CD workflows
- [Sign up at neon.tech](https://neon.tech)

### 3. Vercel Postgres
- **Free tier**: 256MB storage, 60MB data transfer
- **Features**: Seamless Vercel integration, edge regions
- **Good for**: Applications deployed on Vercel
- [Enable in Vercel dashboard](https://vercel.com/storage/postgres)

### 4. Railway
- **Free tier**: $5 credit per month
- **Features**: Simple setup, built-in monitoring
- **Good for**: Quick prototyping and simple deployments
- [Sign up at railway.app](https://railway.app)

## Local Development Setup

### Option 1: Supabase Local (Recommended)

1. **Install Supabase CLI**:
   ```bash
   npm install -g supabase
   ```

2. **Initialize Supabase in your project**:
   ```bash
   cd /path/to/your/project
   npx supabase init
   ```

3. **Start local Supabase**:
   ```bash
   npx supabase start
   ```

4. **Update your environment variables** (`.env.local`):
   ```bash
   DATABASE_URL="postgresql://postgres:postgres@localhost:54322/postgres"
   
   # Authentication
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secure-secret"
   
   # OAuth providers (see setup guides)
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   ```

5. **Run database migrations**:
   ```bash
   npm run db:migrate
   ```

### Option 2: Docker PostgreSQL

1. **Run PostgreSQL in Docker**:
   ```bash
   docker run --name postgres \\
     -e POSTGRES_PASSWORD=postgres \\
     -e POSTGRES_DB=mydatabase \\
     -p 5432:5432 \\
     -d postgres:15
   ```

2. **Update environment variables**:
   ```bash
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/mydatabase"
   ```

3. **Run database migrations**:
   ```bash
   npm run db:migrate
   ```

## Production Setup

### Supabase Production

1. **Create a Supabase project**:
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Note your database password

2. **Get your database URL**:
   - Go to Settings → Database
   - Copy the "Connection string" under "Connection pooling"
   - Format: `postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres`

3. **Set production environment variables**:
   ```bash
   DATABASE_URL="your-supabase-connection-string"
   NEXTAUTH_URL="https://yourapp.com"
   NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
   ```

### Other Providers

For other providers, get your connection string from your provider's dashboard and use it as the `DATABASE_URL`.

## Database Schema Setup

### 1. Run Migrations

The project uses Drizzle migrations to set up your database schema:

```bash
# Apply all migrations
npm run db:migrate
```

This creates the necessary tables for:
- NextAuth.js authentication (users, accounts, sessions, verification tokens)
- Any custom application tables

### 2. Verify Schema

You can verify your schema using Drizzle Studio:

```bash
# Open Drizzle Studio
npm run db:studio
```

This opens a visual database browser at `http://localhost:4983`.

### 3. Generate New Migrations (When adding features)

When you add new tables or modify the schema:

```bash
# Generate a new migration
npm run db:generate

# Apply the migration  
npm run db:migrate
```

## Environment Configuration

### Required Variables

```bash
# Database connection (required)
DATABASE_URL="postgresql://user:password@host:port/database"

# Authentication (required)
NEXTAUTH_URL="http://localhost:3000" # or your production URL
NEXTAUTH_SECRET="your-secure-secret"

# OAuth providers (at least one required)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

### Generate Secure Secret

For production, generate a secure secret:

```bash
# Generate a secure NEXTAUTH_SECRET
openssl rand -base64 32
```

## Testing Your Setup

1. **Start your development server**:
   ```bash
   npm run dev
   ```

2. **Test authentication**:
   - Visit `http://localhost:3000`
   - Try signing in with your configured OAuth provider
   - Check that user data is saved in the database

3. **Test database operations**:
   - Visit `/dashboard` to see user statistics
   - Verify database queries are working

## Development Workflow

### Adding New Tables

1. **Update schema** (`src/lib/db/schema/app.ts`):
   ```typescript
   export const posts = pgTable('posts', {
     id: text('id').primaryKey(),
     title: text('title').notNull(),
     content: text('content'),
     userId: text('userId').references(() => users.id),
     createdAt: timestamp('createdAt').defaultNow(),
   })
   ```

2. **Generate migration**:
   ```bash
   npm run db:generate
   ```

3. **Apply migration**:
   ```bash
   npm run db:migrate
   ```

4. **Add database operations** (`src/lib/db/index.ts`):
   ```typescript
   export const dbOperations = {
     // ... existing operations
     
     async createPost(data: NewPost) {
       const [post] = await db.insert(posts).values(data).returning()
       return post
     }
   }
   ```

## Troubleshooting

### Common Issues

**1. Connection errors**
- Verify your `DATABASE_URL` format
- Check network access to your database
- Ensure the database is running

**2. Migration errors**
- Check for schema conflicts
- Verify you have the latest migrations
- Try resetting local database if needed

**3. Authentication not working**
- Verify OAuth provider setup
- Check `NEXTAUTH_SECRET` is set
- Ensure callback URLs are correct

**4. TypeScript errors**
- Run `npm run db:generate` to update types
- Restart your TypeScript server

### Getting Help

- Check the [Drizzle ORM Documentation](https://orm.drizzle.team)
- Visit the [NextAuth.js Documentation](https://authjs.dev)
- Review the project's database architecture docs

## Security Best Practices

⚠️ **Important Security Notes:**

1. **Never commit `.env.local`** - contains sensitive credentials
2. **Use strong database passwords** in production
3. **Rotate credentials** if compromised
4. **Use connection pooling** in production for performance
5. **Validate all inputs** with Zod before database operations
6. **Generate secure secrets**: `openssl rand -base64 32`

## Next Steps

Once your database is set up:

1. Configure OAuth providers (see `setupGuides/`)
2. Add custom database tables for your application
3. Deploy to production
4. Set up monitoring and backups

Your Next.js app is now ready with a fully type-safe database layer powered by Drizzle ORM!
