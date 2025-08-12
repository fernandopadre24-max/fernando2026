
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Transaction } from '@/types';
import { useMemo } from 'react';

interface FinancialSummaryChartProps {
    transactions: Transaction[];
}

export function FinancialSummaryChart({ transactions }: FinancialSummaryChartProps) {
    
    const summary = useMemo(() => {
        const income = transactions.filter(t => t.type === 'Receita').reduce((acc, t) => acc + t.value, 0);
        const expenses = transactions.filter(t => t.type === 'Despesa').reduce((acc, t) => acc + t.value, 0);
        return { income, expenses };
    }, [transactions]);


    return (
        <Card>
            <CardHeader>
                <CardTitle>Resumo Financeiro</CardTitle>
                 <CardDescription>Visão geral de receitas e despesas.</CardDescription>
            </CardHeader>
            <CardContent>
                 <div className="flex justify-around items-center h-48">
                    <div className="text-center">
                        <p className="text-4xl font-bold text-green-600">{summary.income.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                        <p className="text-sm text-muted-foreground">Total de Receitas</p>
                    </div>
                    <div className="text-center">
                        <p className="text-4xl font-bold text-red-600">{summary.expenses.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                        <p className="text-sm text-muted-foreground">Total de Despesas</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
