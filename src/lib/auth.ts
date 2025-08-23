import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"
import { SupabaseAdapter } from "@auth/supabase-adapter"
import { env } from "./env"

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    // Only include providers that are properly configured
    ...(env.GITHUB_CLIENT_ID && env.GITHUB_CLIENT_SECRET && 
        env.GITHUB_CLIENT_ID !== 'your_github_client_id' ? [
      GitHub({
        clientId: env.GITHUB_CLIENT_ID,
        clientSecret: env.GITHUB_CLIENT_SECRET,
      })
    ] : []),
    ...(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET &&
        env.GOOGLE_CLIENT_ID !== 'your_google_client_id' ? [
      Google({
        clientId: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
      })
    ] : []),
  ],
  adapter: SupabaseAdapter({
    url: process.env.SUPABASE_URL!,
    secret: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  }),
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
