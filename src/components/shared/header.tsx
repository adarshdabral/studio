
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Rocket, LogOut, LayoutDashboard } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useToast } from "@/hooks/use-toast";

export default function Header() {
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
      router.push("/");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Logout Failed",
        description: error.message,
      });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center">
        <Link href="/" className="mr-6 flex items-center p-0.5 rounded-full bg-gradient-to-br from-primary via-accent to-secondary">
          <div className="flex items-center justify-center bg-background p-2 rounded-full">
            <Rocket className="h-6 w-6 text-primary" />
            <div className="flex flex-col text-center ml-2">
              <span className="font-bold font-headline sm:inline-block">
                Innovent
              </span>
              <span className="text-xs text-muted-foreground hidden sm:inline-block">
                A Dabral Enterprises Product
              </span>
            </div>
          </div>
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          <Link
            href="/#events"
            className="transition-colors hover:text-foreground/80 text-foreground/60"
          >
            Events
          </Link>
          <Link
            href="/events/create"
            className="transition-colors hover:text-foreground/80 text-foreground/60"
          >
            Create Event
          </Link>
        </nav>
        <div className="flex flex-1 items-center justify-end space-x-2">
          {user ? (
            <>
              <Button asChild variant="ghost">
                <Link href="/dashboard">
                  <LayoutDashboard className="mr-2" />
                  Dashboard
                </Link>
              </Button>
              <Button onClick={handleLogout} variant="outline">
                <LogOut className="mr-2" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost">
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild className="bg-primary hover:bg-primary/90">
                <Link href="/register">Register</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
