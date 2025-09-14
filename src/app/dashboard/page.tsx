"use client";

import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getEventsByAttendee, getEventsByHost, getEventsByOC } from "@/lib/data";
import { EventCard } from "@/components/events/event-card";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Event } from "@/lib/definitions";
import { Loader2 } from "lucide-react";

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [registeredEvents, setRegisteredEvents] = useState<Event[]>([]);
  const [hostedEvents, setHostedEvents] = useState<Event[]>([]);
  const [ocEvents, setOcEvents] = useState<Event[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    async function fetchUserEvents() {
      if (user?.email) {
        setDataLoading(true);
        const [registered, hosted, oc] = await Promise.all([
          getEventsByAttendee(user.email),
          getEventsByHost(user.uid),
          getEventsByOC(user.email)
        ]);
        setRegisteredEvents(registered);
        setHostedEvents(hosted);
        setOcEvents(oc);
        setDataLoading(false);
      }
    }
    if (user) {
      fetchUserEvents();
    }
  }, [user]);

  if (authLoading || !user) {
    return null; // AuthProvider already shows a loader
  }
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-5xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold font-headline">
            Welcome, {user.displayName || "Innovent User"}!
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Here's your personal event hub.
          </p>
        </header>

        <Card className="mb-12">
          <CardHeader>
            <CardTitle>Your Stats</CardTitle>
            <CardDescription>A quick look at your event activity.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-3xl font-bold">{dataLoading ? <Loader2 className="h-6 w-6 animate-spin mx-auto"/> : registeredEvents.length}</p>
              <p className="text-sm text-muted-foreground">Registered</p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-3xl font-bold">{dataLoading ? <Loader2 className="h-6 w-6 animate-spin mx-auto"/> : hostedEvents.length}</p>
              <p className="text-sm text-muted-foreground">Hosted</p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-3xl font-bold">{dataLoading ? <Loader2 className="h-6 w-6 animate-spin mx-auto"/> : ocEvents.length}</p>
              <p className="text-sm text-muted-foreground">OC Member</p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
               <p className="text-3xl font-bold">0</p>
              <p className="text-sm text-muted-foreground">Attended</p>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="registered">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="registered">Registered Events</TabsTrigger>
            <TabsTrigger value="hosted">My Events</TabsTrigger>
            <TabsTrigger value="oc">OC Duties</TabsTrigger>
          </TabsList>
          
          {dataLoading ? (
             <div className="flex justify-center items-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
             </div>
          ) : (
            <>
              <TabsContent value="registered">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {registeredEvents.length > 0 ? (
                    registeredEvents.map((event) => (
                      <EventCard key={event.id} event={event} />
                    ))
                  ) : (
                    <p className="col-span-full text-center text-muted-foreground">You haven't registered for any events yet.</p>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="hosted">
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {hostedEvents.length > 0 ? (
                    hostedEvents.map((event) => (
                      <EventCard key={event.id} event={event} />
                    ))
                  ) : (
                    <p className="col-span-full text-center text-muted-foreground">You haven't hosted any events yet.</p>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="oc">
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {ocEvents.length > 0 ? (
                    ocEvents.map((event) => (
                      <EventCard key={event.id} event={event} />
                    ))
                  ) : (
                    <p className="col-span-full text-center text-muted-foreground">You are not part of any organizing committee.</p>
                  )}
                </div>
              </TabsContent>
            </>
          )}
        </Tabs>
      </div>
    </div>
  );
}
