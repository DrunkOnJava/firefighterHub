import { useState, useCallback } from 'react';

export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  timestamp: number;
}

const MAX_TOASTS = 3; // Maximum number of toasts visible at once
const AUTO_DISMISS_DELAY = 5000; // 5 seconds

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const newToast: Toast = {
      id: `toast-${Date.now()}-${Math.random()}`,
      message,
      type,
      timestamp: Date.now()
    };

    setToasts(prev => {
      // If at max capacity, remove oldest toast
      const updated = prev.length >= MAX_TOASTS ? prev.slice(1) : prev;
      return [...updated, newToast];
    });

    // Auto-dismiss after delay
    setTimeout(() => {
      hideToast(newToast.id);
    }, AUTO_DISMISS_DELAY);
  }, []);

  const hideToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const clearAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  // Legacy compatibility - return the most recent toast
  const toast = toasts.length > 0 ? toasts[toasts.length - 1] : null;

  return {
    toast, // Legacy single toast (most recent)
    toasts, // New: array of all toasts
    showToast,
    hideToast,
    clearAllToasts
  };
}
