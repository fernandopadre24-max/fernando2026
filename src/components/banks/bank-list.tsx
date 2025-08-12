
'use client';

import * as React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Pen, Trash2, ArrowUpCircle, ArrowDownCircle, ChevronDown, Banknote } from 'lucide-react';
import { BankAccount, Transaction, Artist, Contractor } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';



interface BankListProps {
  accounts: BankAccount[];
  transactions: Transaction[];
  artists: Artist[];
  contractors: Contractor[];
  onEditAccount: (account: BankAccount) => void;
  onDeleteAccount: (id: string) => void;
  onDeposit: (account: BankAccount) => void;
  onWithdraw: (account: BankAccount) => void;
  onEditTransaction: (transaction: Transaction) => void;
  onDeleteTransaction: (id: string) => void;
}

const formatCurrency = (value: number) => {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
};

export function BankList({ 
    accounts, 
    transactions, 
    artists, 
    contractors, 
    onEditAccount, 
    onDeleteAccount, 
    onDeposit, 
    onWithdraw,
    onEditTransaction,
    onDeleteTransaction
}: BankListProps) {
    const [openAccountId, setOpenAccountId] = React.useState<string | null>(null);

    const getAssociatedName = (transaction: Transaction) => {
        if (transaction.type === 'Despesa') {
            return transaction.paidTo || '-';
        }
        if (transaction.type === 'Receita' && transaction.contractorId) {
            return contractors.find(c => c.id === transaction.contractorId)?.name || '-';
        }
        return '-';
    }


  return (
    <div className="bg-notebook">
      <TooltipProvider>
      <Table>
        <TableHeader>
          <TableRow className="bg-primary/5 border-b-primary/20">
            <TableHead className="w-[50px]"></TableHead>
            <TableHead className="w-[80px]">Imagem</TableHead>
            <TableHead>Banco</TableHead>
            <TableHead>Agência</TableHead>
            <TableHead>Conta</TableHead>
            <TableHead>Saldo</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {accounts.length > 0 ? (
            accounts.map((account) => {
                const accountTransactions = transactions
                    .filter(t => t.bankAccountId === account.id)
                    .sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());

                return (
                    <Collapsible asChild key={account.id} open={openAccountId === account.id} onOpenChange={() => setOpenAccountId(prevId => prevId === account.id ? null : account.id)}>
                        <>
                            <TableRow>
                                <TableCell>
                                    <CollapsibleTrigger asChild>
                                        <Button variant="ghost" size="icon">
                                            <ChevronDown className="h-4 w-4 transition-transform data-[state=open]:rotate-180" />
                                            <span className="sr-only">Ver transações</span>
                                        </Button>
                                    </CollapsibleTrigger>
                                </TableCell>
                                 <TableCell>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                        <Avatar className="cursor-pointer">
                                            <AvatarImage src={account.imageUrl} />
                                            <AvatarFallback><Banknote className="h-4 w-4 text-muted-foreground" /></AvatarFallback>
                                        </Avatar>
                                        </PopoverTrigger>
                                        {account.imageUrl && (
                                            <PopoverContent className="w-auto p-0">
                                                <img src={account.imageUrl} alt={account.bankName} className="rounded-md" />
                                            </PopoverContent>
                                        )}
                                    </Popover>
                                </TableCell>
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
                                           <Button variant="ghost" size="icon" onClick={() => onEditAccount(account)}>
                                              <Pen className="h-4 w-4" />
                                              <span className="sr-only">Editar</span>
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>Editar Conta</TooltipContent>
                                     </Tooltip>
                                     <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button variant="ghost" size="icon" onClick={() => onDeleteAccount(account.id)} className="text-red-600 hover:text-red-700">
                                              <Trash2 className="h-4 w-4" />
                                              <span className="sr-only">Excluir</span>
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>Excluir Conta</TooltipContent>
                                    </Tooltip>
                                  </div>
                                </TableCell>
                            </TableRow>
                            <CollapsibleContent asChild>
                                <TableRow className="bg-muted/50">
                                    <TableCell colSpan={7} className="p-0">
                                       <div className="p-4">
                                         <h4 className="font-bold mb-2">Histórico de Movimentações</h4>
                                         {accountTransactions.length > 0 ? (
                                             <Table>
                                                 <TableHeader>
                                                     <TableRow>
                                                         <TableHead>Data</TableHead>
                                                         <TableHead>Descrição</TableHead>
                                                         <TableHead>Forma Pgto.</TableHead>
                                                         <TableHead>Associado a</TableHead>
                                                         <TableHead className="text-right">Valor</TableHead>
                                                         <TableHead className="text-right">Ações</TableHead>
                                                     </TableRow>
                                                 </TableHeader>
                                                 <TableBody>
                                                     {accountTransactions.map(t => (
                                                         <TableRow key={t.id}>
                                                             <TableCell>{formatDate(t.date)}</TableCell>
                                                             <TableCell>{t.description}</TableCell>
                                                             <TableCell>
                                                                {t.paymentMethod ? (
                                                                    <div>
                                                                        <span className="font-medium">{t.paymentMethod}</span>
                                                                        {t.paymentMethod === 'PIX' && t.pixKey && (
                                                                            <span className="block text-xs text-muted-foreground">{t.pixKey}</span>
                                                                        )}
                                                                    </div>
                                                                ) : '-'}
                                                            </TableCell>
                                                             <TableCell>{getAssociatedName(t)}</TableCell>
                                                             <TableCell className={`text-right ${t.type === 'Receita' ? 'text-green-600' : 'text-red-600'}`}>
                                                                {t.type === 'Receita' ? '+' : '-'} {formatCurrency(t.value)}
                                                            </TableCell>
                                                             <TableCell className="text-right">
                                                                <div className="flex items-center justify-end gap-2">
                                                                    <Tooltip>
                                                                        <TooltipTrigger asChild>
                                                                            <Button variant="ghost" size="icon" onClick={() => onEditTransaction(t)}>
                                                                                <Pen className="h-4 w-4" />
                                                                                <span className="sr-only">Editar</span>
                                                                            </Button>
                                                                        </TooltipTrigger>
                                                                        <TooltipContent>Editar Transação</TooltipContent>
                                                                    </Tooltip>
                                                                    <Tooltip>
                                                                        <TooltipTrigger asChild>
                                                                            <Button variant="ghost" size="icon" onClick={() => onDeleteTransaction(t.id)} className="text-red-600 hover:text-red-700">
                                                                                <Trash2 className="h-4 w-4" />
                                                                                <span className="sr-only">Excluir</span>
                                                                            </Button>
                                                                        </TooltipTrigger>
                                                                        <TooltipContent>Excluir Transação</TooltipContent>
                                                                    </Tooltip>
                                                                </div>
                                                             </TableCell>
                                                         </TableRow>
                                                     ))}
                                                 </TableBody>
                                             </Table>
                                         ) : (
                                             <p className="text-sm text-muted-foreground">Nenhuma movimentação nesta conta.</p>
                                         )}
                                       </div>
                                    </TableCell>
                                </TableRow>
                            </CollapsibleContent>
                        </>
                    </Collapsible>
                )
            })
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
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
