import { Shift } from "../lib/supabase";

interface ShiftBadgeProps {
  shift: Shift;
  className?: string;
}

/**
 * Reusable Shift Badge Component
 * 
 * Displays a colored badge indicating the shift (A, B, or C).
 * Consistent styling across the application.
 * 
 * @param shift - The shift letter ('A', 'B', or 'C')
 * @param className - Optional additional CSS classes
 */
export function ShiftBadge({ shift, className = "" }: ShiftBadgeProps) {
  const shiftColors = {
    A: "bg-green-600 text-white border-black shadow-green-900/50",
    B: "bg-red-600 text-white border-black shadow-red-900/50",
    C: "bg-sky-600 text-white border-black shadow-sky-900/50",
  };

  return (
    <span
      className={`
        inline-flex items-center justify-center
        px-2 py-0.5
        text-xs font-bold
        rounded
        border-2 shadow-sm
        ${shiftColors[shift]}
        ${className}
      `}
    >
      {shift}
    </span>
  );
}
