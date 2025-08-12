
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Event } from '@/types';
import { Calendar, CalendarCheck, CalendarClock } from 'lucide-react';
import { useMemo } from 'react';

interface EventsSummaryProps {
  events: Event[];
}

export function EventsSummary({ events }: EventsSummaryProps) {
  const summary = useMemo(() => {
    const total = events.length;
    const pending = events.filter(e => !e.isDone).length;
    const done = total - pending;
    return { total, pending, done };
  }, [events]);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Eventos Totais</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{summary.total}</div>
          <p className="text-xs text-muted-foreground">Total de eventos registrados</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
          <CalendarClock className="h-4 w-4 text-yellow-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{summary.pending}</div>
          <p className="text-xs text-muted-foreground">Eventos a serem realizados</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Realizados</CardTitle>
          <CalendarCheck className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
           <div className="text-2xl font-bold">{summary.done}</div>
          <p className="text-xs text-muted-foreground">Eventos já concluídos</p>
        </CardContent>
      </Card>
    </div>
  );
}
