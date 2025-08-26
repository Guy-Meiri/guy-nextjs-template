import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { UserNav } from "@/components/auth/user-nav";
import { auth } from "@/lib/auth";
import Link from "next/link";

interface SiteHeaderProps {
  title?: string;
  showUserNav?: boolean;
}

export async function SiteHeader({ 
  title = "Guy's template", 
  showUserNav = false 
}: SiteHeaderProps) {
  const session = await auth();
  
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">{title}</h1>
        <div className="flex items-center gap-4">
          {showUserNav ? (
            <UserNav />
          ) : (
            <>
              {session?.user ? (
                <Link href="/dashboard">
                  <Button variant="outline">Dashboard</Button>
                </Link>
              ) : (
                <Link href="/auth/signin">
                  <Button variant="outline">Sign In</Button>
                </Link>
              )}
            </>
          )}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
