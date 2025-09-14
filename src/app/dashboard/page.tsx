"use client";

import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { getEvents } from "@/lib/data";
import { EventCard } from "@/components/events/event-card";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const allEvents = getEvents();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return null; // Or a loading spinner
  }
  
  // Mock data for user's events - this will be replaced with database logic
  const registeredEvents = allEvents.slice(0, 2);
  const hostedEvents = allEvents.slice(2, 3);
  const ocEvents = allEvents.slice(3, 4);

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
              <p className="text-3xl font-bold">{registeredEvents.length}</p>
              <p className="text-sm text-muted-foreground">Registered</p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-3xl font-bold">{hostedEvents.length}</p>
              <p className="text-sm text-muted-foreground">Hosted</p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-3xl font-bold">{ocEvents.length}</p>
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
        </Tabs>
      </div>
    </div>
  );
}
