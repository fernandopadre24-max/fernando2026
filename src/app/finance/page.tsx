
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AppShell } from '@/components/app-shell';
import type { Event, Transaction, ExpenseCategory, BankAccount } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { DollarSign, TrendingDown, TrendingUp, PiggyBank, PlusCircle, MoreHorizontal, Trash2, Edit, CalendarDays, Tag, Package, ArrowRightLeft } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const transactionSchema = z.object({
  description: z.string().min(1, 'Descrição é obrigatória.'),
  value: z.coerce.number().min(0.01, 'Valor deve ser maior que zero.'),
  date: z.string().min(1, 'Data é obrigatória.'),
  type: z.enum(['Receita', 'Despesa']),
  categoryId: z.string().optional().nullable(),
}).refine(data => {
    if (data.type === 'Despesa') {
        return !!data.categoryId;
    }
    return true;
}, {
    message: 'Categoria é obrigatória para despesas.',
    path: ['categoryId'],
});


type TransactionFormValues = z.infer<typeof transactionSchema>;

export default function FinancePage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<ExpenseCategory[]>([]);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [isClient, setIsClient] = useState(false);
  
  const { toast } = useToast();

  const [isAddEditDialogOpen, setIsAddEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isTransferDialogOpen, setIsTransferDialogOpen] = useState(false);

  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [selectedBankAccountId, setSelectedBankAccountId] = useState<string>('');


  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      description: '',
      value: 0,
      date: '',
      type: 'Despesa',
      categoryId: null,
    },
  });

  const transactionType = form.watch('type');

  useEffect(() => {
    setIsClient(true);
    const storedEvents = localStorage.getItem('events');
    if (storedEvents) {
      setEvents(JSON.parse(storedEvents));
    }
    const storedTransactions = localStorage.getItem('transactions');
    if (storedTransactions) {
        setTransactions(JSON.parse(storedTransactions).map((t: Transaction) => ({...t, isTransferred: t.isTransferred || false})));
    }
     const storedCategories = localStorage.getItem('expenseCategories');
    if (storedCategories) {
      setCategories(JSON.parse(storedCategories));
    }
    const storedBankAccounts = localStorage.getItem('bankAccounts');
    if (storedBankAccounts) {
      setBankAccounts(JSON.parse(storedBankAccounts));
    }
  }, []);

  useEffect(() => {
    if (isClient) {
      localStorage.setItem('transactions', JSON.stringify(transactions));
      localStorage.setItem('bankAccounts', JSON.stringify(bankAccounts));
    }
  }, [transactions, bankAccounts, isClient]);

  const handleSaveTransaction = (data: TransactionFormValues) => {
    const transactionData = {
        ...data,
        categoryId: data.type === 'Receita' ? null : data.categoryId,
    };

    if (selectedTransaction) {
      // Edit
      setTransactions(
        transactions.map((t) =>
          t.id === selectedTransaction.id ? { ...t, ...transactionData } : t
        )
      );
      toast({ title: "Transação Atualizada", description: "A transação foi atualizada com sucesso."});
    } else {
      // Add
      const newTransaction: Transaction = {
        id: crypto.randomUUID(),
        ...transactionData,
        isTransferred: false,
      };
      setTransactions([...transactions, newTransaction]);
      toast({ title: "Transação Adicionada", description: "A nova transação foi adicionada."});
    }
    closeAddEditDialog();
  };

  const handleDeleteTransaction = () => {
    if (selectedTransaction) {
      setTransactions(transactions.filter((t) => t.id !== selectedTransaction.id));
      toast({ title: "Transação Excluída", variant: "destructive", description: "A transação foi excluída permanentemente."});
      closeDeleteDialog();
    }
  };

  const handleTransferClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setSelectedBankAccountId('');
    setIsTransferDialogOpen(true);
  };

  const handleConfirmTransfer = () => {
    if (!selectedTransaction || !selectedBankAccountId) return;

    const accountToUpdate = bankAccounts.find(acc => acc.id === selectedBankAccountId);
    if (!accountToUpdate) return;
    
    // Update bank account balance
    setBankAccounts(prevAccounts => 
      prevAccounts.map(account => 
        account.id === selectedBankAccountId 
          ? { ...account, balance: account.balance + selectedTransaction.value }
          : account
      )
    );

    // Update transaction status
    setTransactions(prevTransactions => 
      prevTransactions.map(transaction => 
        transaction.id === selectedTransaction.id 
          ? { ...transaction, isTransferred: true, transferredToBankAccountId: selectedBankAccountId, transferDate: new Date().toISOString() }
          : transaction
      )
    );
     toast({
      title: "Transferência Realizada",
      description: `Valor de ${formatCurrency(selectedTransaction.value)} transferido para a conta ${accountToUpdate.bankName} com sucesso.`
    })

    setIsTransferDialogOpen(false);
    setSelectedTransaction(null);
    setSelectedBankAccountId('');
  };
  
  const openAddDialog = () => {
    setSelectedTransaction(null);
    form.reset({ description: '', value: 0, date: '', type: 'Despesa', categoryId: null });
    setIsAddEditDialogOpen(true);
  };

  const openEditDialog = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    form.reset(transaction);
    setIsAddEditDialogOpen(true);
  };

  const closeAddEditDialog = () => {
    setIsAddEditDialogOpen(false);
    setSelectedTransaction(null);
  };

  const openDeleteDialog = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setSelectedTransaction(null);
  };

  
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  
  const formatDate = (dateString: string) => {
    return new Date(dateString + 'T00:00:00').toLocaleDateString('pt-BR');
  }

  const getCategoryName = (categoryId: string | null | undefined) => {
      if (!categoryId) return '-';
      return categories.find(c => c.id === categoryId)?.name || 'N/A';
  }
   const getBankAccountName = (bankAccountId: string | null | undefined) => {
      if (!bankAccountId) return '-';
      const account = bankAccounts.find(c => c.id === bankAccountId)
      return account ? `${account.bankName} - ${account.accountNumber}` : 'N/A';
  }

  const totalEventRevenue = events.reduce((sum, event) => sum + event.value, 0);
  const manualRevenue = transactions.filter(t => t.type === 'Receita').reduce((sum, t) => sum + t.value, 0);
  const totalRevenue = totalEventRevenue + manualRevenue;
  const totalExpenses = transactions.filter(t => t.type === 'Despesa').reduce((sum, t) => sum + t.value, 0);
  const netProfit = totalRevenue - totalExpenses;

  if (!isClient) {
    return null; // or a loading spinner
  }

  return (
    <AppShell>
      <main className="container mx-auto px-4 pb-16">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold font-headline">Controle Financeiro</h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-emerald-50 border-emerald-200 dark:bg-emerald-950 dark:border-emerald-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium font-body text-emerald-800 dark:text-emerald-200">Receita Total</CardTitle>
                    <TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold font-headline text-emerald-900 dark:text-emerald-100">{formatCurrency(totalRevenue)}</div>
                </CardContent>
            </Card>
             <Card className="bg-rose-50 border-rose-200 dark:bg-rose-950 dark:border-rose-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium font-body text-rose-800 dark:text-rose-200">Despesas Totais</CardTitle>
                    <TrendingDown className="h-5 w-5 text-rose-600 dark:text-rose-400" />
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold font-headline text-rose-900 dark:text-rose-100">{formatCurrency(totalExpenses)}</div>
                </CardContent>
            </Card>
             <Card className="bg-sky-50 border-sky-200 dark:bg-sky-950 dark:border-sky-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium font-body text-sky-800 dark:text-sky-200">Lucro Líquido</CardTitle>
                    <PiggyBank className="h-5 w-5 text-sky-600 dark:text-sky-400" />
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold font-headline text-sky-900 dark:text-sky-100">{formatCurrency(netProfit)}</div>
                </CardContent>
            </Card>
        </div>

        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Lançamentos Financeiros</CardTitle>
                <div className='flex gap-2'>
                    <Button variant="outline" asChild>
                        <Link href="/finance/categories">Gerenciar Categorias</Link>
                    </Button>
                    <Button onClick={openAddDialog}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Adicionar Lançamento
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
              <TooltipProvider>
                <div className="border rounded-md">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Descrição</TableHead>
                                <TableHead>Tipo</TableHead>
                                <TableHead>Categoria</TableHead>
                                <TableHead>Data</TableHead>
                                <TableHead className="text-right">Valor</TableHead>
                                <TableHead className="w-[100px] text-right">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                        {transactions.length > 0 ? (
                            transactions.map((transaction) => (
                            <TableRow key={transaction.id}>
                                <TableCell className="font-medium">{transaction.description}</TableCell>
                                <TableCell>
                                  <Badge variant={transaction.type === 'Receita' ? 'default' : 'destructive'} className={transaction.type === 'Receita' ? 'bg-emerald-500' : 'bg-rose-500'}>
                                      {transaction.type}
                                  </Badge>
                                </TableCell>
                                <TableCell>{getCategoryName(transaction.categoryId)}</TableCell>
                                <TableCell>{formatDate(transaction.date)}</TableCell>
                                <TableCell className={`text-right font-medium ${transaction.type === 'Receita' ? 'text-emerald-600' : 'text-rose-600'}`}>
                                    {transaction.type === 'Despesa' ? '-' : '+'} {formatCurrency(transaction.value)}
                                </TableCell>
                                <TableCell className="text-right">
                                <div className="flex items-center justify-end gap-0.5">
                                 {transaction.type === 'Receita' && !transaction.isTransferred && (
                                    <Button variant="ghost" size="icon" title="Transferir valor" onClick={() => handleTransferClick(transaction)}>
                                        <ArrowRightLeft className="h-4 w-4" />
                                        <span className="sr-only">Transferir</span>
                                    </Button>
                                )}
                                 {transaction.isTransferred && (
                                    <Tooltip>
                                      <TooltipTrigger>
                                        <Badge variant="outline">Transferido</Badge>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>Transferido para: {getBankAccountName(transaction.transferredToBankAccountId)}</p>
                                      </TooltipContent>
                                    </Tooltip>
                                )}
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                        <span className="sr-only">Abrir menu</span>
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => openEditDialog(transaction)}>
                                        <Edit className="mr-2 h-4 w-4" />
                                        Editar
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        className="text-destructive"
                                        onClick={() => openDeleteDialog(transaction)}
                                    >
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Excluir
                                    </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                                </div>
                                </TableCell>
                            </TableRow>
                            ))
                        ) : (
                            <TableRow>
                            <TableCell colSpan={6} className="h-24 text-center">
                                Nenhum lançamento encontrado.
                            </TableCell>
                            </TableRow>
                        )}
                        </TableBody>
                    </Table>
                </div>
              </TooltipProvider>
            </CardContent>
        </Card>

      </main>

      {/* Add/Edit Transaction Dialog */}
      <Dialog open={isAddEditDialogOpen} onOpenChange={setIsAddEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {selectedTransaction ? 'Editar Lançamento' : 'Adicionar Lançamento'}
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSaveTransaction)} className="space-y-4 py-4">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Aluguel do som" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo</FormLabel>
                     <div className="relative">
                        <Package className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <FormControl>
                          <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                            <SelectTrigger className="pl-10">
                              <SelectValue placeholder="Selecione o tipo" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Despesa">Despesa</SelectItem>
                                <SelectItem value="Receita">Receita</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {transactionType === 'Despesa' && (
                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Categoria</FormLabel>
                       <div className="relative">
                          <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <FormControl>
                            <Select onValueChange={field.onChange} defaultValue={field.value || ''} value={field.value || ''}>
                              <SelectTrigger className="pl-10">
                                <SelectValue placeholder="Selecione uma categoria" />
                              </SelectTrigger>
                              <SelectContent>
                                {categories.length > 0 ? (
                                  categories.map((category) => (
                                  <SelectItem key={category.id} value={category.id}>
                                    {category.name}
                                  </SelectItem>
                                ))
                                ) : (
                                  <div className="text-center text-sm text-muted-foreground p-4">Nenhuma categoria cadastrada.</div>
                                )}
                              </SelectContent>
                            </Select>
                          </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

               <div className="grid grid-cols-2 gap-4">
                 <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Data</FormLabel>
                         <div className="relative">
                            <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <FormControl>
                                <Input type="date" className="pl-10" {...field} />
                            </FormControl>
                        </div>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="value"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Valor</FormLabel>
                        <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <FormControl>
                                <Input type="number" placeholder="Ex: 500.00" className="pl-10" {...field} />
                            </FormControl>
                        </div>
                        <FormMessage />
                    </FormItem>
                    )}
                />
               </div>
              <DialogFooter className="pt-4">
                <DialogClose asChild>
                  <Button type="button" variant="secondary">
                    Cancelar
                  </Button>
                </DialogClose>
                <Button type="submit">
                  Salvar
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
       <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Essa ação não pode ser desfeita. Isso excluirá permanentemente o
              lançamento &quot;{selectedTransaction?.description}&quot;.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={closeDeleteDialog}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteTransaction}>Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

       {/* Transfer Dialog */}
      <Dialog open={isTransferDialogOpen} onOpenChange={setIsTransferDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Transferir para Conta Bancária</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground mb-2">
              Selecione a conta para transferir o valor de <strong className='text-foreground'>{formatCurrency(selectedTransaction?.value || 0)}</strong>.
            </p>
            <Select onValueChange={setSelectedBankAccountId} value={selectedBankAccountId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma conta bancária" />
              </SelectTrigger>
              <SelectContent>
                {bankAccounts.length > 0 ? bankAccounts.map((account) => (
                  <SelectItem key={account.id} value={account.id}>
                    {account.bankName} - {account.accountNumber} (Saldo: {formatCurrency(account.balance)})
                  </SelectItem>
                )) : <p className='p-4 text-sm text-muted-foreground'>Nenhuma conta cadastrada.</p>}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">Cancelar</Button>
            </DialogClose>
            <Button type="button" onClick={handleConfirmTransfer} disabled={!selectedBankAccountId}>
              Confirmar Transferência
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </AppShell>
  );
}

    