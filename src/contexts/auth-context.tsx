
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface AuthContextType {
  user: string | null;
  login: (username: string, pass: string) => void;
  logout: () => void;
  signup: (username: string, pass: string, confirmPass: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user database - in a real app, this would be a server-side database.
// For this simulation, we load/save the user list from/to localStorage.
const loadUsers = (): Map<string, { id: string, pass: string }> => {
    if (typeof window === 'undefined') {
        return new Map([
            ['produtor1', { id: 'user1', pass: 'senha1' }],
            ['produtor2', { id: 'user2', pass: 'senha2' }]
        ]);
    }
    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
        return new Map(JSON.parse(storedUsers));
    }
    return new Map([
        ['produtor1', { id: 'user1', pass: 'senha1' }],
        ['produtor2', { id: 'user2', pass: 'senha2' }]
    ]);
}

const saveUsers = (users: Map<string, { id: string, pass: string }>) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('users', JSON.stringify(Array.from(users.entries())));
    }
}

let users = loadUsers();


export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    users = loadUsers(); // Ensure users are loaded on client side
    const checkUser = () => {
      const storedUserId = localStorage.getItem('userId');
      if (storedUserId) {
        setUser(storedUserId);
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

  const login = (username: string, pass: string) => {
    const userData = users.get(username);
    if (userData && userData.pass === pass) {
      localStorage.setItem('userId', userData.id);
      setUser(userData.id);
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

    const newUserId = `user${users.size + 1}`;
    users.set(username, { id: newUserId, pass: pass });
    saveUsers(users);
    
    // Automatically log in the new user
    login(username, pass);
  };

  const logout = () => {
    localStorage.removeItem('userId');
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, signup }}>
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
