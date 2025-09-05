import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { dbOperations } from '@/lib/db'
import { z } from 'zod'

// Validation schema for user profile data
const userProfileSchema = z.object({
  nickname: z.string().min(1, 'Nickname is required').max(50, 'Nickname must be less than 50 characters').optional(),
  dateOfBirth: z.string().transform(str => str ? new Date(str) : null).optional(),
})

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = userProfileSchema.parse(body)

    // Check if profile already exists
    const existingProfile = await dbOperations.getUserProfile(session.user.id)
    if (existingProfile) {
      return NextResponse.json({ error: 'Profile already exists' }, { status: 409 })
    }

    // Create new profile
    const profile = await dbOperations.createUserProfile({
      userId: session.user.id,
      nickname: validatedData.nickname || null,
      dateOfBirth: validatedData.dateOfBirth || null,
    })

    return NextResponse.json(profile)
  } catch (error) {
    console.error('Error creating user profile:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid data', details: error.issues }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
