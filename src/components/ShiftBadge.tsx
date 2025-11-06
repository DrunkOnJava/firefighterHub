/**
 * ShiftBadge - Shift Indicator Component
 *
 * Displays a colored badge for firefighter shifts (A, B, or C).
 * Uses MaterialM design system with WCAG 1.4.1 accessibility (shape indicators).
 *
 * @example
 * ```tsx
 * <ShiftBadge shift="A" />
 * <ShiftBadge shift="B" className="mr-2" />
 * ```
 */

import { Shift } from "../lib/supabase";
import { ShiftBadgeM3 } from "./m3/BadgeM3";

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
 * Uses MaterialM design system:
 * - Shift A: ● (filled circle) - green
 * - Shift B: ■ (filled square) - red
 * - Shift C: ◆ (filled diamond) - blue
 */
export function ShiftBadge({ shift, className = "", size = 'sm' }: ShiftBadgeProps) {
  return <ShiftBadgeM3 shift={shift} size={size} className={className} />;
}
