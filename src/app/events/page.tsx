
'use client';

import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { EventList } from '@/components/events/event-list';
import { EventForm } from '@/components/events/event-form';
import { TransferDialog } from '@/components/events/transfer-dialog';
import { Event, Artist, Contractor, BankAccount, Transaction } from '@/types';
import { loadData, saveData } from '@/lib/storage';
import { EventFilters } from '@/components/events/event-filters';
import { DateRange } from 'react-day-picker';
import { useAuth } from '@/contexts/auth-context';


const EventsPage = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [contractors, setContractors] = useState<Contractor[]>([]);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isTransferDialogOpen, setIsTransferDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const { user } = useAuth();

  // Filter states
  const [artistFilter, setArtistFilter] = useState('all');
  const [contractorFilter, setContractorFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('all');
  const [dateRangeFilter, setDateRangeFilter] = useState<DateRange | undefined>();

  useEffect(() => {
    if (user) {
        setEvents(loadData('events', []));
        setArtists(loadData('artists', []));
        setContractors(loadData('contractors', []));
        setBankAccounts(loadData('bankAccounts', []));
    }
  }, [user]);

  const handleSaveEvent = (event: Event) => {
    let updatedEvents;
    if (event.id) {
      updatedEvents = events.map((e) => (e.id === event.id ? event : e));
    } else {
      updatedEvents = [...events, { ...event, id: `event-${Date.now()}`, isTransferred: false }];
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
  
  const handleStatusChange = (eventId: string, field: 'isDone' | 'isPaid', value: boolean) => {
    const updatedEvents = events.map((event) => {
      if (event.id === eventId) {
        return { ...event, [field]: value };
      }
      return event;
    });
    setEvents(updatedEvents);
    saveData('events', updatedEvents);
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
      id: `trans-${Date.now()}`,
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

  const handleClearFilters = () => {
    setArtistFilter('all');
    setContractorFilter('all');
    setStatusFilter('all');
    setPaymentStatusFilter('all');
    setDateRangeFilter(undefined);
  };

  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      const artistMatch = artistFilter !== 'all' ? event.artistId === artistFilter : true;
      const contractorMatch = contractorFilter !== 'all' ? event.contractorId === contractorFilter : true;
      const statusMatch = statusFilter !== 'all' ? String(event.isDone) === statusFilter : true;
      const paymentStatusMatch = paymentStatusFilter !== 'all' ? String(event.isPaid) === paymentStatusFilter : true;
      
      let dateMatch = true;
      if (dateRangeFilter?.from) {
          const eventDate = new Date(event.date);
          eventDate.setUTCHours(0,0,0,0);
          
          const fromDate = new Date(dateRangeFilter.from);
          fromDate.setUTCHours(0,0,0,0);

          if (dateRangeFilter.to) {
                const toDate = new Date(dateRangeFilter.to);
                toDate.setUTCHours(0,0,0,0);
                dateMatch = eventDate >= fromDate && eventDate <= toDate;
          } else {
              dateMatch = eventDate.getTime() === fromDate.getTime();
          }
      }

      return artistMatch && contractorMatch && statusMatch && paymentStatusMatch && dateMatch;
    });
  }, [events, artistFilter, contractorFilter, statusFilter, paymentStatusFilter, dateRangeFilter]);

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

      <EventFilters
        artists={artists}
        contractors={contractors}
        artistFilter={artistFilter}
        onArtistChange={setArtistFilter}
        contractorFilter={contractorFilter}
        onContractorChange={setContractorFilter}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        paymentStatusFilter={paymentStatusFilter}
        onPaymentStatusChange={setPaymentStatusFilter}
        dateRange={dateRangeFilter}
        onDateRangeChange={setDateRangeFilter}
        onClearFilters={handleClearFilters}
      />

      <div className="mt-8">
        <EventList 
            events={filteredEvents} 
            artists={artists}
            contractors={contractors}
            onEdit={handleEditEvent}
            onDelete={handleDeleteEvent}
            onTransfer={handleOpenTransferDialog}
            onStatusChange={handleStatusChange}
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
