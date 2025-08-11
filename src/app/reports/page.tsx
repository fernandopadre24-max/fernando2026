
'use client';

import { useState, useEffect } from 'react';
import type { Event, Transaction, ExpenseCategory, BankAccount } from '@/types';
import { AppShell } from '@/components/app-shell';
import { EventSummaryReport } from '@/components/reports/event-summary-report';
import { FinancialOverviewReport } from '@/components/reports/financial-overview-report';
import { BankAccountsReport } from '@/components/reports/bank-accounts-report';
import { ExpenseCategoryChart } from '@/components/reports/expense-category-chart';

export default function ReportsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<ExpenseCategory[]>([]);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const storedEvents = localStorage.getItem('events');
    if (storedEvents) setEvents(JSON.parse(storedEvents));
    
    const storedTransactions = localStorage.getItem('transactions');
    if (storedTransactions) setTransactions(JSON.parse(storedTransactions));

    const storedCategories = localStorage.getItem('expenseCategories');
    if (storedCategories) setCategories(JSON.parse(storedCategories));

    const storedBankAccounts = localStorage.getItem('bankAccounts');
    if (storedBankAccounts) setBankAccounts(JSON.parse(storedBankAccounts));
  }, []);

  if (!isClient) {
    return null; // or a loading spinner
  }

  return (
    <AppShell>
      <main className="container mx-auto px-4 pb-16">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold font-headline">Relatórios Consolidados</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main column */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            <FinancialOverviewReport events={events} transactions={transactions} />
            <EventSummaryReport events={events} />
            <BankAccountsReport bankAccounts={bankAccounts} />
          </div>

          {/* Side column */}
          <div className="lg:col-span-1 flex flex-col gap-8">
            <ExpenseCategoryChart transactions={transactions} categories={categories} />
          </div>
        </div>
      </main>
    </AppShell>
  );
}
