import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Event } from '@/types';
import { History } from 'lucide-react';

interface EventHistoryProps {
  events: Event[];
}

export function EventHistory({ events }: EventHistoryProps) {
    const formatCurrency = (value: number) => new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(value);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Histórico de Eventos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="border rounded-md">
            <Table>
            <TableHeader>
                <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Artista</TableHead>
                <TableHead>Contratante</TableHead>
                <TableHead className="text-right">Valor</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {events.length > 0 ? (
                events.map((event) => (
                    <TableRow key={event.id}>
                    <TableCell className="font-medium">{event.date}</TableCell>
                    <TableCell>{event.artist}</TableCell>
                    <TableCell>{event.contractor}</TableCell>
                    <TableCell className="text-right">{formatCurrency(event.value)}</TableCell>
                    </TableRow>
                ))
                ) : (
                <TableRow>
                    <TableCell colSpan={4} className="h-48 text-center">
                    <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                        <History className="h-8 w-8" />
                        <span>Nenhum evento ainda.</span>
                    </div>
                    </TableCell>
                </TableRow>
                )}
            </TableBody>
            </Table>
        </div>
      </CardContent>
    </Card>
  );
}
