
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
import type { Contractor } from '@/types';

export default function ContractorsPage() {
  const [contractors, setContractors] = useState<Contractor[]>([]);
  const [isClient, setIsClient] = useState(false);

  const [isAddEditDialogOpen, setIsAddEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedContractor, setSelectedContractor] = useState<Contractor | null>(null);
  const [contractorName, setContractorName] = useState('');

  useEffect(() => {
    setIsClient(true);
    const storedContractors = localStorage.getItem('contractors');
    if (storedContractors) {
      setContractors(JSON.parse(storedContractors));
    }
  }, []);

  useEffect(() => {
    if (isClient) {
      localStorage.setItem('contractors', JSON.stringify(contractors));
    }
  }, [contractors, isClient]);

  const handleSave = () => {
    if (selectedContractor) {
      // Edit
      setContractors(
        contractors.map((c) =>
          c.id === selectedContractor.id ? { ...c, name: contractorName } : c
        )
      );
    } else {
      // Add
      const newContractor: Contractor = {
        id: crypto.randomUUID(),
        name: contractorName,
      };
      setContractors([...contractors, newContractor]);
    }
    closeAddEditDialog();
  };

  const handleDelete = () => {
    if (selectedContractor) {
      setContractors(contractors.filter((c) => c.id !== selectedContractor.id));
      closeDeleteDialog();
    }
  };

  const openAddDialog = () => {
    setSelectedContractor(null);
    setContractorName('');
    setIsAddEditDialogOpen(true);
  };

  const openEditDialog = (contractor: Contractor) => {
    setSelectedContractor(contractor);
    setContractorName(contractor.name);
    setIsAddEditDialogOpen(true);
  };

  const closeAddEditDialog = () => {
    setIsAddEditDialogOpen(false);
    setSelectedContractor(null);
    setContractorName('');
  };

  const openDeleteDialog = (contractor: Contractor) => {
    setSelectedContractor(contractor);
    setIsDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setSelectedContractor(null);
  };

  if (!isClient) {
    return null; // or a loading spinner
  }

  return (
    <AppShell>
      <main className="container mx-auto px-4 pb-16">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold font-headline">Gerenciar Contratantes</h1>
          <Button onClick={openAddDialog}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Adicionar Contratante
          </Button>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Lista de Contratantes</CardTitle>
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
                  {contractors.length > 0 ? (
                    contractors.map((contractor) => (
                      <TableRow key={contractor.id}>
                        <TableCell className="font-medium">{contractor.name}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Abrir menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => openEditDialog(contractor)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => openDeleteDialog(contractor)}
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
                        Nenhum contratante encontrado.
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
              {selectedContractor ? 'Editar Contratante' : 'Adicionar Contratante'}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nome
              </Label>
              <Input
                id="name"
                value={contractorName}
                onChange={(e) => setContractorName(e.target.value)}
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
              contratante &quot;{selectedContractor?.name}&quot;.
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
