import { useEffect, useState } from 'react';

/**
 * Feature Flag Hook
 *
 * Enables gradual rollout of new features with instant rollback capability.
 * Supports both environment variables and localStorage for flexible control.
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const useMaterialM = useFeatureFlag('MATERIALM');
 *
 *   return useMaterialM ? <NewDesign /> : <LegacyDesign />;
 * }
 * ```
 *
 * @example
 * ```bash
 * # Enable via environment variable
 * VITE_USE_MATERIALM=true pnpm dev
 *
 * # Enable via browser console
 * localStorage.setItem('feature_MATERIALM', 'true')
 * location.reload()
 *
 * # Disable
 * localStorage.setItem('feature_MATERIALM', 'false')
 * location.reload()
 * ```
 */
export function useFeatureFlag(flag: string): boolean {
  const [enabled, setEnabled] = useState(() => {
    // Check environment variable first (build-time)
    const envVar = import.meta.env[`VITE_USE_${flag}`];
    if (envVar === 'true' || envVar === true) {
      return true;
    }

    // Check localStorage second (runtime override)
    const localValue = localStorage.getItem(`feature_${flag}`);
    if (localValue === 'true') {
      return true;
    }

    // Check for explicit disable
    if (localValue === 'false') {
      return false;
    }

    // DEFAULT: Enable MaterialM for all users (no gradual rollout needed)
    // Since there are no real users, MaterialM is the default
    if (flag === 'MATERIALM') {
      return true;
    }

    return false;
  });

  // Listen for storage events (sync across tabs)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === `feature_${flag}`) {
        setEnabled(e.newValue === 'true');
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [flag]);

  return enabled;
}

/**
 * Feature Flag Hook with Toggle Function
 *
 * Use this when you need to programmatically toggle the flag.
 *
 * @example
 * ```tsx
 * function FeatureToggle() {
 *   const [useMaterialM, toggleMaterialM] = useFeatureFlagWithToggle('MATERIALM');
 *
 *   return (
 *     <button onClick={toggleMaterialM}>
 *       {useMaterialM ? 'Disable' : 'Enable'} MaterialM
 *     </button>
 *   );
 * }
 * ```
 */
export function useFeatureFlagWithToggle(flag: string): [boolean, () => void] {
  const enabled = useFeatureFlag(flag);

  const toggle = () => {
    const newValue = !enabled;
    localStorage.setItem(`feature_${flag}`, String(newValue));

    // Trigger storage event manually (doesn't fire in same tab)
    window.dispatchEvent(
      new StorageEvent('storage', {
        key: `feature_${flag}`,
        newValue: String(newValue),
        oldValue: String(enabled),
      })
    );
  };

  return [enabled, toggle];
}

/**
 * Percentage-Based Rollout Hook
 *
 * Enables gradual rollout by percentage (e.g., 10%, 25%, 50%, 100%).
 * Uses deterministic hash to ensure same user always gets same experience.
 *
 * @example
 * ```bash
 * # Vercel environment variable
 * VITE_MATERIALM_ROLLOUT=25  # 25% of users see MaterialM
 * ```
 *
 * @example
 * ```tsx
 * function App() {
 *   const useMaterialM = useRolloutFlag('MATERIALM', userId);
 *
 *   // Admin override via localStorage still works
 *   // localStorage.setItem('feature_MATERIALM', 'true')
 * }
 * ```
 */
export function useRolloutFlag(flag: string, userId: string): boolean {
  const [enabled, setEnabled] = useState(() => {
    // Admin override via localStorage
    const localValue = localStorage.getItem(`feature_${flag}`);
    if (localValue === 'true') {
      return true;
    }
    if (localValue === 'false') {
      return false;
    }

    // Check rollout percentage from environment
    const rolloutPercentage = Number(import.meta.env[`VITE_${flag}_ROLLOUT`]) || 0;

    if (rolloutPercentage === 0) {
      return false;
    }

    if (rolloutPercentage >= 100) {
      return true;
    }

    // Deterministic hash (same user always gets same result)
    const hash = userId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return (hash % 100) < rolloutPercentage;
  });

  // Listen for storage events (admin override changes)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === `feature_${flag}`) {
        if (e.newValue === 'true') {
          setEnabled(true);
        } else if (e.newValue === 'false') {
          setEnabled(false);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [flag]);

  return enabled;
}

/**
 * Check if Feature Flag is Enabled (Non-Hook Version)
 *
 * Use this in non-component code (utils, services, etc.)
 *
 * @example
 * ```ts
 * if (isFeatureEnabled('MATERIALM')) {
 *   // Use MaterialM colors
 * } else {
 *   // Use legacy colors
 * }
 * ```
 */
export function isFeatureEnabled(flag: string): boolean {
  // Check localStorage first (runtime override)
  const localValue = localStorage.getItem(`feature_${flag}`);
  if (localValue === 'true') {
    return true;
  }
  if (localValue === 'false') {
    return false;
  }

  // Check environment variable
  const envVar = import.meta.env[`VITE_USE_${flag}`];
  return envVar === 'true' || envVar === true;
}
