
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
import { Pen, Trash2, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import { BankAccount } from '@/types';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';


interface BankListProps {
  accounts: BankAccount[];
  onEdit: (account: BankAccount) => void;
  onDelete: (id: string) => void;
  onDeposit: (account: BankAccount) => void;
  onWithdraw: (account: BankAccount) => void;
}

const formatCurrency = (value: number) => {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

export function BankList({ accounts, onEdit, onDelete, onDeposit, onWithdraw }: BankListProps) {
  return (
    <div className="bg-notebook">
      <TooltipProvider>
      <Table>
        <TableHeader>
          <TableRow className="bg-primary/5 border-b-primary/20">
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
                <TableCell className={account.balance >= 0 ? 'text-green-600' : 'text-red-600'}>
                    {formatCurrency(account.balance)}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" onClick={() => onDeposit(account)}>
                                <ArrowUpCircle className="h-4 w-4 text-green-600" />
                                <span className="sr-only">Depositar</span>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Depositar</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                           <Button variant="ghost" size="icon" onClick={() => onWithdraw(account)}>
                                <ArrowDownCircle className="h-4 w-4 text-red-600" />
                                <span className="sr-only">Retirar</span>
                            </Button>
                        </TooltipTrigger>
                         <TooltipContent>Retirar</TooltipContent>
                    </Tooltip>
                     <Tooltip>
                        <TooltipTrigger asChild>
                           <Button variant="ghost" size="icon" onClick={() => onEdit(account)}>
                              <Pen className="h-4 w-4" />
                              <span className="sr-only">Editar</span>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Editar</TooltipContent>
                     </Tooltip>
                     <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" onClick={() => onDelete(account.id)} className="text-red-600 hover:text-red-700">
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Excluir</span>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Excluir</TooltipContent>
                    </Tooltip>
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
      </TooltipProvider>
    </div>
  );
}
