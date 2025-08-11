
'use client';

import { useState, useEffect } from 'react';
import { AppShell } from '@/components/app-shell';
import type { Event, Expense } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, TrendingDown, TrendingUp, PiggyBank } from 'lucide-react';

export default function FinancePage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const storedEvents = localStorage.getItem('events');
    if (storedEvents) {
      setEvents(JSON.parse(storedEvents));
    }
    const storedExpenses = localStorage.getItem('expenses');
    if (storedExpenses) {
        setExpenses(JSON.parse(storedExpenses));
    } else {
        // Mock data for now
        setExpenses([
            { id: '1', description: 'Aluguel do Som', value: 500, date: '2024-07-28', category: 'Equipamento' },
            { id: '2', description: 'Transporte da Banda', value: 200, date: '2024-07-28', category: 'Logística' },
        ]);
    }
  }, []);
  
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);

  const totalRevenue = events.reduce((sum, event) => sum + event.value, 0);
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.value, 0);
  const netProfit = totalRevenue - totalExpenses;

  if (!isClient) {
    return null; // or a loading spinner
  }

  return (
    <AppShell>
      <main className="container mx-auto px-4 pb-16">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold font-headline">Controle Financeiro</h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-emerald-50 border-emerald-200 dark:bg-emerald-950 dark:border-emerald-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium font-body text-emerald-800 dark:text-emerald-200">Receita Total (Eventos)</CardTitle>
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
             <Card className="bg-sky-50 border-sky-200 dark:bg-sky-950 dark:border-sky-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium font-body text-sky-800 dark:text-sky-200">Lucro Líquido</CardTitle>
                    <PiggyBank className="h-5 w-5 text-sky-600 dark:text-sky-400" />
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold font-headline text-sky-900 dark:text-sky-100">{formatCurrency(netProfit)}</div>
                </CardContent>
            </Card>
        </div>

        <Card>
            <CardHeader>
                <CardTitle>Em breve: Gerenciamento de Despesas</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-48 flex items-center justify-center text-muted-foreground border-2 border-dashed rounded-lg">
                    <p>A funcionalidade para adicionar e gerenciar despesas será implementada aqui.</p>
                </div>
            </CardContent>
        </Card>

      </main>
    </AppShell>
  );
}
