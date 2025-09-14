"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Rocket } from "lucide-react";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Rocket className="h-6 w-6 text-primary" />
          <span className="font-bold font-headline sm:inline-block">
            Innovent
          </span>
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
          <Button asChild variant="ghost">
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild className="bg-primary hover:bg-primary/90">
            <Link href="/register">Register</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
