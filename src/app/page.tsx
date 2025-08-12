
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { loadData } from '@/lib/storage';
import { Event, Artist, Contractor, BankAccount, Transaction } from '@/types';
import { Calendar, Users, Banknote, Landmark, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import Link from 'next/link';

const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
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

  const summaryCards = [
    { title: 'Eventos', value: events.length, icon: Calendar, href: '/events', description: 'Eventos cadastrados' },
    { title: 'Artistas', value: artists.length, icon: Users, href: '/artists', description: 'Artistas cadastrados' },
    { title: 'Contratantes', value: contractors.length, icon: Banknote, href: '/contractors', description: 'Contratantes cadastrados' },
    { title: 'Contas Bancárias', value: bankAccounts.length, icon: Landmark, href: '/banks', description: 'Contas gerenciadas' },
  ];

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
            {summaryCards.map((card, index) => (
                <Link href={card.href} key={index}>
                    <Card className="hover:bg-muted/50 transition-colors">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                            <card.icon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{card.value}</div>
                            <p className="text-xs text-muted-foreground">{card.description}</p>
                        </CardContent>
                    </Card>
                </Link>
            ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
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
        </div>
    </div>
  );
}
