/**
 * CalendarDayContent Component
 *
 * Custom day content renderer for calendar that displays:
 * - Hold event blocks using Calendr-style EventBlock component
 * - Scheduled holds (blue blocks)
 * - Completed holds (teal blocks)
 * - Compact, clean presentation
 */

import { ScheduledHold } from '@/lib/supabase';
import { EventBlock } from './EventBlock';
import { cn } from '@/lib/utils';

interface CalendarDayContentProps {
  date: Date;
  scheduledHolds: ScheduledHold[];
  selectedFirefighterId?: string | null;
}

export function CalendarDayContent({
  date,
  scheduledHolds,
  selectedFirefighterId,
}: CalendarDayContentProps) {
  const holdsForDate = scheduledHolds.filter(hold => {
    if (!hold.hold_date) return false;
    const holdDate = new Date(hold.hold_date);
    return holdDate.toDateString() === date.toDateString();
  });

  return (
    <div className="flex flex-col gap-0.5 w-full h-full p-1.5 min-h-[80px]">
      {/* Day number - always shown */}
      <div className="flex items-center justify-between mb-1 flex-shrink-0">
        <span className="text-base font-bold text-foreground">{date.getDate()}</span>
      </div>

      {/* Hold blocks - Calendr style (show first 3) */}
      {holdsForDate.length > 0 && (
        <div className="flex flex-col gap-1 overflow-hidden flex-1">
          {holdsForDate.slice(0, 3).map((hold, index) => (
            <EventBlock
              key={hold.id || index}
              event={hold}
            />
          ))}

          {/* Show "+X more" if there are additional holds */}
          {holdsForDate.length > 3 && (
            <button className="text-xs text-muted-foreground hover:text-foreground text-left">
              +{holdsForDate.length - 3} more
            </button>
          )}
        </div>
      )}
    </div>
  );
}
