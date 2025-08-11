
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Event } from '@/types';
import { PiggyBank, Landmark } from 'lucide-react';

interface ValueSummaryProps {
  events: Event[];
}

export function ValueSummary({ events }: ValueSummaryProps) {
  const totalReceived = events
    .filter(event => event.isDone && event.isPaid)
    .reduce((sum, event) => sum + event.value, 0);

  const totalToReceive = events
    .filter(event => event.isDone && !event.isPaid)
    .reduce((sum, event) => sum + event.value, 0);

  const formatCurrency = (value: number) => new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium font-body">Total Recebido</CardTitle>
          <PiggyBank className="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold font-headline">{formatCurrency(totalReceived)}</div>
          <p className="text-xs text-muted-foreground font-body">
            Soma dos eventos concluídos e pagos.
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium font-body">A Receber</CardTitle>
          <Landmark className="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold font-headline">{formatCurrency(totalToReceive)}</div>
           <p className="text-xs text-muted-foreground font-body">
            Soma dos eventos concluídos e pendentes de pagamento.
          </p>
        </CardContent>
      </Card>
    </>
  );
}
