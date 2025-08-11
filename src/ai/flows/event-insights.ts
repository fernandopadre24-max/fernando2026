'use server';
/**
 * @fileOverview Provides AI-driven insights for event profitability and discoverability.
 *
 * - getEventInsights - A function that returns AI insights for event improvement.
 * - EventInsightsInput - The input type for the getEventInsights function.
 * - EventInsightsOutput - The return type for the getEventInsights function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EventInsightsInputSchema = z.object({
  date: z.string().describe('The date of the event.'),
  time: z.string().describe('The time of the event.'),
  artist: z.string().describe('The name of the artist performing at the event.'),
  contractor: z.string().describe('The name of the contractor for the event.'),
  value: z.number().describe('The monetary value associated with the event.'),
  historicalFeedback: z
    .string()
    .describe('Historical customer feedback for similar events.'),
});

export type EventInsightsInput = z.infer<typeof EventInsightsInputSchema>;

const EventInsightsOutputSchema = z.object({
  insights: z.string().describe('AI-driven insights for event improvement.'),
});

export type EventInsightsOutput = z.infer<typeof EventInsightsOutputSchema>;

export async function getEventInsights(input: EventInsightsInput): Promise<EventInsightsOutput> {
  return eventInsightsFlow(input);
}

const eventInsightsPrompt = ai.definePrompt({
  name: 'eventInsightsPrompt',
  input: {schema: EventInsightsInputSchema},
  output: {schema: EventInsightsOutputSchema},
  prompt: `You are an AI assistant designed to provide insights for event organizers.

  Based on the event details and historical feedback, suggest ways to improve event profitability and discoverability.
  Consider factors such as artist selection, contractor choices, pricing strategies, and customer satisfaction.

  Event Date: {{{date}}}
  Event Time: {{{time}}}
  Artist: {{{artist}}}
  Contractor: {{{contractor}}}
  Event Value: {{{value}}}
  Historical Feedback: {{{historicalFeedback}}}

  Provide actionable insights to improve future events.`,
});

const eventInsightsFlow = ai.defineFlow(
  {
    name: 'eventInsightsFlow',
    inputSchema: EventInsightsInputSchema,
    outputSchema: EventInsightsOutputSchema,
  },
  async input => {
    const {output} = await eventInsightsPrompt(input);
    return output!;
  }
);
