-- Database schema for Next.js Golden Template
-- This file contains the initial database setup

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

--
-- NextAuth.js Schema for Supabase
-- This schema is required for the Supabase adapter
--

-- Name: next_auth; Type: SCHEMA;
CREATE SCHEMA IF NOT EXISTS next_auth;

GRANT USAGE ON SCHEMA next_auth TO service_role;
GRANT ALL ON SCHEMA next_auth TO postgres;

-- Create users table
CREATE TABLE IF NOT EXISTS next_auth.users
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    name text,
    email text,
    "emailVerified" timestamp with time zone,
    image text,
    CONSTRAINT users_pkey PRIMARY KEY (id),
    CONSTRAINT email_unique UNIQUE (email)
);

GRANT ALL ON TABLE next_auth.users TO postgres;
GRANT ALL ON TABLE next_auth.users TO service_role;

--- uid() function to be used in RLS policies
CREATE OR REPLACE FUNCTION next_auth.uid() RETURNS uuid
    LANGUAGE sql STABLE
    AS $$
  select
  	coalesce(
		nullif(current_setting('request.jwt.claim.sub', true), ''),
		(nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub')
	)::uuid
$$;

-- Create sessions table
CREATE TABLE IF NOT EXISTS next_auth.sessions
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    expires timestamp with time zone NOT NULL,
    "sessionToken" text NOT NULL,
    "userId" uuid,
    CONSTRAINT sessions_pkey PRIMARY KEY (id),
    CONSTRAINT sessionToken_unique UNIQUE ("sessionToken"),
    CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId")
        REFERENCES next_auth.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
);

GRANT ALL ON TABLE next_auth.sessions TO postgres;
GRANT ALL ON TABLE next_auth.sessions TO service_role;

-- Create accounts table
CREATE TABLE IF NOT EXISTS next_auth.accounts
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    type text NOT NULL,
    provider text NOT NULL,
    "providerAccountId" text NOT NULL,
    refresh_token text,
    access_token text,
    expires_at bigint,
    token_type text,
    scope text,
    id_token text,
    session_state text,
    oauth_token_secret text,
    oauth_token text,
    "userId" uuid,
    CONSTRAINT accounts_pkey PRIMARY KEY (id),
    CONSTRAINT provider_unique UNIQUE (provider, "providerAccountId"),
    CONSTRAINT "accounts_userId_fkey" FOREIGN KEY ("userId")
        REFERENCES next_auth.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
);

GRANT ALL ON TABLE next_auth.accounts TO postgres;
GRANT ALL ON TABLE next_auth.accounts TO service_role;

-- Create verification_tokens table
CREATE TABLE IF NOT EXISTS next_auth.verification_tokens
(
    identifier text,
    token text,
    expires timestamp with time zone NOT NULL,
    CONSTRAINT verification_tokens_pkey PRIMARY KEY (token),
    CONSTRAINT token_unique UNIQUE (token),
    CONSTRAINT token_identifier_unique UNIQUE (token, identifier)
);

GRANT ALL ON TABLE next_auth.verification_tokens TO postgres;
GRANT ALL ON TABLE next_auth.verification_tokens TO service_role;

--
-- Application Schema
-- Your application-specific tables
--

-- Users table (extends NextAuth users)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  image TEXT,
  role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Posts table for demo CRUD operations
CREATE TABLE IF NOT EXISTS posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  content TEXT,
  author_id UUID REFERENCES users(id) ON DELETE SET NULL,
  published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_posts_author_id ON posts(author_id);
CREATE INDEX IF NOT EXISTS idx_posts_published ON posts(published);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);

-- Insert a default admin user (optional - for development)
-- Note: In production, you should create admin users through your application
INSERT INTO users (email, name, role) 
VALUES ('admin@example.com', 'Admin User', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Insert some sample posts (optional - for development)
INSERT INTO posts (title, content, author_id, published)
SELECT 
  'Welcome to the Next.js Golden Template',
  'This is a sample post to demonstrate the database integration. You can create, read, update, and delete posts through the admin interface.',
  users.id,
  true
FROM users 
WHERE users.email = 'admin@example.com'
ON CONFLICT DO NOTHING;

INSERT INTO posts (title, content, author_id, published)
SELECT 
  'Draft Post Example',
  'This is a draft post that demonstrates unpublished content. Only admins and the author can see draft posts.',
  users.id,
  false
FROM users 
WHERE users.email = 'admin@example.com'
ON CONFLICT DO NOTHING;
