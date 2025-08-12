
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { EventList } from '@/components/events/event-list';
import { EventForm } from '@/components/events/event-form';
import { Event, Artist, Contractor } from '@/types';
import { loadData, saveData } from '@/lib/storage';

const EventsPage = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [contractors, setContractors] = useState<Contractor[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  useEffect(() => {
    setEvents(loadData('events', []));
    setArtists(loadData('artists', [{ id: '1', name: 'Artista Padrão' }]));
    setContractors(loadData('contractors', [{ id: '1', name: 'Contratante Padrão' }]));
  }, []);

  const handleSaveEvent = (event: Event) => {
    let updatedEvents;
    if (event.id) {
      updatedEvents = events.map((e) => (e.id === event.id ? event : e));
    } else {
      updatedEvents = [...events, { ...event, id: new Date().toISOString() }];
    }
    setEvents(updatedEvents);
    saveData('events', updatedEvents);
    setIsFormOpen(false);
    setSelectedEvent(null);
  };

  const handleDeleteEvent = (id: string) => {
    const updatedEvents = events.filter((e) => e.id !== id);
    setEvents(updatedEvents);
    saveData('events', updatedEvents);
  };

  const handleEditEvent = (event: Event) => {
    setSelectedEvent(event);
    setIsFormOpen(true);
  };

  const handleOpenForm = () => {
    setSelectedEvent(null);
    setIsFormOpen(true);
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Eventos</h2>
        <div className="flex items-center space-x-2">
          <Button onClick={handleOpenForm}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Adicionar Evento
          </Button>
        </div>
      </div>

      <div className="mt-8">
        <EventList 
            events={events} 
            artists={artists}
            contractors={contractors}
            onEdit={handleEditEvent}
            onDelete={handleDeleteEvent}
        />
      </div>

      {isFormOpen && (
        <EventForm
          isOpen={isFormOpen}
          onClose={() => {
            setIsFormOpen(false);
            setSelectedEvent(null);
          }}
          onSave={handleSaveEvent}
          event={selectedEvent}
          artists={artists}
          contractors={contractors}
        />
      )}
    </div>
  );
};

export default EventsPage;
