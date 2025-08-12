
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { BankList } from '@/components/banks/bank-list';
import { BankForm } from '@/components/banks/bank-form';
import { MovementForm, MovementFormData } from '@/components/banks/movement-form';
import { BankAccount, Transaction, Artist, Contractor } from '@/types';
import { loadData, saveData } from '@/lib/storage';

const BanksPage = () => {
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [contractors, setContractors] = useState<Contractor[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isMovementFormOpen, setIsMovementFormOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<BankAccount | null>(null);
  const [movementType, setMovementType] = useState<'deposit' | 'withdrawal'>('deposit');


  useEffect(() => {
    setAccounts(loadData('bankAccounts', []));
    setTransactions(loadData('transactions', []));
    setArtists(loadData('artists', []));
    setContractors(loadData('contractors', []));
  }, []);

  const handleSaveAccount = (account: Omit<BankAccount, 'id' | 'balance'>) => {
    let updatedAccounts;
    if (selectedAccount) {
      updatedAccounts = accounts.map((acc) =>
        acc.id === selectedAccount.id ? { ...selectedAccount, ...account } : acc
      );
    } else {
      const newAccount: BankAccount = {
        ...account,
        id: new Date().toISOString(),
        balance: 0, 
      };
      updatedAccounts = [...accounts, newAccount];
    }
    setAccounts(updatedAccounts);
    saveData('bankAccounts', updatedAccounts);
    setIsFormOpen(false);
    setSelectedAccount(null);
  };
  
  const handleSaveMovement = (data: MovementFormData) => {
    if (!selectedAccount) return;

    const value = movementType === 'deposit' ? data.value : -data.value;

    // Update bank account balance
    const updatedAccounts = accounts.map(acc => 
      acc.id === selectedAccount.id ? { ...acc, balance: acc.balance + value } : acc
    );
    setAccounts(updatedAccounts);
    saveData('bankAccounts', updatedAccounts);

    // Create a new transaction
    const newTransaction: Transaction = {
      id: new Date().toISOString(),
      description: data.description,
      value: data.value,
      date: data.date,
      type: movementType === 'deposit' ? 'Receita' : 'Despesa',
      isTransferred: true, // Direct bank movement
      bankAccountId: selectedAccount.id,
      paymentMethod: data.paymentMethod,
      artistId: data.artistId,
      contractorId: data.contractorId,
    };
    const updatedTransactions = [...transactions, newTransaction];
    setTransactions(updatedTransactions);
    saveData('transactions', updatedTransactions);

    setIsMovementFormOpen(false);
    setSelectedAccount(null);
  };


  const handleDeleteAccount = (id: string) => {
    const updatedAccounts = accounts.filter((acc) => acc.id !== id);
    setAccounts(updatedAccounts);
    saveData('bankAccounts', updatedAccounts);
  };

  const handleEditAccount = (account: BankAccount) => {
    setSelectedAccount(account);
    setIsFormOpen(true);
  };

  const handleOpenForm = () => {
    setSelectedAccount(null);
    setIsFormOpen(true);
  };
  
  const handleOpenMovementForm = (account: BankAccount, type: 'deposit' | 'withdrawal') => {
    setSelectedAccount(account);
    setMovementType(type);
    setIsMovementFormOpen(true);
  };


  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Bancos</h2>
        <div className="flex items-center space-x-2">
          <Button onClick={handleOpenForm}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Adicionar Conta
          </Button>
        </div>
      </div>

      <div className="mt-8">
        <BankList 
            accounts={accounts} 
            transactions={transactions}
            artists={artists}
            contractors={contractors}
            onEdit={handleEditAccount}
            onDelete={handleDeleteAccount}
            onDeposit={(account) => handleOpenMovementForm(account, 'deposit')}
            onWithdraw={(account) => handleOpenMovementForm(account, 'withdrawal')}
        />
      </div>

      {isFormOpen && (
        <BankForm
          isOpen={isFormOpen}
          onClose={() => {
            setIsFormOpen(false);
            setSelectedAccount(null);
          }}
          onSave={handleSaveAccount}
          account={selectedAccount}
        />
      )}
      
      {isMovementFormOpen && selectedAccount && (
        <MovementForm
          isOpen={isMovementFormOpen}
          onClose={() => {
            setIsMovementFormOpen(false);
            setSelectedAccount(null);
          }}
          onSave={handleSaveMovement}
          account={selectedAccount}
          type={movementType}
          artists={artists}
          contractors={contractors}
        />
      )}
    </div>
  );
};

export default BanksPage;
