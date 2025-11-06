import { Shift } from '../lib/supabase';
import { tokens } from '../styles';

interface ShiftIndicatorProps {
  shift: Shift;
}

const SHIFT_COLORS = {
  A: {
    bg: 'bg-materialm-success',
    border: 'border-materialm-success',
    text: 'text-white'
  },
  B: {
    bg: 'bg-materialm-error',
    border: 'border-materialm-error',
    text: 'text-white'
  },
  C: {
    bg: 'bg-materialm-primary',
    border: 'border-materialm-primary',
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
