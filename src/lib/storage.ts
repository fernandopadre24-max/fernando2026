
'use client';

// Helper function to get the currently logged-in user ID
const getUserId = (): string | null => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('userId');
    }
    return null;
}

export function saveData<T>(key: string, data: T): void {
  const userId = getUserId();
  if (!userId) {
      console.warn("No user logged in, data will not be saved.");
      return;
  }
  const userKey = `${userId}_${key}`;

  if (typeof window !== 'undefined') {
    try {
      const serializedData = JSON.stringify(data);
      localStorage.setItem(userKey, serializedData);
    } catch (error) {
      console.error(`Error saving data to localStorage for key: ${userKey}`, error);
    }
  }
};

export function loadData<T>(key: string, defaultValue: T | null = null): T {
  const userId = getUserId();
  if (!userId) {
      return defaultValue as T;
  }
  const userKey = `${userId}_${key}`;

  if (typeof window !== 'undefined') {
    try {
      const serializedData = localStorage.getItem(userKey);
      if (serializedData === null) {
        return defaultValue as T;
      }
      return JSON.parse(serializedData);
    } catch (error) {
      console.error(`Error loading data from localStorage for key: ${userKey}`, error);
      return defaultValue as T;
    }
  }
  return defaultValue as T;
};
