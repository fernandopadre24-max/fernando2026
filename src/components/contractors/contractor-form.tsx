
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

const contractorSchema = z.object({
  name: z.string().min(1, 'O nome do contratante é obrigatório.'),
});

type ContractorFormData = z.infer<typeof contractorSchema>;

interface ContractorFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (contractor: Omit<Contractor, 'id'>) => void;
  contractor: Contractor | null;
}

export function ContractorForm({ isOpen, onClose, onSave, contractor }: ContractorFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContractorFormData>({
    resolver: zodResolver(contractorSchema),
    defaultValues: {
      name: contractor?.name || '',
    },
  });

  const onSubmit = (data: ContractorFormData) => {
    onSave(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{contractor ? 'Editar Contratante' : 'Novo Contratante'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Contratante</Label>
            <Input id="name" {...register('name')} />
            {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
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
