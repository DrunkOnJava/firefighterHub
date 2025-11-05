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
      color: "bg-green-600 text-white border-black shadow-green-900/50",
      icon: "●",
      label: "Shift A (circle)",
    },
    B: {
      color: "bg-red-600 text-white border-black shadow-red-900/50",
      icon: "■",
      label: "Shift B (square)",
    },
    C: {
      color: "bg-sky-600 text-white border-black shadow-sky-900/50",
      icon: "▲",
      label: "Shift C (triangle)",
    },
  };

  const style = shiftStyles[shift];

  return (
    <span
      className={`
        inline-flex items-center gap-1
        px-2 py-0.5
        text-xs font-bold
        rounded
        border-2 shadow-sm
        ${style.color}
        ${className}
      `}
      aria-label={style.label}
    >
      <span aria-hidden="true">{style.icon}</span>
      <span>{shift}</span>
    </span>
  );
}
