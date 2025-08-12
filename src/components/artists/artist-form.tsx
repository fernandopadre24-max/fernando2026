
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
import { useState, useEffect, ChangeEvent } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';


const artistSchema = z.object({
  name: z.string().min(1, 'O nome do artista é obrigatório.'),
  imageUrl: z.string().optional(),
});

type ArtistFormData = z.infer<typeof artistSchema>;

interface ArtistFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (artist: Omit<Artist, 'id'>) => void;
  artist: Artist | null;
}

export function ArtistForm({ isOpen, onClose, onSave, artist }: ArtistFormProps) {
    const [previewImage, setPreviewImage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ArtistFormData>({
    resolver: zodResolver(artistSchema),
    defaultValues: {
      name: '',
      imageUrl: '',
    },
  });
  
  const watchedName = watch('name');

  useEffect(() => {
    if (isOpen) {
        if (artist) {
            reset({
                name: artist.name,
                imageUrl: artist.imageUrl,
            });
            setPreviewImage(artist.imageUrl || null);
        } else {
            reset({
                name: '',
                imageUrl: '',
            });
            setPreviewImage(null);
        }
    }
  }, [artist, isOpen, reset]);

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

  const onSubmit = (data: ArtistFormData) => {
    onSave(data);
  };
  
  const getInitials = (name?: string) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }

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
            <Label htmlFor="imageUpload">Foto do Artista</Label>
            <div className="flex items-center gap-4">
                 <Avatar className="h-24 w-24">
                    <AvatarImage src={previewImage || undefined} alt={watchedName} />
                    <AvatarFallback className="text-3xl">{getInitials(watchedName)}</AvatarFallback>
                  </Avatar>
                <Input id="imageUpload" type="file" accept="image/*" onChange={handleImageChange} className="flex-1" />
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
