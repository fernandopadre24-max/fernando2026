
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { ContractorList } from '@/components/contractors/contractor-list';
import { ContractorForm } from '@/components/contractors/contractor-form';
import { Contractor } from '@/types';
import { loadData, saveData } from '@/lib/storage';
import { useAuth } from '@/contexts/auth-context';

const ContractorsPage = () => {
  const [contractors, setContractors] = useState<Contractor[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedContractor, setSelectedContractor] = useState<Contractor | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
        setContractors(loadData('contractors', []));
    }
  }, [user]);

  const handleSaveContractor = (contractorData: Omit<Contractor, 'id'>) => {
    let updatedContractors;
    if (selectedContractor) {
      updatedContractors = contractors.map((contractor) =>
        contractor.id === selectedContractor.id ? { ...selectedContractor, ...contractorData } : contractor
      );
    } else {
      const newContractor: Contractor = {
        ...contractorData,
        id: `contractor-${Date.now()}`,
      };
      updatedContractors = [...contractors, newContractor];
    }
    setContractors(updatedContractors);
    saveData('contractors', updatedContractors);
    setIsFormOpen(false);
    setSelectedContractor(null);
  };

  const handleDeleteContractor = (id: string) => {
    const updatedContractors = contractors.filter((contractor) => contractor.id !== id);
    setContractors(updatedContractors);
    saveData('contractors', updatedContractors);
  };

  const handleEditContractor = (contractor: Contractor) => {
    setSelectedContractor(contractor);
    setIsFormOpen(true);
  };

  const handleOpenForm = () => {
    setSelectedContractor(null);
    setIsFormOpen(true);
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Contratantes</h2>
        <div className="flex items-center space-x-2">
          <Button onClick={handleOpenForm}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Adicionar Contratante
          </Button>
        </div>
      </div>

      <div className="mt-8">
        <ContractorList 
            contractors={contractors} 
            onEdit={handleEditContractor}
            onDelete={handleDeleteContractor}
        />
      </div>

      {isFormOpen && (
        <ContractorForm
          isOpen={isFormOpen}
          onClose={() => {
            setIsFormOpen(false);
            setSelectedContractor(null);
          }}
          onSave={handleSaveContractor}
          contractor={selectedContractor}
        />
      )}
    </div>
  );
};

export default ContractorsPage;
