
'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Transaction, ExpenseCategory, PaymentMethod, Artist, Contractor } from '@/types';

const transactionSchema = z.object({
  description: z.string().min(1, 'A descrição é obrigatória.'),
  value: z.coerce.number().positive('O valor deve ser positivo.'),
  date: z.string().min(1, 'A data é obrigatória.'),
  type: z.enum(['Receita', 'Despesa']),
  categoryId: z.string().optional().nullable(),
  paymentMethod: z.nativeEnum(PaymentMethod).nullable(),
  pixKey: z.string().optional().nullable(),
  paidTo: z.string().optional().nullable(),
  contractorId: z.string().optional().nullable(),
});

type TransactionFormData = z.infer<typeof transactionSchema>;

interface TransactionFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (transaction: Transaction) => void;
  transaction: Transaction | null;
  categories: ExpenseCategory[];
  artists: Artist[];
  contractors: Contractor[];
}

export function TransactionForm({
  isOpen,
  onClose,
  onSave,
  transaction,
  categories,
  artists,
  contractors
}: TransactionFormProps) {
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      description: transaction?.description || '',
      value: transaction?.value || 0,
      date: transaction?.date || new Date().toISOString().split('T')[0],
      type: transaction?.type || 'Receita',
      categoryId: transaction?.categoryId || null,
      paymentMethod: transaction?.paymentMethod || null,
      pixKey: transaction?.pixKey || '',
      paidTo: transaction?.paidTo || '',
      contractorId: transaction?.contractorId || null,
    },
  });

  const transactionType = watch('type');
  const paymentMethod = watch('paymentMethod');

  const onSubmit = (data: TransactionFormData) => {
    onSave({
      id: transaction?.id || '',
      ...data,
      isTransferred: transaction?.isTransferred || false,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{transaction ? 'Editar Transação' : 'Nova Transação'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Input id="description" {...register('description')} />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description.message}</p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="value">Valor</Label>
              <Input id="value" type="number" step="0.01" {...register('value')} />
              {errors.value && <p className="text-sm text-red-500">{errors.value.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Data</Label>
              <Input id="date" type="date" {...register('date')} />
              {errors.date && <p className="text-sm text-red-500">{errors.date.message}</p>}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label>Tipo</Label>
                <Controller
                name="type"
                control={control}
                render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Receita">Receita</SelectItem>
                        <SelectItem value="Despesa">Despesa</SelectItem>
                    </SelectContent>
                    </Select>
                )}
                />
            </div>
             <div className="space-y-2">
                <Label>Forma de Pagamento</Label>
                <Controller name="paymentMethod" control={control} render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={field.value || ''}>
                    <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="PIX">PIX</SelectItem>
                        <SelectItem value="Dinheiro">Dinheiro</SelectItem>
                        <SelectItem value="Cartão">Cartão</SelectItem>
                    </SelectContent>
                    </Select>
                )} />
            </div>
          </div>

           {paymentMethod === 'PIX' && (
             <div className="space-y-2">
              <Label htmlFor="pixKey">Chave PIX</Label>
              <Input id="pixKey" {...register('pixKey')} />
            </div>
           )}
          
          {transactionType === 'Despesa' && (
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                <Label>Categoria</Label>
                <Controller
                    name="categoryId"
                    control={control}
                    render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={field.value || ''}>
                        <SelectTrigger>
                        <SelectValue placeholder="Selecione uma categoria" />
                        </SelectTrigger>
                        <SelectContent>
                        {categories.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id}>
                            {cat.name}
                            </SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                    )}
                />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="paidTo">Pago para (opcional)</Label>
                    <Input id="paidTo" {...register('paidTo')} />
                </div>
            </div>
          )}

           {transactionType === 'Receita' && (
             <div className="space-y-2">
                <Label>Recebido de (Contratante)</Label>
                <Controller name="contractorId" control={control} render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={field.value || ''}>
                    <SelectTrigger><SelectValue placeholder="Selecione o contratante" /></SelectTrigger>
                    <SelectContent>
                        {contractors.map((c) => (
                        <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                        ))}
                    </SelectContent>
                    </Select>
                )} />
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">Salvar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
