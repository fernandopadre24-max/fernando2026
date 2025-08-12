
'use client';

import { useForm } from 'react-hook-form';
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
import { BankAccount } from '@/types';

const movementSchema = z.object({
  value: z.coerce.number().positive('O valor deve ser positivo.'),
  description: z.string().min(1, 'A descrição é obrigatória.'),
  date: z.string().min(1, 'A data é obrigatória.'),
});

export type MovementFormData = z.infer<typeof movementSchema>;

interface MovementFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: MovementFormData) => void;
  account: BankAccount;
  type: 'deposit' | 'withdrawal';
}

export function MovementForm({ isOpen, onClose, onSave, account, type }: MovementFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MovementFormData>({
    resolver: zodResolver(movementSchema),
    defaultValues: {
      value: 0,
      description: '',
      date: new Date().toISOString().split('T')[0],
    },
  });

  const onSubmit = (data: MovementFormData) => {
    onSave(data);
  };
  
  const title = type === 'deposit' ? 'Registrar Depósito' : 'Registrar Retirada';
  const description = `Realize um ${type === 'deposit' ? 'depósito' : 'retirada'} na conta ${account.bankName} - ${account.accountNumber}.`;


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="value">Valor</Label>
            <Input id="value" type="number" step="0.01" {...register('value')} />
            {errors.value && <p className="text-sm text-red-500">{errors.value.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Input id="description" {...register('description')} />
            {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
          </div>
          
           <div className="space-y-2">
            <Label htmlFor="date">Data</Label>
            <Input id="date" type="date" {...register('date')} />
            {errors.date && <p className="text-sm text-red-500">{errors.date.message}</p>}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
            <Button type="submit">Salvar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
