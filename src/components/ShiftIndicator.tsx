import { Shift } from '../lib/supabase';

interface ShiftIndicatorProps {
  shift: Shift;
  isDarkMode?: boolean;
}

const SHIFT_COLORS = {
  A: {
    dark: {
      bg: 'bg-sky-700',
      border: 'border-sky-600',
      text: 'text-white'
    },
    light: {
      bg: 'bg-sky-600',
      border: 'border-sky-500',
      text: 'text-white'
    }
  },
  B: {
    dark: {
      bg: 'bg-emerald-700',
      border: 'border-emerald-600',
      text: 'text-white'
    },
    light: {
      bg: 'bg-emerald-600',
      border: 'border-emerald-500',
      text: 'text-white'
    }
  },
  C: {
    dark: {
      bg: 'bg-red-700',
      border: 'border-red-600',
      text: 'text-white'
    },
    light: {
      bg: 'bg-red-600',
      border: 'border-red-500',
      text: 'text-white'
    }
  }
};

export function ShiftIndicator({ shift, isDarkMode = true }: ShiftIndicatorProps) {
  const colors = isDarkMode ? SHIFT_COLORS[shift].dark : SHIFT_COLORS[shift].light;

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border-2 ${colors.bg} ${colors.border} shadow-lg`}>
      <span className={`text-xs font-semibold uppercase tracking-wide ${colors.text} opacity-90`}>
        Shift
      </span>
      <span className={`text-lg font-bold ${colors.text}`}>
        {shift}
      </span>
    </div>
  );
}
