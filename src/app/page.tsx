
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { loadData } from '@/lib/storage';
import { Event, Artist, Contractor, BankAccount, Transaction } from '@/types';
import { Calendar, Users, Banknote, Landmark, ArrowUpCircle, ArrowDownCircle, Wallet, ListTodo } from 'lucide-react';
import Link from 'next/link';

const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
};

export default function Home() {
  const [events, setEvents] = useState<Event[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [contractors, setContractors] = useState<Contractor[]>([]);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setEvents(loadData('events', []));
    setArtists(loadData('artists', []));
    setContractors(loadData('contractors', []));
    setBankAccounts(loadData('bankAccounts', []));
    setTransactions(loadData('transactions', []));
    setLoading(false);
  }, []);

  const totalIncome = transactions
    .filter((t) => t.type === 'Receita')
    .reduce((acc, t) => acc + t.value, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === 'Despesa')
    .reduce((acc, t) => acc + t.value, 0);

  const totalBalance = bankAccounts.reduce((acc, b) => acc + b.balance, 0);
  
  const pendingEvents = events.filter(e => !e.isDone);

  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);
    
  const upcomingEvents = [...events]
    .filter(e => !e.isDone)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);


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

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <Link href="/events">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total de Eventos</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{events.length}</div>
                        <p className="text-xs text-muted-foreground">Eventos cadastrados</p>
                    </CardContent>
                </Link>
            </Card>
            <Card>
                 <Link href="/events">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Eventos Pendentes</CardTitle>
                        <ListTodo className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{pendingEvents.length}</div>
                        <p className="text-xs text-muted-foreground">Eventos a serem realizados</p>
                    </CardContent>
                 </Link>
            </Card>
            <Card>
                 <Link href="/artists">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Artistas</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{artists.length}</div>
                        <p className="text-xs text-muted-foreground">Artistas cadastrados</p>
                    </CardContent>
                </Link>
            </Card>
            <Card>
                <Link href="/contractors">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Contratantes</CardTitle>
                        <Banknote className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{contractors.length}</div>
                        <p className="text-xs text-muted-foreground">Contratantes cadastrados</p>
                    </CardContent>
                </Link>
            </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Receitas</CardTitle>
                    <ArrowUpCircle className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(totalIncome)}</div>
                    <p className="text-xs text-muted-foreground">Total de entradas</p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Despesas</CardTitle>
                    <ArrowDownCircle className="h-4 w-4 text-red-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(totalExpenses)}</div>
                    <p className="text-xs text-muted-foreground">Total de saídas</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Saldo em Contas</CardTitle>
                    <Landmark className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(totalBalance)}</div>
                    <p className="text-xs text-muted-foreground">Soma dos saldos bancários</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Balanço Geral</CardTitle>
                    <Wallet className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className={`text-2xl font-bold ${totalIncome - totalExpenses >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatCurrency(totalIncome - totalExpenses)}
                    </div>
                    <p className="text-xs text-muted-foreground">Receitas - Despesas</p>
                </CardContent>
            </Card>
        </div>

         <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="lg:col-span-4">
              <CardHeader>
                <CardTitle>Próximos Eventos</CardTitle>
              </CardHeader>
              <CardContent>
                {upcomingEvents.length > 0 ? (
                    <div className="space-y-4">
                    {upcomingEvents.map((event) => (
                      <div key={event.id} className="flex items-center">
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
                            <div key={transaction.id} className="flex items-center">
                                <div className="flex-1">
                                    <p className="text-sm font-medium">{transaction.description}</p>
                                    <p className="text-sm text-muted-foreground">{formatDate(transaction.date)}</p>
                                </div>
                                <div className={`font-medium ${transaction.type === 'Receita' ? 'text-green-600' : 'text-red-600'}`}>
                                    {transaction.type === 'Receita' ? '+' : '-'} {formatCurrency(transaction.value)}
                                </div>
                            </div>
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
