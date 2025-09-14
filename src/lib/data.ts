import { Event } from "@/lib/definitions";
import { PlaceHolderImages } from "@/lib/placeholder-images";

const events: Event[] = [
  {
    id: "1",
    name: "InnovateX 2024",
    description:
      "A flagship event for innovators and tech enthusiasts. Join us for a week of coding, collaboration, and creation. Includes workshops, keynotes, and a 24-hour hackathon.",
    date: new Date("2024-10-26T09:00:00"),
    venue: "Main Auditorium",
    image: PlaceHolderImages.find(p => p.id === "event-2")?.imageUrl || "",
    imageHint: PlaceHolderImages.find(p => p.id === "event-2")?.imageHint || "",
  },
  {
    id: "2",
    name: "Campus Music Fest",
    description:
      "An unforgettable night of live music from student bands and renowned artists. Food trucks, merch, and good vibes guaranteed. Don't miss the biggest party of the semester!",
    date: new Date("2024-09-15T18:00:00"),
    venue: "University Grounds",
    image: PlaceHolderImages.find(p => p.id === "event-1")?.imageUrl || "",
    imageHint: PlaceHolderImages.find(p => p.id === "event-1")?.imageHint || "",
  },
  {
    id: "3",
    name: "Art & Soul Exhibition",
    description:
      "Explore a stunning collection of paintings, sculptures, and digital art from our talented student artists. An evening of culture, creativity, and inspiration.",
    date: new Date("2024-11-05T17:00:00"),
    venue: "Fine Arts Gallery",
    image: PlaceHolderImages.find(p => p.id === "event-3")?.imageUrl || "",
    imageHint: PlaceHolderImages.find(p => p.id === "event-3")?.imageHint || "",
  },
  {
    id: "4",
    name: "Future Forward: Career Fair",
    description:
      "Connect with leading companies from various industries. Explore internship and full-time opportunities. Bring your resume and dress to impress!",
    date: new Date("2024-10-10T10:00:00"),
    venue: "Exhibition Hall",
    image: PlaceHolderImages.find(p => p.id === "event-4")?.imageUrl || "",
    imageHint: PlaceHolderImages.find(p => p.id === "event-4")?.imageHint || "",
  },
  {
    id: "5",
    name: "Startup Pitch Night",
    description:
      "Listen to the brightest student entrepreneurs pitch their business ideas to a panel of venture capitalists. Who will get funded? Join to find out.",
    date: new Date("2024-11-20T19:00:00"),
    venue: "Business School Auditorium",
    image: PlaceHolderImages.find(p => p.id === "event-5")?.imageUrl || "",
    imageHint: PlaceHolderImages.find(p => p.id === "event-5")?.imageHint || "",
  },
  {
    id: "6",
    name: "University Sports Championship",
    description:
      "Cheer for your favorite teams as they compete for the ultimate glory. A day filled with thrilling matches, team spirit, and athletic excellence.",
    date: new Date("2024-09-28T09:00:00"),
    venue: "University Sports Complex",
    image: PlaceHolderImages.find(p => p.id === "event-6")?.imageUrl || "",
    imageHint: PlaceHolderImages.find(p => p.id === "event-6")?.imageHint || "",
  },
];

export const getEvents = (): Event[] => events;

export const getEventById = (id: string): Event | undefined =>
  events.find((event) => event.id === id);
