
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Pen, Trash2 } from 'lucide-react';
import { Contractor } from '@/types';

interface ContractorListProps {
  contractors: Contractor[];
  onEdit: (contractor: Contractor) => void;
  onDelete: (id: string) => void;
}

export function ContractorList({ contractors, onEdit, onDelete }: ContractorListProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
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
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Abrir menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(contractor)}>
                      <Pen className="mr-2 h-4 w-4" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDelete(contractor.id)} className="text-red-600">
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
  );
}
