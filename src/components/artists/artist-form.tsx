
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
import { Artist } from '@/types';

const artistSchema = z.object({
  name: z.string().min(1, 'O nome do artista é obrigatório.'),
  imageUrl: z.string().url().optional().or(z.literal('')),
});

type ArtistFormData = z.infer<typeof artistSchema>;

interface ArtistFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (artist: Omit<Artist, 'id'>) => void;
  artist: Artist | null;
}

export function ArtistForm({ isOpen, onClose, onSave, artist }: ArtistFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ArtistFormData>({
    resolver: zodResolver(artistSchema),
    defaultValues: {
      name: artist?.name || '',
      imageUrl: artist?.imageUrl || '',
    },
  });

  const onSubmit = (data: ArtistFormData) => {
    onSave(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{artist ? 'Editar Artista' : 'Novo Artista'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Artista</Label>
            <Input id="name" {...register('name')} />
            {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="imageUrl">URL da Imagem</Label>
            <Input id="imageUrl" {...register('imageUrl')} placeholder="https://exemplo.com/imagem.png" />
            {errors.imageUrl && <p className="text-sm text-red-500">{errors.imageUrl.message}</p>}
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
