import { Shift } from "../lib/supabase";

interface ShiftBadgeProps {
  shift: Shift;
  className?: string;
}

/**
 * Reusable Shift Badge Component
 * 
 * Displays a colored badge indicating the shift (A, B, or C).
 * Includes shape/icon differentiation for color-blind accessibility (WCAG 1.4.1).
 * 
 * Shape indicators:
 * - Shift A: ● (filled circle)
 * - Shift B: ■ (filled square)
 * - Shift C: ▲ (filled triangle)
 * 
 * @param shift - The shift letter ('A', 'B', or 'C')
 * @param className - Optional additional CSS classes
 */
export function ShiftBadge({ shift, className = "" }: ShiftBadgeProps) {
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
        ${shift === 'C' ? '' : ''}
      `}
      aria-label={style.label}
    >
      <span className={shift === 'C' ? '-rotate-45' : ''}>{shift}</span>
    </span>
  );
}
