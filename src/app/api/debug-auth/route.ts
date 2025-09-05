import { NextResponse } from 'next/server'
import { env } from '@/lib/env'

export async function GET() {
  return NextResponse.json({
    providers: {
      github: {
        hasClientId: !!env.GITHUB_CLIENT_ID,
        hasClientSecret: !!env.GITHUB_CLIENT_SECRET,
        isNotPlaceholder: env.GITHUB_CLIENT_ID !== 'your_github_client_id',
        isConfigured: !!(env.GITHUB_CLIENT_ID && env.GITHUB_CLIENT_SECRET && env.GITHUB_CLIENT_ID !== 'your_github_client_id')
      },
      google: {
        hasClientId: !!env.GOOGLE_CLIENT_ID,
        hasClientSecret: !!env.GOOGLE_CLIENT_SECRET,
        isNotPlaceholder: env.GOOGLE_CLIENT_ID !== 'your_google_client_id',
        isConfigured: !!(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET && env.GOOGLE_CLIENT_ID !== 'your_google_client_id')
      }
    },
    env: {
      GITHUB_CLIENT_ID: env.GITHUB_CLIENT_ID ? '***' + env.GITHUB_CLIENT_ID.slice(-4) : 'missing',
      GOOGLE_CLIENT_ID: env.GOOGLE_CLIENT_ID ? '***' + env.GOOGLE_CLIENT_ID.slice(-4) : 'missing',
    }
  })
}
