import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { EventCard } from '@/components/events/event-card';
import { getEvents } from '@/lib/data';
import { ArrowRight } from 'lucide-react';

export default async function Home() {
  const events = await getEvents();

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="text-center py-16 md:py-24">
        <h1 className="text-4xl md:text-6xl font-bold font-headline tracking-tight text-primary">
          Welcome to Innovent
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-foreground/80">
          The heart of campus life. Discover, create, and join events that shape your university experience.
        </p>
        <div className="mt-8 flex justify-center gap-4">
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
        {events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
           <div className="text-center text-muted-foreground">
             <p>No events found.</p>
             <p className="text-sm mt-2">Check back later or create a new event!</p>
           </div>
        )}
      </section>
    </div>
  );
}
