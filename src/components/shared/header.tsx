
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Rocket, LogOut, LayoutDashboard, UserPlus, LogIn } from "lucide-react";
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
      <div className="container flex h-16 max-w-screen-2xl items-center relative">
        {/* Desktop nav */}
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="flex items-center p-0.5 rounded-full bg-gradient-to-br from-primary via-accent to-secondary">
            <div className="flex items-center justify-center bg-background p-1.5 rounded-full">
                <Rocket className="h-6 w-6 text-primary" />
                <div className="flex flex-col text-center ml-2">
                <span className="font-bold font-headline inline-block">
                    Innovent
                </span>
                <span className="text-xs text-muted-foreground inline-block">
                    A Dabral Enterprises Product
                </span>
                </div>
            </div>
          </Link>
        </div>
        <nav className="hidden items-center gap-6 text-sm md:flex">
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

        {/* Mobile nav */}
        <div className="flex md:hidden items-center justify-between w-full">
            {user ? (
                 <Button asChild variant="ghost" size="icon" className="w-auto px-2">
                    <Link href="/dashboard">
                        <LayoutDashboard className="h-5 w-5" />
                    </Link>
                </Button>
            ) : (
                <Button asChild variant="ghost" size="icon" className="w-auto px-2">
                    <Link href="/login">
                        <LogIn className="h-5 w-5" />
                    </Link>
                </Button>
            )}

            <div className="absolute left-1/2 -translate-x-1/2">
                <Link href="/" className="flex items-center p-0.5 rounded-full bg-gradient-to-br from-primary via-accent to-secondary">
                    <div className="flex items-center justify-center bg-background p-1 rounded-full">
                        <Rocket className="h-5 w-5 text-primary" />
                        <div className="flex flex-col text-center ml-1.5">
                        <span className="font-bold font-headline text-sm">
                            Innovent
                        </span>
                        <span className="text-xs text-muted-foreground -mt-0.5">
                            A Dabral Enterprises Product
                        </span>
                        </div>
                    </div>
                </Link>
            </div>

            {user ? (
                 <Button onClick={handleLogout} variant="ghost" size="icon" className="w-auto px-2">
                    <LogOut className="h-5 w-5" />
                </Button>
            ) : (
                <Button asChild variant="ghost" size="icon" className="w-auto px-2">
                    <Link href="/register">
                        <UserPlus className="h-5 w-5" />
                    </Link>
                </Button>
            )}
        </div>


        {/* Desktop Auth Buttons */}
        <div className="hidden flex-1 items-center justify-end space-x-2 md:flex">
          {user ? (
            <>
              <Button asChild variant="ghost">
                <Link href="/dashboard">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Dashboard
                </Link>
              </Button>
              <Button onClick={handleLogout} variant="outline">
                <LogOut className="mr-2 h-4 w-4" />
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
