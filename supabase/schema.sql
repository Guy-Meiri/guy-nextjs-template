-- Database schema for Next.js Golden Template
-- This file contains the initial database setup

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

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
