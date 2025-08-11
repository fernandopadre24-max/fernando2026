
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
import { History, MoreHorizontal, Trash2, Edit } from 'lucide-react';
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from './ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
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

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | ''>('');


  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const artistMatch =
        artistFilter === 'all' || event.artistId === artistFilter;
      const contractorMatch =
        contractorFilter === 'all' || event.contractorId === contractorFilter;
      return artistMatch && contractorMatch;
    });
  }, [events, artistFilter, contractorFilter]);

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
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
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
        </div>
        <div className="border rounded-md bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Artista</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead className="text-center">Feito</TableHead>
                <TableHead className="text-center">Pago</TableHead>
                <TableHead>Método Pgto.</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEvents.length > 0 ? (
                filteredEvents.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell className="font-medium">
                      {new Date(event.date + 'T00:00:00').toLocaleDateString(
                        'pt-BR'
                      )}
                    </TableCell>
                    <TableCell>{event.artist}</TableCell>
                    <TableCell>{formatCurrency(event.value)}</TableCell>
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
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Abrir menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditClick(event)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => handleDeleteClick(event)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-48 text-center">
                    <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                      <History className="h-8 w-8" />
                      <span>Nenhum evento encontrado.</span>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={2} className="font-bold">
                  Subtotal
                </TableCell>
                <TableCell className="font-bold">
                  {formatCurrency(subtotal)}
                </TableCell>
                <TableCell colSpan={4}></TableCell>
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
