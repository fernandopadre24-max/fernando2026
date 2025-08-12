
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

interface EventListProps {
  events: Event[];
  artists: Artist[];
  contractors: Contractor[];
  onEdit: (event: Event) => void;
  onDelete: (id: string) => void;
  onTransfer: (event: Event) => void;
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
};

const formatCurrency = (value: number) => {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

export function EventList({ events, artists, contractors, onEdit, onDelete, onTransfer }: EventListProps) {

  return (
    <Table>
      <TableHeader>
        <TableRow>
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
                <Badge variant={event.isDone ? 'default' : 'secondary'} 
                   className={event.isDone ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                  {event.isDone ? 'Realizado' : 'Pendente'}
                </Badge>
              </TableCell>
               <TableCell>
                <Badge variant={event.isPaid ? 'default' : 'destructive'} 
                   className={event.isPaid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                  {event.isPaid ? 'Pago' : 'Pendente'}
                </Badge>
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
  );
}
