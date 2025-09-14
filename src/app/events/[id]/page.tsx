"use client";

import { useEffect, useState } from "react";
import { getEventById } from "@/lib/data";
import { notFound } from "next/navigation";
import Image from "next/image";
import { format } from "date-fns";
import { Calendar, MapPin, ChevronLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { RegisterButton } from "@/components/events/register-button";
import type { Event } from "@/lib/definitions";

type PageProps = {
  params: {
    id: string;
  };
};

export default function EventDetailPage({ params }: PageProps) {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const { id } = params;

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const fetchedEvent = await getEventById(id);
        if (fetchedEvent) {
          setEvent(fetchedEvent);
        } else {
          notFound();
        }
      } catch (error) {
        console.error("Failed to fetch event:", error);
        // Handle error display if necessary
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!event) {
    return notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <Button asChild variant="ghost" className="mb-4">
          <Link href="/">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Events
          </Link>
        </Button>
        <div className="bg-card rounded-lg shadow-lg overflow-hidden">
          <div className="relative h-64 md:h-96 w-full">
            <Image
              src={event.image}
              alt={event.name}
              fill
              className="object-cover"
              data-ai-hint={event.imageHint}
              priority
            />
          </div>
          <div className="p-6 md:p-8">
            <h1 className="text-3xl md:text-4xl font-bold font-headline text-primary mb-4">
              {event.name}
            </h1>

            <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8 mb-6 text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                <span>{format(event.date, "EEEE, MMMM d, yyyy 'at' p")}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                <span>{event.venue}</span>
              </div>
            </div>

            <p className="text-foreground/80 leading-relaxed">
              {event.description}
            </p>

            <div className="mt-8 text-center">
              <RegisterButton event={event} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
