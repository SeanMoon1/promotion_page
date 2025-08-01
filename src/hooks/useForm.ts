import { useState, useCallback } from 'react';

export const useForm = <T extends Record<string, any>>(initialState: T) => {
  const [values, setValues] = useState<T>(initialState);

  const handleChange = useCallback((field: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleInputChange = useCallback((field: keyof T) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setValues(prev => ({ ...prev, [field]: e.target.value }));
  }, []);

  const reset = useCallback(() => {
    setValues(initialState);
  }, [initialState]);

  const setValue = useCallback((field: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [field]: value }));
  }, []);

  return {
    values,
    handleChange,
    handleInputChange,
    reset,
    setValue,
    setValues
  };
}; 