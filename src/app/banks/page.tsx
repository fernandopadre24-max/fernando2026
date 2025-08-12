
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { BankList } from '@/components/banks/bank-list';
import { BankForm } from '@/components/banks/bank-form';
import { MovementForm, MovementFormData } from '@/components/banks/movement-form';
import { TransactionForm } from '@/components/finance/transaction-form';
import { BankAccount, Transaction, Artist, Contractor, ExpenseCategory } from '@/types';
import { loadData, saveData } from '@/lib/storage';
import { useAuth } from '@/contexts/auth-context';

const BanksPage = () => {
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [contractors, setContractors] = useState<Contractor[]>([]);
  const [categories, setCategories] = useState<ExpenseCategory[]>([]);
  const [isAccountFormOpen, setIsAccountFormOpen] = useState(false);
  const [isMovementFormOpen, setIsMovementFormOpen] = useState(false);
  const [isTransactionFormOpen, setIsTransactionFormOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<BankAccount | null>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [movementType, setMovementType] = useState<'deposit' | 'withdrawal'>('deposit');
  const { user } = useAuth();


  useEffect(() => {
    if (user) {
        setAccounts(loadData('bankAccounts', []));
        setTransactions(loadData('transactions', []));
        setArtists(loadData('artists', []));
        setContractors(loadData('contractors', []));
        setCategories(loadData('expenseCategories', []));
    }
  }, [user]);

  const handleSaveAccount = (accountData: Omit<BankAccount, 'id' | 'balance'> & { balance?: number }) => {
    let updatedAccounts;
    if (selectedAccount) {
      updatedAccounts = accounts.map((acc) =>
        acc.id === selectedAccount.id ? { ...selectedAccount, ...accountData, balance: accountData.balance ?? selectedAccount.balance } : acc
      );
    } else {
      const newAccount: BankAccount = {
        id: `bank-${Date.now()}`,
        ...accountData,
        balance: accountData.balance || 0,
      };
      updatedAccounts = [...accounts, newAccount];
    }
    setAccounts(updatedAccounts);
    saveData('bankAccounts', updatedAccounts);
    setIsAccountFormOpen(false);
    setSelectedAccount(null);
  };
  
  const handleSaveMovement = (data: MovementFormData) => {
    if (!selectedAccount) return;

    const value = movementType === 'deposit' ? data.value : -data.value;

    const updatedAccounts = accounts.map(acc => 
      acc.id === selectedAccount.id ? { ...acc, balance: acc.balance + value } : acc
    );
    setAccounts(updatedAccounts);
    saveData('bankAccounts', updatedAccounts);

    const newTransaction: Transaction = {
      id: `trans-${Date.now()}`,
      description: data.description,
      value: data.value,
      date: data.date,
      type: movementType === 'deposit' ? 'Receita' : 'Despesa',
      isTransferred: true, 
      bankAccountId: selectedAccount.id,
      paymentMethod: data.paymentMethod,
      pixKey: data.pixKey,
      paidTo: data.paidTo,
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
    setIsAccountFormOpen(true);
  };

  const handleOpenAccountForm = () => {
    setSelectedAccount(null);
    setIsAccountFormOpen(true);
  };
  
  const handleOpenMovementForm = (account: BankAccount, type: 'deposit' | 'withdrawal') => {
    setSelectedAccount(account);
    setMovementType(type);
    setIsMovementFormOpen(true);
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsTransactionFormOpen(true);
  }

  const handleDeleteTransaction = (id: string) => {
    const transactionToDelete = transactions.find(t => t.id === id);
    if (!transactionToDelete || !transactionToDelete.bankAccountId) return;

    // Revert balance
    const value = transactionToDelete.type === 'Receita' ? -transactionToDelete.value : transactionToDelete.value;
    const updatedAccounts = accounts.map(acc => 
        acc.id === transactionToDelete.bankAccountId ? { ...acc, balance: acc.balance + value } : acc
    );
    setAccounts(updatedAccounts);
    saveData('bankAccounts', updatedAccounts);


    const updatedTransactions = transactions.filter((t) => t.id !== id);
    setTransactions(updatedTransactions);
    saveData('transactions', updatedTransactions);
  }

  const handleSaveTransaction = (transaction: Transaction) => {
    const originalTransaction = transactions.find(t => t.id === transaction.id);

    // If value or type changed, we need to adjust the balance
    if (originalTransaction && originalTransaction.bankAccountId) {
        const originalValue = originalTransaction.type === 'Receita' ? originalTransaction.value : -originalTransaction.value;
        const newValue = transaction.type === 'Receita' ? transaction.value : -transaction.value;
        const difference = newValue - originalValue;

        if (difference !== 0) {
             const updatedAccounts = accounts.map(acc => 
                acc.id === originalTransaction.bankAccountId ? { ...acc, balance: acc.balance + difference } : acc
            );
            setAccounts(updatedAccounts);
            saveData('bankAccounts', updatedAccounts);
        }
    }
    
    let updatedTransactions = transactions.map((t) => (t.id === transaction.id ? transaction : t));
    
    setTransactions(updatedTransactions);
    saveData('transactions', updatedTransactions);
    setIsTransactionFormOpen(false);
    setSelectedTransaction(null);
  };


  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Bancos</h2>
        <div className="flex items-center space-x-2">
          <Button onClick={handleOpenAccountForm}>
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
            onEditAccount={handleEditAccount}
            onDeleteAccount={handleDeleteAccount}
            onDeposit={(account) => handleOpenMovementForm(account, 'deposit')}
            onWithdraw={(account) => handleOpenMovementForm(account, 'withdrawal')}
            onEditTransaction={handleEditTransaction}
            onDeleteTransaction={handleDeleteTransaction}
        />
      </div>

      {isAccountFormOpen && (
        <BankForm
          isOpen={isAccountFormOpen}
          onClose={() => {
            setIsAccountFormOpen(false);
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

      {isTransactionFormOpen && (
        <TransactionForm
          isOpen={isTransactionFormOpen}
          onClose={() => {
            setIsTransactionFormOpen(false);
            setSelectedTransaction(null);
          }}
          onSave={handleSaveTransaction}
          transaction={selectedTransaction}
          categories={categories}
          artists={artists}
          contractors={contractors}
        />
      )}
    </div>
  );
};

export default BanksPage;
