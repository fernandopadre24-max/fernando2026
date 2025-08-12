
'use client';

import { useMemo, useState } from 'react';
import { Pie, PieChart, ResponsiveContainer, Bar, BarChart, XAxis, YAxis, CartesianGrid } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Transaction, ExpenseCategory } from '@/types';

interface ExpensesByCategoryChartProps {
    transactions: Transaction[];
    categories: ExpenseCategory[];
}

const chartColors = [
    'hsl(var(--chart-1))',
    'hsl(var(--chart-2))',
    'hsl(var(--chart-3))',
    'hsl(var(--chart-4))',
    'hsl(var(--chart-5))',
    'hsl(var(--chart-1) / 0.7)',
    'hsl(var(--chart-2) / 0.7)',
    'hsl(var(--chart-3) / 0.7)',
    'hsl(var(--chart-4) / 0.7)',
    'hsl(var(--chart-5) / 0.7)',
];


const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};


export function ExpensesByCategoryChart({ transactions, categories }: ExpensesByCategoryChartProps) {
    const [chartType, setChartType] = useState('pie');
    
    const expensesByCategory = useMemo(() => {
        const categoryMap: { [key: string]: { name: string, value: number, fill: string } } = {};
        
        transactions.filter(t => t.type === 'Despesa' && t.categoryId).forEach(t => {
            if (!categoryMap[t.categoryId!]) {
                const category = categories.find(c => c.id === t.categoryId);
                categoryMap[t.categoryId!] = {
                    name: category?.name || 'Sem Categoria',
                    value: 0,
                    fill: `var(--color-${t.categoryId})`
                };
            }
            categoryMap[t.categoryId!].value += t.value;
        });

        return Object.values(categoryMap);
    }, [transactions, categories]);

    const chartConfig = useMemo(() => {
        const config: ChartConfig = {};
        expensesByCategory.forEach((item, index) => {
            config[item.name] = {
                label: item.name,
                color: chartColors[index % chartColors.length],
            };
        });
        return config;
    }, [expensesByCategory]);
    
    const chartData = useMemo(() => expensesByCategory.map(item => ({
        name: item.name,
        value: item.value,
        fill: chartConfig[item.name]?.color
    })), [expensesByCategory, chartConfig]);


    return (
        <Card>
            <CardHeader className="flex-row items-center justify-between">
                <div>
                    <CardTitle>Despesas por Categoria</CardTitle>
                    <CardDescription>Distribuição de despesas no período</CardDescription>
                </div>
                 <Tabs value={chartType} onValueChange={setChartType} className="self-end">
                    <TabsList>
                        <TabsTrigger value="pie">Pizza</TabsTrigger>
                        <TabsTrigger value="bar">Barra</TabsTrigger>
                    </TabsList>
                </Tabs>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                 <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square max-h-[300px]"
                    >
                     {expensesByCategory.length > 0 ? (
                        <>
                           {chartType === 'pie' && (
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <ChartTooltip
                                        cursor={false}
                                        content={<ChartTooltipContent hideLabel formatter={(value) => formatCurrency(value as number)} />}
                                    />
                                    <Pie
                                        data={chartData}
                                        dataKey="value"
                                        nameKey="name"
                                        innerRadius={60}
                                        strokeWidth={5}
                                    >
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                           )}
                            {chartType === 'bar' && (
                               <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={chartData} layout="vertical" margin={{ left: 20 }}>
                                  <CartesianGrid horizontal={false} />
                                  <XAxis type="number" dataKey="value" tickFormatter={(value) => formatCurrency(value as number)} />
                                  <YAxis type="category" dataKey="name" tickLine={false} axisLine={false} width={80} />
                                  <ChartTooltip
                                    cursor={false}
                                    content={<ChartTooltipContent hideLabel formatter={(value) => formatCurrency(value as number)} />}
                                  />
                                  <Bar dataKey="value" radius={4}>
                                  </Bar>
                                </BarChart>
                              </ResponsiveContainer>
                           )}
                        </>
                     ) : (
                        <div className="flex items-center justify-center h-full text-muted-foreground">
                            Nenhuma despesa registrada no período.
                        </div>
                     )}
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm">
                 <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
                    {Object.entries(chartConfig).map(([key, value]) => (
                        <div key={key} className="flex items-center gap-2">
                             <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: value.color }} />
                             <span className="text-xs text-muted-foreground">{value.label}</span>
                        </div>
                    ))}
                </div>
            </CardFooter>
        </Card>
    );
}
