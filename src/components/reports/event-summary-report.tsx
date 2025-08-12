
'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from '@/components/ui/table';
import type { Event } from '@/types';
import { CalendarCheck, CalendarClock, CalendarX, Package, Sigma, FileDown, Printer } from 'lucide-react';
import { Button } from '../ui/button';
import { exportToPdf, printReport } from '@/lib/pdf-generator';

interface EventSummaryReportProps {
  events: Event[];
}

export function EventSummaryReport({ events }: EventSummaryReportProps) {
  const totalEvents = events.length;
  const concludedEvents = events.filter(e => e.isDone).length;
  const pendingEvents = totalEvents - concludedEvents;

  const totalValue = events.reduce((sum, event) => sum + event.value, 0);
  const paidValue = events.filter(e => e.isPaid).reduce((sum, event) => sum + event.value, 0);
  const toReceiveValue = events.filter(e => e.isDone && !e.isPaid).reduce((sum, event) => sum + event.value, 0);

  const formatCurrency = (value: number) => new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);

  const generateReportData = () => {
    const headers = [['Métrica', 'Quantidade', 'Valor']];
    const body = [
        ['Eventos Concluídos', concludedEvents, formatCurrency(events.filter(e => e.isDone).reduce((sum, e) => sum + e.value, 0))],
        ['Eventos Pendentes', pendingEvents, formatCurrency(events.filter(e => !e.isDone).reduce((sum, e) => sum + e.value, 0))],
        ['A Receber (Concluídos)', '-', formatCurrency(toReceiveValue)],
    ];
    const footer = [['Total Geral', totalEvents, formatCurrency(totalValue)]];
    return { headers, body, footer };
  };

  const handleExport = () => {
    const { headers, body, footer } = generateReportData();
    exportToPdf('Resumo de Eventos', headers, body, footer);
  }

  const handlePrint = () => {
      const { headers, body, footer } = generateReportData();
      const tableHtml = `
        <table>
            <thead><tr>${headers[0].map(h => `<th>${h}</th>`).join('')}</tr></thead>
            <tbody>${body.map(row => `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`).join('')}</tbody>
            <tfoot><tr><td>${footer[0][0]}</td><td>${footer[0][1]}</td><td>${footer[0][2]}</td></tr></tfoot>
        </table>
      `;
      printReport('Resumo de Eventos', tableHtml);
  }

  return (
    <Card>
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle className="font-headline text-xl flex items-center gap-2">
            <Package className="h-5 w-5" />
            Resumo de Eventos
        </CardTitle>
        <div className='flex gap-2'>
            <Button variant="outline" size="sm" onClick={handlePrint} disabled={events.length === 0}>
                <Printer className="h-4 w-4 mr-2" />
                Imprimir
            </Button>
            <Button variant="outline" size="sm" onClick={handleExport} disabled={events.length === 0}>
                <FileDown className="h-4 w-4 mr-2" />
                Exportar para PDF
            </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="border rounded-md">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Métrica</TableHead>
                        <TableHead className="text-right">Quantidade</TableHead>
                        <TableHead className="text-right">Valor</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                     <TableRow>
                        <TableCell className="font-medium flex items-center gap-2"><CalendarCheck className="h-4 w-4 text-green-500" />Eventos Concluídos</TableCell>
                        <TableCell className="text-right">{concludedEvents}</TableCell>
                        <TableCell className="text-right">{formatCurrency(events.filter(e => e.isDone).reduce((sum, e) => sum + e.value, 0))}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className="font-medium flex items-center gap-2"><CalendarClock className="h-4 w-4 text-amber-500" />Eventos Pendentes</TableCell>
                        <TableCell className="text-right">{pendingEvents}</TableCell>
                        <TableCell className="text-right">{formatCurrency(events.filter(e => !e.isDone).reduce((sum, e) => sum + e.value, 0))}</TableCell>
                    </TableRow>
                     <TableRow>
                        <TableCell className="font-medium flex items-center gap-2"><CalendarX className="h-4 w-4 text-sky-500" />A Receber (Concluídos)</TableCell>
                        <TableCell className="text-right">-</TableCell>
                        <TableCell className="text-right">{formatCurrency(toReceiveValue)}</TableCell>
                    </TableRow>
                </TableBody>
                <TableFooter>
                    <TableRow className="bg-muted/50 font-bold">
                         <TableCell className="flex items-center gap-2"><Sigma className="h-4 w-4" />Total Geral</TableCell>
                         <TableCell className="text-right">{totalEvents}</TableCell>
                         <TableCell className="text-right">{formatCurrency(totalValue)}</TableCell>
                    </TableRow>
                </TableFooter>
            </Table>
        </div>
      </CardContent>
    </Card>
  );
}
