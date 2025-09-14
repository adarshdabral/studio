'use server';
/**
 * @fileOverview An AI-powered task suggestion agent for event hosts.
 *
 * - suggestTasks - A function that suggests tasks for organizing committee members based on event details.
 * - SuggestTasksInput - The input type for the suggestTasks function.
 * - SuggestTasksOutput - The return type for the suggestTasks function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const SuggestTasksInputSchema = z.object({
  eventDetails: z
    .string()
    .describe('Detailed information about the event, including name, description, date, venue, and objectives.'),
  organizingCommitteeMembers: z
    .array(z.string())
    .describe('An array of email addresses or usernames of the organizing committee members.'),
});
export type SuggestTasksInput = z.infer<typeof SuggestTasksInputSchema>;

const SuggestTasksOutputSchema = z.array(z.object({
  member: z.string().describe('The email address or username of the organizing committee member.'),
  task: z.string().describe('A suggested task for the organizing committee member.'),
  reason: z.string().describe('The reasoning behind the task suggestion.'),
}));
export type SuggestTasksOutput = z.infer<typeof SuggestTasksOutputSchema>;

export async function suggestTasks(input: SuggestTasksInput): Promise<SuggestTasksOutput> {
  return suggestTasksFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestTasksPrompt',
  input: {schema: SuggestTasksInputSchema},
  output: {schema: SuggestTasksOutputSchema},
  prompt: `You are an AI assistant that helps event hosts delegate responsibilities efficiently. Given the event details and the list of organizing committee members, suggest suitable tasks for each member. Provide a clear reason for each task suggestion.

Event Details: {{{eventDetails}}}
Organizing Committee Members: {{#each organizingCommitteeMembers}}{{{this}}}, {{/each}}

Output the tasks in a JSON array where each object has the fields 'member', 'task', and 'reason'.`,
});

const suggestTasksFlow = ai.defineFlow(
  {
    name: 'suggestTasksFlow',
    inputSchema: SuggestTasksInputSchema,
    outputSchema: SuggestTasksOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
