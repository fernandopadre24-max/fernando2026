
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { FinancialSummary } from '@/components/finance/financial-summary';
import { TransactionList } from '@/components/finance/transaction-list';
import { TransactionForm } from '@/components/finance/transaction-form';
import { Transaction, ExpenseCategory } from '@/types';
import { loadData, saveData } from '@/lib/storage';

const FinancePage = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<ExpenseCategory[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  useEffect(() => {
    setTransactions(loadData('transactions'));
    setCategories(loadData('expenseCategories', [{ id: '1', name: 'Alimentação' }, { id: '2', name: 'Transporte' }]));
  }, []);

  const handleSaveTransaction = (transaction: Transaction) => {
    let updatedTransactions;
    if (transaction.id) {
      updatedTransactions = transactions.map((t) => (t.id === transaction.id ? transaction : t));
    } else {
      updatedTransactions = [...transactions, { ...transaction, id: new Date().toISOString() }];
    }
    setTransactions(updatedTransactions);
    saveData('transactions', updatedTransactions);
    setIsFormOpen(false);
    setSelectedTransaction(null);
  };

  const handleDeleteTransaction = (id: string) => {
    const updatedTransactions = transactions.filter((t) => t.id !== id);
    setTransactions(updatedTransactions);
    saveData('transactions', updatedTransactions);
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsFormOpen(true);
  };

  const handleOpenForm = () => {
    setSelectedTransaction(null);
    setIsFormOpen(true);
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Financeiro</h2>
        <div className="flex items-center space-x-2">
          <Button onClick={handleOpenForm}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Adicionar Transação
          </Button>
        </div>
      </div>
      
      <FinancialSummary transactions={transactions} />

      <div className="mt-8">
        <TransactionList 
            transactions={transactions} 
            categories={categories}
            onEdit={handleEditTransaction}
            onDelete={handleDeleteTransaction}
        />
      </div>

      {isFormOpen && (
        <TransactionForm
          isOpen={isFormOpen}
          onClose={() => {
            setIsFormOpen(false);
            setSelectedTransaction(null);
          }}
          onSave={handleSaveTransaction}
          transaction={selectedTransaction}
          categories={categories}
        />
      )}
    </div>
  );
};

export default FinancePage;
