
'use client';

import { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Transaction, ExpenseCategory } from '@/types';
import { Tag } from 'lucide-react';

interface ExpenseCategoryChartProps {
  transactions: Transaction[];
  categories: ExpenseCategory[];
}

const COLORS = [
  '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', 
  '#FF4560', '#775DD0', '#546E7A', '#26a69a', '#D10CE8'
];

export function ExpenseCategoryChart({ transactions, categories }: ExpenseCategoryChartProps) {
  const data = useMemo(() => {
    const expenses = transactions.filter((t) => t.type === 'Despesa');
    const categoryTotals: { [key: string]: number } = {};

    expenses.forEach((expense) => {
      if (expense.categoryId) {
        if (!categoryTotals[expense.categoryId]) {
          categoryTotals[expense.categoryId] = 0;
        }
        categoryTotals[expense.categoryId] += expense.value;
      }
    });

    return Object.entries(categoryTotals).map(([categoryId, total]) => ({
      name: categories.find((c) => c.id === categoryId)?.name || 'Sem Categoria',
      value: total,
    }));
  }, [transactions, categories]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div className="p-2 bg-background/80 border rounded-lg shadow-lg">
            <p className="font-bold">{`${data.name}`}</p>
            <p className="text-sm">{`Valor: ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(data.value)}`}</p>
            </div>
        );
    }
    return null;
  };


  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-xl flex items-center gap-2">
            <Tag className="h-5 w-5" />
            Despesas por Categoria
        </CardTitle>
      </CardHeader>
      <CardContent>
        {data.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
                wrapperStyle={{
                    fontSize: '12px',
                    wordWrap: 'break-word',
                }}
            />
          </PieChart>
        </ResponsiveContainer>
         ) : (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                Nenhuma despesa para exibir.
            </div>
        )}
      </CardContent>
    </Card>
  );
}
