
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { EventList } from '@/components/events/event-list';
import { EventForm } from '@/components/events/event-form';
import { TransferDialog } from '@/components/events/transfer-dialog';
import { Event, Artist, Contractor, BankAccount, Transaction } from '@/types';
import { loadData, saveData } from '@/lib/storage';

const EventsPage = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [contractors, setContractors] = useState<Contractor[]>([]);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isTransferDialogOpen, setIsTransferDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  useEffect(() => {
    setEvents(loadData('events', []));
    setArtists(loadData('artists', [{ id: '1', name: 'Artista Padrão' }]));
    setContractors(loadData('contractors', [{ id: '1', name: 'Contratante Padrão' }]));
    setBankAccounts(loadData('bankAccounts', []));
  }, []);

  const handleSaveEvent = (event: Event) => {
    let updatedEvents;
    if (event.id) {
      updatedEvents = events.map((e) => (e.id === event.id ? event : e));
    } else {
      updatedEvents = [...events, { ...event, id: new Date().toISOString(), isTransferred: false }];
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

  const handleOpenTransferDialog = (event: Event) => {
    setSelectedEvent(event);
    setIsTransferDialogOpen(true);
  };

  const handleTransfer = (accountId: string) => {
    if (!selectedEvent) return;

    // Update event
    const updatedEvents = events.map((e) =>
      e.id === selectedEvent.id
        ? {
            ...e,
            isTransferred: true,
            transferredToBankAccountId: accountId,
            transferDate: new Date().toISOString(),
          }
        : e
    );
    setEvents(updatedEvents);
    saveData('events', updatedEvents);

    // Update bank account balance
    const updatedAccounts = bankAccounts.map(acc => 
      acc.id === accountId ? { ...acc, balance: acc.balance + selectedEvent.value } : acc
    );
    setBankAccounts(updatedAccounts);
    saveData('bankAccounts', updatedAccounts);

    // Create a new transaction
    const transactions = loadData('transactions', []);
    const newTransaction: Transaction = {
      id: new Date().toISOString(),
      description: `Transferência do evento: ${selectedEvent.artist} - ${new Date(selectedEvent.date).toLocaleDateString('pt-BR')}`,
      value: selectedEvent.value,
      date: new Date().toISOString().split('T')[0],
      type: 'Receita',
      isTransferred: true,
      transferredToBankAccountId: accountId,
      transferDate: new Date().toISOString(),
    };
    const updatedTransactions = [...transactions, newTransaction];
    saveData('transactions', updatedTransactions);


    setIsTransferDialogOpen(false);
    setSelectedEvent(null);
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
            onTransfer={handleOpenTransferDialog}
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

      {isTransferDialogOpen && selectedEvent && (
        <TransferDialog
          isOpen={isTransferDialogOpen}
          onClose={() => {
            setIsTransferDialogOpen(false);
            setSelectedEvent(null);
          }}
          onConfirm={handleTransfer}
          accounts={bankAccounts}
          eventValue={selectedEvent.value}
        />
      )}
    </div>
  );
};

export default EventsPage;
