
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { CategoryList } from '@/components/finance/categories/category-list';
import { CategoryForm } from '@/components/finance/categories/category-form';
import { ExpenseCategory, Transaction } from '@/types';
import { loadData, saveData } from '@/lib/storage';
import { useAuth } from '@/contexts/auth-context';

const CategoriesPage = () => {
  const [categories, setCategories] = useState<ExpenseCategory[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ExpenseCategory | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
        setCategories(loadData('expenseCategories', []));
    }
  }, [user]);

  const handleSaveCategory = (categoryData: Omit<ExpenseCategory, 'id'>) => {
    let updatedCategories;
    if (selectedCategory) {
      updatedCategories = categories.map((category) =>
        category.id === selectedCategory.id ? { ...selectedCategory, ...categoryData } : category
      );
    } else {
      const newCategory: ExpenseCategory = {
        ...categoryData,
        id: `category-${Date.now()}`,
      };
      updatedCategories = [...categories, newCategory];
    }
    setCategories(updatedCategories);
    saveData('expenseCategories', updatedCategories);
    setIsFormOpen(false);
    setSelectedCategory(null);
  };

  const handleDeleteCategory = (id: string) => {
    // Remove category from list
    const updatedCategories = categories.filter((category) => category.id !== id);
    setCategories(updatedCategories);
    saveData('expenseCategories', updatedCategories);

    // Update transactions that used this category
    const transactions = loadData<Transaction[]>('transactions', []);
    const updatedTransactions = transactions.map(t => {
        if (t.categoryId === id) {
            return { ...t, categoryId: null };
        }
        return t;
    });
    saveData('transactions', updatedTransactions);
  };

  const handleEditCategory = (category: ExpenseCategory) => {
    setSelectedCategory(category);
    setIsFormOpen(true);
  };

  const handleOpenForm = () => {
    setSelectedCategory(null);
    setIsFormOpen(true);
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Gerenciar Categorias</h2>
        <div className="flex items-center space-x-2">
          <Button onClick={handleOpenForm}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Adicionar Categoria
          </Button>
        </div>
      </div>

      <div className="mt-8">
        <CategoryList 
            categories={categories} 
            onEdit={handleEditCategory}
            onDelete={handleDeleteCategory}
        />
      </div>

      {isFormOpen && (
        <CategoryForm
          isOpen={isFormOpen}
          onClose={() => {
            setIsFormOpen(false);
            setSelectedCategory(null);
          }}
          onSave={handleSaveCategory}
          category={selectedCategory}
        />
      )}
    </div>
  );
};

export default CategoriesPage;
