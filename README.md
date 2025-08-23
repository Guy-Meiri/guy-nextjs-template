# Next.js Golden Template 🚀

A comprehensive, production-ready Next.js template for building full-stack progressive web apps with TypeScript, modern UI components, and enterprise-grade tooling.

## 🎯 Purpose

This template eliminates repetitive setup work by providing a pre-configured, battle-tested foundation for Next.js applications. Use it to bootstrap new projects instantly with best practices baked in.

## 🛠️ Tech Stack

### Core Framework
- **Next.js 14+** - React framework with App Router
- **TypeScript** - Type-safe development
- **React 18** - Latest React features

### Styling & UI
- **Tailwind CSS** - Utility-first CSS framework with semantic colors
- **Shadcn/ui** - Beautiful, accessible components with dark mode support
- **Dark Mode** - Built-in dark/light theme switching
- **Lucide React** - Modern icon library

### Backend & Database
- **Supabase** - Backend-as-a-Service (Database, Auth, Storage, Edge Functions)
- **PostgreSQL** - Robust relational database (via Supabase)

### Authentication
- **NextAuth.js v5** - Complete authentication solution
- **Supabase Auth** - Integrated with NextAuth for seamless experience

### Data Management
- **TanStack Query (React Query)** - Server state management
- **TanStack Table** - Powerful data tables
- **Zod** - TypeScript-first schema validation

### Development & Deployment
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Vercel** - Deployment platform
- **PWA** - Progressive Web App capabilities

## 🌟 Features

### ✅ Authentication & Authorization
- Multiple auth providers (GitHub, Google, Email)
- Protected routes and middleware
- Role-based access control
- Session management

### ✅ Database & API
- Supabase integration with TypeScript types
- RESTful API routes
- Real-time subscriptions
- File upload and storage

### ✅ UI Components
- Pre-built Shadcn components
- Dark/Light mode toggle with system preference detection
- Semantic color system with Tailwind CSS
- Responsive design
- Accessibility compliant

### ✅ Data Management
- Type-safe API calls with TanStack Query
- Optimistic updates
- Caching strategies
- Error handling

### ✅ Progressive Web App
- Service worker
- Offline capabilities
- App-like experience
- Push notifications ready

### ✅ Developer Experience
- TypeScript throughout
- Pre-commit hooks
- Automated testing setup
- Environment validation

## 🚀 Quick Start

```bash
# Create a new app using this template
npx create-next-app@latest my-new-app --example "https://github.com/guymeiri/guy-nextjs-template"

# Navigate to your project
cd my-new-app

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Supabase and NextAuth configuration

# Run the development server
npm run dev
```

## 📋 Setup Checklist

After creating a new project from this template:

- [ ] Update `package.json` with your project details
- [ ] Configure environment variables in `.env.local`
- [ ] Set up Supabase project and update connection details
- [ ] Configure NextAuth providers and secrets (see OAuth setup guides below)
- [ ] Update site metadata in `app/layout.tsx`
- [ ] Customize the landing page and branding
- [ ] Set up Vercel deployment
- [ ] Configure domain and SSL

## 🔐 OAuth Provider Setup

Detailed step-by-step guides for configuring authentication providers:

- **[Google OAuth Setup](./googleAuthInstruciton.md)** - Complete guide for Google Cloud Console setup
- **[GitHub OAuth Setup](./githubAuthInstructions.md)** - Complete guide for GitHub OAuth App setup

Follow these guides to get your Client IDs and Client Secrets for the environment variables below.

## 🔧 Environment Variables

```bash
# Database
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret

# OAuth Providers
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

## 📁 Project Structure

```
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication routes
│   ├── (dashboard)/       # Protected dashboard routes
│   ├── api/               # API routes
│   ├── globals.css        # Global styles
│   └── layout.tsx         # Root layout
├── components/            # Reusable components
│   ├── ui/               # Shadcn components
│   ├── auth/             # Authentication components
│   └── layout/           # Layout components
├── lib/                  # Utility functions
│   ├── auth.ts          # NextAuth configuration
│   ├── db.ts            # Database client
│   ├── utils.ts         # General utilities
│   └── validations.ts   # Zod schemas
├── hooks/               # Custom React hooks
├── types/               # TypeScript type definitions
├── public/              # Static assets
└── supabase/           # Database migrations and types
```

## 🧪 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript compiler
npm run db:generate  # Generate database types
npm run db:push      # Push database changes
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - feel free to use this template for personal and commercial projects.

## 🔗 Links

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Shadcn/ui Documentation](https://ui.shadcn.com)
- [TanStack Query Documentation](https://tanstack.com/query)
- [NextAuth.js Documentation](https://authjs.dev)

---

Made with ❤️ for rapid Next.js development
