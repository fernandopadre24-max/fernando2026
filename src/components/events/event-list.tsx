
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Pen, Trash2 } from 'lucide-react';
import { Event, Artist, Contractor } from '@/types';

interface EventListProps {
  events: Event[];
  artists: Artist[];
  contractors: Contractor[];
  onEdit: (event: Event) => void;
  onDelete: (id: string) => void;
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
};

const formatCurrency = (value: number) => {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

export function EventList({ events, artists, contractors, onEdit, onDelete }: EventListProps) {

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
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Abrir menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(event)}>
                      <Pen className="mr-2 h-4 w-4" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDelete(event.id)} className="text-red-600">
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
            <TableCell colSpan={7} className="h-24 text-center">
              Nenhum evento encontrado.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
