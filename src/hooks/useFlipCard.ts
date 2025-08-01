import { useState, useCallback } from 'react';

export const useFlipCard = (initialState: boolean = false) => {
  const [isFlipped, setIsFlipped] = useState(initialState);

  const flip = useCallback(() => {
    setIsFlipped(prev => !prev);
  }, []);

  const setFlipped = useCallback((value: boolean) => {
    setIsFlipped(value);
  }, []);

  const reset = useCallback(() => {
    setIsFlipped(false);
  }, []);

  return {
    isFlipped,
    flip,
    setFlipped,
    reset
  };
}; 