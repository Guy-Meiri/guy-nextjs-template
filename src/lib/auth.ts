import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"
import { SupabaseAdapter } from "@auth/supabase-adapter"
import { env, hasSupabaseConfig } from "./env"

// Only use Supabase adapter if properly configured
const adapter = hasSupabaseConfig() 
  ? SupabaseAdapter({
      url: env.NEXT_PUBLIC_SUPABASE_URL,
      secret: env.SUPABASE_SERVICE_ROLE_KEY,
    })
  : undefined

// Only include providers that are properly configured
const providers = []
if (env.GITHUB_CLIENT_ID && env.GITHUB_CLIENT_SECRET && 
    env.GITHUB_CLIENT_ID !== 'your_github_client_id') {
  providers.push(GitHub({
    clientId: env.GITHUB_CLIENT_ID,
    clientSecret: env.GITHUB_CLIENT_SECRET,
  }))
}
if (env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET &&
    env.GOOGLE_CLIENT_ID !== 'your_google_client_id') {
  providers.push(Google({
    clientId: env.GOOGLE_CLIENT_ID,
    clientSecret: env.GOOGLE_CLIENT_SECRET,
  }))
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter,
  providers,
  callbacks: {
    session({ session, user }) {
      if (user?.id) {
        session.user.id = user.id
      }
      return session
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
})
