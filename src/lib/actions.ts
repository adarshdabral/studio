"use server";

import { suggestTasks } from "@/ai/flows/ai-task-assigner";
import type { SuggestTasksInput, SuggestTasksOutput } from "@/ai/flows/ai-task-assigner";

type ActionResponse = {
  success: boolean;
  data?: SuggestTasksOutput;
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
