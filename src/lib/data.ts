import { Event } from "@/lib/definitions";
import { db } from "@/lib/firebase";
import { collection, getDocs, doc, getDoc, Timestamp, query, where, onSnapshot, Unsubscribe } from "firebase/firestore";

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
    try {
        const eventDocRef = doc(db, "events", id);
        const eventSnap = await getDoc(eventDocRef);

        if (eventSnap.exists()) {
            return eventFromDoc(eventSnap);
        } else {
            console.log(`No event found with id: ${id}`);
            return undefined;
        }
    } catch (error) {
        console.error(`Error fetching event with id ${id}:`, error);
        throw new Error(`Failed to get document. Firestore error: ${error}`);
    }
};

export const listenToEvents = (
  callback: (events: Event[]) => void, 
  onError: (error: Error) => void
): Unsubscribe => {
    const eventsCollection = collection(db, 'events');
    const q = query(eventsCollection, where("date", ">=", new Date()));
    
    const unsubscribe = onSnapshot(q, snapshot => {
      const events = snapshot.docs.map(doc => eventFromDoc(doc));
      callback(events);
    }, (error) => {
        console.error("Error listening to events:", error);
        onError(error);
    });

    return unsubscribe;
};
