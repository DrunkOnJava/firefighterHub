/**
 * SuccessAnimation Component
 * 
 * Animated checkmark with bounce effect for success states.
 * 
 * Usage:
 * ```tsx
 * <SuccessAnimation onComplete={() => console.log('done')} />
 * ```
 */

import { useEffect, useState } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { Check } from 'lucide-react';

interface SuccessAnimationProps {
  size?: number;
  duration?: number;
  onComplete?: () => void;
  showConfetti?: boolean;
  className?: string;
}

export function SuccessAnimation({
  size = 80,
  duration = 600,
  onComplete,
  className = '',
}: SuccessAnimationProps) {
  const prefersReducedMotion = useReducedMotion();
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onComplete?.();
    }, duration + 500);

    return () => clearTimeout(timer);
  }, [duration, onComplete]);

  if (!isVisible) return null;

  return (
    <div
      className={`
        flex items-center justify-center
        ${className}
      `}
      style={{ width: size, height: size }}
    >
      <div
        className={`
          w-full h-full
          rounded-full
          bg-green-500
          flex items-center justify-center
          ${!prefersReducedMotion ? 'animate-bounce-in' : ''}
        `}
        style={{
          animationDuration: `${duration}ms`,
        }}
      >
        <Check className="w-2/3 h-2/3 text-white stroke-[3]" />
      </div>
    </div>
  );
}

/**
 * SuccessOverlay Component
 * Full-screen success celebration
 */
interface SuccessOverlayProps {
  isOpen: boolean;
  message?: string;
  onClose: () => void;
  showConfetti?: boolean;
  autoClose?: boolean;
  duration?: number;
}

export function SuccessOverlay({
  isOpen,
  message = 'Success!',
  onClose,
  showConfetti = true,
  autoClose = true,
  duration = 2000,
}: SuccessOverlayProps) {
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (!isOpen || !autoClose) return;

    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [isOpen, autoClose, duration, onClose]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className={`
        fixed inset-0 z-[9998]
        bg-black/50 backdrop-blur-sm
        flex items-center justify-center
        ${!prefersReducedMotion ? 'animate-fade-in' : ''}
      `}
      onClick={onClose}
    >
      <div
        className={`
          bg-white dark:bg-slate-800
          rounded-2xl p-8
          flex flex-col items-center gap-4
          shadow-2xl
          ${!prefersReducedMotion ? 'animate-scale-in' : ''}
        `}
        onClick={(e) => e.stopPropagation()}
      >
        <SuccessAnimation size={100} />
        
        {message && (
          <p className="text-xl font-semibold text-slate-900 dark:text-white">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
