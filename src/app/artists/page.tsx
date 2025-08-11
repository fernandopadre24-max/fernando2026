
'use client';

import { useState, useEffect } from 'react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { PlusCircle, MoreHorizontal, Trash2, Edit } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Artist } from '@/types';

export default function ArtistsPage() {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [isClient, setIsClient] = useState(false);
  
  const [isAddEditDialogOpen, setIsAddEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
  const [artistName, setArtistName] = useState('');

  useEffect(() => {
    setIsClient(true);
    const storedArtists = localStorage.getItem('artists');
    if (storedArtists) {
      setArtists(JSON.parse(storedArtists));
    }
  }, []);

  useEffect(() => {
    if (isClient) {
      localStorage.setItem('artists', JSON.stringify(artists));
    }
  }, [artists, isClient]);

  const handleSave = () => {
    if (selectedArtist) {
      // Edit
      setArtists(
        artists.map((a) =>
          a.id === selectedArtist.id ? { ...a, name: artistName } : a
        )
      );
    } else {
      // Add
      const newArtist: Artist = {
        id: crypto.randomUUID(),
        name: artistName,
      };
      setArtists([...artists, newArtist]);
    }
    closeAddEditDialog();
  };

  const handleDelete = () => {
    if (selectedArtist) {
      setArtists(artists.filter((a) => a.id !== selectedArtist.id));
      closeDeleteDialog();
    }
  };
  
  const openAddDialog = () => {
    setSelectedArtist(null);
    setArtistName('');
    setIsAddEditDialogOpen(true);
  };

  const openEditDialog = (artist: Artist) => {
    setSelectedArtist(artist);
    setArtistName(artist.name);
    setIsAddEditDialogOpen(true);
  };

  const closeAddEditDialog = () => {
    setIsAddEditDialogOpen(false);
    setSelectedArtist(null);
    setArtistName('');
  };

  const openDeleteDialog = (artist: Artist) => {
    setSelectedArtist(artist);
    setIsDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setSelectedArtist(null);
  };


  if (!isClient) {
    return null; // or a loading spinner
  }

  return (
    <AppShell>
      <main className="container mx-auto px-4 pb-16">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold font-headline">Gerenciar Artistas</h1>
          <Button onClick={openAddDialog}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Adicionar Artista
          </Button>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Lista de Artistas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {artists.length > 0 ? (
                    artists.map((artist) => (
                      <TableRow key={artist.id}>
                        <TableCell className="font-medium">{artist.name}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Abrir menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => openEditDialog(artist)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => openDeleteDialog(artist)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Excluir
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={2} className="h-24 text-center">
                        Nenhum artista encontrado.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Add/Edit Dialog */}
      <Dialog open={isAddEditDialogOpen} onOpenChange={setIsAddEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {selectedArtist ? 'Editar Artista' : 'Adicionar Artista'}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nome
              </Label>
              <Input
                id="name"
                value={artistName}
                onChange={(e) => setArtistName(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Cancelar
              </Button>
            </DialogClose>
            <Button type="button" onClick={handleSave}>
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
       <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Essa ação não pode ser desfeita. Isso excluirá permanentemente o
              artista &quot;{selectedArtist?.name}&quot;.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={closeDeleteDialog}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </AppShell>
  );
}
