
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Event } from '@/types';

interface EventsByStatusChartProps {
    events: Event[];
}

export function EventsByStatusChart({ events }: EventsByStatusChartProps) {
    const doneCount = events.filter(e => e.isDone).length;
    const pendingCount = events.filter(e => !e.isDone).length;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Eventos por Status</CardTitle>
                <CardDescription>Visão geral de eventos realizados e pendentes.</CardDescription>
            </CardHeader>
            <CardContent>
                 <div className="flex justify-around items-center h-48">
                    <div className="text-center">
                        <p className="text-4xl font-bold text-green-600">{doneCount}</p>
                        <p className="text-sm text-muted-foreground">Realizados</p>
                    </div>
                    <div className="text-center">
                        <p className="text-4xl font-bold text-yellow-600">{pendingCount}</p>
                        <p className="text-sm text-muted-foreground">Pendentes</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
