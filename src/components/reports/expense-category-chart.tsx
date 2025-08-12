
'use client';

import { useMemo, useRef } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Transaction, ExpenseCategory } from '@/types';
import { Tag, FileDown, Printer } from 'lucide-react';
import { Button } from '../ui/button';
import { exportChartToPdf, printChart } from '@/lib/pdf-generator';

interface ExpenseCategoryChartProps {
  transactions: Transaction[];
  categories: ExpenseCategory[];
}

const COLORS = [
  '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', 
  '#FF4560', '#775DD0', '#546E7A', '#26a69a', '#D10CE8'
];

export function ExpenseCategoryChart({ transactions, categories }: ExpenseCategoryChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  
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

  const handleExport = () => {
    if (chartRef.current) {
      exportChartToPdf('Despesas por Categoria', chartRef.current);
    }
  }

  const handlePrint = () => {
    if(chartRef.current) {
      printChart('Despesas por Categoria', chartRef.current);
    }
  }


  return (
    <Card>
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle className="font-headline text-xl flex items-center gap-2">
            <Tag className="h-5 w-5" />
            Despesas por Categoria
        </CardTitle>
        <div className='flex gap-2'>
             <Button variant="outline" size="sm" onClick={handlePrint} disabled={data.length === 0}>
                <Printer className="h-4 w-4 mr-2" />
                Imprimir
            </Button>
            <Button variant="outline" size="sm" onClick={handleExport} disabled={data.length === 0}>
                <FileDown className="h-4 w-4 mr-2" />
                Exportar para PDF
            </Button>
        </div>
      </CardHeader>
      <CardContent>
        {data.length > 0 ? (
        <div ref={chartRef}>
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
        </div>
         ) : (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                Nenhuma despesa para exibir.
            </div>
        )}
      </CardContent>
    </Card>
  );
}
