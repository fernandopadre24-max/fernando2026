
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
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BankAccount, PaymentMethod, Artist, Contractor } from '@/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const movementSchema = z.object({
  value: z.coerce.number().positive('O valor deve ser positivo.'),
  description: z.string().min(1, 'A descrição é obrigatória.'),
  date: z.string().min(1, 'A data é obrigatória.'),
  paymentMethod: z.nativeEnum(PaymentMethod).nullable(),
  pixKey: z.string().optional().nullable(),
  paidTo: z.string().optional().nullable(),
  contractorId: z.string().optional().nullable(),
});

export type MovementFormData = z.infer<typeof movementSchema>;

interface MovementFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: MovementFormData) => void;
  account: BankAccount;
  type: 'deposit' | 'withdrawal';
  artists: Artist[];
  contractors: Contractor[];
}

export function MovementForm({ 
    isOpen, 
    onClose, 
    onSave, 
    account, 
    type,
    artists,
    contractors 
}: MovementFormProps) {
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<MovementFormData>({
    resolver: zodResolver(movementSchema),
    defaultValues: {
      value: 0,
      description: '',
      date: new Date().toISOString().split('T')[0],
      paymentMethod: null,
      pixKey: '',
      paidTo: '',
      contractorId: null,
    },
  });

  const paymentMethod = watch('paymentMethod');

  const onSubmit = (data: MovementFormData) => {
    onSave(data);
  };
  
  const title = type === 'deposit' ? 'Registrar Depósito' : 'Registrar Retirada';
  const description = `Realize um ${type === 'deposit' ? 'depósito' : 'retirada'} na conta ${account.bankName} - ${account.accountNumber}.`;


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
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
          
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Input id="description" {...register('description')} />
            {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
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

        {paymentMethod === 'PIX' && (
          <div className="space-y-2">
            <Label htmlFor="pixKey">Chave PIX</Label>
            <Input id="pixKey" {...register('pixKey')} />
          </div>
        )}

        {type === 'withdrawal' && (
            <div className="space-y-2">
                <Label htmlFor="paidTo">Pago para (opcional)</Label>
                <Input id="paidTo" {...register('paidTo')} />
            </div>
        )}

        {type === 'deposit' && (
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
            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
            <Button type="submit">Salvar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
