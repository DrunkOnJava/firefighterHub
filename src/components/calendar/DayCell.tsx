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
 */

import { Shift } from "../../lib/supabase";
import { CalendarDay } from "../../utils/calendarUtils";

interface DayCellProps {
  day: CalendarDay;
  onDayClick: (day: CalendarDay) => void;
  isAdminMode?: boolean;
  currentShift: Shift;
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
    min-h-[44px] min-w-[44px]
    transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background
    flex flex-col
    aspect-square
    rounded-xl
    border-2
  `;

  if (!day.isCurrentMonth) {
    cellClasses += ` bg-muted/30 border-border/20 text-muted-foreground cursor-default opacity-40`;
  } else {
    // Base state - thin outline on hover
    cellClasses += ` bg-card border-border/40 text-foreground hover:border-border hover:shadow-lg cursor-pointer active:bg-muted`;
  }

  // TODO: AUDIT FIX - Today indicator visibility
  // Current: Blue gradient with shadow (works but could be more prominent)
  // Recommendation: Add a "Today" badge or use filled red background for higher contrast
  // See: AUDIT_REPORT_2025-11-09.md - Section 2 (Calendar Day Cell Selected State)
  // Today indicator - STRONG accent fill (HIGHEST PRIORITY)
  if (day.isToday && day.isCurrentMonth) {
    cellClasses += ` !bg-gradient-to-br !from-blue-600/40 !to-blue-700/50 dark:!from-blue-600/40 dark:!to-blue-700/50 !border-blue-500 !shadow-2xl !shadow-blue-500/40 ring-3 ring-blue-500/60`;
  }

  // Has holds - add left border accent
  if (hasHolds && day.isCurrentMonth) {
    cellClasses += ` border-l-4 !border-l-orange-500`;
  }

  // Selected firefighter highlight - accent outline
  if (hasSelectedFF && day.isCurrentMonth) {
    cellClasses += ` ring-2 ring-blue-400 ring-offset-1 ring-offset-background`;
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
          day.isToday ? 'text-blue-100 dark:text-blue-100' : day.isCurrentMonth ? 'text-foreground' : 'text-muted-foreground'
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
        {/* Show first 3 holds - MODERN PILL DESIGN */}
        {scheduledHolds.slice(0, 3).map((hold, index) => {
          const formattedName = formatName(hold.firefighter_name);
          const isSelected = hold.firefighter_id === selectedFirefighterId;
          
          return (
            <div
              key={hold.id || index}
              className={`
                text-[11px] px-2 py-1 rounded-md
                bg-gradient-to-r from-orange-500 to-orange-600
                text-white font-bold 
                border ${isSelected ? 'border-blue-400 ring-2 ring-blue-400/50' : 'border-orange-400/30'}
                flex items-center justify-between shadow-md 
                hover:from-orange-400 hover:to-orange-500 hover:shadow-lg
                transition-all duration-150
                backdrop-blur-sm
              `}
              title={`${hold.firefighter_name || "Unknown"}${
                hold.fire_station ? ` - Station ${hold.fire_station}` : ""
              }`}
            >
              <span className="whitespace-nowrap drop-shadow-sm">{formattedName}</span>
              {hold.fire_station && (
                <span className="ml-1 flex-shrink-0 text-orange-100 font-extrabold text-xs">
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
                text-[11px] px-2 py-1 rounded-md
                bg-gradient-to-r from-emerald-600 to-green-600
                text-white font-bold 
                border ${isSelected ? 'border-blue-400 ring-2 ring-blue-400/50' : 'border-emerald-400/30'}
                flex items-center justify-between shadow-md 
                hover:from-emerald-500 hover:to-green-500 hover:shadow-lg
                transition-all duration-150
                backdrop-blur-sm opacity-90
              `}
              title={`${hold.firefighter_name || "Unknown"}${
                hold.fire_station ? ` - Station ${hold.fire_station}` : ""
              } (completed)`}
            >
              <span className="whitespace-nowrap drop-shadow-sm">{formattedName}</span>
              {hold.fire_station && (
                <span className="ml-1 flex-shrink-0 text-emerald-100 font-extrabold text-xs">
                  #{hold.fire_station}
                </span>
              )}
            </div>
          );
        })}

        {/* Show "more" indicator if there are additional holds */}
        {day.scheduledHolds.length > 3 && (
          <div className="text-[10px] text-muted-foreground px-1.5 font-semibold">
            +{day.scheduledHolds.length - 3} more
          </div>
        )}
      </div>
    </button>
  );
}
