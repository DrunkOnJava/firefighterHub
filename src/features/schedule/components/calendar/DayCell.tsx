/**
 * DayCell Component
 *
 * Renders an individual day cell in the calendar grid.
 * Shows:
 * - Day number with shift color indicator
 * - Working shift badge (visual rotation pattern)
 * - Today indicator (strong accent fill)
 * - Hold count badges (scheduled/completed)
 * - Visual states for scheduled/completed holds
 * - Hover and selected states
 */

import { Shift } from '@/lib/supabase';
import { CalendarDay } from '@/utils/calendarUtils';
import { getShiftForDate, getShiftColor } from '@/utils/shiftRotation';
import { EventBlock } from './EventBlock';

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

  // Format name as "F. Lastname" - currently unused, full names shown in pills
  // const formatName = (fullName: string | null): string => {
  //   if (!fullName) return "Unknown";
  //   const parts = fullName.trim().split(/\s+/);
  //   if (parts.length === 1) return parts[0]; // Single name
  //   const firstInitial = parts[0][0]?.toUpperCase() || "";
  //   const lastName = parts[parts.length - 1];
  //   return `${firstInitial}. ${lastName}`;
  // };

  // Calendr-style cell classes - cleaner, flatter design
  let cellClasses = `
    relative w-full p-2 text-left
    min-h-[100px] lg:min-h-[120px]
    transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-primary/50
    flex flex-col
    border border-border/50
    bg-background
  `;

  if (!day.isCurrentMonth) {
    cellClasses += ` bg-muted/10 text-muted-foreground/50 cursor-default`;
  } else {
    // Base state - clean, minimal
    cellClasses += `
      hover:bg-muted/20
      cursor-pointer
      active:bg-muted/30
    `;
  }

  // Today indicator - Calendr-style blue circle on date number
  if (day.isToday && day.isCurrentMonth) {
    cellClasses += `
      bg-primary/5
      border-primary/30
    `;
  }

  // Has holds - subtle left border (Calendr style)
  if (hasHolds && day.isCurrentMonth) {
    cellClasses += ` border-l-2 border-l-primary`;
  }

  // Selected firefighter highlight - subtle ring
  if (hasSelectedFF && day.isCurrentMonth) {
    cellClasses += ` ring-1 ring-primary/50 ring-inset`;
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
      {/* Day number - Calendr style */}
      <div className="flex items-start justify-between mb-1.5">
        {/* Date number - with today indicator */}
        <div className={`
          flex items-center justify-center
          ${day.isToday && day.isCurrentMonth
            ? 'w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-bold'
            : 'text-sm font-medium text-foreground'
          }
        `}>
          {day.date.getDate()}
        </div>

        {/* Hold count indicator - subtle */}
        {hasHolds && day.isCurrentMonth && (
          <div className="text-[10px] text-muted-foreground font-medium">
            {day.scheduledHolds.length} event{day.scheduledHolds.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>

      {/* Holds list - using EventBlock component (Calendr style) */}
      <div className="space-y-1 flex-1 overflow-hidden">
        {/* Show first 3 holds (Calendr compact style) */}
        {day.scheduledHolds.slice(0, 3).map((hold, index) => (
          <EventBlock
            key={hold.id || index}
            event={hold}
            onClick={() => onDayClick(day)}
          />
        ))}

        {/* Overflow indicator */}
        {day.scheduledHolds.length > 3 && (
          <button
            className="text-xs text-muted-foreground hover:text-foreground mt-1"
            onClick={() => onDayClick(day)}
          >
            +{day.scheduledHolds.length - 3} more
          </button>
        )}
      </div>
    </button>
  );
}
