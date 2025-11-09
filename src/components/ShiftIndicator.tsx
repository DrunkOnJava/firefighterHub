import { Shift } from '../lib/supabase';

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
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border-2 ${shiftColors.bg} ${shiftColors.border} shadow-lg`}>
      <span className={`text-xs font-semibold uppercase tracking-wide ${shiftColors.text} opacity-90`}>
        Shift
      </span>
      <span className={`text-lg font-bold ${shiftColors.text}`}>
        {shift}
      </span>
    </div>
  );
}
