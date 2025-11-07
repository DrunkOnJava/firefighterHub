/**
 * useReducedMotion Hook
 * 
 * Detects user's motion preference via prefers-reduced-motion media query.
 * Returns true if user prefers reduced motion (accessibility preference).
 * 
 * Usage:
 * ```tsx
 * const prefersReducedMotion = useReducedMotion();
 * 
 * return (
 *   <div
 *     className={prefersReducedMotion ? 'no-animation' : 'with-animation'}
 *   >
 *     Content
 *   </div>
 * );
 * ```
 */

import { useEffect, useState } from 'react';

export function useReducedMotion(): boolean {
  // Check if user has preference set via localStorage (user override)
  const getStoredPreference = (): boolean | null => {
    if (typeof window === 'undefined') return null;
    const stored = localStorage.getItem('prefers-reduced-motion');
    return stored ? stored === 'true' : null;
  };

  // Get initial value from media query
  const getMediaQueryPreference = (): boolean => {
    if (typeof window === 'undefined') return false;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    return mediaQuery.matches;
  };

  // Priority: localStorage > media query > false
  const getInitialValue = (): boolean => {
    const stored = getStoredPreference();
    if (stored !== null) return stored;
    return getMediaQueryPreference();
  };

  const [prefersReducedMotion, setPrefersReducedMotion] = useState(getInitialValue);

  useEffect(() => {
    // Don't set up listener if user has explicit override
    if (getStoredPreference() !== null) return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    // Update state when media query changes
    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handleChange);
    }

    // Cleanup
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      } else {
        mediaQuery.removeListener(handleChange);
      }
    };
  }, []);

  return prefersReducedMotion;
}

/**
 * Hook to set user preference override
 * Useful for accessibility settings panel
 */
export function useReducedMotionPreference() {
  const prefersReducedMotion = useReducedMotion();

  const setPreference = (value: boolean | null) => {
    if (value === null) {
      localStorage.removeItem('prefers-reduced-motion');
    } else {
      localStorage.setItem('prefers-reduced-motion', String(value));
    }
    // Force page reload to apply new preference
    window.location.reload();
  };

  return {
    prefersReducedMotion,
    setPreference,
    isUserOverride: localStorage.getItem('prefers-reduced-motion') !== null,
  };
}
