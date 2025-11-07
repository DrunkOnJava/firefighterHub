/**
 * useStaggerAnimation Hook
 * 
 * Provides stagger animation utilities for list items.
 */

import { useReducedMotion } from './useReducedMotion';
import { useCallback, useMemo } from 'react';

interface StaggerAnimationOptions {
  baseDelay?: number;
  maxDelay?: number;
  animationDuration?: number;
  animationType?: 'fadeIn' | 'slideUp' | 'slideDown' | 'slideLeft' | 'slideRight' | 'scale';
}

export function useStaggerAnimation({
  baseDelay = 50,
  maxDelay = 500,
  animationDuration = 200,
  animationType = 'fadeIn',
}: StaggerAnimationOptions = {}) {
  const prefersReducedMotion = useReducedMotion();

  const getStaggerDelay = useCallback(
    (index: number): number => {
      if (prefersReducedMotion) return 0;
      return Math.min(index * baseDelay, maxDelay);
    },
    [baseDelay, maxDelay, prefersReducedMotion]
  );

  const getStaggerStyle = useCallback(
    (index: number): React.CSSProperties => {
      if (prefersReducedMotion) return {};

      const delay = getStaggerDelay(index);
      return {
        animationDelay: `${delay}ms`,
        animationDuration: `${animationDuration}ms`,
        animationFillMode: 'both',
      };
    },
    [getStaggerDelay, animationDuration, prefersReducedMotion]
  );

  const animationClassMap = useMemo(
    () => ({
      fadeIn: 'animate-fade-in',
      slideUp: 'animate-slide-in-up',
      slideDown: 'animate-slide-in-down',
      slideLeft: 'animate-slide-in-left',
      slideRight: 'animate-slide-in-right',
      scale: 'animate-scale-in',
    }),
    []
  );

  const staggerClass = useMemo(() => {
    if (prefersReducedMotion) return '';
    return animationClassMap[animationType];
  }, [animationType, animationClassMap, prefersReducedMotion]);

  const getStaggerClass = useCallback(
    (index: number): string => {
      if (prefersReducedMotion) return '';
      return `${staggerClass} stagger-item-${index}`;
    },
    [staggerClass, prefersReducedMotion]
  );

  return {
    getStaggerDelay,
    getStaggerStyle,
    getStaggerClass,
    staggerClass,
    prefersReducedMotion,
  };
}

export function useListStagger<T>({
  items,
  keyExtractor = (_:T, index:number) => index,
  ...staggerOptions
}: {
  items: T[];
  keyExtractor?: (item: T, index: number) => string | number;
} & StaggerAnimationOptions) {
  const stagger = useStaggerAnimation(staggerOptions);

  const getItemProps = useCallback(
    (item: T, index: number) => ({
      key: keyExtractor(item, index),
      className: stagger.staggerClass,
      style: stagger.getStaggerStyle(index),
    }),
    [stagger, keyExtractor]
  );

  return {
    ...stagger,
    getItemProps,
    itemCount: items.length,
  };
}
