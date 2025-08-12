
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
import { Pen, Trash2 } from 'lucide-react';
import { BankAccount } from '@/types';

interface BankListProps {
  accounts: BankAccount[];
  onEdit: (account: BankAccount) => void;
  onDelete: (id: string) => void;
}

const formatCurrency = (value: number) => {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

export function BankList({ accounts, onEdit, onDelete }: BankListProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Banco</TableHead>
          <TableHead>Agência</TableHead>
          <TableHead>Conta</TableHead>
          <TableHead>Saldo</TableHead>
          <TableHead className="text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {accounts.length > 0 ? (
          accounts.map((account) => (
            <TableRow key={account.id}>
              <TableCell className="font-medium">{account.bankName}</TableCell>
              <TableCell>{account.agency}</TableCell>
              <TableCell>{account.accountNumber}</TableCell>
              <TableCell>{formatCurrency(account.balance)}</TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button variant="ghost" size="icon" onClick={() => onEdit(account)}>
                    <Pen className="h-4 w-4" />
                    <span className="sr-only">Editar</span>
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => onDelete(account.id)} className="text-red-600 hover:text-red-700">
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Excluir</span>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={5} className="h-24 text-center">
              Nenhuma conta encontrada.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
