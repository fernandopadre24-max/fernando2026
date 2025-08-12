
'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { BankAccount } from '@/types';

interface TransferDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (accountId: string) => void;
  accounts: BankAccount[];
  eventValue: number;
}

const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

export function TransferDialog({ isOpen, onClose, onConfirm, accounts, eventValue }: TransferDialogProps) {
  const [selectedAccount, setSelectedAccount] = useState<string>('');

  const handleConfirm = () => {
    if (selectedAccount) {
      onConfirm(selectedAccount);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Transferir Valor do Evento</DialogTitle>
          <DialogDescription>
            Selecione a conta de destino para transferir o valor de{' '}
            <span className="font-bold">{formatCurrency(eventValue)}</span>.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="bankAccount">Conta de Destino</Label>
            <Select onValueChange={setSelectedAccount} defaultValue={selectedAccount}>
              <SelectTrigger id="bankAccount">
                <SelectValue placeholder="Selecione uma conta" />
              </SelectTrigger>
              <SelectContent>
                {accounts.length > 0 ? (
                  accounts.map((account) => (
                    <SelectItem key={account.id} value={account.id}>
                      {account.bankName} - Ag: {account.agency}, C/C: {account.accountNumber}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-accounts" disabled>
                    Nenhuma conta cadastrada
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleConfirm} disabled={!selectedAccount}>
            Confirmar Transferência
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
