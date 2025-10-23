import { useState, useCallback } from 'react';

export type OperationType =
  | 'add'
  | 'delete'
  | 'update'
  | 'deactivate'
  | 'reactivate'
  | 'transfer'
  | 'completeHold'
  | 'scheduleHold'
  | 'removeHold'
  | 'reorder'
  | 'reset';

interface LoadingState {
  [key: string]: boolean;
}

export function useOperationLoading() {
  const [loadingStates, setLoadingStates] = useState<LoadingState>({});

  const startLoading = useCallback((operation: OperationType, id?: string) => {
    const key = id ? `${operation}-${id}` : operation;
    setLoadingStates(prev => ({ ...prev, [key]: true }));
  }, []);

  const stopLoading = useCallback((operation: OperationType, id?: string) => {
    const key = id ? `${operation}-${id}` : operation;
    setLoadingStates(prev => ({ ...prev, [key]: false }));
  }, []);

  const isLoading = useCallback((operation: OperationType, id?: string) => {
    const key = id ? `${operation}-${id}` : operation;
    return loadingStates[key] || false;
  }, [loadingStates]);

  const clearAll = useCallback(() => {
    setLoadingStates({});
  }, []);

  return {
    startLoading,
    stopLoading,
    isLoading,
    clearAll,
    loadingStates
  };
}
