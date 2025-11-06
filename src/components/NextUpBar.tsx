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
    const badgeStyles = {
      A: 'w-6 h-6 rounded-full', // Circle
      B: 'w-6 h-6 rounded-sm',   // Square
      C: 'w-6 h-6 rotate-45',    // Diamond (rotated square)
    };

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
      <div className={`${badgeStyles[shift]} ${badgeColors[shift]} flex-shrink-0`} />
    );
  };

  const renderShiftSection = (
    shift: 'A' | 'B' | 'C',
    firefighter: Firefighter | null
  ) => {
    return (
      <div
        className={`
          flex items-center gap-3 px-6 py-4 rounded-lg
          ${tokens.transitions.fast}
          ${
            isDarkMode
              ? `${colors.structural.bg.elevated} ${colors.structural.border.subtle} border`
              : 'bg-gray-50 border border-gray-200'
          }
        `}
      >
        {renderShiftBadge(shift)}

        <div className="flex-1 min-w-0">
          <div
            className={`
              text-lg font-semibold
              ${
                isDarkMode
                  ? colors.structural.text.primary
                  : 'text-gray-900'
              }
            `}
          >
            {firefighter ? (
              <>
                <span className="font-bold">{shift}:</span> {firefighter.name}
              </>
            ) : (
              <span className="font-normal opacity-60">
                {shift}: No available firefighters
              </span>
            )}
          </div>

          {firefighter && (
            <div
              className={`
                text-sm mt-0.5
                ${
                  isDarkMode
                    ? colors.structural.text.secondary
                    : 'text-gray-600'
                }
              `}
            >
              Station #{firefighter.fire_station || 'Unassigned'}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div
      className={`
        px-4 sm:px-6 py-4
        ${
          isDarkMode
            ? `${colors.structural.bg.base} ${colors.structural.border.subtle} border-b`
            : 'bg-white border-b border-gray-200'
        }
      `}
    >
      <div className="flex items-center gap-2 mb-3 overflow-hidden">
        <h2
          className={`
            text-base font-bold uppercase tracking-wide truncate
            ${
              isDarkMode
                ? colors.structural.text.primary
                : 'text-gray-900'
            }
          `}
        >
          Next Up for Hold
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {renderShiftSection('A', nextA)}
        {renderShiftSection('B', nextB)}
        {renderShiftSection('C', nextC)}
      </div>
    </div>
  );
}
