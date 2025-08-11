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
import { Switch } from '@/components/ui/switch';

interface EventHistoryProps {
  events: Event[];
  onStatusChange: (eventId: string, type: 'isDone' | 'isPaid', value: boolean) => void;
}

export function EventHistory({ events, onStatusChange }: EventHistoryProps) {
    const formatCurrency = (value: number) => new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(value);

  return (
    <Card className="bg-yellow-100 border-yellow-200 dark:bg-yellow-950/50 dark:border-yellow-800">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Histórico de Eventos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="border rounded-md bg-card">
            <Table>
            <TableHeader>
                <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Artista</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead className="text-center">Feito</TableHead>
                <TableHead className="text-center">Pago</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {events.length > 0 ? (
                events.map((event) => (
                    <TableRow key={event.id}>
                    <TableCell className="font-medium">{new Date(event.date + 'T00:00:00').toLocaleDateString('pt-BR')}</TableCell>
                    <TableCell>{event.artist}</TableCell>
                    <TableCell>{formatCurrency(event.value)}</TableCell>
                    <TableCell className="text-center">
                        <Switch
                            checked={event.isDone}
                            onCheckedChange={(value) => onStatusChange(event.id, 'isDone', value)}
                        />
                    </TableCell>
                     <TableCell className="text-center">
                        <Switch
                            checked={event.isPaid}
                            onCheckedChange={(value) => onStatusChange(event.id, 'isPaid', value)}
                        />
                    </TableCell>
                    </TableRow>
                ))
                ) : (
                <TableRow>
                    <TableCell colSpan={5} className="h-48 text-center">
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
