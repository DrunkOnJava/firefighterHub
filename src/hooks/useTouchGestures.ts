/**
 * Touch Gesture Hooks
 * 
 * Provides swipe, long-press, and pull-to-refresh detection for mobile interfaces.
 * Respects prefers-reduced-motion for accessibility.
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { useDevice } from './useDevice';

export interface SwipeGestureOptions {
  /** Minimum swipe distance in pixels */
  minDistance?: number;
  /** Maximum time for swipe in milliseconds */
  maxTime?: number;
  /** Callback when swipe detected */
  onSwipe?: (direction: 'left' | 'right' | 'up' | 'down') => void;
  /** Callback during swipe */
  onSwiping?: (deltaX: number, deltaY: number) => void;
}

export interface LongPressOptions {
  /** Time in milliseconds to trigger long press */
  delay?: number;
  /** Callback when long press detected */
  onLongPress?: () => void;
}

export interface PullToRefreshOptions {
  /** Threshold distance to trigger refresh */
  threshold?: number;
  /** Callback when refresh triggered */
  onRefresh?: () => Promise<void>;
}

/**
 * Hook for detecting swipe gestures
 */
export function useSwipeGesture(
  elementRef: React.RefObject<HTMLElement>,
  options: SwipeGestureOptions = {}
) {
  const {
    minDistance = 50,
    maxTime = 300,
    onSwipe,
    onSwiping,
  } = options;

  const device = useDevice();
  const touchStart = useRef<{ x: number; y: number; time: number } | null>(null);

  useEffect(() => {
    if (!device.hasTouch || device.prefersReducedMotion) return;

    const element = elementRef.current;
    if (!element) return;

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      touchStart.current = {
        x: touch.clientX,
        y: touch.clientY,
        time: Date.now(),
      };
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!touchStart.current || !onSwiping) return;

      const touch = e.touches[0];
      const deltaX = touch.clientX - touchStart.current.x;
      const deltaY = touch.clientY - touchStart.current.y;

      onSwiping(deltaX, deltaY);
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!touchStart.current || !onSwipe) return;

      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - touchStart.current.x;
      const deltaY = touch.clientY - touchStart.current.y;
      const deltaTime = Date.now() - touchStart.current.time;

      if (deltaTime > maxTime) {
        touchStart.current = null;
        return;
      }

      const absX = Math.abs(deltaX);
      const absY = Math.abs(deltaY);

      if (absX < minDistance && absY < minDistance) {
        touchStart.current = null;
        return;
      }

      if (absX > absY) {
        onSwipe(deltaX > 0 ? 'right' : 'left');
      } else {
        onSwipe(deltaY > 0 ? 'down' : 'up');
      }

      touchStart.current = null;
    };

    element.addEventListener('touchstart', handleTouchStart, { passive: true });
    element.addEventListener('touchmove', handleTouchMove, { passive: true });
    element.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [elementRef, minDistance, maxTime, onSwipe, onSwiping, device.hasTouch, device.prefersReducedMotion]);
}

/**
 * Hook for detecting long press gestures
 */
export function useLongPress(
  elementRef: React.RefObject<HTMLElement>,
  options: LongPressOptions = {}
) {
  const { delay = 500, onLongPress } = options;
  const device = useDevice();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!device.hasTouch) return;

    const element = elementRef.current;
    if (!element) return;

    const handleTouchStart = () => {
      timerRef.current = setTimeout(() => {
        if (onLongPress) {
          // Haptic feedback if supported
          if ('vibrate' in navigator) {
            navigator.vibrate(50);
          }
          onLongPress();
        }
      }, delay);
    };

    const handleTouchEnd = () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };

    element.addEventListener('touchstart', handleTouchStart, { passive: true });
    element.addEventListener('touchend', handleTouchEnd, { passive: true });
    element.addEventListener('touchcancel', handleTouchEnd, { passive: true });

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchend', handleTouchEnd);
      element.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, [elementRef, delay, onLongPress, device.hasTouch]);
}

/**
 * Hook for pull-to-refresh functionality
 */
export function usePullToRefresh(
  scrollContainerRef: React.RefObject<HTMLElement>,
  options: PullToRefreshOptions = {}
) {
  const { threshold = 80, onRefresh } = options;
  const device = useDevice();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);

  const touchStart = useRef<{ y: number; scrollTop: number } | null>(null);

  useEffect(() => {
    if (!device.hasTouch || !device.isMobile) return;

    const container = scrollContainerRef.current;
    if (!container) return;

    const handleTouchStart = (e: TouchEvent) => {
      if (container.scrollTop === 0) {
        touchStart.current = {
          y: e.touches[0].clientY,
          scrollTop: container.scrollTop,
        };
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!touchStart.current || container.scrollTop > 0) {
        touchStart.current = null;
        setPullDistance(0);
        return;
      }

      const deltaY = e.touches[0].clientY - touchStart.current.y;

      if (deltaY > 0) {
        e.preventDefault();
        setPullDistance(Math.min(deltaY, threshold * 1.5));
      }
    };

    const handleTouchEnd = async () => {
      if (!touchStart.current) return;

      if (pullDistance >= threshold && onRefresh && !isRefreshing) {
        setIsRefreshing(true);
        
        // Haptic feedback
        if ('vibrate' in navigator) {
          navigator.vibrate(30);
        }

        try {
          await onRefresh();
        } finally {
          setIsRefreshing(false);
          setPullDistance(0);
        }
      } else {
        setPullDistance(0);
      }

      touchStart.current = null;
    };

    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [scrollContainerRef, threshold, onRefresh, isRefreshing, pullDistance, device.hasTouch, device.isMobile]);

  return { isRefreshing, pullDistance };
}

/**
 * Hook for haptic feedback on touch interactions
 */
export function useHapticFeedback() {
  const device = useDevice();

  const vibrate = useCallback((pattern: number | number[]) => {
    if (!device.hasTouch || device.prefersReducedMotion) return;
    
    if ('vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  }, [device.hasTouch, device.prefersReducedMotion]);

  return {
    light: () => vibrate(10),
    medium: () => vibrate(20),
    heavy: () => vibrate(40),
    success: () => vibrate([10, 50, 10]),
    error: () => vibrate([50, 100, 50]),
  };
}
