'use client';

import { useState, useEffect } from 'react';

/**
 * Custom hook for safely working with localStorage
 * Handles hydration issues by only accessing localStorage on the client
 * 
 * @param key - The localStorage key
 * @param initialValue - The initial value to use if no value is in localStorage
 * @returns [storedValue, setValue] - The current value and a function to update it
 */
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  // State to store our value
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize on mount only (client-side only)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    try {
      const item = window.localStorage.getItem(key);
      const value = item ? JSON.parse(item) : initialValue;
      setStoredValue(value);
      setIsInitialized(true);
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      setStoredValue(initialValue);
      setIsInitialized(true);
    }
  }, [key, initialValue]);

  // Return a wrapped version of useState's setter function
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function to match useState behavior
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      
      // Save state
      setStoredValue(valueToStore);
      
      // Save to localStorage (client-side only)
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
}

/**
 * A simpler version that only reads from localStorage once on mount
 * Useful for values that don't need to be tracked across components
 */
export function readFromLocalStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') {
    return defaultValue;
  }
  
  try {
    const item = window.localStorage.getItem(key);
    return item ? (JSON.parse(item) as T) : defaultValue;
  } catch (error) {
    console.error(`Error reading localStorage key "${key}":`, error);
    return defaultValue;
  }
}

/**
 * A simple wrapper for writing to localStorage
 * Useful when you don't need to track the value as state
 */
export function writeToLocalStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error writing to localStorage key "${key}":`, error);
  }
}
