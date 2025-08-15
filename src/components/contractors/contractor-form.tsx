
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
import { Contractor } from '@/types';
import { useEffect, ChangeEvent } from 'react';

const contractorSchema = z.object({
  name: z.string().min(1, 'O nome do contratante é obrigatório.'),
  email: z.string().email({ message: "Email inválido." }).optional().or(z.literal('')),
  contact: z.string().optional(),
});

type ContractorFormData = z.infer<typeof contractorSchema>;

interface ContractorFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (contractor: Omit<Contractor, 'id'>) => void;
  contractor: Contractor | null;
}

const formatPhoneNumber = (value: string) => {
    if (!value) return '';
    value = value.replace(/\D/g, '');
    if (value.length > 11) value = value.substring(0, 11);
    
    if (value.length > 10) {
        // (99) 9 9999-9999
        value = value.replace(/^(\d{2})(\d)(\d{4})(\d{4}).*/, '($1) $2 $3-$4');
    } else if (value.length > 6) {
        // (99) 9999-9999
        value = value.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, '($1) $2-$3');
    } else if (value.length > 2) {
        // (99) 9999
        value = value.replace(/^(\d{2})(\d{0,5}).*/, '($1) $2');
    } else if (value.length > 0) {
        value = value.replace(/^(\d*)/, '($1');
    }
    return value;
}

export function ContractorForm({ isOpen, onClose, onSave, contractor }: ContractorFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ContractorFormData>({
    resolver: zodResolver(contractorSchema),
  });

  useEffect(() => {
    if(isOpen) {
        reset(contractor ? {
            name: contractor.name,
            email: contractor.email,
            contact: contractor.contact,
        } : {
            name: '',
            email: '',
            contact: '',
        });
    }
  }, [contractor, isOpen, reset]);

  const handleContactChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue('contact', formatPhoneNumber(e.target.value));
  };


  const onSubmit = (data: ContractorFormData) => {
    onSave(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{contractor ? 'Editar Contratante' : 'Novo Contratante'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Contratante</Label>
            <Input id="name" {...register('name')} />
            {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...register('email')} />
              {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact">Contato</Label>
              <Input 
                id="contact" 
                type="tel" 
                {...register('contact')} 
                onChange={handleContactChange}
                maxLength={16}
              />
            </div>
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
