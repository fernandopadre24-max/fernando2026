
'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Pen, Trash2 } from 'lucide-react';
import { Transaction, ExpenseCategory } from '@/types';

interface TransactionListProps {
  transactions: Transaction[];
  categories: ExpenseCategory[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
};

const formatCurrency = (value: number) => {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

export function TransactionList({ transactions, categories, onEdit, onDelete }: TransactionListProps) {
  const getCategoryName = (categoryId?: string | null) => {
    return categories.find((c) => c.id === categoryId)?.name || 'N/A';
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Descrição</TableHead>
          <TableHead>Valor</TableHead>
          <TableHead>Data</TableHead>
          <TableHead>Tipo</TableHead>
          <TableHead>Categoria</TableHead>
          <TableHead className="text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.length > 0 ? (
          transactions
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell className="font-medium">{transaction.description}</TableCell>
              <TableCell
                className={transaction.type === 'Receita' ? 'text-green-600' : 'text-red-600'}
              >
                {formatCurrency(transaction.value)}
              </TableCell>
              <TableCell>{formatDate(transaction.date)}</TableCell>
              <TableCell>
                <Badge variant={transaction.type === 'Receita' ? 'default' : 'destructive'} 
                   className={transaction.type === 'Receita' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                  {transaction.type}
                </Badge>
              </TableCell>
              <TableCell>
                {transaction.type === 'Despesa' ? getCategoryName(transaction.categoryId) : '-'}
              </TableCell>
              <TableCell className="text-right">
                 <div className="flex items-center justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => onEdit(transaction)}>
                      <Pen className="h-4 w-4" />
                       <span className="sr-only">Editar</span>
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => onDelete(transaction.id)} className="text-red-600 hover:text-red-700">
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Excluir</span>
                    </Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={6} className="h-24 text-center">
              Nenhuma transação encontrada.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
