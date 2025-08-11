
'use client';

import { useMemo } from 'react';
import type { BankAccount, Event, Transaction } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter
} from '@/components/ui/table';
import { History } from 'lucide-react';

interface Transfer {
    id: string;
    description: string;
    value: number;
    accountName: string;
    transferDate?: string;
}

interface TransferHistoryReportProps {
  events: Event[];
  transactions: Transaction[];
  bankAccounts: BankAccount[];
}

export function TransferHistoryReport({ events, transactions, bankAccounts }: TransferHistoryReportProps) {
  const allTransfers = useMemo(() => {
    const eventTransfers = events
      .filter((event) => event.isTransferred && event.transferredToBankAccountId)
      .map((event) => {
        const account = bankAccounts.find(
          (acc) => acc.id === event.transferredToBankAccountId
        );
        return {
          id: event.id,
          description: `Show ${event.artist} em ${new Date(event.date + 'T00:00:00').toLocaleDateString('pt-BR')}`,
          value: event.value,
          accountName: account
            ? `${account.bankName} - ${account.accountNumber}`
            : 'Conta não encontrada',
          transferDate: event.transferDate,
        };
      });

      const transactionTransfers = transactions
        .filter((t) => t.type === 'Receita' && t.isTransferred && t.transferredToBankAccountId)
        .map((t) => {
             const account = bankAccounts.find(
                (acc) => acc.id === t.transferredToBankAccountId
            );
            return {
                id: t.id,
                description: t.description,
                value: t.value,
                 accountName: account
                    ? `${account.bankName} - ${account.accountNumber}`
                    : 'Conta não encontrada',
                transferDate: t.transferDate,
            }
        });

    return [...eventTransfers, ...transactionTransfers]
      .sort((a, b) => new Date(b.transferDate!).getTime() - new Date(a.transferDate!).getTime());
  }, [events, transactions, bankAccounts]);

  const totalTransferred = useMemo(() => {
    return allTransfers.reduce((sum, transaction) => sum + transaction.value, 0);
  }, [allTransfers]);
  
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
  }

  return (
    <Card className="bg-yellow-100/60 border-yellow-200/80 dark:bg-yellow-950/50 dark:border-yellow-800/60">
      <CardHeader>
        <CardTitle>Histórico de Movimentações Bancárias</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="border rounded-md bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data da Transferência</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Conta de Destino</TableHead>
                <TableHead className="text-right">Valor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allTransfers.length > 0 ? (
                allTransfers.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>{formatDate(transaction.transferDate)}</TableCell>
                    <TableCell className="font-medium">
                      {transaction.description}
                    </TableCell>
                    <TableCell>{transaction.accountName}</TableCell>
                    <TableCell className="text-right">{formatCurrency(transaction.value)}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                      <History className="h-8 w-8" />
                      <span>Nenhuma transação encontrada.</span>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={3} className="text-right font-bold">Total Transferido</TableCell>
                <TableCell className="text-right font-bold">{formatCurrency(totalTransferred)}</TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
