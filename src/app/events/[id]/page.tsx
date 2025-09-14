import { getEventById } from "@/lib/data";
import { notFound } from "next/navigation";
import Image from "next/image";
import { format } from "date-fns";
import {
  Calendar,
  MapPin,
  Ticket,
  ChevronLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Link from "next/link";

type PageProps = {
  params: {
    id: string;
  };
};

export default function EventDetailPage({ params }: PageProps) {
  const event = getEventById(params.id);

  if (!event) {
    notFound();
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
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                    <Ticket className="mr-2" />
                    Register for Event
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Registration Confirmed!</AlertDialogTitle>
                    <AlertDialogDescription>
                      You have successfully registered for {event.name}. A
                      confirmation ticket has been sent to your email.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <div className="my-4 p-6 border-dashed border-2 border-primary rounded-lg text-center bg-background">
                    <Ticket className="h-16 w-16 mx-auto text-primary" />
                    <h3 className="mt-4 text-lg font-bold">{event.name}</h3>
                    <p className="text-muted-foreground">{format(event.date, "PPP p")}</p>
                    <p className="font-mono text-xs mt-4 bg-muted p-2 rounded-md">TICKET-ID: INNO-{Math.floor(100000 + Math.random() * 900000)}</p>
                  </div>
                  <AlertDialogFooter>
                    <AlertDialogAction>Close</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
