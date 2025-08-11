'use server';

import { getEventInsights, type EventInsightsInput } from '@/ai/flows/event-insights';

export async function generateInsightsAction(input: EventInsightsInput): Promise<string> {
  try {
    const result = await getEventInsights(input);
    return result.insights;
  } catch (error) {
    console.error('Error in generateInsightsAction:', error);
    throw new Error('Failed to generate insights. Please try again later.');
  }
}
