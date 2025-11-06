/**
 * Minimal, explicit feature flag for MaterialM.
 * - MATERIALM: always ON (no fallback, no env vars, no rollout)
 * - Others: preserve lightweight localStorage overrides
 */
export function useFeatureFlag(flag: string): boolean {
  // MaterialM is always ON - no exceptions, no env vars, no rollout
  if (flag === 'MATERIALM') return true;

  // For other feature flags, check localStorage
  try {
    const v = typeof localStorage !== 'undefined'
      ? localStorage.getItem(`feature_${flag}`)
      : null;
    if (v === 'true') return true;
    if (v === 'false') return false;
  } catch {
    // Ignore access errors (SSR, blocked storage, etc.)
  }

  return false;
}

/**
 * Feature Flag with Toggle (for other features, not MaterialM)
 */
export function useFeatureFlagWithToggle(flag: string): [boolean, () => void] {
  const enabled = useFeatureFlag(flag);

  const toggle = () => {
    const newValue = !enabled;
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(`feature_${flag}`, String(newValue));
        window.location.reload();
      }
    } catch {
      // Ignore
    }
  };

  return [enabled, toggle];
}

/**
 * Check if Feature Flag is Enabled (Non-Hook Version)
 */
export function isFeatureEnabled(flag: string): boolean {
  if (flag === 'MATERIALM') return true;

  try {
    if (typeof localStorage === 'undefined') return false;
    const localValue = localStorage.getItem(`feature_${flag}`);
    return localValue === 'true';
  } catch {
    return false;
  }
}
