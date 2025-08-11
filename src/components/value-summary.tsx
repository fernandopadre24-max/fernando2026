import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Event } from '@/types';
import { PiggyBank } from 'lucide-react';

interface ValueSummaryProps {
  events: Event[];
}

export function ValueSummary({ events }: ValueSummaryProps) {
  const totalValue = events
    .filter(event => event.isDone && event.isPaid)
    .reduce((sum, event) => sum + event.value, 0);

  const formattedValue = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(totalValue);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium font-body">Receita Total</CardTitle>
        <PiggyBank className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold font-headline">{formattedValue}</div>
        <p className="text-xs text-muted-foreground font-body">
          Soma dos valores dos eventos concluídos e pagos
        </p>
      </CardContent>
    </Card>
  );
}
