import { Shift } from '../lib/supabase';

interface ShiftSelectorProps {
  currentShift: Shift;
  onShiftChange: (shift: Shift) => void;
  isDarkMode?: boolean;
}

const SHIFT_COLORS = {
  A: {
    dark: {
      bg: 'bg-green-700',
      bgHover: 'hover:bg-green-600',
      bgInactive: 'bg-green-950/60',
      border: 'border-green-800',
      text: 'text-green-300'
    },
    light: {
      bg: 'bg-green-600',
      bgHover: 'hover:bg-green-700',
      bgInactive: 'bg-green-100',
      border: 'border-green-400',
      text: 'text-green-700'
    }
  },
  B: {
    dark: {
      bg: 'bg-red-700',
      bgHover: 'hover:bg-red-600',
      bgInactive: 'bg-red-950/60',
      border: 'border-red-800',
      text: 'text-red-300'
    },
    light: {
      bg: 'bg-red-600',
      bgHover: 'hover:bg-red-700',
      bgInactive: 'bg-red-100',
      border: 'border-red-400',
      text: 'text-red-700'
    }
  },
  C: {
    dark: {
      bg: 'bg-gray-800',
      bgHover: 'hover:bg-gray-700',
      bgInactive: 'bg-gray-950/60',
      border: 'border-gray-700',
      text: 'text-gray-300'
    },
    light: {
      bg: 'bg-gray-700',
      bgHover: 'hover:bg-gray-600',
      bgInactive: 'bg-gray-200',
      border: 'border-gray-500',
      text: 'text-gray-900'
    }
  }
};

export function ShiftSelector({ currentShift, onShiftChange, isDarkMode = true }: ShiftSelectorProps) {
  const shifts: Shift[] = ['A', 'B', 'C'];

  return (
    <div className="flex items-center gap-2">
      <span className={`text-sm font-semibold hidden sm:inline ${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>Shift:</span>
      <div className={`flex rounded-lg p-1 ${isDarkMode ? 'bg-gray-800' : 'bg-slate-200'}`}>
        {shifts.map((shift) => {
          const colors = isDarkMode ? SHIFT_COLORS[shift].dark : SHIFT_COLORS[shift].light;
          const isActive = currentShift === shift;

          return (
            <button
              key={shift}
              onClick={() => onShiftChange(shift)}
              className={`
                px-4 py-2 rounded-md transition-all font-bold text-sm focus-ring
                ${isActive
                  ? `${colors.bg} text-white shadow-lg`
                  : `${colors.bgInactive} ${colors.text} ${colors.bgHover}`
                }
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

export function ShiftBadge({ shift, isDarkMode = true }: { shift: Shift; isDarkMode?: boolean }) {
  const colors = isDarkMode ? SHIFT_COLORS[shift].dark : SHIFT_COLORS[shift].light;

  return (
    <span className={`
      inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold
      ${colors.bgInactive} border ${colors.border} ${colors.text}
    `}>
      Shift {shift}
    </span>
  );
}
