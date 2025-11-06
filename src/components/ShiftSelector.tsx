import { Shift } from "../lib/supabase";
import { colors, tokens } from "../styles";

interface ShiftSelectorProps {
  currentShift: Shift;
  onShiftChange: (shift: Shift) => void;
}

const SHIFT_COLORS = {
  A: {
    active: "bg-materialm-success text-white shadow-lg",
    inactive: "bg-materialm-success/20 text-materialm-success hover:bg-materialm-success/60",
  },
  B: {
    active: "bg-materialm-error text-white shadow-lg",
    inactive: "bg-materialm-error/20 text-materialm-error hover:bg-materialm-error/60",
  },
  C: {
    active: "bg-materialm-primary text-white shadow-lg",
    inactive: "bg-materialm-primary/20 text-materialm-primary hover:bg-materialm-primary/60",
  },
};

const SHIFT_BADGE_COLORS = {
  A: "bg-materialm-success border border-white text-white shadow-sm shadow-materialm-success/50",
  B: "bg-materialm-error border border-white text-white shadow-sm shadow-materialm-error/50",
  C: "bg-materialm-primary border border-white text-white shadow-sm shadow-materialm-primary/50",
};

const SHIFT_SHAPES = {
  A: { shape: "rounded-full", label: "Shift A (circle)" },
  B: { shape: "rounded-none", label: "Shift B (square)" },
  C: { shape: "rounded-sm rotate-45", label: "Shift C (diamond)", needsRotateText: true },
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
  const shapeData = SHIFT_SHAPES[shift];

  return (
    <span
      className={`
      inline-flex items-center justify-center w-8 h-8 ${tokens.typography.body.small} font-bold
      ${shapeData.shape}
      ${SHIFT_BADGE_COLORS[shift]}
    `}
      aria-label={shapeData.label}
    >
      <span className={shift === 'C' ? '-rotate-45' : ''}>Shift {shift}</span>
    </span>
  );
}
