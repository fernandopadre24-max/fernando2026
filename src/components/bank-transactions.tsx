
'use client';

import { useMemo } from 'react';
import type { BankAccount, Event } from '@/types';
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

interface BankTransactionsProps {
  events: Event[];
  bankAccounts: BankAccount[];
}

export function BankTransactions({ events, bankAccounts }: BankTransactionsProps) {
  const transactions = useMemo(() => {
    return events
      .filter((event) => event.isTransferred && event.transferredToBankAccountId)
      .map((event) => {
        const account = bankAccounts.find(
          (acc) => acc.id === event.transferredToBankAccountId
        );
        return {
          ...event,
          accountName: account
            ? `${account.bankName} - ${account.accountNumber}`
            : 'Conta não encontrada',
        };
      })
      .sort((a, b) => new Date(b.transferDate!).getTime() - new Date(a.transferDate!).getTime());
  }, [events, bankAccounts]);

  const totalTransferred = useMemo(() => {
    return transactions.reduce((sum, transaction) => sum + transaction.value, 0);
  }, [transactions]);
  
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
    <Card>
      <CardHeader>
        <CardTitle>Histórico de Movimentações Bancárias</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data da Transferência</TableHead>
                <TableHead>Descrição do Evento</TableHead>
                <TableHead>Conta de Destino</TableHead>
                <TableHead className="text-right">Valor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.length > 0 ? (
                transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>{formatDate(transaction.transferDate)}</TableCell>
                    <TableCell className="font-medium">
                      Show {transaction.artist} em {new Date(transaction.date + 'T00:00:00').toLocaleDateString('pt-BR')}
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
