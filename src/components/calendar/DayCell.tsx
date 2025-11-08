/**
 * DayCell Component
 *
 * Renders an individual day cell in the calendar grid.
 * Shows:
 * - Day number
 * - Today indicator (strong accent fill)
 * - Hold count badges (scheduled/completed)
 * - Visual states for scheduled/completed holds
 * - Hover and selected states
 *
 * Uses design tokens for consistent styling.
 */

import { Shift } from "../../lib/supabase";
import { tokens } from "../../styles";
import { CalendarDay } from "../../utils/calendarUtils";

interface DayCellProps {
  day: CalendarDay;
  onDayClick: (day: CalendarDay) => void;
  isAdminMode?: boolean;
  currentShift: Shift;
  isDarkMode?: boolean;
  selectedFirefighterId?: string | null;
}

export function DayCell({
  day,
  onDayClick,
  isAdminMode = false,
  selectedFirefighterId = null,
}: DayCellProps) {
  const hasHolds = day.scheduledHolds.length > 0;
  const scheduledHolds = day.scheduledHolds.filter(
    (h) => h.status === "scheduled"
  );
  const completedHolds = day.scheduledHolds.filter(
    (h) => h.status === "completed"
  );

  // Check if any holds belong to the selected firefighter
  const hasSelectedFF = selectedFirefighterId 
    ? day.scheduledHolds.some(h => h.firefighter_id === selectedFirefighterId)
    : false;

  // Format name as "F. Lastname"
  const formatName = (fullName: string | null): string => {
    if (!fullName) return "Unknown";
    const parts = fullName.trim().split(/\s+/);
    if (parts.length === 1) return parts[0]; // Single name
    const firstInitial = parts[0][0]?.toUpperCase() || "";
    const lastName = parts[parts.length - 1];
    return `${firstInitial}. ${lastName}`;
  };

  // Determine styling based on state - WCAG 2.5.5: 44px minimum touch targets
  let cellClasses = `
    relative w-full p-2 text-left
    ${tokens.touchTarget.min} min-w-[44px]
    ${tokens.transitions.fast}
    ${tokens.focus.default}
    flex flex-col
    aspect-square
    rounded-xl
    border-2
  `;

  if (!day.isCurrentMonth) {
    cellClasses += ` bg-slate-800/30 border-slate-700/20 text-gray-600 cursor-default opacity-40`;
  } else {
    // Base state - thin outline on hover
    cellClasses += ` bg-slate-800/80 border-slate-700/40 text-gray-200 hover:border-slate-500 hover:shadow-lg cursor-pointer active:bg-slate-700`;
  }

  // Today indicator - STRONG accent fill (HIGHEST PRIORITY)
  if (day.isToday && day.isCurrentMonth) {
    cellClasses += ` !bg-gradient-to-br !from-blue-600/40 !to-blue-700/50 !border-blue-500 !shadow-2xl !shadow-blue-500/40 ring-3 ring-blue-500/60`;
  }

  // Has holds - add left border accent
  if (hasHolds && day.isCurrentMonth) {
    cellClasses += ` border-l-4 !border-l-orange-500`;
  }

  // Selected firefighter highlight - accent outline
  if (hasSelectedFF && day.isCurrentMonth) {
    cellClasses += ` ring-2 ring-blue-400 ring-offset-1 ring-offset-slate-900`;
  }

  // Past date and not admin - make read-only
  const isPastDate = day.date < new Date(new Date().setHours(0, 0, 0, 0));
  const isClickable =
    day.isCurrentMonth && (isAdminMode || !isPastDate || hasHolds);

  const handleClick = () => {
    if (isClickable) {
      onDayClick(day);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={cellClasses}
      disabled={!isClickable}
      aria-label={`${day.date.toLocaleDateString()}, ${
        scheduledHolds.length
      } scheduled, ${completedHolds.length} completed`}
      title={
        !isClickable && isPastDate
          ? "Admin mode required to edit past dates"
          : undefined
      }
    >
      {/* Day content wrapper */}
      <div className="flex items-center justify-between mb-1">
        {/* Day number */}
        <div className={`text-base font-extrabold ${
          day.isToday ? 'text-blue-100' : day.isCurrentMonth ? 'text-slate-100' : 'text-gray-600'
        }`}>
          {day.date.getDate()}
        </div>

        {/* Hold count badge */}
        {hasHolds && day.isCurrentMonth && (
          <div className="bg-orange-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-extrabold shadow-lg">
            {day.scheduledHolds.length}
          </div>
        )}
      </div>

      {/* Holds list - show first 3, compact pills */}
      <div className="space-y-1 flex-1">
        {/* Show first 3 holds */}
        {scheduledHolds.slice(0, 3).map((hold, index) => {
          const formattedName = formatName(hold.firefighter_name);
          const isSelected = hold.firefighter_id === selectedFirefighterId;
          
          return (
            <div
              key={hold.id || index}
              className={`
                text-[10px] px-1.5 py-0.5 rounded 
                bg-orange-600/90 text-white font-bold 
                border-l-2 ${isSelected ? 'border-blue-400 ring-1 ring-blue-400' : 'border-orange-400'}
                flex items-center justify-between shadow-sm 
                hover:bg-orange-500 transition-colors
              `}
              title={`${hold.firefighter_name || "Unknown"}${
                hold.fire_station ? ` - Station ${hold.fire_station}` : ""
              }`}
            >
              <span className="truncate">{formattedName}</span>
              {hold.fire_station && (
                <span className="ml-1 flex-shrink-0 text-orange-200">
                  #{hold.fire_station}
                </span>
              )}
            </div>
          );
        })}
        
        {completedHolds.slice(0, 3 - scheduledHolds.length).map((hold, index) => {
          const formattedName = formatName(hold.firefighter_name);
          const isSelected = hold.firefighter_id === selectedFirefighterId;
          
          return (
            <div
              key={hold.id || index}
              className={`
                text-[10px] px-1.5 py-0.5 rounded 
                bg-green-700/80 text-white font-semibold 
                border-l-2 ${isSelected ? 'border-blue-400 ring-1 ring-blue-400' : 'border-green-500'}
                flex items-center justify-between shadow-sm 
                hover:bg-green-600 transition-colors opacity-75
              `}
              title={`${hold.firefighter_name || "Unknown"}${
                hold.fire_station ? ` - Station ${hold.fire_station}` : ""
              } (completed)`}
            >
              <span className="truncate">{formattedName}</span>
              {hold.fire_station && (
                <span className="ml-1 flex-shrink-0">
                  (#{hold.fire_station})
                </span>
              )}
            </div>
          );
        })}

        {/* Show "more" indicator if there are additional holds */}
        {day.scheduledHolds.length > 3 && (
          <div className="text-[10px] text-slate-400 px-1.5 font-semibold">
            +{day.scheduledHolds.length - 3} more
          </div>
        )}
      </div>
    </button>
  );
}
