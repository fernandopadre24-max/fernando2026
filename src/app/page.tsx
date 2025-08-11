'use client';

import { useState } from 'react';
import type { Event } from '@/types';
import { generateInsightsAction } from '@/app/actions';
import { EventForm, type EventFormValues } from '@/components/event-form';
import { EventHistory } from '@/components/event-history';
import { ValueSummary } from '@/components/value-summary';
import { AiInsights } from '@/components/ai-insights';
import { Header } from '@/components/header';
import { useToast } from '@/hooks/use-toast';

export default function Home() {
  const [events, setEvents] = useState<Event[]>([]);
  const [insights, setInsights] = useState<string | null>(null);
  const [isLoadingInsights, setIsLoadingInsights] = useState(false);
  const { toast } = useToast();

  const handleEventAdd = async (data: EventFormValues) => {
    setIsLoadingInsights(true);
    setInsights(null);

    try {
      const newInsights = await generateInsightsAction({
        ...data,
        historicalFeedback: data.historicalFeedback || 'No feedback provided.',
      });
      setInsights(newInsights);

      const newEvent: Event = {
        id: crypto.randomUUID(),
        ...data,
        historicalFeedback: data.historicalFeedback || '',
      };
      setEvents((prevEvents) => [newEvent, ...prevEvents]);
       toast({
        title: "Event Added",
        description: `Insights for ${data.artist}'s event are ready!`,
      });

    } catch (error) {
      console.error("Failed to add event or generate insights:", error);
      toast({
        variant: "destructive",
        title: "An Error Occurred",
        description: "Could not add event or get insights. Please try again.",
      });
    } finally {
      setIsLoadingInsights(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-body">
      <Header />
      <main className="container mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          <div className="lg:col-span-2 flex flex-col gap-8 lg:sticky lg:top-8">
            <ValueSummary events={events} />
            <AiInsights insights={insights} isLoading={isLoadingInsights} />
          </div>
          <div className="lg:col-span-3 flex flex-col gap-8">
            <EventForm onEventAdd={handleEventAdd} isSubmitting={isLoadingInsights} />
            <EventHistory events={events} />
          </div>
        </div>
      </main>
    </div>
  );
}
