
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
import { Category } from '@/types';
import { useEffect } from 'react';

const categorySchema = z.object({
  name: z.string().min(1, 'O nome da categoria é obrigatório.'),
  type: z.enum(['Receita', 'Despesa']),
});

type CategoryFormData = z.infer<typeof categorySchema>;

interface CategoryFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (category: Omit<Category, 'id'>) => void;
  category: Category | null;
  type: 'Receita' | 'Despesa';
}

export function CategoryForm({ isOpen, onClose, onSave, category, type }: CategoryFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
  });

  useEffect(() => {
    if (isOpen) {
        reset({ 
            name: category?.name || '',
            type: category?.type || type 
        });
    }
  }, [category, isOpen, reset, type]);


  const onSubmit = (data: CategoryFormData) => {
    onSave(data);
  };
  
  const dialogTitle = category 
    ? 'Editar Categoria' 
    : `Nova Categoria de ${type === 'Receita' ? 'Receita' : 'Despesa'}`;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome da Categoria</Label>
            <Input id="name" {...register('name')} />
            {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
          </div>
            <input type="hidden" {...register('type')} />
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
            <Button type="submit">Salvar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
