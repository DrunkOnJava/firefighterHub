import { Shift } from '../lib/supabase';
import { tokens } from '../styles';

interface ShiftIndicatorProps {
  shift: Shift;
}

const SHIFT_COLORS = {
  A: {
    bg: 'bg-sky-700',
    border: 'border-sky-600',
    text: 'text-white'
  },
  B: {
    bg: 'bg-emerald-700',
    border: 'border-emerald-600',
    text: 'text-white'
  },
  C: {
    bg: 'bg-red-700',
    border: 'border-red-600',
    text: 'text-white'
  }
};

export function ShiftIndicator({ shift }: ShiftIndicatorProps) {
  const shiftColors = SHIFT_COLORS[shift];

  return (
    <div className={`inline-flex items-center ${tokens.spacing.gap.sm} px-3 py-1.5 ${tokens.borders.radius.lg} border-2 ${shiftColors.bg} ${shiftColors.border} shadow-lg`}>
      <span className={`${tokens.typography.body.small} font-semibold uppercase tracking-wide ${shiftColors.text} opacity-90`}>
        Shift
      </span>
      <span className={`text-lg font-bold ${shiftColors.text}`}>
        {shift}
      </span>
    </div>
  );
}
