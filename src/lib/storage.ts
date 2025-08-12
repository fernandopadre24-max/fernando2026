
'use client';

export const saveData = <T>(key: string, data: T): void => {
  if (typeof window !== 'undefined') {
    try {
      const serializedData = JSON.stringify(data);
      localStorage.setItem(key, serializedData);
    } catch (error) {
      console.error(`Error saving data to localStorage for key: ${key}`, error);
    }
  }
};

export const loadData = <T>(key: string, defaultValue: T | null = null): T => {
  if (typeof window !== 'undefined') {
    try {
      const serializedData = localStorage.getItem(key);
      if (serializedData === null) {
        return defaultValue as T;
      }
      return JSON.parse(serializedData);
    } catch (error) {
      console.error(`Error loading data from localStorage for key: ${key}`, error);
      return defaultValue as T;
    }
  }
  return defaultValue as T;
};
