
'use client';

import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, Settings } from 'lucide-react';
import { FinancialSummary } from '@/components/finance/financial-summary';
import { TransactionList } from '@/components/finance/transaction-list';
import { TransactionForm } from '@/components/finance/transaction-form';
import { TransactionFilters } from '@/components/finance/transaction-filters';
import { Transaction, Category, Artist, Contractor } from '@/types';
import { loadData, saveData } from '@/lib/storage';
import { DateRange } from 'react-day-picker';
import { useAuth } from '@/contexts/auth-context';
import Link from 'next/link';

const FinancePage = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [contractors, setContractors] = useState<Contractor[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const { user } = useAuth();

  // Filter states
  const [descriptionFilter, setDescriptionFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [dateRangeFilter, setDateRangeFilter] = useState<DateRange | undefined>();
  const [monthFilter, setMonthFilter] = useState('all');
  const [yearFilter, setYearFilter] = useState('all');


  useEffect(() => {
    if (user) {
        setTransactions(loadData('transactions', []));
        setCategories(loadData('categories', []));
        setArtists(loadData('artists', []));
        setContractors(loadData('contractors', []));
    }
  }, [user]);

  const handleSaveTransaction = (transaction: Transaction) => {
    let updatedTransactions;
    if (transaction.id) {
      updatedTransactions = transactions.map((t) => (t.id === transaction.id ? transaction : t));
    } else {
      updatedTransactions = [...transactions, { ...transaction, id: `trans-${Date.now()}` }];
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
  
  const handleClearFilters = () => {
    setDescriptionFilter('');
    setTypeFilter('all');
    setCategoryFilter('all');
    setDateRangeFilter(undefined);
    setMonthFilter('all');
    setYearFilter('all');
  };

  const availableYears = useMemo(() => {
    const years = new Set(transactions.map(t => new Date(t.date).getFullYear().toString()));
    return Array.from(years).sort((a,b) => b.localeCompare(a));
  }, [transactions]);


  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
        const descriptionMatch = descriptionFilter ? t.description.toLowerCase().includes(descriptionFilter.toLowerCase()) : true;
        const typeMatch = typeFilter !== 'all' ? t.type === typeFilter : true;
        
        let categoryMatch = true;
        if (typeFilter !== 'all' && categoryFilter !== 'all') {
            categoryMatch = t.categoryId === categoryFilter;
        }

        const transactionDate = new Date(t.date);
        
        const yearMatch = yearFilter !== 'all' ? transactionDate.getFullYear().toString() === yearFilter : true;
        const monthMatch = monthFilter !== 'all' ? (transactionDate.getMonth() + 1).toString() === monthFilter : true;

        let dateMatch = true;
        if (monthFilter !== 'all' || yearFilter !== 'all') {
            dateMatch = yearMatch && monthMatch;
        } else if (dateRangeFilter?.from) {
            transactionDate.setUTCHours(0,0,0,0);
            
            const fromDate = new Date(dateRangeFilter.from);
            fromDate.setUTCHours(0,0,0,0);

            if (dateRangeFilter.to) {
                 const toDate = new Date(dateRangeFilter.to);
                 toDate.setUTCHours(0,0,0,0);
                 dateMatch = transactionDate >= fromDate && transactionDate <= toDate;
            } else {
                dateMatch = transactionDate.getTime() === fromDate.getTime();
            }
        }
        
        return descriptionMatch && typeMatch && categoryMatch && dateMatch;
    });
  }, [transactions, descriptionFilter, typeFilter, categoryFilter, dateRangeFilter, monthFilter, yearFilter]);
  
  const filteredCategories = useMemo(() => {
    if (typeFilter === 'all') return [];
    return categories.filter(c => c.type === typeFilter);
  }, [categories, typeFilter]);

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Financeiro</h2>
        <div className="flex items-center space-x-2">
           <Link href="/finance/categories">
             <Button variant="outline">
                <Settings className="mr-2 h-4 w-4" />
                Gerenciar Categorias
            </Button>
          </Link>
          <Button onClick={handleOpenForm}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Adicionar Transação
          </Button>
        </div>
      </div>
      
      <FinancialSummary transactions={filteredTransactions} />
      
      <TransactionFilters
        description={descriptionFilter}
        onDescriptionChange={setDescriptionFilter}
        type={typeFilter}
        onTypeChange={(value) => {
            setTypeFilter(value);
            setCategoryFilter('all'); // Reset category filter when type changes
        }}
        category={categoryFilter}
        onCategoryChange={setCategoryFilter}
        dateRange={dateRangeFilter}
        onDateRangeChange={setDateRangeFilter}
        month={monthFilter}
        onMonthChange={setMonthFilter}
        year={yearFilter}
        onYearChange={setYearFilter}
        onClearFilters={handleClearFilters}
        categories={filteredCategories}
        availableYears={availableYears}
      />

      <div className="mt-8">
        <TransactionList 
            transactions={filteredTransactions} 
            categories={categories}
            artists={artists}
            contractors={contractors}
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
          artists={artists}
          contractors={contractors}
        />
      )}
    </div>
  );
};

export default FinancePage;
