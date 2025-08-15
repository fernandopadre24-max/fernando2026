
'use client';

import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { DatePickerWithRange } from '@/components/ui/date-picker';
import { Category } from '@/types';
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
  month: string;
  onMonthChange: (value: string) => void;
  year: string;
  onYearChange: (value: string) => void;
  onClearFilters: () => void;
  categories: Category[];
  availableYears: string[];
}

const months = [
    { value: '1', label: 'Janeiro' }, { value: '2', label: 'Fevereiro' },
    { value: '3', label: 'Março' }, { value: '4', label: 'Abril' },
    { value: '5', label: 'Maio' }, { value: '6', label: 'Junho' },
    { value: '7', label: 'Julho' }, { value: '8', label: 'Agosto' },
    { value: '9', label: 'Setembro' }, { value: '10', label: 'Outubro' },
    { value: '11', label: 'Novembro' }, { value: '12', label: 'Dezembro' }
];

export function TransactionFilters({
  description,
  onDescriptionChange,
  type,
  onTypeChange,
  category,
  onCategoryChange,
  dateRange,
  onDateRangeChange,
  month,
  onMonthChange,
  year,
  onYearChange,
  onClearFilters,
  categories,
  availableYears,
}: TransactionFiltersProps) {
  return (
    <div className="p-4 bg-card border rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 xl:grid-cols-7 gap-4">
            <Input
                placeholder="Filtrar por descrição..."
                value={description}
                onChange={(e) => onDescriptionChange(e.target.value)}
                className="lg:col-span-2 xl:col-span-2"
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

            <Select value={category} onValueChange={onCategoryChange} disabled={type === 'all'}>
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
            
            <Select value={month} onValueChange={onMonthChange}>
                <SelectTrigger><SelectValue placeholder="Filtrar por mês" /></SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Todos os Meses</SelectItem>
                    {months.map(m => <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>)}
                </SelectContent>
            </Select>
            
            <Select value={year} onValueChange={onYearChange}>
                <SelectTrigger><SelectValue placeholder="Filtrar por ano" /></SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Todos os Anos</SelectItem>
                    {availableYears.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}
                </SelectContent>
            </Select>

            <div className="relative lg:col-span-5 xl:col-span-1">
                <DatePickerWithRange
                    date={dateRange}
                    onDateChange={onDateRangeChange}
                    className={month !== 'all' ? 'opacity-50 pointer-events-none' : ''}
                />
                 {month !== 'all' && <div className="absolute inset-0 bg-transparent" title="Filtro de período desabilitado ao usar filtro de mês/ano"></div>}
            </div>

            <Button onClick={onClearFilters} variant="ghost" className="lg:col-span-2 xl:col-span-2">
                <X className="mr-2 h-4 w-4" />
                Limpar Filtros
            </Button>
        </div>
    </div>
  );
}
