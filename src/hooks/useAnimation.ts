/**
 * useAnimation Hook
 * 
 * Centralized animation hook that respects user motion preferences.
 * Provides utilities for managing animations with cleanup and performance monitoring.
 * 
 * Usage:
 * ```tsx
 * const { animate, prefersReducedMotion } = useAnimation();
 * 
 * const handleClick = () => {
 *   animate({
 *     element: buttonRef.current,
 *     keyframes: [
 *       { transform: 'scale(1)' },
 *       { transform: 'scale(0.95)' },
 *       { transform: 'scale(1)' },
 *     ],
 *     duration: 150,
 *   });
 * };
 * ```
 */

import { useEffect, useRef, useCallback, useState } from 'react';
import { useReducedMotion } from './useReducedMotion';
import { monitorAnimationPerformance } from '@/utils/performanceMonitor';

interface AnimationOptions {
  element: HTMLElement | null;
  keyframes: Keyframe[];
  duration?: number;
  easing?: string;
  fill?: FillMode;
  delay?: number;
  iterations?: number;
  onComplete?: () => void;
  name?: string; // For performance monitoring
}

export function useAnimation() {
  const prefersReducedMotion = useReducedMotion();
  const animationsRef = useRef<Animation[]>([]);

  // Clean up all running animations on unmount
  useEffect(() => {
    return () => {
      animationsRef.current.forEach(anim => {
        anim.cancel();
      });
      animationsRef.current = [];
    };
  }, []);

  const animate = useCallback(
    ({
      element,
      keyframes,
      duration = 200,
      easing = 'ease-out',
      fill = 'forwards',
      delay = 0,
      iterations = 1,
      onComplete,
      name = 'unnamed-animation',
    }: AnimationOptions): Animation | null => {
      if (!element) return null;

      // If user prefers reduced motion, skip to end state instantly
      if (prefersReducedMotion) {
        if (keyframes.length > 0) {
          const finalState = keyframes[keyframes.length - 1];
          Object.assign(element.style, finalState);
        }
        onComplete?.();
        return null;
      }

      // Monitor performance
      const stopMonitoring = monitorAnimationPerformance(name);

      // Create Web Animation
      const animation = element.animate(keyframes, {
        duration,
        easing,
        fill,
        delay,
        iterations,
      });

      // Store reference for cleanup
      animationsRef.current.push(animation);

      // Handle completion
      animation.onfinish = () => {
        stopMonitoring();
        onComplete?.();
        
        // Remove from active animations
        const index = animationsRef.current.indexOf(animation);
        if (index > -1) {
          animationsRef.current.splice(index, 1);
        }
      };

      return animation;
    },
    [prefersReducedMotion]
  );

  const cancelAll = useCallback(() => {
    animationsRef.current.forEach(anim => anim.cancel());
    animationsRef.current = [];
  }, []);

  return {
    animate,
    cancelAll,
    prefersReducedMotion,
  };
}

/**
 * Hook for CSS class-based animations (simpler alternative)
 */
export function useAnimationClass(baseClass: string) {
  const prefersReducedMotion = useReducedMotion();
  const [animationClass, setAnimationClass] = useState('');

  const trigger = useCallback(
    (variant: string, duration: number = 200) => {
      if (prefersReducedMotion) {
        // Apply final state class without animation
        setAnimationClass(`${baseClass}-${variant}-final`);
        return;
      }

      setAnimationClass(`${baseClass}-${variant}`);

      // Reset after animation completes
      const timer = setTimeout(() => {
        setAnimationClass('');
      }, duration);

      return () => clearTimeout(timer);
    },
    [baseClass, prefersReducedMotion]
  );

  return { animationClass, trigger, prefersReducedMotion };
}
