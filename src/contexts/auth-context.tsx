
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface AuthContextType {
  user: string | null;
  login: (username: string, pass: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user database
const users = new Map<string, { id: string, pass: string }>();
users.set('produtor1', { id: 'user1', pass: 'senha1' });
users.set('produtor2', { id: 'user2', pass: 'senha2' });


export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
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

  const logout = () => {
    localStorage.removeItem('userId');
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
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
