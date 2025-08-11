'use client';

import { useState } from 'react';
import type { Artist, Contractor, Event } from '@/types';
import { generateInsightsAction } from '@/app/actions';
import { EventForm, type EventFormValues } from '@/components/event-form';
import { EventHistory } from '@/components/event-history';
import { ValueSummary } from '@/components/value-summary';
import { AiInsights } from '@/components/ai-insights';
import { useToast } from '@/hooks/use-toast';
import { AppShell } from '@/components/app-shell';

export default function Home() {
  const [events, setEvents] = useState<Event[]>([]);
  const [insights, setInsights] = useState<string | null>(null);
  const [isLoadingInsights, setIsLoadingInsights] = useState(false);
  const { toast } = useToast();

  const [artists, setArtists] = useState<Artist[]>([
      { id: '1', name: 'Os Futuristas' },
      { id: '2', name: 'Sintetizadores Sonoros' },
      { id: '3', name: 'A Banda de Ontem' },
  ]);
  const [contractors, setContractors] = useState<Contractor[]>([
    { id: '1', name: 'Palco Principal Produções' },
    { id: '2', name: 'Luz e Som Eventos' },
     { id: '3', name: 'Festas & Cia' },
  ]);

  const handleEventAdd = async (data: EventFormValues) => {
    setIsLoadingInsights(true);
    setInsights(null);

    try {
      const artistName = artists.find(a => a.id === data.artistId)?.name || 'N/A';
      const contractorName = contractors.find(c => c.id === data.contractorId)?.name || 'N/A';

      const newInsights = await generateInsightsAction({
        artist: artistName,
        contractor: contractorName,
        date: data.date,
        time: data.time,
        value: data.value,
        historicalFeedback: data.historicalFeedback || 'Nenhum feedback fornecido.',
      });
      setInsights(newInsights);

      const newEvent: Event = {
        id: crypto.randomUUID(),
        ...data,
        artist: artistName,
        contractor: contractorName,
        historicalFeedback: data.historicalFeedback || '',
      };
      setEvents((prevEvents) => [newEvent, ...prevEvents]);
       toast({
        title: "Evento Adicionado",
        description: `Insights para o evento de ${artistName} estão prontos!`,
      });

    } catch (error) {
      console.error("Falha ao adicionar evento ou gerar insights:", error);
      toast({
        variant: "destructive",
        title: "Ocorreu um Erro",
        description: "Não foi possível adicionar o evento ou obter insights. Por favor, tente novamente.",
      });
    } finally {
      setIsLoadingInsights(false);
    }
  };

  return (
    <AppShell>
      <main className="container mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          <div className="lg:col-span-2 flex flex-col gap-8 lg:sticky lg:top-8">
            <ValueSummary events={events} />
            <AiInsights insights={insights} isLoading={isLoadingInsights} />
          </div>
          <div className="lg:col-span-3 flex flex-col gap-8">
            <EventForm
              onEventAdd={handleEventAdd}
              isSubmitting={isLoadingInsights}
              artists={artists}
              contractors={contractors}
            />
            <EventHistory events={events} />
          </div>
        </div>
      </main>
    </AppShell>
  );
}
