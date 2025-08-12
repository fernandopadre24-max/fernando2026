
'use client';

import { useState, useEffect } from 'react';
import { User } from '@/types';
import { useAuth } from '@/contexts/auth-context';
import { useToast } from '@/hooks/use-toast';
import { UserList } from '@/components/users/user-list';
import { UserForm } from '@/components/users/user-form';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"


export default function UsersPage() {
    const { user, getAllUsers, updateUserPassword, deleteUser } = useAuth();
    const { toast } = useToast();
    const [users, setUsers] = useState<User[]>([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<User | null>(null);

    const fetchUsers = () => {
        try {
            setUsers(getAllUsers());
        } catch (error: any) {
            toast({ title: "Erro ao carregar usuários", description: error.message, variant: "destructive" });
        }
    };

    useEffect(() => {
        if (user?.role === 'admin') {
            fetchUsers();
        }
    }, [user]);

    const handleEditUser = (user: User) => {
        setSelectedUser(user);
        setIsFormOpen(true);
    };

    const handleOpenDeleteDialog = (user: User) => {
        setUserToDelete(user);
        setIsDeleteDialogOpen(true);
    }

    const handleCloseForm = () => {
        setSelectedUser(null);
        setIsFormOpen(false);
    };

    const handleSaveChanges = async (userId: string, newPass: string) => {
        try {
            await updateUserPassword(userId, newPass);
            toast({ title: "Sucesso", description: "Senha do usuário atualizada." });
            fetchUsers();
            handleCloseForm();
        } catch (error: any) {
             toast({ title: "Erro ao salvar", description: error.message, variant: "destructive" });
        }
    };

    const handleDeleteUser = async () => {
        if (!userToDelete) return;
        try {
            await deleteUser(userToDelete.id);
            toast({ title: "Sucesso", description: "Usuário excluído." });
            fetchUsers();
            setIsDeleteDialogOpen(false);
            setUserToDelete(null);
        } catch (error: any) {
             toast({ title: "Erro ao excluir", description: error.message, variant: "destructive" });
        }
    };

    if (user?.role !== 'admin') {
        return (
             <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
                <h2 className="text-3xl font-bold tracking-tight">Acesso Negado</h2>
                <p>Você não tem permissão para visualizar esta página.</p>
            </div>
        )
    }


    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Gerenciamento de Usuários</h2>
            </div>
            
            <UserList 
                users={users}
                currentUser={user}
                onEdit={handleEditUser}
                onDelete={handleOpenDeleteDialog}
            />

            {isFormOpen && selectedUser && (
                <UserForm
                    isOpen={isFormOpen}
                    onClose={handleCloseForm}
                    onSave={handleSaveChanges}
                    user={selectedUser}
                />
            )}

            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Esta ação não pode ser desfeita. Isso excluirá permanentemente a conta do usuário
                        <span className="font-bold"> {userToDelete?.username}</span> e todos os seus dados associados.
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setUserToDelete(null)}>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteUser}>Confirmar Exclusão</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>


        </div>
    );
}
