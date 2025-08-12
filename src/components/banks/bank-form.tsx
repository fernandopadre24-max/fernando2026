
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
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BankAccount } from '@/types';

const accountSchema = z.object({
  bankName: z.string().min(1, 'O nome do banco é obrigatório.'),
  agency: z.string().min(1, 'A agência é obrigatória.'),
  accountNumber: z.string().min(1, 'O número da conta é obrigatório.'),
  balance: z.coerce.number().optional(),
});

type AccountFormData = z.infer<typeof accountSchema>;

interface BankFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (account: Omit<BankAccount, 'id'>) => void;
  account: BankAccount | null;
}

export function BankForm({ isOpen, onClose, onSave, account }: BankFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AccountFormData>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      bankName: account?.bankName || '',
      agency: account?.agency || '',
      accountNumber: account?.accountNumber || '',
      balance: account?.balance || 0,
    },
  });

  const onSubmit = (data: AccountFormData) => {
    const saveData: Omit<BankAccount, 'id'> = {
        bankName: data.bankName,
        agency: data.agency,
        accountNumber: data.accountNumber,
        balance: data.balance || 0,
    };
    onSave(saveData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{account ? 'Editar Conta' : 'Nova Conta'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="bankName">Nome do Banco</Label>
            <Input id="bankName" {...register('bankName')} />
            {errors.bankName && <p className="text-sm text-red-500">{errors.bankName.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="agency">Agência</Label>
            <Input id="agency" {...register('agency')} />
            {errors.agency && <p className="text-sm text-red-500">{errors.agency.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="accountNumber">Número da Conta</Label>
            <Input id="accountNumber" {...register('accountNumber')} />
            {errors.accountNumber && <p className="text-sm text-red-500">{errors.accountNumber.message}</p>}
          </div>

          <div className="space-y-2">
              <Label htmlFor="balance">{account ? 'Saldo' : 'Saldo Inicial'}</Label>
              <Input id="balance" type="number" step="0.01" {...register('balance')} />
              {errors.balance && <p className="text-sm text-red-500">{errors.balance.message}</p>}
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
