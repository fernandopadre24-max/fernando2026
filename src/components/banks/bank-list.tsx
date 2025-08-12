
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Pen, Trash2 } from 'lucide-react';
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
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Abrir menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(account)}>
                      <Pen className="mr-2 h-4 w-4" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDelete(account.id)} className="text-red-600">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Excluir
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
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
