
'use client';

import { useState, useEffect } from 'react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { PlusCircle, MoreHorizontal, Trash2, Edit } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { BankAccount, Event, Transaction } from '@/types';
import { TransferHistoryReport } from '@/components/reports/transfer-history-report';
import { useAuth } from '@/hooks/use-auth';

export default function BanksPage() {
  const { user, getUserData, saveUserData, isLoading } = useAuth();
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const [isAddEditDialogOpen, setIsAddEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<BankAccount | null>(null);
  
  const [bankName, setBankName] = useState('');
  const [agency, setAgency] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    if (!isLoading && user) {
      setAccounts(getUserData('bankAccounts') || []);
      setEvents(getUserData('events') || []);
      setTransactions(getUserData('transactions') || []);
    }
  }, [user, isLoading, getUserData]);

  useEffect(() => {
    if (user) {
      saveUserData('bankAccounts', accounts);
    }
  }, [accounts, user, saveUserData]);
  
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);


  const handleSave = () => {
    const newAccountData = {
      bankName,
      agency,
      accountNumber,
      balance: selectedAccount ? selectedAccount.balance : balance, // Keep original balance on edit
    };

    if (selectedAccount) {
      // Edit
      setAccounts(
        accounts.map((acc) =>
          acc.id === selectedAccount.id ? { ...acc, ...newAccountData } : acc
        )
      );
    } else {
      // Add
      const newAccount: BankAccount = {
        id: crypto.randomUUID(),
        ...newAccountData,
        balance: balance,
      };
      setAccounts([...accounts, newAccount]);
    }
    closeAddEditDialog();
  };

  const handleDelete = () => {
    if (selectedAccount) {
      setAccounts(accounts.filter((a) => a.id !== selectedAccount.id));
      closeDeleteDialog();
    }
  };
  
  const openAddDialog = () => {
    setSelectedAccount(null);
    setBankName('');
    setAgency('');
    setAccountNumber('');
    setBalance(0);
    setIsAddEditDialogOpen(true);
  };

  const openEditDialog = (account: BankAccount) => {
    setSelectedAccount(account);
    setBankName(account.bankName);
    setAgency(account.agency);
    setAccountNumber(account.accountNumber);
    setBalance(account.balance);
    setIsAddEditDialogOpen(true);
  };

  const closeAddEditDialog = () => {
    setIsAddEditDialogOpen(false);
    setSelectedAccount(null);
  };

  const openDeleteDialog = (account: BankAccount) => {
    setSelectedAccount(account);
    setIsDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setSelectedAccount(null);
  };

  if (isLoading || !user) {
    return null;
  }

  return (
    <AppShell>
      <main className="container mx-auto px-4 pb-16 flex flex-col gap-8">
        <div>
            <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold font-headline">Gerenciar Contas Bancárias</h1>
            <Button onClick={openAddDialog}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Adicionar Conta
            </Button>
            </div>
            <Card>
            <CardHeader>
                <CardTitle>Lista de Contas</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="border rounded-md">
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead>Banco</TableHead>
                        <TableHead>Agência</TableHead>
                        <TableHead>Conta</TableHead>
                        <TableHead>Saldo</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
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
                            <TableCell>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                    <span className="sr-only">Abrir menu</span>
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => openEditDialog(account)}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Editar
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    className="text-destructive"
                                    onClick={() => openDeleteDialog(account)}
                                >
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
                </div>
            </CardContent>
            </Card>
        </div>

        <TransferHistoryReport events={events} transactions={transactions} bankAccounts={accounts} />
      </main>

      {/* Add/Edit Dialog */}
      <Dialog open={isAddEditDialogOpen} onOpenChange={setIsAddEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {selectedAccount ? 'Editar Conta' : 'Adicionar Conta'}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="bankName" className="text-right">
                Banco
              </Label>
              <Input
                id="bankName"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="agency" className="text-right">
                Agência
              </Label>
              <Input
                id="agency"
                value={agency}
                onChange={(e) => setAgency(e.target.value)}
                className="col-span-3"
              />
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="accountNumber" className="text-right">
                Conta
              </Label>
              <Input
                id="accountNumber"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                className="col-span-3"
              />
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="balance" className="text-right">
                Saldo Inicial
              </Label>
              <Input
                id="balance"
                type="number"
                value={balance}
                onChange={(e) => setBalance(parseFloat(e.target.value) || 0)}
                className="col-span-3"
                disabled={!!selectedAccount}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Cancelar
              </Button>
            </DialogClose>
            <Button type="button" onClick={handleSave}>
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
       <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Essa ação não pode ser desfeita. Isso excluirá permanentemente a
              conta &quot;{selectedAccount?.bankName} - {selectedAccount?.accountNumber}&quot;.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={closeDeleteDialog}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </AppShell>
  );
}
