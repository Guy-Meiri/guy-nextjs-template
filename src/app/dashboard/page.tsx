import { auth } from "@/lib/auth"
import { UserNav } from "@/components/auth/user-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { redirect } from "next/navigation"

export default async function DashboardPage() {
  const session = await auth()

  if (!session?.user) {
    redirect("/auth/signin")
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <UserNav />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              Welcome back, {session.user.name || "User"}!
            </h2>
            <p className="text-muted-foreground">
              This is your protected dashboard.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>✅ Authentication</CardTitle>
                <CardDescription>
                  NextAuth.js v5 with Supabase
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  You&apos;re successfully authenticated!
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>🔐 Protected Route</CardTitle>
                <CardDescription>
                  Middleware protection
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  This page is protected by authentication middleware.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>👤 User Session</CardTitle>
                <CardDescription>
                  Session management
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm space-y-1">
                  <p><strong>Name:</strong> {session.user.name || "N/A"}</p>
                  <p><strong>Email:</strong> {session.user.email || "N/A"}</p>
                  <p><strong>ID:</strong> {session.user.id || "N/A"}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
