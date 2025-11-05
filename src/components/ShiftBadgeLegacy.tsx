/**
 * ShiftBadgeLegacy - Original Shift Badge Implementation
 *
 * Preserved for backward compatibility during MaterialM migration.
 * Uses geometric shapes (circle, square, diamond) for shift differentiation.
 */

import { Shift } from "../lib/supabase";

interface ShiftBadgeLegacyProps {
  shift: Shift;
  className?: string;
}

/**
 * Original Shift Badge Component
 *
 * Displays a colored badge indicating the shift (A, B, or C).
 * Includes shape/icon differentiation for color-blind accessibility (WCAG 1.4.1).
 *
 * Shape indicators:
 * - Shift A: Circle (rounded-full)
 * - Shift B: Square (rounded-none)
 * - Shift C: Diamond (rotate-45)
 */
export function ShiftBadgeLegacy({ shift, className = "" }: ShiftBadgeLegacyProps) {
  const shiftStyles = {
    A: {
      color: "bg-green-600 text-white border-white shadow-green-900/50",
      shape: "rounded-full",
      label: "Shift A (circle)",
    },
    B: {
      color: "bg-red-600 text-white border-white shadow-red-900/50",
      shape: "rounded-none",
      label: "Shift B (square)",
    },
    C: {
      color: "bg-sky-600 text-white border-white shadow-sky-900/50",
      shape: "rounded-sm rotate-45",
      label: "Shift C (diamond)",
    },
  };

  const style = shiftStyles[shift];

  return (
    <span
      className={`
        inline-flex items-center justify-center
        w-7 h-7
        text-xs font-bold
        ${style.shape}
        border shadow-sm
        ${style.color}
        ${className}
      `}
      aria-label={style.label}
    >
      <span className={shift === 'C' ? '-rotate-45' : ''}>{shift}</span>
    </span>
  );
}
