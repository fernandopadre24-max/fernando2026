
'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from '@/components/ui/table';
import type { BankAccount } from '@/types';
import { Landmark, Sigma, FileDown } from 'lucide-react';
import { Button } from '../ui/button';
import { exportToPdf } from '@/lib/pdf-generator';

interface BankAccountsReportProps {
  bankAccounts: BankAccount[];
}

export function BankAccountsReport({ bankAccounts }: BankAccountsReportProps) {
  
  const totalBalance = bankAccounts.reduce((sum, account) => sum + account.balance, 0);

  const formatCurrency = (value: number) => new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);

  const handleExport = () => {
    const headers = [['Banco', 'Agência', 'Conta', 'Saldo']];
    const body = bankAccounts.map(acc => [
        acc.bankName,
        acc.agency,
        acc.accountNumber,
        formatCurrency(acc.balance)
    ]);
    const footer = [['', '', 'Saldo Total', formatCurrency(totalBalance)]];
    exportToPdf('Balanço das Contas Bancárias', headers, body, footer);
  }

  return (
    <Card>
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle className="font-headline text-xl flex items-center gap-2">
            <Landmark className="h-5 w-5" />
            Balanço das Contas Bancárias
        </CardTitle>
        <Button variant="outline" size="sm" onClick={handleExport} disabled={bankAccounts.length === 0}>
            <FileDown className="h-4 w-4 mr-2" />
            Exportar para PDF
        </Button>
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
