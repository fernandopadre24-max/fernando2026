
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { User, UserRole } from '@/types';

interface AuthContextType {
  user: User | null;
  login: (username: string, pass: string) => Promise<void>;
  logout: () => void;
  signup: (username: string, pass: string, confirmPass: string) => Promise<void>;
  getAllUsers: () => User[];
  updateUserPassword: (userId: string, newPass: string) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
  deleteCurrentUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user database - in a real app, this would be a server-side database.
// For this simulation, we load/save the user list from/to localStorage.
const loadUsers = (): Map<string, User> => {
    if (typeof window === 'undefined') {
        return new Map();
    }
    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
        try {
            // Filter out any null/undefined entries that might have been saved.
            const parsed = JSON.parse(storedUsers) as [string, User][];
            const validEntries = parsed.filter(([key, value]) => key && value);
            return new Map(validEntries);
        } catch (e) {
            // If parsing fails, fall back to default.
            console.error("Failed to parse users from localStorage", e);
        }
    }
    
    // If no users, create a default admin user
    const adminUser: User = { id: 'user-admin-0', username: 'admin', pass: 'admin', role: 'admin' };
    const defaultUsers = new Map<string, User>();
    defaultUsers.set('admin', adminUser);
    saveUsers(defaultUsers); // Save it so it persists
    return defaultUsers;
}

const saveUsers = (users: Map<string, User>) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('users', JSON.stringify(Array.from(users.entries())));
    }
}

let users = loadUsers();


export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    users = loadUsers(); // Ensure users are loaded on client side
    const checkUser = () => {
      const storedUserId = localStorage.getItem('userId');
      if (storedUserId) {
        const currentUser = Array.from(users.values()).find(u => u && u.id === storedUserId);
        setUser(currentUser || null);
        if(pathname === '/login') {
            router.push('/');
        }
      } else {
        if (pathname !== '/login') {
            router.push('/login');
        }
      }
    };
    checkUser();
  }, [pathname, router]);

  const login = async (username: string, pass: string): Promise<void> => {
    const userData = users.get(username);
    if (userData && userData.pass === pass) {
      localStorage.setItem('userId', userData.id);
      setUser(userData);
      router.push('/');
    } else {
      throw new Error('Usuário ou senha inválidos.');
    }
  };

  const signup = async (username: string, pass: string, confirmPass: string): Promise<void> => {
     if (pass !== confirmPass) {
        throw new Error("As senhas não coincidem.");
    }
    if (users.has(username)) {
        throw new Error("Este nome de usuário já está em uso.");
    }

    const newUserId = `user-${Date.now()}`;
    const role: UserRole = username.toLowerCase() === 'admin' && users.size === 0 ? 'admin' : 'user';

    const newUser: User = {
        id: newUserId,
        username,
        pass,
        role
    };

    users.set(username, newUser);
    saveUsers(users);
    
    // Automatically log in the new user
    await login(username, pass);
  };

  const logout = () => {
    localStorage.removeItem('userId');
    setUser(null);
    router.push('/login');
  };

  const getAllUsers = (): User[] => {
    return Array.from(users.values());
  };

  const updateUserPassword = async (userId: string, newPass: string): Promise<void> => {
    if (user?.role !== 'admin') {
      throw new Error("Apenas administradores podem alterar senhas.");
    }
    let userToUpdate: User | undefined;
    for (const u of users.values()) {
        if (u.id === userId) {
            userToUpdate = u;
            break;
        }
    }

    if (userToUpdate) {
        userToUpdate.pass = newPass;
        users.set(userToUpdate.username, userToUpdate);
        saveUsers(users);
    } else {
        throw new Error("Usuário não encontrado.");
    }
  }

  const deleteUser = async (userId: string): Promise<void> => {
     if (user?.role !== 'admin') {
      throw new Error("Apenas administradores podem excluir usuários.");
    }
     if (user?.id === userId) {
        throw new Error("Você não pode excluir sua própria conta.");
    }

    const userToDelete = Array.from(users.values()).find(u => u.id === userId);

    if (userToDelete) {
        // Delete user data. The key format is `${userId}_${key}`
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith(`${userToDelete.id}_`)) {
                localStorage.removeItem(key);
            }
        });
        users.delete(userToDelete.username);
        saveUsers(users);
    } else {
        throw new Error("Usuário não encontrado.");
    }
  }

  const deleteCurrentUser = async (): Promise<void> => {
    if (!user) {
        throw new Error("Nenhum usuário logado.");
    }
    
    // Check if the user is the only admin
    const adminUsers = Array.from(users.values()).filter(u => u.role === 'admin');
    if (user.role === 'admin' && adminUsers.length === 1) {
      throw new Error("Não é possível excluir o único administrador do sistema.");
    }

    // Delete user data. The key format is `${userId}_${key}`
     Object.keys(localStorage).forEach(key => {
        if (key.startsWith(`${user.id}_`)) {
            localStorage.removeItem(key);
        }
     });

    // Delete user from user list
    users.delete(user.username);
    saveUsers(users);

    // Logout
    logout();
  }


  return (
    <AuthContext.Provider value={{ user, login, logout, signup, getAllUsers, updateUserPassword, deleteUser, deleteCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
