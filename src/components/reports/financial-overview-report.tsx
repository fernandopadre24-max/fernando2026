
'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Event, Transaction } from '@/types';
import { TrendingDown, TrendingUp } from 'lucide-react';

interface FinancialOverviewReportProps {
  events: Event[];
  transactions: Transaction[];
}

export function FinancialOverviewReport({ events, transactions }: FinancialOverviewReportProps) {
  const totalEventRevenue = events.reduce((sum, event) => sum + event.value, 0);
  const manualRevenue = transactions.filter(t => t.type === 'Receita').reduce((sum, t) => sum + t.value, 0);
  const totalRevenue = totalEventRevenue + manualRevenue;
  const totalExpenses = transactions.filter(t => t.type === 'Despesa').reduce((sum, t) => sum + t.value, 0);
  
  const formatCurrency = (value: number) => new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);

  return (
     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-emerald-50 border-emerald-200 dark:bg-emerald-950 dark:border-emerald-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium font-body text-emerald-800 dark:text-emerald-200">Receita Total</CardTitle>
                <TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </CardHeader>
            <CardContent>
                <div className="text-3xl font-bold font-headline text-emerald-900 dark:text-emerald-100">{formatCurrency(totalRevenue)}</div>
            </CardContent>
        </Card>
        <Card className="bg-rose-50 border-rose-200 dark:bg-rose-950 dark:border-rose-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium font-body text-rose-800 dark:text-rose-200">Despesas Totais</CardTitle>
                <TrendingDown className="h-5 w-5 text-rose-600 dark:text-rose-400" />
            </CardHeader>
            <CardContent>
                <div className="text-3xl font-bold font-headline text-rose-900 dark:text-rose-100">{formatCurrency(totalExpenses)}</div>
            </CardContent>
        </Card>
    </div>
  );
}
