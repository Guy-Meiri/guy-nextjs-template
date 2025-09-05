# User Profile Setup Guide

Quick guide to implementing user profiles with the established patterns.

## Overview

The user profile system demonstrates the complete pattern for adding new features:
- Database schema with Drizzle ORM
- Type-safe API client with validation
- React Query hooks for data management
- Form components with validation

## Implementation Pattern

### 1. Database Schema (`src/lib/db/schema/auth.ts`)
```typescript
export const userProfiles = pgTable('user_profile', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text('userId').notNull().unique().references(() => users.id, { onDelete: 'cascade' }),
  nickname: text('nickname'),
  dateOfBirth: date('dateOfBirth', { mode: 'date' }),
  createdAt: timestamp('createdAt', { mode: 'date' }).defaultNow(),
  updatedAt: timestamp('updatedAt', { mode: 'date' }).defaultNow(),
})
```

### 2. Database Operations (`src/lib/db/index.ts`)
```typescript
export const dbOperations = {
  async getUserProfile(userId: string) {
    const [profile] = await db.select().from(schema.userProfiles)
      .where(eq(schema.userProfiles.userId, userId)).limit(1)
    return profile || null
  },
  
  async createUserProfile(data: typeof schema.userProfiles.$inferInsert) {
    const [profile] = await db.insert(schema.userProfiles).values(data).returning()
    return profile
  },
}
```

### 3. API Types & Validation (`src/lib/api.types.ts`)
```typescript
export type UserProfile = {
  id: string
  userId: string
  nickname: string | null
  dateOfBirth: Date | null
  createdAt: Date
  updatedAt: Date
}

export const userProfileFormSchema = z.object({
  nickname: z.string().min(1).max(50),
  dateOfBirth: z.string().min(1),
})

export type UserProfileFormData = z.infer<typeof userProfileFormSchema>
```

### 4. API Routes
- `POST /api/user-profile` - Create profile
- `GET /api/user-profile/[userId]` - Get profile  
- `PUT /api/user-profile/[userId]` - Update profile

### 5. Custom Hook (`src/hooks/use-user-profile.ts`)
```typescript
export function useUserProfile() {
  const { data: session } = useSession()
  const userId = session?.user?.id

  const profileQuery = useQuery({
    queryKey: ['userProfile', userId],
    queryFn: () => apiClient.userProfile.get(userId!),
    enabled: !!userId,
  })

  return {
    profile: profileQuery.data,
    createProfile: createProfileMutation.mutateAsync,
    updateProfile: updateProfileMutation.mutateAsync,
    isLoading: profileQuery.isLoading,
  }
}
```

### 6. Component (`src/components/profile/user-profile-form.tsx`)
- Uses imported form schema and types
- Implements create/update logic
- Handles loading states and validation

## Testing

1. **Start local database**: `npm run supabase:start`
2. **Apply schema**: `npm run db:push`
3. **Visit profile page**: `/profile`
4. **Test CRUD operations**: Create, read, update profile data

This pattern can be replicated for any new feature requiring database operations.
