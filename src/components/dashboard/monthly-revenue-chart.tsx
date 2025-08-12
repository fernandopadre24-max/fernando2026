
'use client';

import { useMemo, useState } from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Line, LineChart } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Transaction } from '@/types';
import { ptBR } from 'date-fns/locale';
import { format } from 'date-fns';

interface MonthlyRevenueChartProps {
    transactions: Transaction[];
}

const chartConfig = {
  receita: {
    label: "Receita",
    color: "hsl(var(--chart-2))",
  },
  despesa: {
    label: "Despesa",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

export function MonthlyRevenueChart({ transactions }: MonthlyRevenueChartProps) {
    const [chartType, setChartType] = useState('bar');
    
    const monthlyData = useMemo(() => {
        const data: { [key: string]: { receita: number, despesa: number } } = {};
        
        transactions.forEach(t => {
            const month = format(new Date(t.date), 'MMM', { locale: ptBR });
            if (!data[month]) {
                data[month] = { receita: 0, despesa: 0 };
            }
            if (t.type === 'Receita') {
                data[month].receita += t.value;
            } else {
                data[month].despesa += t.value;
            }
        });

        const monthOrder = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];

        return monthOrder.map(month => ({
            month,
            ...data[month] || { receita: 0, despesa: 0 },
        }));

    }, [transactions]);


    return (
        <Card>
            <CardHeader className="flex-row items-center justify-between">
                <div>
                    <CardTitle>Receita x Despesa</CardTitle>
                    <CardDescription>Resumo mensal de receitas e despesas</CardDescription>
                </div>
                 <Tabs value={chartType} onValueChange={setChartType} className="self-end">
                    <TabsList>
                        <TabsTrigger value="bar">Barra</TabsTrigger>
                        <TabsTrigger value="line">Linha</TabsTrigger>
                    </TabsList>
                </Tabs>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
                     <ResponsiveContainer width="100%" height={300}>
                       {chartType === 'bar' ? (
                          <BarChart data={monthlyData}>
                              <CartesianGrid vertical={false} />
                              <XAxis
                                  dataKey="month"
                                  tickLine={false}
                                  tickMargin={10}
                                  axisLine={false}
                                  tickFormatter={(value) => value.charAt(0).toUpperCase() + value.slice(1)}
                              />
                              <YAxis 
                                  tickFormatter={(value) => formatCurrency(value as number)}
                              />
                              <ChartTooltip 
                                  cursor={false} 
                                  content={<ChartTooltipContent 
                                      formatter={(value) => formatCurrency(value as number)}
                                  />} 
                              />
                              <Bar dataKey="receita" fill="var(--color-receita)" radius={4} />
                              <Bar dataKey="despesa" fill="var(--color-despesa)" radius={4} />
                          </BarChart>
                       ) : (
                          <LineChart data={monthlyData}>
                               <CartesianGrid vertical={false} />
                               <XAxis
                                  dataKey="month"
                                  tickLine={false}
                                  tickMargin={10}
                                  axisLine={false}
                                  tickFormatter={(value) => value.charAt(0).toUpperCase() + value.slice(1)}
                              />
                              <YAxis 
                                  tickFormatter={(value) => formatCurrency(value as number)}
                              />
                               <ChartTooltip 
                                  cursor={false} 
                                  content={<ChartTooltipContent 
                                      formatter={(value) => formatCurrency(value as number)}
                                  />} 
                              />
                              <Line type="monotone" dataKey="receita" stroke="var(--color-receita)" strokeWidth={2} />
                              <Line type="monotone" dataKey="despesa" stroke="var(--color-despesa)" strokeWidth={2} />
                          </LineChart>
                       )}
                    </ResponsiveContainer>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
