
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
import { useState, useEffect, ChangeEvent } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Banknote } from 'lucide-react';


const accountSchema = z.object({
  bankName: z.string().min(1, 'O nome do banco é obrigatório.'),
  agency: z.string().min(1, 'A agência é obrigatória.'),
  accountNumber: z.string().min(1, 'O número da conta é obrigatório.'),
  balance: z.coerce.number().optional(),
  imageUrl: z.string().optional(),
});

type AccountFormData = z.infer<typeof accountSchema>;

interface BankFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (account: Omit<BankAccount, 'id'>) => void;
  account: BankAccount | null;
}

export function BankForm({ isOpen, onClose, onSave, account }: BankFormProps) {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<AccountFormData>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      bankName: '',
      agency: '',
      accountNumber: '',
      balance: 0,
      imageUrl: '',
    },
  });

  useEffect(() => {
    if (isOpen) {
        if (account) {
            reset({
                bankName: account.bankName,
                agency: account.agency,
                accountNumber: account.accountNumber,
                balance: account.balance,
                imageUrl: account.imageUrl,
            });
            setPreviewImage(account.imageUrl || null);
        } else {
            reset({
                bankName: '',
                agency: '',
                accountNumber: '',
                balance: 0,
                imageUrl: '',
            });
            setPreviewImage(null);
        }
    }
  }, [account, isOpen, reset]);


  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setValue('imageUrl', base64String);
        setPreviewImage(base64String);
      };
      reader.readAsDataURL(file);
    }
  };


  const onSubmit = (data: AccountFormData) => {
    onSave(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{account ? 'Editar Conta' : 'Nova Conta'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
           <div className="space-y-2">
            <Label htmlFor="imageUpload">Imagem do Banco</Label>
            <div className="flex items-center gap-4">
                 <Avatar className="h-24 w-24 rounded-md">
                    <AvatarImage src={previewImage || undefined} className="rounded-md" />
                    <AvatarFallback className="text-3xl rounded-md"><Banknote className="h-8 w-8 text-muted-foreground" /></AvatarFallback>
                  </Avatar>
                <Input id="imageUpload" type="file" accept="image/*" onChange={handleImageChange} className="flex-1" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="bankName">Nome do Banco</Label>
            <Input id="bankName" {...register('bankName')} />
            {errors.bankName && <p className="text-sm text-red-500">{errors.bankName.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
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
