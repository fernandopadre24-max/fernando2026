
'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Pen, Trash2, ArrowRightLeft } from 'lucide-react';
import { Event, Artist, Contractor } from '@/types';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface EventListProps {
  events: Event[];
  artists: Artist[];
  contractors: Contractor[];
  onEdit: (event: Event) => void;
  onDelete: (id: string) => void;
  onTransfer: (event: Event) => void;
  onStatusChange: (eventId: string, field: 'isDone' | 'isPaid', value: boolean) => void;
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
};

const formatCurrency = (value: number) => {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

export function EventList({ events, artists, contractors, onEdit, onDelete, onTransfer, onStatusChange }: EventListProps) {

  return (
    <div className="bg-notebook">
      <Table>
        <TableHeader>
          <TableRow className="bg-primary/5 border-b-primary/20">
            <TableHead>Data</TableHead>
            <TableHead>Artista</TableHead>
            <TableHead>Contratante</TableHead>
            <TableHead>Valor</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Pagamento</TableHead>
            <TableHead>Transferência</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {events.length > 0 ? (
            events
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map((event) => (
              <TableRow key={event.id}>
                <TableCell className="font-medium">{formatDate(event.date)} às {event.time}</TableCell>
                <TableCell>{event.artist}</TableCell>
                <TableCell>{event.contractor}</TableCell>
                <TableCell>{formatCurrency(event.value)}</TableCell>
                <TableCell>
                    <div className="flex items-center space-x-2">
                      <Switch
                          id={`isDone-${event.id}`}
                          checked={event.isDone}
                          onCheckedChange={(value) => onStatusChange(event.id, 'isDone', value)}
                          aria-label="Status do Evento"
                      />
                      <Label htmlFor={`isDone-${event.id}`} className={event.isDone ? 'text-green-600' : 'text-yellow-600'}>
                          {event.isDone ? 'Realizado' : 'Pendente'}
                      </Label>
                    </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                      <Switch
                          id={`isPaid-${event.id}`}
                          checked={event.isPaid}
                          onCheckedChange={(value) => onStatusChange(event.id, 'isPaid', value)}
                          aria-label="Status do Pagamento"
                      />
                      <Label htmlFor={`isPaid-${event.id}`} className={event.isPaid ? 'text-green-600' : 'text-red-600'}>
                          {event.isPaid ? 'Pago' : 'Pendente'}
                      </Label>
                    </div>
                </TableCell>
                <TableCell>
                  <Badge variant={event.isTransferred ? 'default' : 'secondary'}
                      className={event.isTransferred ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}>
                      {event.isTransferred ? 'Transferido' : 'Pendente'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => onEdit(event)}>
                        <Pen className="h-4 w-4" />
                        <span className="sr-only">Editar</span>
                      </Button>
                      {event.isPaid && !event.isTransferred && (
                        <Button variant="ghost" size="icon" onClick={() => onTransfer(event)}>
                            <ArrowRightLeft className="h-4 w-4" />
                            <span className="sr-only">Transferir para Conta</span>
                        </Button>
                      )}
                      <Button variant="ghost" size="icon" onClick={() => onDelete(event.id)} className="text-red-600 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Excluir</span>
                      </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={8} className="h-24 text-center">
                Nenhum evento encontrado.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
