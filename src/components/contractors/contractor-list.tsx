
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
import { Pen, Trash2 } from 'lucide-react';
import { Contractor } from '@/types';

interface ContractorListProps {
  contractors: Contractor[];
  onEdit: (contractor: Contractor) => void;
  onDelete: (id: string) => void;
}

export function ContractorList({ contractors, onEdit, onDelete }: ContractorListProps) {
  return (
    <div className="bg-notebook">
      <Table>
        <TableHeader>
          <TableRow className="bg-primary/5 border-b-primary/20">
            <TableHead>Nome</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contractors.length > 0 ? (
            contractors.map((contractor) => (
              <TableRow key={contractor.id}>
                <TableCell className="font-medium">{contractor.name}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => onEdit(contractor)}>
                      <Pen className="h-4 w-4" />
                      <span className="sr-only">Editar</span>
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => onDelete(contractor.id)} className="text-red-600 hover:text-red-700">
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Excluir</span>
                    </Button>
                  </div>
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
  );
}
