
'use client';

import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { DatePickerWithRange } from '@/components/ui/date-picker';
import { ExpenseCategory } from '@/types';
import { DateRange } from 'react-day-picker';
import { X } from 'lucide-react';

interface TransactionFiltersProps {
  description: string;
  onDescriptionChange: (value: string) => void;
  type: string;
  onTypeChange: (value: string) => void;
  category: string;
  onCategoryChange: (value: string) => void;
  dateRange: DateRange | undefined;
  onDateRangeChange: (date: DateRange | undefined) => void;
  onClearFilters: () => void;
  categories: ExpenseCategory[];
}

export function TransactionFilters({
  description,
  onDescriptionChange,
  type,
  onTypeChange,
  category,
  onCategoryChange,
  dateRange,
  onDateRangeChange,
  onClearFilters,
  categories,
}: TransactionFiltersProps) {
  return (
    <div className="p-4 bg-card border rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <Input
                placeholder="Filtrar por descrição..."
                value={description}
                onChange={(e) => onDescriptionChange(e.target.value)}
            />
            <Select value={type} onValueChange={onTypeChange}>
                <SelectTrigger>
                    <SelectValue placeholder="Filtrar por tipo" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Todos os Tipos</SelectItem>
                    <SelectItem value="Receita">Receita</SelectItem>
                    <SelectItem value="Despesa">Despesa</SelectItem>
                </SelectContent>
            </Select>

            <Select value={category} onValueChange={onCategoryChange} disabled={type !== 'Despesa'}>
                 <SelectTrigger>
                    <SelectValue placeholder="Filtrar por categoria" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Todas as Categorias</SelectItem>
                    {categories.map(cat => (
                        <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <DatePickerWithRange
                date={dateRange}
                onDateChange={onDateRangeChange}
            />

            <Button onClick={onClearFilters} variant="ghost" className="lg:col-span-1">
                <X className="mr-2 h-4 w-4" />
                Limpar Filtros
            </Button>
        </div>
    </div>
  );
}
