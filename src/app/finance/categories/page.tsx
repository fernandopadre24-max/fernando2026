
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { CategoryList } from '@/components/finance/categories/category-list';
import { CategoryForm } from '@/components/finance/categories/category-form';
import { Category, Transaction } from '@/types';
import { loadData, saveData } from '@/lib/storage';
import { useAuth } from '@/contexts/auth-context';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';


const CategoriesPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [categoryType, setCategoryType] = useState<'Receita' | 'Despesa'>('Despesa');
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
        setCategories(loadData('categories', []));
    }
  }, [user]);

  const handleSaveCategory = (categoryData: Omit<Category, 'id'>) => {
    let updatedCategories;
    if (selectedCategory) {
      updatedCategories = categories.map((category) =>
        category.id === selectedCategory.id ? { ...selectedCategory, ...categoryData } : category
      );
    } else {
      const newCategory: Category = {
        ...categoryData,
        id: `category-${Date.now()}`,
      };
      updatedCategories = [...categories, newCategory];
    }
    setCategories(updatedCategories);
    saveData('categories', updatedCategories);
    setIsFormOpen(false);
    setSelectedCategory(null);
  };

  const handleDeleteCategory = (id: string) => {
    // Remove category from list
    const updatedCategories = categories.filter((category) => category.id !== id);
    setCategories(updatedCategories);
    saveData('categories', updatedCategories);

    // Update transactions that used this category
    const transactions = loadData<Transaction[]>('transactions', []);
    const updatedTransactions = transactions.map(t => {
        if (t.categoryId === id) {
            return { ...t, categoryId: undefined };
        }
        return t;
    });
    saveData('transactions', updatedTransactions);
  };

  const handleEditCategory = (category: Category) => {
    setSelectedCategory(category);
    setIsFormOpen(true);
  };

  const handleOpenForm = (type: 'Receita' | 'Despesa') => {
    setSelectedCategory(null);
    setCategoryType(type);
    setIsFormOpen(true);
  };

  const expenseCategories = categories.filter(c => c.type === 'Despesa');
  const incomeCategories = categories.filter(c => c.type === 'Receita');

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Gerenciar Categorias</h2>
      </div>

       <Tabs defaultValue="expenses" className="space-y-4">
        <TabsList>
          <TabsTrigger value="expenses">Despesas</TabsTrigger>
          <TabsTrigger value="income">Receitas</TabsTrigger>
        </TabsList>
        <TabsContent value="expenses" className="space-y-4">
          <div className="flex items-center justify-end">
             <Button onClick={() => handleOpenForm('Despesa')}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Adicionar Categoria de Despesa
            </Button>
          </div>
          <CategoryList 
              categories={expenseCategories} 
              onEdit={handleEditCategory}
              onDelete={handleDeleteCategory}
          />
        </TabsContent>
        <TabsContent value="income" className="space-y-4">
            <div className="flex items-center justify-end">
                <Button onClick={() => handleOpenForm('Receita')}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Adicionar Categoria de Receita
                </Button>
            </div>
            <CategoryList 
                categories={incomeCategories} 
                onEdit={handleEditCategory}
                onDelete={handleDeleteCategory}
            />
        </TabsContent>
      </Tabs>


      {isFormOpen && (
        <CategoryForm
          isOpen={isFormOpen}
          onClose={() => {
            setIsFormOpen(false);
            setSelectedCategory(null);
          }}
          onSave={handleSaveCategory}
          category={selectedCategory}
          type={categoryType}
        />
      )}
    </div>
  );
};

export default CategoriesPage;
