
'use client';

import { useState, useEffect } from 'react';
import type { Artist, Contractor, Event, PaymentMethod, BankAccount } from '@/types';
import { EventForm, type EventFormValues } from '@/components/event-form';
import { EventHistory } from '@/components/event-history';
import { RecentTransfers } from '@/components/recent-transfers';
import { useToast } from '@/hooks/use-toast';
import { AppShell } from '@/components/app-shell';
import { DashboardSummary } from '@/components/dashboard-summary';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';

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
  const { user, getUserData, saveUserData } = useAuth();
  const router = useRouter();

  const [events, setEvents] = useState<Event[]>([]);
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);

  const [artists, setArtists] = useState<Artist[]>([]);
  const [contractors, setContractors] = useState<Contractor[]>([]);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (user) {
      const storedEvents = getUserData('events') || [];
      const parsedEvents = storedEvents.map((event: Event) => ({
        ...event,
        paymentMethod: event.paymentMethod || null,
        observations: event.observations || '',
        isTransferred: event.isTransferred || false,
        transferredToBankAccountId: event.transferredToBankAccountId || null,
        transferDate: event.transferDate || undefined,
      }));
      setEvents(parsedEvents);

      setArtists(getUserData('artists') || initialArtists);
      setContractors(getUserData('contractors') || initialContractors);
      setBankAccounts(getUserData('bankAccounts') || []);
    } else if (isClient) {
      router.push('/login');
    }
  }, [user, isClient, router, getUserData]);

  useEffect(() => {
    if(isClient && user) {
      saveUserData('events', events);
      saveUserData('artists', artists);
      saveUserData('contractors', contractors);
      saveUserData('bankAccounts', bankAccounts);
    }
  }, [events, artists, contractors, bankAccounts, isClient, user, saveUserData]);


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
          ? { ...event, isTransferred: true, transferredToBankAccountId: bankAccountId, transferDate: new Date().toISOString() }
          : event
      )
    );

    toast({
      title: "Transferência Realizada",
      description: `Valor de ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(eventToTransfer.value)} transferido para a conta ${accountToUpdate.bankName} com sucesso.`
    })
  }
  
  if (!isClient || !user) {
    return null; // Or a loading spinner
  }

  return (
    <AppShell>
      <main className="container mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start mb-8">
          <div className="lg:col-span-3 flex flex-col gap-8">
             <DashboardSummary events={events} />
             <RecentTransfers events={events} bankAccounts={bankAccounts} />
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
