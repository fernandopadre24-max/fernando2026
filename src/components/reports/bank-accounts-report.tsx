
'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from '@/components/ui/table';
import type { BankAccount } from '@/types';
import { Landmark, Sigma } from 'lucide-react';

interface BankAccountsReportProps {
  bankAccounts: BankAccount[];
}

export function BankAccountsReport({ bankAccounts }: BankAccountsReportProps) {
  
  const totalBalance = bankAccounts.reduce((sum, account) => sum + account.balance, 0);

  const formatCurrency = (value: number) => new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-xl flex items-center gap-2">
            <Landmark className="h-5 w-5" />
            Balanço das Contas Bancárias
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="border rounded-md">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Banco</TableHead>
                        <TableHead>Agência</TableHead>
                        <TableHead>Conta</TableHead>
                        <TableHead className="text-right">Saldo</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {bankAccounts.length > 0 ? bankAccounts.map((account) => (
                        <TableRow key={account.id}>
                            <TableCell className="font-medium">{account.bankName}</TableCell>
                            <TableCell>{account.agency}</TableCell>
                            <TableCell>{account.accountNumber}</TableCell>
                            <TableCell className="text-right">{formatCurrency(account.balance)}</TableCell>
                        </TableRow>
                    )) : (
                        <TableRow>
                            <TableCell colSpan={4} className="h-24 text-center">Nenhuma conta encontrada.</TableCell>
                        </TableRow>
                    )}
                </TableBody>
                <TableFooter>
                    <TableRow className="bg-muted/50 font-bold">
                        <TableCell colSpan={3} className="text-right flex items-center gap-2 justify-end"><Sigma className="h-4 w-4" /> Saldo Total</TableCell>
                        <TableCell className="text-right">{formatCurrency(totalBalance)}</TableCell>
                    </TableRow>
                </TableFooter>
            </Table>
        </div>
      </CardContent>
    </Card>
  );
}
