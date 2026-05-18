import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Hook for managing AsyncStorage with state synchronization
 */
export function useAsyncStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(initialValue ?? null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStoredValue = async () => {
      try {
        const item = await AsyncStorage.getItem(key);
        if (item !== null) {
          setStoredValue(JSON.parse(item));
        } else if (initialValue !== undefined) {
          setStoredValue(initialValue);
        }
      } catch (error) {
        console.error(`Error loading ${key} from AsyncStorage:`, error);
        if (initialValue !== undefined) {
          setStoredValue(initialValue);
        }
      } finally {
        setIsLoading(false);
      }
    };

    void loadStoredValue();
  }, [key, initialValue]);

  const setValue = useCallback(
    async (value) => {
      try {
        setStoredValue(value);
        if (value === null) {
          await AsyncStorage.removeItem(key);
        } else {
          await AsyncStorage.setItem(key, JSON.stringify(value));
        }
      } catch (error) {
        console.error(`Error setting ${key} in AsyncStorage:`, error);
        throw error;
      }
    },
    [key],
  );

  const removeValue = useCallback(async () => {
    try {
      setStoredValue(null);
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing ${key} from AsyncStorage:`, error);
      throw error;
    }
  }, [key]);

  return [storedValue, setValue, removeValue, isLoading];
}
