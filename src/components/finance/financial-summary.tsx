
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Transaction } from '@/types';
import { ArrowDownCircle, ArrowUpCircle, DollarSign } from 'lucide-react';

interface FinancialSummaryProps {
  transactions: Transaction[];
}

export function FinancialSummary({ transactions }: FinancialSummaryProps) {
  const totalIncome = transactions
    .filter((t) => t.type === 'Receita')
    .reduce((acc, t) => acc + t.value, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === 'Despesa')
    .reduce((acc, t) => acc + t.value, 0);

  const balance = totalIncome - totalExpenses;

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card className="bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-green-800 dark:text-green-200">Receitas</CardTitle>
          <ArrowUpCircle className="h-4 w-4 text-green-600 dark:text-green-300" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-900 dark:text-green-100">{formatCurrency(totalIncome)}</div>
          <p className="text-xs text-green-700 dark:text-green-300">Total de entradas</p>
        </CardContent>
      </Card>
      <Card className="bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-red-800 dark:text-red-200">Despesas</CardTitle>
          <ArrowDownCircle className="h-4 w-4 text-red-600 dark:text-red-300" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-900 dark:text-red-100">{formatCurrency(totalExpenses)}</div>
          <p className="text-xs text-red-700 dark:text-red-300">Total de saídas</p>
        </CardContent>
      </Card>
      <Card className="bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-blue-800 dark:text-blue-200">Saldo</CardTitle>
          <DollarSign className="h-4 w-4 text-blue-600 dark:text-blue-300" />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${balance >= 0 ? 'text-blue-900 dark:text-blue-100' : 'text-red-600'}`}>
            {formatCurrency(balance)}
          </div>
          <p className="text-xs text-blue-700 dark:text-blue-300">Receitas - Despesas</p>
        </CardContent>
      </Card>
    </div>
  );
}
