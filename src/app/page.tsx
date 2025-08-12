
'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { loadData } from '@/lib/storage';
import { Event, Transaction, ExpenseCategory } from '@/types';
import { Calendar } from 'lucide-react';
import Link from 'next/link';
import { MonthlyRevenueChart } from '@/components/dashboard/monthly-revenue-chart';
import { ExpensesByCategoryChart } from '@/components/dashboard/expenses-by-category-chart';
import { FinancialSummary } from '@/components/finance/financial-summary';
import { EventsSummary } from '@/components/dashboard/events-summary';
import { useAuth } from '@/contexts/auth-context';


const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
};

export default function Home() {
  const [events, setEvents] = useState<Event[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<ExpenseCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
        const loadedEvents = loadData<Event[]>('events', []);
        const loadedTransactions = loadData<Transaction[]>('transactions', []);
        const loadedCategories = loadData<ExpenseCategory[]>('expenseCategories', []);

        setEvents(loadedEvents);
        setTransactions(loadedTransactions);
        setCategories(loadedCategories);
        setLoading(false);
    }
  }, [user]);
    
  const upcomingEvents = useMemo(() => {
    return [...events]
      .filter(e => !e.isDone)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 5);
  }, [events]);

  const recentTransactions = useMemo(() => {
    return [...transactions]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  }, [transactions]);


  if (loading) {
    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            <p>Carregando...</p>
        </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        </div>

        <div className="grid gap-4 md:grid-cols-1">
            <FinancialSummary transactions={transactions} />
            <EventsSummary events={events} />
        </div>


        <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
             <MonthlyRevenueChart transactions={transactions} />
             <ExpensesByCategoryChart transactions={transactions} categories={categories} />
        </div>

         <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="lg:col-span-4">
              <CardHeader>
                <CardTitle>Próximos Eventos</CardTitle>
                <CardDescription>
                  Seus próximos 5 eventos pendentes.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {upcomingEvents.length > 0 ? (
                    <div className="space-y-4">
                    {upcomingEvents.map((event) => (
                       <Link href={`/events`} key={event.id}>
                          <div className="flex items-center hover:bg-muted/50 p-2 rounded-md transition-colors">
                            <Calendar className="h-6 w-6 mr-4 text-muted-foreground" />
                            <div className="flex-1">
                              <p className="text-sm font-medium leading-none">{event.artist}</p>
                              <p className="text-sm text-muted-foreground">{event.contractor}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium">{formatDate(event.date)}</p>
                              <p className="text-sm text-muted-foreground">{event.time}</p>
                            </div>
                          </div>
                       </Link>
                    ))}
                  </div>
                ) : (
                    <p className="text-sm text-muted-foreground">Nenhum evento pendente.</p>
                )}
              </CardContent>
            </Card>
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Transações Recentes</CardTitle>
                <CardDescription>
                  Suas últimas 5 movimentações.
                </CardDescription>
              </CardHeader>
              <CardContent>
                 {recentTransactions.length > 0 ? (
                    <div className="space-y-4">
                        {recentTransactions.map((transaction) => (
                           <Link href={`/finance`} key={transaction.id}>
                              <div className="flex items-center hover:bg-muted/50 p-2 rounded-md transition-colors">
                                  <div className="flex-1">
                                      <p className="text-sm font-medium">{transaction.description}</p>
                                      <p className="text-sm text-muted-foreground">{formatDate(transaction.date)}</p>
                                  </div>
                                  <div className={`font-medium ${transaction.type === 'Receita' ? 'text-green-600' : 'text-red-600'}`}>
                                      {transaction.type === 'Receita' ? '+' : '-'} {formatCurrency(transaction.value)}
                                  </div>
                              </div>
                           </Link>
                        ))}
                    </div>
                 ) : (
                    <p className="text-sm text-muted-foreground">Nenhuma transação registrada.</p>
                 )}
              </CardContent>
            </Card>
          </div>
    </div>
  );
}
