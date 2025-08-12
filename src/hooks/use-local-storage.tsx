
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';

function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  const { user } = useAuth();
  const userKey = user ? `${key}_${user.id}` : key;

  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined' || !user) {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(userKey);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value: T) => {
    if (!user) return;
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(userKey, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(error);
    }
  };
  
  useEffect(() => {
    if (user) {
        const item = window.localStorage.getItem(userKey);
        setStoredValue(item ? JSON.parse(item) : initialValue);
    } else {
        setStoredValue(initialValue);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, userKey]);


  return [storedValue, setValue];
}

export default useLocalStorage;
