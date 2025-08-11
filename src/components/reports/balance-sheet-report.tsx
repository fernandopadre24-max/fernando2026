
'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Event, Transaction, BankAccount } from '@/types';
import { Scale, PiggyBank } from 'lucide-react';

interface BalanceSheetReportProps {
  events: Event[];
  transactions: Transaction[];
  bankAccounts: BankAccount[];
}

export function BalanceSheetReport({ events, transactions, bankAccounts }: BalanceSheetReportProps) {
  const totalEventRevenue = events.reduce((sum, event) => sum + event.value, 0);
  const manualRevenue = transactions.filter(t => t.type === 'Receita').reduce((sum, t) => sum + t.value, 0);
  const totalRevenue = totalEventRevenue + manualRevenue;
  const totalExpenses = transactions.filter(t => t.type === 'Despesa').reduce((sum, t) => sum + t.value, 0);
  const netProfit = totalRevenue - totalExpenses;

  const totalInBanks = bankAccounts.reduce((sum, account) => sum + account.balance, 0);
  
  const formatCurrency = (value: number) => new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);

  return (
    <Card className="bg-primary/5 border-primary/20">
      <CardHeader>
        <CardTitle className="font-headline text-xl flex items-center gap-2 text-primary/90">
            <Scale className="h-5 w-5" />
            Balanço Patrimonial Geral
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-indigo-50 border-indigo-200 dark:bg-indigo-950 dark:border-indigo-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium font-body text-indigo-800 dark:text-indigo-200">Ativos (Saldo em Contas)</CardTitle>
                    <PiggyBank className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold font-headline text-indigo-900 dark:text-indigo-100">{formatCurrency(totalInBanks)}</div>
                </CardContent>
            </Card>
             <Card className="bg-sky-50 border-sky-200 dark:bg-sky-950 dark:border-sky-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium font-body text-sky-800 dark:text-sky-200">Resultado (Lucro Líquido)</CardTitle>
                    <PiggyBank className="h-5 w-5 text-sky-600 dark:text-sky-400" />
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold font-headline text-sky-900 dark:text-sky-100">{formatCurrency(netProfit)}</div>
                </CardContent>
            </Card>
        </div>
      </CardContent>
    </Card>
  );
}
