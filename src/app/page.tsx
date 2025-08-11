'use client';

import { useState } from 'react';
import type { Artist, Contractor, Event } from '@/types';
import { EventForm, type EventFormValues } from '@/components/event-form';
import { EventHistory } from '@/components/event-history';
import { ValueSummary } from '@/components/value-summary';
import { useToast } from '@/hooks/use-toast';
import { AppShell } from '@/components/app-shell';

export default function Home() {
  const [events, setEvents] = useState<Event[]>([]);
  const { toast } = useToast();

  // For now, we'll manage artists and contractors here.
  // In a real app, this would likely come from a database.
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEventAdd = async (data: EventFormValues) => {
    setIsSubmitting(true);
    try {
      const artistName = artists.find(a => a.id === data.artistId)?.name || 'N/A';
      const contractorName = contractors.find(c => c.id === data.contractorId)?.name || 'N/A';

      if(artistName === 'N/A' || contractorName === 'N/A') {
        throw new Error("Artista ou Contratante não encontrado.");
      }

      const newEvent: Event = {
        id: crypto.randomUUID(),
        ...data,
        artist: artistName,
        contractor: contractorName,
      };
      setEvents((prevEvents) => [newEvent, ...prevEvents]);
       toast({
        title: "Evento Adicionado",
        description: `O evento de ${artistName} foi adicionado com sucesso.`,
      });

    } catch (error) {
      console.error("Falha ao adicionar evento:", error);
      toast({
        variant: "destructive",
        title: "Ocorreu um Erro",
        description: "Não foi possível adicionar o evento. Por favor, tente novamente.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AppShell>
      <main className="container mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          <div className="lg:col-span-2 flex flex-col gap-8 lg:sticky lg:top-8">
            <ValueSummary events={events} />
          </div>
          <div className="lg:col-span-3 flex flex-col gap-8">
            <EventForm
              artists={artists}
              contractors={contractors}
              onEventAdd={handleEventAdd}
              isSubmitting={isSubmitting}
            />
            <EventHistory events={events} />
          </div>
        </div>
      </main>
    </AppShell>
  );
}
