/**
 * useCelebration Hook
 * 
 * Centralized celebration management with confetti, success animations, and haptic feedback.
 * 
 * Usage:
 * ```tsx
 * const { celebrate, isPlaying } = useCelebration();
 * 
 * celebrate('success', { message: 'Hold completed!' });
 * ```
 */

import { useState, useCallback } from 'react';
import { useReducedMotion } from './useReducedMotion';

export type CelebrationType = 'success' | 'confetti' | 'checkmark';

interface CelebrationOptions {
  message?: string;
  confetti?: boolean;
  haptic?: boolean;
  duration?: number;
  onComplete?: () => void;
}

export function useCelebration() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeType, setActiveType] = useState<CelebrationType | null>(null);
  const prefersReducedMotion = useReducedMotion();

  const triggerHaptic = useCallback(() => {
    // Vibration API for haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate([50, 100, 50]);
    }
  }, []);

  const celebrate = useCallback(
    (type: CelebrationType, options: CelebrationOptions = {}) => {
      if (isPlaying) return; // Prevent overlapping celebrations

      setIsPlaying(true);
      setActiveType(type);

      // Trigger haptic feedback if requested
      if (options.haptic && !prefersReducedMotion) {
        triggerHaptic();
      }

      // Auto-complete after duration
      const duration = options.duration || 2000;
      const timer = setTimeout(() => {
        setIsPlaying(false);
        setActiveType(null);
        options.onComplete?.();
      }, duration);

      return () => clearTimeout(timer);
    },
    [isPlaying, prefersReducedMotion, triggerHaptic]
  );

  const dismiss = useCallback(() => {
    setIsPlaying(false);
    setActiveType(null);
  }, []);

  return {
    celebrate,
    dismiss,
    isPlaying,
    activeType,
  };
}
