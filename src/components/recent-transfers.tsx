
'use client';

import { useMemo } from 'react';
import type { BankAccount, Event } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRightLeft, History } from 'lucide-react';
import { Separator } from './ui/separator';

interface RecentTransfersProps {
  events: Event[];
  bankAccounts: BankAccount[];
}

export function RecentTransfers({ events, bankAccounts }: RecentTransfersProps) {
  const recentTransactions = useMemo(() => {
    return events
      .filter((event) => event.isTransferred && event.transferDate)
      .sort((a, b) => new Date(b.transferDate!).getTime() - new Date(a.transferDate!).getTime())
      .slice(0, 3)
      .map((event) => {
        const account = bankAccounts.find(
          (acc) => acc.id === event.transferredToBankAccountId
        );
        return {
          ...event,
          accountName: account
            ? `${account.bankName} - Conta: ${account.accountNumber}`
            : 'Conta não encontrada',
        };
      });
  }, [events, bankAccounts]);

  const totalTransferred = useMemo(() => {
     return events
      .filter((event) => event.isTransferred)
      .reduce((sum, event) => sum + event.value, 0);
  }, [events]);
  
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });
  }

  return (
    <Card className="bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800 h-full">
      <CardHeader>
        <CardTitle className="font-headline text-2xl flex items-center gap-2">
            <ArrowRightLeft className="h-6 w-6" />
            <span>Últimas Transferências</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-baseline mb-4">
            <p className="text-muted-foreground">Total Transferido</p>
            <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{formatCurrency(totalTransferred)}</p>
        </div>
        <Separator className="mb-4 bg-blue-200 dark:bg-blue-800" />
        <div className="space-y-4">
          {recentTransactions.length > 0 ? (
            recentTransactions.map((transaction) => (
              <div key={transaction.id} className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">Show {transaction.artist}</p>
                  <p className="text-sm text-muted-foreground">{transaction.accountName}</p>
                </div>
                <div className="text-right">
                    <p className="font-semibold">{formatCurrency(transaction.value)}</p>
                    <p className="text-sm text-muted-foreground">{formatDate(transaction.transferDate)}</p>
                </div>
              </div>
            ))
          ) : (
             <div className="flex flex-col items-center justify-center gap-2 text-blue-800/70 dark:text-blue-200/70 py-6">
                <History className="h-8 w-8" />
                <span>Nenhuma transferência encontrada.</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
