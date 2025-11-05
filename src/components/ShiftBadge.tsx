/**
 * ShiftBadge - Shift Indicator Component
 *
 * Displays a colored badge for firefighter shifts (A, B, or C).
 * Automatically switches between MaterialM and legacy styling based on feature flag.
 * Maintains WCAG 1.4.1 accessibility with shape indicators.
 *
 * @example
 * ```tsx
 * <ShiftBadge shift="A" />
 * <ShiftBadge shift="B" className="mr-2" />
 * ```
 */

import { useFeatureFlag } from "../hooks/useFeatureFlag";
import { Shift } from "../lib/supabase";
import { ShiftBadgeM3 } from "./m3/BadgeM3";
import { ShiftBadgeLegacy } from "./ShiftBadgeLegacy";

interface ShiftBadgeProps {
  shift: Shift;
  className?: string;
  /**
   * Badge size (only applies to MaterialM version)
   * @default 'sm'
   */
  size?: 'xs' | 'sm' | 'md';
}

/**
 * Shift Badge Component
 *
 * Displays a colored badge indicating the shift (A, B, or C).
 * Includes shape/icon differentiation for color-blind accessibility (WCAG 1.4.1).
 *
 * MaterialM version uses:
 * - Shift A: ● (filled circle) - green
 * - Shift B: ■ (filled square) - red
 * - Shift C: ◆ (filled diamond) - blue
 *
 * Legacy version uses:
 * - Shift A: Circle shape (rounded-full) - green
 * - Shift B: Square shape (rounded-none) - red
 * - Shift C: Diamond shape (rotate-45) - blue
 */
export function ShiftBadge({ shift, className = "", size = 'sm' }: ShiftBadgeProps) {
  const useMaterialM = useFeatureFlag('MATERIALM');

  // Use legacy badge if MaterialM is disabled
  if (!useMaterialM) {
    return <ShiftBadgeLegacy shift={shift} className={className} />;
  }

  // MaterialM Badge
  return <ShiftBadgeM3 shift={shift} size={size} className={className} />;
}
