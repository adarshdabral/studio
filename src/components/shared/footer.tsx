
import Link from 'next/link';
import { Rocket } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex justify-center items-center">
             <Link href="/" className="flex items-center p-0.5 rounded-full bg-gradient-to-br from-primary via-accent to-secondary">
                <div className="flex items-center justify-center bg-background p-2 rounded-full">
                    <Rocket className="h-6 w-6 text-primary" />
                    <div className="flex flex-col text-center ml-2">
                    <span className="font-bold font-headline">
                        Innovent
                    </span>
                    <span className="text-xs text-muted-foreground">
                        A Dabral Enterprises Product
                    </span>
                    </div>
                </div>
            </Link>
          </div>
          <nav className="flex flex-wrap justify-center gap-4 md:gap-6 text-sm text-muted-foreground">
            <Link href="/#events" className="hover:text-primary transition-colors">Events</Link>
            <Link href="/events/create" className="hover:text-primary transition-colors">Create Event</Link>
            <Link href="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link>
          </nav>
          <div className="text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} Dabral Enterprises. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
