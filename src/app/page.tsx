import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Next.js Golden Template</h1>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Hero Section */}
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold tracking-tight">
              Welcome to Your Template
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A comprehensive, production-ready Next.js template with TypeScript, 
              Shadcn/ui, dark mode, and modern development tools.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>🎨 Modern UI</CardTitle>
                <CardDescription>
                  Built with Shadcn/ui and Tailwind CSS
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Beautiful, accessible components with dark mode support out of the box.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>⚡ TypeScript</CardTitle>
                <CardDescription>
                  Type-safe development experience
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Full TypeScript support with strict type checking and IntelliSense.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>🚀 Production Ready</CardTitle>
                <CardDescription>
                  Optimized for deployment
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Environment validation, performance optimization, and deployment guides.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Demo Form */}
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Component Demo</CardTitle>
              <CardDescription>
                Try out the form components
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="your@email.com" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input 
                  id="name" 
                  type="text" 
                  placeholder="Your name" 
                />
              </div>
              <Button className="w-full">
                Get Started
              </Button>
            </CardContent>
          </Card>

          {/* Status Info */}
          <div className="text-center text-sm text-muted-foreground">
            <p>✅ Phase 1: Core Setup Complete</p>
            <p>🎨 Phase 2: UI Foundation - In Progress</p>
          </div>
        </div>
      </main>
    </div>
  );
}
