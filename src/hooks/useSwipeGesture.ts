/**
 * Swipe Gesture Hook
 * 
 * Detects horizontal swipe gestures (left/right) on touch devices.
 * Only triggers swipe if horizontal movement exceeds vertical movement.
 */

import { useRef } from 'react';

interface SwipeGestureOptions {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  minDistance?: number; // Minimum distance in pixels to trigger swipe (default: 50)
}

interface TouchPosition {
  x: number;
  y: number;
}

export function useSwipeGesture(
  onSwipeLeft?: () => void,
  onSwipeRight?: () => void,
  minDistance: number = 50
) {
  const touchStart = useRef<TouchPosition>({ x: 0, y: 0 });

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStart.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const deltaX = e.changedTouches[0].clientX - touchStart.current.x;
    const deltaY = e.changedTouches[0].clientY - touchStart.current.y;

    // Only swipe if horizontal movement > vertical movement
    // This prevents triggering swipe during vertical scrolling
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minDistance) {
      if (deltaX < 0 && onSwipeLeft) {
        onSwipeLeft();
      } else if (deltaX > 0 && onSwipeRight) {
        onSwipeRight();
      }
    }
  };

  return {
    handleTouchStart,
    handleTouchEnd,
  };
}

/**
 * Alternative hook that returns gesture handlers separately
 * Use when you need more granular control over touch events
 */
export function useSwipeGestureDetailed(options: SwipeGestureOptions) {
  const { onSwipeLeft, onSwipeRight, minDistance = 50 } = options;
  const touchStart = useRef<TouchPosition>({ x: 0, y: 0 });

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStart.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const deltaX = e.changedTouches[0].clientX - touchStart.current.x;
    const deltaY = e.changedTouches[0].clientY - touchStart.current.y;

    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minDistance) {
      if (deltaX < 0 && onSwipeLeft) {
        onSwipeLeft();
      } else if (deltaX > 0 && onSwipeRight) {
        onSwipeRight();
      }
    }
  };

  return {
    handleTouchStart,
    handleTouchEnd,
  };
}
