
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { useToast } from "@/hooks/use-toast";
import { registerForEvent } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Ticket, Loader2 } from "lucide-react";
import type { Event } from "@/lib/definitions";
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
import { format } from "date-fns";

type RegisterButtonProps = {
  event: Event;
};

export function RegisterButton({ event }: RegisterButtonProps) {
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistered, setIsRegistered] = useState(user && event.attendees.includes(user.email || ""));

  const handleRegister = async () => {
    if (!user || !user.email) {
      router.push("/login");
      return;
    }

    setIsLoading(true);

    const result = await registerForEvent(event.id, user.email);

    setIsLoading(false);

    if (result.success) {
      setIsRegistered(true);
      // The dialog will be shown by the trigger
    } else {
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: result.error || "Could not register for the event.",
      });
    }
  };

  if (isRegistered) {
    return (
        <Button size="lg" disabled>
            <Ticket className="mr-2" />
            You are registered!
        </Button>
    )
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90" onClick={handleRegister} disabled={isLoading}>
          {isLoading ? <Loader2 className="mr-2 animate-spin" /> : <Ticket className="mr-2" />}
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
          <AlertDialogAction onClick={() => router.refresh()}>Close</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
