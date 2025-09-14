
"use server";

import { suggestTasks } from "@/ai/flows/ai-task-assigner";
import type { SuggestTasksInput, SuggestTasksOutput } from "@/ai/flows/ai-task-assigner";
import { db } from "@/lib/firebase";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { revalidatePath } from "next/cache";

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

export async function registerForEvent(eventId: string, userEmail: string): Promise<ActionResponse> {
  try {
    const eventDocRef = doc(db, 'events', eventId);
    
    // We will let Firestore's arrayUnion handle duplication and security rules handle auth.
    // This is more atomic and avoids a read-before-write scenario.
    await updateDoc(eventDocRef, {
      attendees: arrayUnion(userEmail)
    });

    revalidatePath(`/events/${eventId}`);
    revalidatePath('/dashboard');

    return { success: true };
  } catch (error: any) {
    console.error("Error registering for event:", error);
    // The security rules will reject this if the user is already in the array,
    // but the error message might not be user-friendly. We can make it better.
     if ((error.code as string)?.includes('permission-denied')) {
      return { success: false, error: "You are already registered or do not have permission." };
    }
    return { success: false, error: "Failed to register for the event." };
  }
}
