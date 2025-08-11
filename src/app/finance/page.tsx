
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AppShell } from '@/components/app-shell';
import type { Event, Expense, ExpenseCategory } from '@/types';
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
import { DollarSign, TrendingDown, TrendingUp, PiggyBank, PlusCircle, MoreHorizontal, Trash2, Edit, CalendarDays, Tag } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Link from 'next/link';

const expenseSchema = z.object({
  description: z.string().min(1, 'Descrição é obrigatória.'),
  value: z.coerce.number().min(0.01, 'Valor deve ser maior que zero.'),
  date: z.string().min(1, 'Data é obrigatória.'),
  categoryId: z.string().min(1, 'Categoria é obrigatória.'),
});

type ExpenseFormValues = z.infer<typeof expenseSchema>;

export default function FinancePage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<ExpenseCategory[]>([]);
  const [isClient, setIsClient] = useState(false);
  
  const { toast } = useToast();

  const [isAddEditDialogOpen, setIsAddEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);

  const form = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      description: '',
      value: 0,
      date: '',
      categoryId: '',
    },
  });

  useEffect(() => {
    setIsClient(true);
    const storedEvents = localStorage.getItem('events');
    if (storedEvents) {
      setEvents(JSON.parse(storedEvents));
    }
    const storedExpenses = localStorage.getItem('expenses');
    if (storedExpenses) {
        setExpenses(JSON.parse(storedExpenses));
    }
     const storedCategories = localStorage.getItem('expenseCategories');
    if (storedCategories) {
      setCategories(JSON.parse(storedCategories));
    }
  }, []);

  useEffect(() => {
    if (isClient) {
      localStorage.setItem('expenses', JSON.stringify(expenses));
    }
  }, [expenses, isClient]);

  const handleSaveExpense = (data: ExpenseFormValues) => {
    if (selectedExpense) {
      // Edit
      setExpenses(
        expenses.map((exp) =>
          exp.id === selectedExpense.id ? { ...exp, ...data } : exp
        )
      );
      toast({ title: "Despesa Atualizada", description: "A despesa foi atualizada com sucesso."});
    } else {
      // Add
      const newExpense: Expense = {
        id: crypto.randomUUID(),
        ...data,
      };
      setExpenses([...expenses, newExpense]);
      toast({ title: "Despesa Adicionada", description: "A nova despesa foi adicionada."});
    }
    closeAddEditDialog();
  };

  const handleDeleteExpense = () => {
    if (selectedExpense) {
      setExpenses(expenses.filter((exp) => exp.id !== selectedExpense.id));
      toast({ title: "Despesa Excluída", variant: "destructive", description: "A despesa foi excluída permanentemente."});
      closeDeleteDialog();
    }
  };
  
  const openAddDialog = () => {
    setSelectedExpense(null);
    form.reset({ description: '', value: 0, date: '', categoryId: '' });
    setIsAddEditDialogOpen(true);
  };

  const openEditDialog = (expense: Expense) => {
    setSelectedExpense(expense);
    form.reset(expense);
    setIsAddEditDialogOpen(true);
  };

  const closeAddEditDialog = () => {
    setIsAddEditDialogOpen(false);
    setSelectedExpense(null);
  };

  const openDeleteDialog = (expense: Expense) => {
    setSelectedExpense(expense);
    setIsDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setSelectedExpense(null);
  };

  
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  
  const formatDate = (dateString: string) => {
    return new Date(dateString + 'T00:00:00').toLocaleDateString('pt-BR');
  }

  const getCategoryName = (categoryId: string) => {
      return categories.find(c => c.id === categoryId)?.name || 'N/A';
  }

  const totalRevenue = events.reduce((sum, event) => sum + event.value, 0);
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.value, 0);
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
                    <CardTitle className="text-sm font-medium font-body text-emerald-800 dark:text-emerald-200">Receita Total (Eventos)</CardTitle>
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
                <CardTitle>Gerenciamento de Despesas</CardTitle>
                <div className='flex gap-2'>
                    <Button variant="outline" asChild>
                        <Link href="/finance/categories">Gerenciar Categorias</Link>
                    </Button>
                    <Button onClick={openAddDialog}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Adicionar Despesa
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="border rounded-md">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Descrição</TableHead>
                                <TableHead>Categoria</TableHead>
                                <TableHead>Data</TableHead>
                                <TableHead className="text-right">Valor</TableHead>
                                <TableHead className="w-[50px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                        {expenses.length > 0 ? (
                            expenses.map((expense) => (
                            <TableRow key={expense.id}>
                                <TableCell className="font-medium">{expense.description}</TableCell>
                                <TableCell>{getCategoryName(expense.categoryId)}</TableCell>
                                <TableCell>{formatDate(expense.date)}</TableCell>
                                <TableCell className="text-right">{formatCurrency(expense.value)}</TableCell>
                                <TableCell>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                        <span className="sr-only">Abrir menu</span>
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => openEditDialog(expense)}>
                                        <Edit className="mr-2 h-4 w-4" />
                                        Editar
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        className="text-destructive"
                                        onClick={() => openDeleteDialog(expense)}
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
                                Nenhuma despesa encontrada.
                            </TableCell>
                            </TableRow>
                        )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>

      </main>

      {/* Add/Edit Expense Dialog */}
      <Dialog open={isAddEditDialogOpen} onOpenChange={setIsAddEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {selectedExpense ? 'Editar Despesa' : 'Adicionar Despesa'}
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSaveExpense)} className="space-y-4 py-4">
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
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoria</FormLabel>
                     <div className="relative">
                        <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <FormControl>
                          <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
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
              Essa ação não pode ser desfeita. Isso excluirá permanentemente a
              despesa &quot;{selectedExpense?.description}&quot;.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={closeDeleteDialog}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteExpense}>Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </AppShell>
  );
}
