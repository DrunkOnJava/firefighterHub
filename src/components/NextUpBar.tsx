/**
 * NextUpBar Component
 *
 * Horizontal bar displaying the next firefighter up for hold from each shift (A/B/C)
 * Shows full names and station numbers without abbreviation
 */

import { Firefighter } from '../lib/supabase';
import { colors, tokens } from '../styles';

interface NextUpBarProps {
  firefighters: Firefighter[];
  isDarkMode?: boolean;
}

export function NextUpBar({ firefighters, isDarkMode = true }: NextUpBarProps) {
  // Get next up for each shift (first available firefighter)
  const getNextForShift = (shift: 'A' | 'B' | 'C'): Firefighter | null => {
    const shiftFirefighters = firefighters
      .filter(ff => ff.shift === shift && ff.is_available)
      .sort((a, b) => a.order_position - b.order_position);

    return shiftFirefighters[0] || null;
  };

  const nextA = getNextForShift('A');
  const nextB = getNextForShift('B');
  const nextC = getNextForShift('C');

  const renderShiftBadge = (shift: 'A' | 'B' | 'C') => {
    const badgeColors = {
      A: isDarkMode
        ? 'bg-gradient-to-br from-cyan-500 to-blue-600'
        : 'bg-gradient-to-br from-cyan-400 to-blue-500',
      B: isDarkMode
        ? 'bg-gradient-to-br from-rose-500 to-red-600'
        : 'bg-gradient-to-br from-rose-400 to-red-500',
      C: isDarkMode
        ? 'bg-gradient-to-br from-blue-500 to-indigo-600'
        : 'bg-gradient-to-br from-blue-400 to-indigo-500',
    };

    return (
      <div className={`${badgeColors[shift]} px-2.5 py-1 rounded flex items-center justify-center flex-shrink-0`}>
        <span className="text-white text-xs font-bold uppercase tracking-wide whitespace-nowrap">
          Shift {shift}
        </span>
      </div>
    );
  };

  const renderShiftSection = (
    shift: 'A' | 'B' | 'C',
    firefighter: Firefighter | null
  ) => {
    return (
      <div
        className={`
          flex items-center gap-2 px-3 py-4 rounded-lg relative
          ${tokens.transitions.fast}
          ${
            isDarkMode
              ? 'bg-slate-700 border border-slate-600 shadow-lg'
              : 'bg-gray-50 border border-gray-200'
          }
        `}
      >
        {renderShiftBadge(shift)}

        <div className="flex-1 min-w-0 relative z-10">
          <div
            className={`
              text-base font-medium flex items-center gap-2.5 whitespace-nowrap overflow-hidden
              ${
                isDarkMode
                  ? colors.structural.text.primary
                  : 'text-gray-900'
              }
            `}
          >
            {firefighter ? (
              <>
                <span className="truncate font-semibold">{firefighter.name}</span>
                <span className={`flex-shrink-0 text-sm font-normal ${
                  isDarkMode
                    ? colors.structural.text.secondary
                    : 'text-gray-600'
                }`}>
                  Station #{firefighter.fire_station || 'Unassigned'}
                </span>
              </>
            ) : (
              <span className="font-normal opacity-60 text-sm">
                No available firefighters
              </span>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      className={`
        px-4 sm:px-6 py-3
        ${
          isDarkMode
            ? 'bg-slate-950 border-b border-slate-800'
            : 'bg-white border-b border-gray-200'
        }
      `}
    >
      <div className="flex items-center gap-2 mb-2.5">
        <h2
          className={`
            text-sm font-bold uppercase tracking-wider overflow-hidden truncate
            ${
              isDarkMode
                ? colors.structural.text.secondary
                : 'text-gray-600'
            }
          `}
        >
          Next Up for Hold
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 relative">
        {renderShiftSection('A', nextA)}
        {renderShiftSection('B', nextB)}
        {renderShiftSection('C', nextC)}
      </div>
    </div>
  );
}
