import { useState, useEffect } from 'react';
import { BREAKPOINTS, getDeviceCategory, getOrientation } from '@/config/constants';
import { useMediaQuery } from './useMediaQuery';

export type DeviceType = 'mobile' | 'tablet' | 'desktop' | 'large';
export type OrientationType = 'portrait' | 'landscape';

export interface DeviceInfo {
  /** Current device category based on viewport width */
  type: DeviceType;

  /** Whether device is mobile-sized (< 640px) */
  isMobile: boolean;

  /** Whether device is tablet-sized (640px - 767px) */
  isTablet: boolean;

  /** Whether device is desktop-sized (768px - 1023px) */
  isDesktop: boolean;

  /** Whether device is large desktop (>= 1024px) */
  isLarge: boolean;

  /** Current orientation (portrait/landscape) */
  orientation: OrientationType;

  /** Whether in portrait orientation */
  isPortrait: boolean;

  /** Whether in landscape orientation */
  isLandscape: boolean;

  /** Whether device supports touch */
  hasTouch: boolean;

  /** Whether user prefers reduced motion */
  prefersReducedMotion: boolean;

  /** Current viewport width in pixels */
  width: number;

  /** Current viewport height in pixels */
  height: number;
}

/**
 * Comprehensive device detection hook for responsive behavior
 *
 * @returns DeviceInfo object with current device characteristics
 *
 * @example
 * const device = useDevice();
 *
 * if (device.isMobile) {
 *   // Render mobile-optimized UI
 * }
 *
 * if (device.hasTouch) {
 *   // Enable touch gestures
 * }
 *
 * if (device.prefersReducedMotion) {
 *   // Disable animations
 * }
 */
export function useDevice(): DeviceInfo {
  // Media queries
  const isMobileQuery = useMediaQuery(BREAKPOINTS.mobile.query);
  const isTabletQuery = useMediaQuery(BREAKPOINTS.tablet.query);
  const isDesktopQuery = useMediaQuery(BREAKPOINTS.desktop.query);
  const isLargeQuery = useMediaQuery(BREAKPOINTS.large.query);
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  // Viewport dimensions
  const [dimensions, setDimensions] = useState(() => ({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  }));

  // Touch support detection
  const [hasTouch, setHasTouch] = useState(false);

  useEffect(() => {
    // Detect touch support
    const checkTouch = () => {
      return (
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        (navigator as any).msMaxTouchPoints > 0
      );
    };
    setHasTouch(checkTouch());

    // Update dimensions on resize
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Determine device type
  const type = getDeviceCategory();

  // Determine orientation
  const orientation = getOrientation();

  return {
    type,
    isMobile: isMobileQuery,
    isTablet: isTabletQuery,
    isDesktop: isDesktopQuery,
    isLarge: isLargeQuery,
    orientation,
    isPortrait: orientation === 'portrait',
    isLandscape: orientation === 'landscape',
    hasTouch,
    prefersReducedMotion,
    width: dimensions.width,
    height: dimensions.height,
  };
}

/**
 * Hook to detect orientation changes and execute callbacks
 *
 * @param onOrientationChange - Callback when orientation changes
 *
 * @example
 * useOrientationChange((orientation) => {
 *   console.log('Device rotated to:', orientation);
 *   if (orientation === 'landscape') {
 *     // Show landscape-specific UI
 *   }
 * });
 */
export function useOrientationChange(
  onOrientationChange?: (orientation: OrientationType) => void
) {
  const [orientation, setOrientation] = useState<OrientationType>(() => getOrientation());

  useEffect(() => {
    const handleOrientationChange = () => {
      const newOrientation = getOrientation();
      setOrientation(newOrientation);
      onOrientationChange?.(newOrientation);
    };

    // Listen for resize events (orientation change triggers resize)
    window.addEventListener('resize', handleOrientationChange);

    // Modern browsers support orientationchange event
    window.addEventListener('orientationchange', handleOrientationChange);

    return () => {
      window.removeEventListener('resize', handleOrientationChange);
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, [onOrientationChange]);

  return orientation;
}

/**
 * Hook to track if keyboard is open on mobile (iOS specific)
 * Useful for adjusting UI when keyboard appears
 */
export function useKeyboardVisible(): boolean {
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const device = useDevice();

  useEffect(() => {
    if (!device.isMobile) return;

    const handleResize = () => {
      // On mobile, if viewport height shrinks significantly, keyboard is likely open
      const viewportHeight = window.visualViewport?.height || window.innerHeight;
      const screenHeight = window.screen.height;
      const keyboardThreshold = screenHeight * 0.7; // 30% reduction suggests keyboard

      setIsKeyboardVisible(viewportHeight < keyboardThreshold);
    };

    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleResize);
      return () => window.visualViewport?.removeEventListener('resize', handleResize);
    } else {
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, [device.isMobile]);

  return isKeyboardVisible;
}
