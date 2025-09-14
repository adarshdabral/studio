
"use client";

import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
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
import { onSnapshot, collection, query, where, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

const eventFromDoc = (doc: any): Event => {
    const data = doc.data();
    return {
        id: doc.id,
        ...data,
        date: (data.date as Timestamp).toDate(),
    } as Event;
};

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [allUserEvents, setAllUserEvents] = useState<Event[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user?.email || !user?.uid) return;

    setDataLoading(true);
    const eventsCollection = collection(db, "events");

    const queries = [
        query(eventsCollection, where("attendees", "array-contains", user.email)),
        query(eventsCollection, where("hostId", "==", user.uid)),
        query(eventsCollection, where("organizingCommittee", "array-contains", user.email)),
    ];

    let queryCount = queries.length;
    let initialLoadsFinished = 0;
    const allEventsMap = new Map<string, Event>();

    const unsubscribes = queries.map((q) => 
        onSnapshot(q, (snapshot) => {
            snapshot.docs.forEach(doc => {
                allEventsMap.set(doc.id, eventFromDoc(doc));
            });
            
            if (initialLoadsFinished < queryCount) {
                initialLoadsFinished++;
                if (initialLoadsFinished === queryCount) {
                    setDataLoading(false);
                }
            }

            setAllUserEvents(Array.from(allEventsMap.values()));

        }, (error) => {
            console.error("Error fetching events:", error);
            if (initialLoadsFinished < queryCount) {
                initialLoadsFinished++;
                 if (initialLoadsFinished === queryCount) {
                    setDataLoading(false);
                }
            }
        })
    );
    
    return () => unsubscribes.forEach(unsub => unsub());

  }, [user]);

  const { upcomingRegisteredEvents, attendedEvents, hostedEvents, ocEvents } = useMemo(() => {
    if (!user?.email || !user?.uid) {
        return { upcomingRegisteredEvents: [], attendedEvents: [], hostedEvents: [], ocEvents: [] };
    }
    const now = new Date();
    const isRegistered = (e: Event) => e.attendees.includes(user.email!);
    const isHost = (e: Event) => e.hostId === user.uid;
    const isOC = (e: Event) => e.organizingCommittee.includes(user.email!);

    const uniqueEvents = Array.from(new Map(allUserEvents.map(e => [e.id, e])).values());

    return {
        upcomingRegisteredEvents: uniqueEvents.filter(e => isRegistered(e) && e.date >= now && !isHost(e) && !isOC(e)),
        attendedEvents: uniqueEvents.filter(e => isRegistered(e) && e.date < now && !isHost(e) && !isOC(e)),
        hostedEvents: uniqueEvents.filter(e => isHost(e)),
        ocEvents: uniqueEvents.filter(e => isOC(e)),
    }
  }, [allUserEvents, user]);


  if (authLoading || !user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
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
              <p className="text-3xl font-bold">{dataLoading ? <Loader2 className="h-6 w-6 animate-spin mx-auto"/> : upcomingRegisteredEvents.length}</p>
              <p className="text-sm text-muted-foreground">Upcoming</p>
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
               <p className="text-3xl font-bold">{dataLoading ? <Loader2 className="h-6 w-6 animate-spin mx-auto"/> : attendedEvents.length}</p>
              <p className="text-sm text-muted-foreground">Attended</p>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="registered">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 mb-8">
            <TabsTrigger value="registered">Upcoming</TabsTrigger>
            <TabsTrigger value="attended">Attended</TabsTrigger>
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
                  {upcomingRegisteredEvents.length > 0 ? (
                    upcomingRegisteredEvents.map((event) => (
                      <EventCard key={event.id} event={event} />
                    ))
                  ) : (
                    <p className="col-span-full text-center text-muted-foreground">You haven't registered for any upcoming events yet.</p>
                  )}
                </div>
              </TabsContent>

               <TabsContent value="attended">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {attendedEvents.length > 0 ? (
                    attendedEvents.map((event) => (
                      <EventCard key={event.id} event={event} />
                    ))
                  ) : (
                    <p className="col-span-full text-center text-muted-foreground">You haven't attended any events yet.</p>
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
