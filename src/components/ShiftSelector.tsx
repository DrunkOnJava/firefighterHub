import { Shift } from "../lib/supabase";
import { colors, tokens } from "../styles";

interface ShiftSelectorProps {
  currentShift: Shift;
  onShiftChange: (shift: Shift) => void;
}

const SHIFT_COLORS = {
  A: {
    active: "bg-green-700 text-white shadow-lg",
    inactive: "bg-green-950/60 text-green-300 hover:bg-green-600",
  },
  B: {
    active: "bg-red-700 text-white shadow-lg",
    inactive: "bg-red-950/60 text-red-300 hover:bg-red-600",
  },
  C: {
    active: "bg-sky-700 text-white shadow-lg",
    inactive: "bg-sky-950/60 text-sky-300 hover:bg-sky-600",
  },
};

const SHIFT_BADGE_COLORS = {
  A: "bg-green-600 border-2 border-green-800 text-white shadow-sm shadow-green-900/50",
  B: "bg-red-600 border-2 border-red-800 text-white shadow-sm shadow-red-900/50",
  C: "bg-sky-600 border-2 border-sky-800 text-white shadow-sm shadow-sky-900/50",
};

export function ShiftSelector({
  currentShift,
  onShiftChange,
}: ShiftSelectorProps) {
  const shifts: Shift[] = ["A", "B", "C"];

  return (
    <div className={`flex items-center ${tokens.spacing.gap.sm}`}>
      <span
        className={`${tokens.typography.body.secondary} font-semibold hidden sm:inline ${colors.structural.text.tertiary}`}
      >
        Shift:
      </span>
      <div
        className={`flex ${tokens.borders.radius.lg} p-1 ${colors.structural.bg.card}`}
      >
        {shifts.map((shift) => {
          const isActive = currentShift === shift;
          const colorClasses = isActive
            ? SHIFT_COLORS[shift].active
            : SHIFT_COLORS[shift].inactive;

          return (
            <button
              key={shift}
              onClick={() => onShiftChange(shift)}
              className={`
                px-4 py-2 ${tokens.borders.radius.md} transition-all font-bold ${tokens.typography.body.secondary} focus-ring
                ${colorClasses}
              `}
              aria-label={`Switch to Shift ${shift}`}
              aria-pressed={isActive}
            >
              {shift}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function ShiftBadge({ shift }: { shift: Shift }) {
  return (
    <span
      className={`
      inline-flex items-center justify-center px-2.5 py-0.5 ${tokens.borders.radius.md} ${tokens.typography.body.small} font-bold
      ${SHIFT_BADGE_COLORS[shift]}
    `}
    >
      Shift {shift}
    </span>
  );
}
