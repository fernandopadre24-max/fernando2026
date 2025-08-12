
'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ReportView } from '@/components/reports/report-view';
import { Event, Transaction, ExpenseCategory, BankAccount } from '@/types';
import { loadData } from '@/lib/storage';
import { EventsByStatusChart } from '@/components/reports/events-by-status-chart';
import { FinancialSummaryChart } from '@/components/reports/financial-summary-chart';
import { useAuth } from '@/contexts/auth-context';


const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
const formatCurrency = (value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export default function ReportsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<ExpenseCategory[]>([]);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
        setEvents(loadData('events', []));
        setTransactions(loadData('transactions', []));
        setCategories(loadData('expenseCategories', []));
        setBankAccounts(loadData('bankAccounts', []));
    }
  }, [user]);

  const getCategoryName = (categoryId?: string | null) => {
    return categories.find((c) => c.id === categoryId)?.name || 'N/A';
  };

  const getBankAccountName = (accountId?: string | null) => {
    if (!accountId) return '-';
    const account = bankAccounts.find(acc => acc.id === accountId);
    return account ? `${account.bankName} (C/C: ${account.accountNumber})` : 'N/A';
  }

  const eventColumns = [
    { header: 'Data', dataKey: 'date' },
    { header: 'Artista', dataKey: 'artist' },
    { header: 'Contratante', dataKey: 'contractor' },
    { header: 'Valor', dataKey: 'value' },
    { header: 'Status', dataKey: 'status' },
    { header: 'Pagamento', dataKey: 'paymentStatus' },
    { header: 'Transferência', dataKey: 'transferStatus' },
    { header: 'Conta de Destino', dataKey: 'destinationAccount' },
  ];

  const eventData = events.map(event => ({
    ...event,
    date: `${formatDate(event.date)} às ${event.time}`,
    value: formatCurrency(event.value),
    status: event.isDone ? 'Realizado' : 'Pendente',
    paymentStatus: event.isPaid ? 'Pago' : 'Pendente',
    transferStatus: event.isTransferred ? 'Transferido' : 'Pendente',
    destinationAccount: getBankAccountName(event.transferredToBankAccountId),
  }));

  const financialColumns = [
    { header: 'Data', dataKey: 'date' },
    { header: 'Descrição', dataKey: 'description' },
    { header: 'Tipo', dataKey: 'type' },
    { header: 'Categoria', dataKey: 'category' },
    { header: 'Valor', dataKey: 'value' },
  ];

  const financialData = transactions.map(t => ({
    ...t,
    date: formatDate(t.date),
    value: formatCurrency(t.value),
    category: t.type === 'Despesa' ? getCategoryName(t.categoryId) : '-',
  }));

  const financialSummary = useMemo(() => {
    const totalIncome = transactions.filter(t => t.type === 'Receita').reduce((sum, t) => sum + t.value, 0);
    const totalExpenses = transactions.filter(t => t.type === 'Despesa').reduce((sum, t) => sum + t.value, 0);
    return { totalIncome, totalExpenses, balance: totalIncome - totalExpenses };
  }, [transactions]);


  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
       <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Relatórios</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        <EventsByStatusChart events={events} />
        <FinancialSummaryChart transactions={transactions} />
      </div>

      <Card>
         <CardHeader>
          <CardTitle>Relatórios Detalhados</CardTitle>
          <CardDescription>
            Exporte seus dados em PDF ou imprima-os.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="events">
            <TabsList>
              <TabsTrigger value="events">Eventos</TabsTrigger>
              <TabsTrigger value="finance">Financeiro</TabsTrigger>
            </TabsList>
            <TabsContent value="events">
              <ReportView
                title="Relatório de Eventos"
                data={eventData}
                columns={eventColumns}
              />
            </TabsContent>
            <TabsContent value="finance">
               <ReportView
                title="Relatório Financeiro"
                data={financialData}
                columns={financialColumns}
                footer={[
                    [
                        { content: 'Receitas:', colSpan: 4, styles: { fontStyle: 'bold', halign: 'right' } },
                        { content: formatCurrency(financialSummary.totalIncome), styles: { halign: 'left' } },
                    ],
                    [
                        { content: 'Despesas:', colSpan: 4, styles: { fontStyle: 'bold', halign: 'right' } },
                        { content: formatCurrency(financialSummary.totalExpenses), styles: { halign: 'left' } },
                    ],
                    [
                        { content: 'Saldo:', colSpan: 4, styles: { fontStyle: 'bold', halign: 'right' } },
                        { content: formatCurrency(financialSummary.balance), styles: { halign: 'left' } },
                    ],
                ]}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
