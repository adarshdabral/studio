
"use server";

import { suggestTasks } from "@/ai/flows/ai-task-assigner";
import type { SuggestTasksInput, SuggestTasksOutput } from "@/ai/flows/ai-task-assigner";
import { db } from "@/lib/firebase";
import { collection, addDoc, doc, updateDoc, arrayUnion, serverTimestamp, getDoc } from "firebase/firestore";
import { revalidatePath } from "next/cache";
import type { Event } from "./definitions";

type ActionResponse = {
  success: boolean;
  data?: any;
  error?: string;
};

export async function suggestAndAssignTasks(
  input: SuggestTasksInput
): Promise<ActionResponse> {
  try {
    if (!input.eventDetails || input.organizingCommitteeMembers.length === 0) {
      return {
        success: false,
        error: "Event details and committee members are required.",
      };
    }

    const suggestions = await suggestTasks(input);

    if (!suggestions || suggestions.length === 0) {
      return {
        success: false,
        error: "The AI could not generate suggestions. Please try again with more detailed event information.",
      };
    }

    return {
      success: true,
      data: suggestions,
    };
  } catch (err) {
    console.error("Error in suggestAndAssignTasks action:", err);
    return {
      success: false,
      error: "An unexpected error occurred while generating tasks. Please try again later.",
    };
  }
}

export async function createEvent(eventData: Omit<Event, 'id' | 'attendees'>): Promise<ActionResponse> {
  try {
    const eventCollection = collection(db, 'events');
    const docRef = await addDoc(eventCollection, {
      ...eventData,
      attendees: [],
      createdAt: serverTimestamp(),
    });
    revalidatePath('/');
    revalidatePath('/dashboard');
    return { success: true, data: { id: docRef.id } };
  } catch (error: any) {
    console.error("Error creating event:", error);
    return { success: false, error: error.message };
  }
}


export async function registerForEvent(eventId: string, userEmail: string): Promise<ActionResponse> {
  try {
    const eventDocRef = doc(db, 'events', eventId);
    
    // Check if user is already registered
    const eventSnap = await getDoc(eventDocRef);
    if (eventSnap.exists()) {
      const eventData = eventSnap.data() as Event;
      if (eventData.attendees && eventData.attendees.includes(userEmail)) {
        return { success: false, error: "You are already registered for this event." };
      }
    } else {
        return { success: false, error: "Event not found." };
    }

    await updateDoc(eventDocRef, {
      attendees: arrayUnion(userEmail)
    });

    revalidatePath(`/events/${eventId}`);
    revalidatePath('/dashboard');

    return { success: true };
  } catch (error: any) {
    console.error("Error registering for event:", error);
    return { success: false, error: "Failed to register for the event." };
  }
}
