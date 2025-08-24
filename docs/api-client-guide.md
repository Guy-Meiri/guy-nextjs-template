# Type-Safe API Client Guide

A fully type-safe API client that eliminates hardcoded paths and provides excellent TypeScript intellisense.

## How It Works

Single source of truth for all API endpoints:

```typescript
// src/lib/api-client.ts
const API_ENDPOINTS = {
  stats: {
    dashboard: {
      method: 'GET' as const,
      path: '/api/stats' as const,
      response: {} as { totalUsers: number }
    }
  }
} as const

export type ApiEndpoints = typeof API_ENDPOINTS
```

**Benefits**: Type safety, no hardcoded paths, full IntelliSense, refactor-safe, runtime + compile time validation.

## Adding New APIs

### 1. Define Endpoint

```typescript
const API_ENDPOINTS = {
  // existing endpoints...
  users: {
    profile: {
      method: 'GET' as const,
      path: '/api/users/profile' as const,
      response: {} as { id: string; name: string; email: string }
    },
    updateProfile: {
      method: 'PUT' as const,
      path: '/api/users/profile' as const,
      request: {} as { name: string },
      response: {} as { id: string; name: string; email: string }
    }
  }
} as const
```

### 2. Add Client Methods

```typescript
export class ApiClient {
  users = {
    getProfile: () => 
      this.request<ApiEndpoints['users']['profile']['response']>(
        API_ENDPOINTS.users.profile.path
      ),
    
    updateProfile: (data: ApiEndpoints['users']['updateProfile']['request']) =>
      this.request<ApiEndpoints['users']['updateProfile']['response']>(
        API_ENDPOINTS.users.updateProfile.path,
        { method: 'PUT', body: JSON.stringify(data) }
      ),
  }
}
```

### 3. Create API Route

```typescript
// src/app/api/users/profile/route.ts
import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'

export async function GET() {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  return NextResponse.json({
    id: session.user.id,
    name: session.user.name,
    email: session.user.email
  })
}

export async function PUT(request: Request) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  const data = await request.json()
  // Update user logic here
  return NextResponse.json({ /* updated user */ })
}
```

### 4. Create React Hooks

```typescript
// src/hooks/use-data.ts
export function useUserProfile() {
  return useQuery({
    queryKey: ['users', 'profile'],
    queryFn: () => apiClient.users.getProfile(),
  })
}

export function useUpdateProfile() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: apiClient.users.updateProfile,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users', 'profile'] }),
  })
}
```

### 5. Use in Components

```tsx
import { useUserProfile, useUpdateProfile } from '@/hooks/use-data'

export function UserProfile() {
  const { data: user, isLoading } = useUserProfile()
  const updateProfile = useUpdateProfile()

  if (isLoading) return <div>Loading...</div>
  
  return (
    <div>
      <h1>Welcome, {user?.name}</h1>
      <button onClick={() => updateProfile.mutate({ name: 'New Name' })}>
        Update
      </button>
    </div>
  )
}
```

## Best Practices

### Group by Feature
```typescript
const API_ENDPOINTS = {
  auth: { login: {}, logout: {}, refresh: {} },
  users: { profile: {}, update: {}, delete: {} },
  posts: { list: {}, create: {}, update: {}, delete: {} }
}
```

### Handle Path Parameters
```typescript
posts = {
  get: (id: string) => this.request(`/api/posts/${id}`),
  update: (id: string, data: UpdatePost) => 
    this.request(`/api/posts/${id}`, { method: 'PUT', body: JSON.stringify(data) })
}
```

### Export Types
```typescript
export type UserProfile = ApiEndpoints['users']['profile']['response']
export type UpdateProfileRequest = ApiEndpoints['users']['updateProfile']['request']
```

### Advanced Patterns

**Optimistic Updates:**
```typescript
export function useUpdateProfile() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: apiClient.users.updateProfile,
    onMutate: async (newData) => {
      await queryClient.cancelQueries({ queryKey: ['users', 'profile'] })
      const previous = queryClient.getQueryData(['users', 'profile'])
      queryClient.setQueryData(['users', 'profile'], (old: any) => ({ ...old, ...newData }))
      return { previous }
    },
    onError: (err, newData, context) => {
      queryClient.setQueryData(['users', 'profile'], context?.previous)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['users', 'profile'] })
    },
  })
}
```

**Error Handling:**
```typescript
export function useUserProfile() {
  return useQuery({
    queryKey: ['users', 'profile'],
    queryFn: () => apiClient.users.getProfile(),
    retry: (failureCount, error) => {
      if (error.message.includes('Unauthorized')) return false
      return failureCount < 3
    },
  })
}
```

---

This pattern scales well and maintains excellent type safety throughout your codebase.
