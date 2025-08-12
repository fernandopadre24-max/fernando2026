
'use client';

import { useMemo } from 'react';
import { Pie, PieChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Transaction } from '@/types';

interface FinancialSummaryChartProps {
    transactions: Transaction[];
}

const chartConfig = {
  income: {
    label: "Receitas",
    color: "hsl(var(--chart-2))",
  },
  expenses: {
    label: "Despesas",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};


export function FinancialSummaryChart({ transactions }: FinancialSummaryChartProps) {
    
    const summary = useMemo(() => {
        const income = transactions.filter(t => t.type === 'Receita').reduce((acc, t) => acc + t.value, 0);
        const expenses = transactions.filter(t => t.type === 'Despesa').reduce((acc, t) => acc + t.value, 0);
        return { income, expenses, balance: income - expenses };
    }, [transactions]);

    const chartData = [
      { type: "expenses", value: summary.expenses, fill: "var(--color-expenses)" },
      { type: "income", value: summary.income, fill: "var(--color-income)" },
    ]

    return (
        <Card className="flex flex-col">
            <CardHeader className="items-center pb-0">
                <CardTitle>Resumo Financeiro</CardTitle>
                <CardDescription>Visão geral de receitas e despesas.</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                 <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square max-h-[250px]"
                    >
                    <PieChart>
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel formatter={(value, name) => `${chartConfig[name as keyof typeof chartConfig].label}: ${formatCurrency(value as number)}`} />}
                        />
                        <Pie
                            data={chartData}
                            dataKey="value"
                            nameKey="type"
                            innerRadius={60}
                            strokeWidth={5}
                        />
                    </PieChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm">
                <div className="flex items-center gap-2 font-medium leading-none">
                   Saldo Final: <span className={summary.balance >= 0 ? 'text-green-600' : 'text-red-600'}>{formatCurrency(summary.balance)}</span>
                </div>
                <div className="leading-none text-muted-foreground">
                    Detalhes de receitas e despesas
                </div>
            </CardFooter>
        </Card>
    );
}
