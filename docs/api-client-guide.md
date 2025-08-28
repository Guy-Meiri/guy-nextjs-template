# Type-Safe API Client Guide

A fully type-safe API client that eliminates hardcoded paths and provides excellent TypeScript intellisense.

## Project Structure

- `src/lib/api-client.types.ts` - Type definitions and endpoint configurations
- `src/lib/api-client.ts` - API client implementation
- `src/hooks/use-data.ts` - React Query hooks

## How It Works

Define endpoints in the types file:

```typescript
// src/lib/api-client.types.ts
export const API_ENDPOINTS = {
  stats: {
    dashboard: {
      method: 'GET' as const,
      path: '/api/stats' as const,
      response: {} as { totalUsers: number }
    }
  }
} as const

export type ApiEndpoints = typeof API_ENDPOINTS
export type DashboardStats = ApiEndpoints['stats']['dashboard']['response']
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
// src/lib/api-client.types.ts
export const API_ENDPOINTS = {
  // existing endpoints...
  users: {
    profile: {
      method: 'GET' as const,
      path: '/api/users/profile' as const,
      response: {} as { id: string; name: string; email: string }
    }
  }
} as const

export type UserProfile = ApiEndpoints['users']['profile']['response']
```

### 2. Add Client Methods

```typescript
// src/lib/api-client.ts
import { API_ENDPOINTS, UserProfile } from './api-client.types'

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
