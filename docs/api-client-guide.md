# Type-Safe API Client Guide

A fully type-safe API client that eliminates hardcoded paths and provides excellent TypeScript intellisense.

## Project Structure

- `src/lib/api.types.ts` - API response/request type definitions
- `src/lib/api-client.types.ts` - Endpoint configurations and client types
- `src/lib/api-client.ts` - API client implementation
- `src/hooks/use-data.ts` - React Query hooks

## How It Works

Define types and endpoints separately:

```typescript
// src/lib/api.types.ts
export type DashboardStats = {
  totalUsers: number
}

// src/lib/api-client.types.ts
import { DashboardStats } from './api.types'

export const API_ENDPOINTS = {
  stats: {
    dashboard: {
      method: 'GET' as const,
      path: '/api/stats' as const,
      response: {} as DashboardStats
    }
  }
} as const

export type ApiEndpoints = typeof API_ENDPOINTS
```

The client imports and uses these types:

```typescript
// src/lib/api-client.ts
import { API_ENDPOINTS, DashboardStats } from './api-client.types'

export class ApiClient {
  stats = {
    getDashboard: () => this.request<DashboardStats>(API_ENDPOINTS.stats.dashboard.path)
  }
}
```

**Benefits**: Type safety, no hardcoded paths, full IntelliSense, refactor-safe.

## Adding New APIs

### 1. Define Types and Endpoints

```typescript
// src/lib/api.types.ts
export type UserProfile = {
  id: string
  name: string
  email: string
}

// src/lib/api-client.types.ts
import { UserProfile } from './api.types'

export const API_ENDPOINTS = {
  // existing endpoints...
  users: {
    profile: {
      method: 'GET' as const,
      path: '/api/users/profile' as const,
      response: {} as UserProfile
    }
  }
} as const
```

### 2. Add Client Methods

```typescript
// src/lib/api-client.ts
import { API_ENDPOINTS } from './api-client.types'
import { UserProfile } from './api.types'

export class ApiClient {
  users = {
    getProfile: () => this.request<UserProfile>(API_ENDPOINTS.users.profile.path)
  }
}
```

### 3. Create React Hooks

```typescript
// src/hooks/use-data.ts
import { apiClient } from '@/lib/api-client'

export function useUserProfile() {
  return useQuery({
    queryKey: ['users', 'profile'],
    queryFn: () => apiClient.users.getProfile(),
  })
}
```

### 4. Use in Components

```tsx
import { useUserProfile } from '@/hooks/use-data'

export function UserProfile() {
  const { data: user, isLoading } = useUserProfile()
  return <div>Welcome, {user?.name}</div>
}
```

## Best Practices

### File Organization
- Keep all types in `api-client.types.ts`
- Group endpoints by feature (auth, users, posts)
- Export specific types for components

### Type Safety
```typescript
// Export specific types for easy import
export type UserProfile = ApiEndpoints['users']['profile']['response']
export type UpdateProfileRequest = ApiEndpoints['users']['updateProfile']['request']
```

### Error Handling
```typescript
export function useUserProfile() {
  return useQuery({
    queryKey: ['users', 'profile'],
    queryFn: () => apiClient.users.getProfile(),
    retry: (failureCount, error) => {
      if (error.message.includes('Unauthorized')) return false
      return failureCount < 3
    }
  })
}
```

---

This pattern scales well and maintains excellent type safety throughout your codebase.
