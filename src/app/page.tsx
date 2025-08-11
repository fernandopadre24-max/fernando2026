
'use client';

import { useState, useEffect } from 'react';
import type { Artist, Contractor, Event, PaymentMethod, BankAccount } from '@/types';
import { EventForm, type EventFormValues } from '@/components/event-form';
import { EventHistory } from '@/components/event-history';
import { ValueSummary } from '@/components/value-summary';
import { useToast } from '@/hooks/use-toast';
import { AppShell } from '@/components/app-shell';

const initialArtists: Artist[] = [
    { id: '1', name: 'Os Futuristas' },
    { id: '2', name: 'Sintetizadores Sonoros' },
    { id: '3', name: 'A Banda de Ontem' },
];

const initialContractors: Contractor[] = [
  { id: '1', name: 'Palco Principal Produções' },
  { id: '2', name: 'Luz e Som Eventos' },
  { id: '3', name: 'Festas & Cia' },
];

export default function Home() {
  const [events, setEvents] = useState<Event[]>([]);
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);

  const [artists, setArtists] = useState<Artist[]>([]);
  const [contractors, setContractors] = useState<Contractor[]>([]);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    // Load events from localStorage
    const storedEvents = localStorage.getItem('events');
    if (storedEvents) {
      const parsedEvents = JSON.parse(storedEvents).map((event: Event) => ({
        ...event,
        paymentMethod: event.paymentMethod || null,
        observations: event.observations || '',
        isTransferred: event.isTransferred || false,
        transferredToBankAccountId: event.transferredToBankAccountId || null,
      }));
      setEvents(parsedEvents);
    }

    // Load artists from localStorage or use initial data
    const storedArtists = localStorage.getItem('artists');
    if (storedArtists) {
      setArtists(JSON.parse(storedArtists));
    } else {
      setArtists(initialArtists);
    }
    
    // Load contractors from localStorage or use initial data
    const storedContractors = localStorage.getItem('contractors');
    if (storedContractors) {
      setContractors(JSON.parse(storedContractors));
    } else {
      setContractors(initialContractors);
    }

    // Load bank accounts from localStorage
    const storedBankAccounts = localStorage.getItem('bankAccounts');
    if (storedBankAccounts) {
      setBankAccounts(JSON.parse(storedBankAccounts));
    }

  }, []);

  useEffect(() => {
    if(isClient) {
      localStorage.setItem('events', JSON.stringify(events));
      localStorage.setItem('artists', JSON.stringify(artists));
      localStorage.setItem('contractors', JSON.stringify(contractors));
      localStorage.setItem('bankAccounts', JSON.stringify(bankAccounts));
    }
  }, [events, artists, contractors, bankAccounts, isClient]);


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
        isDone: false,
        isPaid: false,
        paymentMethod: null,
        isTransferred: false,
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
  
  const handleEventUpdate = (updatedEvent: Event) => {
    const artistName = artists.find(a => a.id === updatedEvent.artistId)?.name || 'N/A';
    const contractorName = contractors.find(c => c.id === updatedEvent.contractorId)?.name || 'N/A';

    setEvents(events.map(event => event.id === updatedEvent.id ? {...updatedEvent, artist: artistName, contractor: contractorName} : event));
    toast({
      title: "Evento Atualizado",
      description: "O evento foi atualizado com sucesso.",
    });
  }

  const handleEventDelete = (eventId: string) => {
    setEvents(events.filter(event => event.id !== eventId));
     toast({
      title: "Evento Excluído",
      description: "O evento foi excluído com sucesso.",
      variant: "destructive"
    });
  }


  const handleEventStatusChange = (eventId: string, type: 'isDone', value: boolean) => {
    setEvents(prevEvents =>
      prevEvents.map(event =>
        event.id === eventId ? { ...event, [type]: value } : event
      )
    );
  };

  const handlePaymentStatusChange = (eventId: string, isPaid: boolean, paymentMethod: PaymentMethod | null) => {
    setEvents(prevEvents =>
      prevEvents.map(event =>
        event.id === eventId ? { ...event, isPaid, paymentMethod: isPaid ? paymentMethod : null } : event
      )
    );
     if(isPaid) {
        toast({
            title: "Status de Pagamento Atualizado",
            description: "O status de pagamento do evento foi atualizado.",
        });
     }
  }

  const handleTransfer = (eventId: string, bankAccountId: string) => {
    const eventToTransfer = events.find(e => e.id === eventId);
    const accountToUpdate = bankAccounts.find(acc => acc.id === bankAccountId);
    if (!eventToTransfer || !accountToUpdate) return;

    setBankAccounts(prevAccounts => 
      prevAccounts.map(account => 
        account.id === bankAccountId 
          ? { ...account, balance: account.balance + eventToTransfer.value }
          : account
      )
    );

    setEvents(prevEvents => 
      prevEvents.map(event => 
        event.id === eventId 
          ? { ...event, isTransferred: true, transferredToBankAccountId: bankAccountId }
          : event
      )
    );

    toast({
      title: "Transferência Realizada",
      description: `Valor de ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(eventToTransfer.value)} transferido para a conta ${accountToUpdate.bankName} com sucesso.`
    })
  }
  
  if (!isClient) {
    return null; // Or a loading spinner
  }

  return (
    <AppShell>
      <main className="container mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start mb-8">
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-8">
            <ValueSummary events={events} />
          </div>
          <div className="lg:col-span-2">
            <EventForm
              artists={artists}
              contractors={contractors}
              onEventAdd={handleEventAdd}
              isSubmitting={isSubmitting}
            />
          </div>
        </div>
        <div className="flex flex-col gap-8">
          <EventHistory 
            events={events} 
            artists={artists}
            contractors={contractors}
            bankAccounts={bankAccounts}
            onStatusChange={handleEventStatusChange}
            onPaymentChange={handlePaymentStatusChange}
            onEventUpdate={handleEventUpdate}
            onEventDelete={handleEventDelete}
            onTransfer={handleTransfer}
          />
        </div>
      </main>
    </AppShell>
  );
}
