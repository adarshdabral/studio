import type { SuggestTasksOutput } from "@/ai/flows/ai-task-assigner";

export type Event = {
  id: string;
  name: string;
  description: string;
  date: Date;
  venue: string;
  image: string;
  imageHint: string;
  hostId: string;
  organizingCommittee: string[];
  attendees: string[];
};

export type OCMember = {
  id: string;
  email: string;
};

export type TaskSuggestion = SuggestTasksOutput[0];
