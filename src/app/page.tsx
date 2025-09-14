
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { EventCard } from '@/components/events/event-card';
import { listenToEvents } from '@/lib/data';
import { ArrowRight, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Event } from '@/lib/definitions';

export default function Home() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    
    const unsubscribe = listenToEvents((newEvents) => {
      setEvents(newEvents);
      setLoading(false);
      setError(null);
    }, (err) => {
      console.error(err);
      setError("Could not connect to the database. Please check your configuration and security rules.");
      setLoading(false);
    });
    
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="text-center py-16 md:py-24">
        <h1 className="text-4xl md:text-6xl font-bold font-headline tracking-tight text-primary">
          Welcome to Innovent
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-foreground/80">
          The heart of campus life. Discover, create, and join events that shape your university experience.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
          <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
            <Link href="#events">
              Explore Events
              <ArrowRight className="ml-2" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/events/create">Create an Event</Link>
          </Button>
        </div>
      </section>

      <section id="events" className="py-12">
        <h2 className="text-3xl font-bold font-headline text-center mb-8">
          Upcoming Events
        </h2>
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
           <div className="text-center text-destructive-foreground bg-destructive/80 p-4 rounded-md">
             <p className="font-bold">Error loading events:</p>
             <p>{error}</p>
           </div>
        ) : events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
           <div className="text-center text-muted-foreground">
             <p>No upcoming events found.</p>
             <p className="text-sm mt-2">Check back later or create a new event!</p>
           </div>
        )}
      </section>
    </div>
  );
}
