import { Event } from "@/lib/definitions";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { db } from "@/lib/firebase";
import { collection, getDocs, doc, getDoc, Timestamp, query, where } from "firebase/firestore";

const seedEvents: Omit<Event, 'id'>[] = [
    {
      name: "InnovateX 2024",
      description:
        "A flagship event for innovators and tech enthusiasts. Join us for a week of coding, collaboration, and creation. Includes workshops, keynotes, and a 24-hour hackathon.",
      date: new Date("2024-10-26T09:00:00"),
      venue: "Main Auditorium",
      image: PlaceHolderImages.find(p => p.id === "event-2")?.imageUrl || "",
      imageHint: PlaceHolderImages.find(p => p.id === "event-2")?.imageHint || "",
      hostId: "mock-host-1",
      organizingCommittee: ["oc-member-1@test.com", "oc-member-2@test.com"],
      attendees: ["attendee-1@test.com"]
    },
    {
      name: "Campus Music Fest",
      description:
        "An unforgettable night of live music from student bands and renowned artists. Food trucks, merch, and good vibes guaranteed. Don't miss the biggest party of the semester!",
      date: new Date("2024-09-15T18:00:00"),
      venue: "University Grounds",
      image: PlaceHolderImages.find(p => p.id === "event-1")?.imageUrl || "",
      imageHint: PlaceHolderImages.find(p => p.id === "event-1")?.imageHint || "",
      hostId: "mock-host-2",
      organizingCommittee: [],
      attendees: ["attendee-1@test.com", "attendee-2@test.com"]
    },
    {
      name: "Art & Soul Exhibition",
      description:
        "Explore a stunning collection of paintings, sculptures, and digital art from our talented student artists. An evening of culture, creativity, and inspiration.",
      date: new Date("2024-11-05T17:00:00"),
      venue: "Fine Arts Gallery",
      image: PlaceHolderImages.find(p => p.id === "event-3")?.imageUrl || "",
      imageHint: PlaceHolderImages.find(p => p.id === "event-3")?.imageHint || "",
      hostId: "mock-host-1",
      organizingCommittee: [],
      attendees: []
    },
    {
      name: "Future Forward: Career Fair",
      description:
        "Connect with leading companies from various industries. Explore internship and full-time opportunities. Bring your resume and dress to impress!",
      date: new Date("2024-10-10T10:00:00"),
      venue: "Exhibition Hall",
      image: PlaceHolderImages.find(p => p.id === "event-4")?.imageUrl || "",
      imageHint: PlaceHolderImages.find(p => p.id === "event-4")?.imageHint || "",
      hostId: "mock-host-3",
      organizingCommittee: ["oc-member-3@test.com"],
      attendees: ["attendee-1@test.com"]
    },
    {
      name: "Startup Pitch Night",
      description:
        "Listen to the brightest student entrepreneurs pitch their business ideas to a panel of venture capitalists. Who will get funded? Join to find out.",
      date: new Date("2024-11-20T19:00:00"),
      venue: "Business School Auditorium",
      image: PlaceHolderImages.find(p => p.id === "event-5")?.imageUrl || "",
      imageHint: PlaceHolderImages.find(p => p.id === "event-5")?.imageHint || "",
      hostId: "mock-host-2",
      organizingCommittee: ["oc-member-1@test.com"],
      attendees: []
    },
    {
      name: "University Sports Championship",
      description:
        "Cheer for your favorite teams as they compete for the ultimate glory. A day filled with thrilling matches, team spirit, and athletic excellence.",
      date: new Date("2024-09-28T09:00:00"),
      venue: "University Sports Complex",
      image: PlaceHolderImages.find(p => p.id === "event-6")?.imageUrl || "",
      imageHint: PlaceHolderImages.find(p => p.id === "event-6")?.imageHint || "",
      hostId: "mock-host-3",
      organizingCommittee: [],
      attendees: ["attendee-2@test.com"]
    },
  ];

  
// Note: In a real app, you would have a more robust seeding strategy.
// For now, we are not seeding the database to avoid overwriting data.
// You can manually add the events to your Firestore 'events' collection.

const eventFromDoc = (doc: any): Event => {
    const data = doc.data();
    return {
      id: doc.id,
      name: data.name,
      description: data.description,
      date: (data.date as Timestamp).toDate(),
      venue: data.venue,
      image: data.image,
      imageHint: data.imageHint,
      hostId: data.hostId,
      organizingCommittee: data.organizingCommittee,
      attendees: data.attendees,
    };
  };

export const getEvents = async (): Promise<Event[]> => {
    const eventsCollection = collection(db, "events");
    const eventSnapshot = await getDocs(eventsCollection);
    const eventList = eventSnapshot.docs.map(doc => eventFromDoc(doc));
    return eventList;
};

export const getEventById = async (id: string): Promise<Event | undefined> => {
    const eventDocRef = doc(db, "events", id);
    const eventSnap = await getDoc(eventDocRef);

    if (eventSnap.exists()) {
        return eventFromDoc(eventSnap);
    } else {
        return undefined;
    }
};

export const getEventsByHost = async (hostId: string): Promise<Event[]> => {
    const eventsCollection = collection(db, "events");
    const q = query(eventsCollection, where("hostId", "==", hostId));
    const eventSnapshot = await getDocs(q);
    return eventSnapshot.docs.map(doc => eventFromDoc(doc));
};

export const getEventsByAttendee = async (attendeeEmail: string): Promise<Event[]> => {
    const eventsCollection = collection(db, "events");
    const q = query(eventsCollection, where("attendees", "array-contains", attendeeEmail));
    const eventSnapshot = await getDocs(q);
    return eventSnapshot.docs.map(doc => eventFromDoc(doc));
};

export const getEventsByOC = async (ocEmail: string): Promise<Event[]> => {
    const eventsCollection = collection(db, "events");
    const q = query(eventsCollection, where("organizingCommittee", "array-contains", ocEmail));
    const eventSnapshot = await getDocs(q);
    return eventSnapshot.docs.map(doc => eventFromDoc(doc));
};
