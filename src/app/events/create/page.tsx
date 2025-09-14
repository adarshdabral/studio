import { CreateEventForm } from "@/components/events/create-event-form";

export default function CreateEventPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold font-headline">Create Your Event</h1>
          <p className="text-muted-foreground mt-2">
            Bring your idea to life and share it with the campus community.
          </p>
        </div>
        <CreateEventForm />
      </div>
    </div>
  );
}
