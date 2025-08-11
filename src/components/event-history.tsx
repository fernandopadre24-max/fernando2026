
'use client';

import { useMemo, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Artist, Contractor, Event, PaymentMethod } from '@/types';
import { History, Trash2, Edit } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { EventForm } from './event-form';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { DialogHeader, DialogTitle, DialogFooter, DialogClose } from './ui/dialog';


interface EventHistoryProps {
  events: Event[];
  artists: Artist[];
  contractors: Contractor[];
  onStatusChange: (
    eventId: string,
    type: 'isDone',
    value: boolean
  ) => void;
  onPaymentChange: (eventId: string, isPaid: boolean, paymentMethod: PaymentMethod | null) => void;
  onEventUpdate: (event: Event) => void;
  onEventDelete: (eventId: string) => void;
}

export function EventHistory({
  events,
  artists,
  contractors,
  onStatusChange,
  onPaymentChange,
  onEventUpdate,
  onEventDelete,
}: EventHistoryProps) {
  const [artistFilter, setArtistFilter] = useState('all');
  const [contractorFilter, setContractorFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | ''>('');

  const availableDates = useMemo(() => {
    const dates = new Set<string>();
    events.forEach((event) => {
      if (event.date) {
        // "2024-07-29" -> "2024-07"
        dates.add(event.date.substring(0, 7)); 
      }
    });
    return Array.from(dates).sort().reverse();
  }, [events]);

  const formatMonthYear = (dateString: string) => {
    const [year, month] = dateString.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleString('pt-BR', { month: 'long', year: 'numeric' });
  };


  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const artistMatch =
        artistFilter === 'all' || event.artistId === artistFilter;
      const contractorMatch =
        contractorFilter === 'all' || event.contractorId === contractorFilter;
      const dateMatch =
        dateFilter === 'all' || (event.date && event.date.startsWith(dateFilter));
      return artistMatch && contractorMatch && dateMatch;
    });
  }, [events, artistFilter, contractorFilter, dateFilter]);

  const subtotal = useMemo(() => {
    return filteredEvents.reduce((sum, event) => sum + event.value, 0);
  }, [filteredEvents]);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);

  const handleEditClick = (event: Event) => {
    setSelectedEvent(event);
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (event: Event) => {
    setSelectedEvent(event);
    setIsDeleteDialogOpen(true);
  };
  
  const confirmDelete = () => {
    if (selectedEvent) {
      onEventDelete(selectedEvent.id);
      setIsDeleteDialogOpen(false);
      setSelectedEvent(null);
    }
  };

  const handlePaymentSwitchChange = (event: Event, isPaid: boolean) => {
    if (isPaid) {
      setSelectedEvent(event);
      setIsPaymentDialogOpen(true);
    } else {
      onPaymentChange(event.id, false, null);
    }
  };
  
  const handleConfirmPayment = () => {
    if (selectedEvent && selectedPaymentMethod) {
      onPaymentChange(selectedEvent.id, true, selectedPaymentMethod);
      setIsPaymentDialogOpen(false);
      setSelectedEvent(null);
      setSelectedPaymentMethod('');
    }
  };
  

  return (
    <Card className="bg-yellow-100 border-yellow-200 dark:bg-yellow-950/50 dark:border-yellow-800">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">
          Histórico de Eventos
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <Select value={artistFilter} onValueChange={setArtistFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por artista" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Artistas</SelectItem>
              {artists.map((artist) => (
                <SelectItem key={artist.id} value={artist.id}>
                  {artist.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={contractorFilter} onValueChange={setContractorFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por contratante" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Contratantes</SelectItem>
              {contractors.map((contractor) => (
                <SelectItem key={contractor.id} value={contractor.id}>
                  {contractor.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
           <Select value={dateFilter} onValueChange={setDateFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por data" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as Datas</SelectItem>
              {availableDates.map((date) => (
                <SelectItem key={date} value={date}>
                  {formatMonthYear(date)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="border rounded-md bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Artista</TableHead>
                <TableHead>Contratante</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Observações</TableHead>
                <TableHead className="text-center">Feito</TableHead>
                <TableHead className="text-center">Pago</TableHead>
                <TableHead>Método Pgto.</TableHead>
                <TableHead className="w-[100px] text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEvents.length > 0 ? (
                filteredEvents.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell className="font-medium">
                      {event.date ? new Date(event.date + 'T00:00:00').toLocaleDateString(
                        'pt-BR'
                      ) : 'N/A'}
                    </TableCell>
                    <TableCell>{event.artist}</TableCell>
                    <TableCell>{event.contractor}</TableCell>
                    <TableCell>{formatCurrency(event.value)}</TableCell>
                    <TableCell className="max-w-[200px] truncate" title={event.observations}>{event.observations}</TableCell>
                    <TableCell className="text-center">
                      <Switch
                        checked={event.isDone}
                        onCheckedChange={(value) =>
                          onStatusChange(event.id, 'isDone', value)
                        }
                      />
                    </TableCell>
                    <TableCell className="text-center">
                       <Switch
                        checked={event.isPaid}
                        onCheckedChange={(value) => handlePaymentSwitchChange(event, value)}
                      />
                    </TableCell>
                     <TableCell>
                      {event.isPaid && <Badge variant="secondary">{event.paymentMethod}</Badge>}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEditClick(event)}>
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Editar</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDeleteClick(event)}
                        >
                          <Trash2 className="h-4 w-4" />
                           <span className="sr-only">Excluir</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={9} className="h-48 text-center">
                    <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                      <History className="h-8 w-8" />
                      <span>Nenhum evento encontrado para os filtros selecionados.</span>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={3} className="font-bold">
                  Subtotal
                </TableCell>
                <TableCell className="font-bold">
                  {formatCurrency(subtotal)}
                </TableCell>
                <TableCell colSpan={5}></TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      </CardContent>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <EventForm
            artists={artists}
            contractors={contractors}
            eventToEdit={selectedEvent}
            onEventUpdate={onEventUpdate}
            onEventAdd={async () => {}}
            isSubmitting={false}
            onClose={() => setIsEditDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
       <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Essa ação não pode ser desfeita. Isso excluirá permanentemente o evento.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Payment Method Dialog */}
      <Dialog open={isPaymentDialogOpen} onOpenChange={(isOpen) => {
        setIsPaymentDialogOpen(isOpen);
        if (!isOpen) {
            // If the dialog is closed without confirming, revert the switch
            if(selectedEvent && !selectedEvent.paymentMethod) {
                 onPaymentChange(selectedEvent.id, false, null);
            }
            setSelectedEvent(null);
            setSelectedPaymentMethod('');
        }
      }}>
          <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                  <DialogTitle>Selecionar Método de Pagamento</DialogTitle>
              </DialogHeader>
              <div className="py-4">
                   <RadioGroup 
                      defaultValue={selectedPaymentMethod} 
                      onValueChange={(value: PaymentMethod) => setSelectedPaymentMethod(value)}
                      className="grid grid-cols-3 gap-4"
                    >
                      <div>
                        <RadioGroupItem value="PIX" id="pix" className="peer sr-only" />
                        <Label
                          htmlFor="pix"
                          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                        >
                         PIX
                        </Label>
                      </div>
                       <div>
                        <RadioGroupItem value="Dinheiro" id="dinheiro" className="peer sr-only" />
                        <Label
                          htmlFor="dinheiro"
                          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                        >
                         Dinheiro
                        </Label>
                      </div>
                       <div>
                        <RadioGroupItem value="Cartão" id="cartao" className="peer sr-only" />
                        <Label
                          htmlFor="cartao"
                          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                        >
                         Cartão
                        </Label>
                      </div>
                    </RadioGroup>
              </div>
              <DialogFooter>
                  <DialogClose asChild>
                      <Button type="button" variant="secondary">Cancelar</Button>
                  </DialogClose>
                  <Button type="button" onClick={handleConfirmPayment} disabled={!selectedPaymentMethod}>
                    Confirmar Pagamento
                  </Button>
              </DialogFooter>
          </DialogContent>
      </Dialog>
    </Card>
  );
}
