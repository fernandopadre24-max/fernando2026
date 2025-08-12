
'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Pen, Trash2 } from 'lucide-react';
import { Artist } from '@/types';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';


interface ArtistListProps {
  artists: Artist[];
  onEdit: (artist: Artist) => void;
  onDelete: (id: string) => void;
}

export function ArtistList({ artists, onEdit, onDelete }: ArtistListProps) {
  const getInitials = (name: string) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }

  return (
    <div className="bg-notebook">
      <Table>
        <TableHeader>
          <TableRow className="bg-primary/5 border-b-primary/20">
            <TableHead className="w-[80px]">Imagem</TableHead>
            <TableHead>Nome</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {artists.length > 0 ? (
            artists.map((artist) => (
              <TableRow key={artist.id}>
                <TableCell>
                   <Popover>
                    <PopoverTrigger asChild>
                       <Avatar className="cursor-pointer">
                        <AvatarImage src={artist.imageUrl} alt={artist.name} />
                        <AvatarFallback>{getInitials(artist.name)}</AvatarFallback>
                      </Avatar>
                    </PopoverTrigger>
                    {artist.imageUrl && (
                         <PopoverContent className="w-auto p-0">
                            <img src={artist.imageUrl} alt={artist.name} className="rounded-md" />
                        </PopoverContent>
                    )}
                  </Popover>
                </TableCell>
                <TableCell className="font-medium">{artist.name}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => onEdit(artist)}>
                      <Pen className="h-4 w-4" />
                      <span className="sr-only">Editar</span>
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => onDelete(artist.id)} className="text-red-600 hover:text-red-700">
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Excluir</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={3} className="h-24 text-center">
                Nenhum artista encontrado.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
