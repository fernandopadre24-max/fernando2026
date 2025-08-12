
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Event } from '@/types';
import { Calendar, CalendarCheck, CalendarClock, DollarSign } from 'lucide-react';
import { useMemo } from 'react';

interface EventsSummaryProps {
  events: Event[];
}

const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

export function EventsSummary({ events }: EventsSummaryProps) {
  const summary = useMemo(() => {
    const totalValue = events.reduce((sum, event) => sum + event.value, 0);
    const pendingValue = events.filter(e => !e.isDone).reduce((sum, event) => sum + event.value, 0);
    const doneValue = events.filter(e => e.isDone).reduce((sum, event) => sum + event.value, 0);
    return { totalValue, pendingValue, doneValue };
  }, [events]);

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-blue-800 dark:text-blue-200">Valor Total em Eventos</CardTitle>
          <DollarSign className="h-4 w-4 text-blue-600 dark:text-blue-300" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">{formatCurrency(summary.totalValue)}</div>
          <p className="text-xs text-blue-700 dark:text-blue-300">Soma de todos os eventos</p>
        </CardContent>
      </Card>
      <Card className="bg-yellow-50 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-800">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-yellow-800 dark:text-yellow-200">Valor Pendente</CardTitle>
          <CalendarClock className="h-4 w-4 text-yellow-600 dark:text-yellow-300" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">{formatCurrency(summary.pendingValue)}</div>
          <p className="text-xs text-yellow-700 dark:text-yellow-300">Valor de eventos pendentes</p>
        </CardContent>
      </Card>
      <Card className="bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-green-800 dark:text-green-200">Valor Realizado</CardTitle>
          <CalendarCheck className="h-4 w-4 text-green-600 dark:text-green-300" />
        </CardHeader>
        <CardContent>
           <div className="text-2xl font-bold text-green-900 dark:text-green-100">{formatCurrency(summary.doneValue)}</div>
          <p className="text-xs text-green-700 dark:text-green-300">Valor de eventos concluídos</p>
        </CardContent>
      </Card>
    </div>
  );
}
