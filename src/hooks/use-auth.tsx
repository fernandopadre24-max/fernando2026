
'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { User } from '@/types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (username: string, password_provided: string) => boolean;
  logout: () => void;
  register: (username: string, password_provided: string) => boolean;
  getUserData: (key: string) => any;
  saveUserData: (key: string, data: any) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = (username: string, password_provided: string): boolean => {
    const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
    const foundUser = users.find(u => u.username === username && u.password === password_provided);

    if (foundUser) {
      const userToStore = { id: foundUser.id, username: foundUser.username };
      localStorage.setItem('currentUser', JSON.stringify(userToStore));
      setUser(userToStore);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem('currentUser');
    setUser(null);
    router.push('/login');
  };

  const register = (username: string, password_provided: string): boolean => {
    const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
    const userExists = users.some(u => u.username === username);

    if (userExists) {
      return false;
    }

    const newUser: User = {
      id: crypto.randomUUID(),
      username,
      password: password_provided,
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    return true;
  };

  const getUserData = useCallback((key: string) => {
    if (!user) return null;
    const dataKey = `${key}_${user.username}`;
    const data = localStorage.getItem(dataKey);
    return data ? JSON.parse(data) : null;
  }, [user]);

  const saveUserData = useCallback((key: string, data: any) => {
    if (!user) return;
    const dataKey = `${key}_${user.username}`;
    localStorage.setItem(dataKey, JSON.stringify(data));
  }, [user]);


  const value = { user, isLoading, login, logout, register, getUserData, saveUserData };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
