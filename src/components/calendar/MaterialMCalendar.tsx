/**
 * MaterialM Calendar Component
 *
 * Adapted from MaterialM template for firefighter hold scheduling
 * Uses react-day-picker with Material Design 3 styling
 */

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DayPicker } from 'react-day-picker';
import { cn } from '../../lib/utils';
import { Firefighter, Shift, HoldDuration } from '../../lib/supabase';
import { ScheduledHold } from '../../utils/calendarUtils';
import 'react-day-picker/dist/style.css';

interface MaterialMCalendarProps {
  firefighters: Firefighter[];
  scheduledHolds: ScheduledHold[];
  onScheduleHold: (
    holdDate: string,
    firefighter: Firefighter,
    station?: string,
    duration?: HoldDuration,
    startTime?: string
  ) => void;
  onRemoveHold: (holdId: string) => void;
  onMarkCompleted: (hold: ScheduledHold) => void;
  loading: boolean;
  isAdminMode?: boolean;
  isDarkMode?: boolean;
  currentShift: Shift;
}

export function MaterialMCalendar({
  firefighters,
  scheduledHolds,
  onScheduleHold,
  onRemoveHold,
  onMarkCompleted,
  loading,
  isAdminMode = false,
  isDarkMode = true,
  currentShift,
}: MaterialMCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  // Get holds for a specific date
  const getHoldsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return scheduledHolds.filter(hold => hold.hold_date.startsWith(dateStr));
  };

  // Custom day content renderer to show holds
  const DayContent = (date: Date) => {
    const holds = getHoldsForDate(date);
    const hasHolds = holds.length > 0;

    return (
      <div className="relative w-full h-full flex flex-col items-center justify-center">
        <div className={cn(
          "text-sm",
          hasHolds && "font-semibold"
        )}>
          {date.getDate()}
        </div>
        {hasHolds && (
          <div className="absolute bottom-1 flex gap-0.5">
            {holds.slice(0, 3).map((_, i) => (
              <div
                key={i}
                className="w-1 h-1 rounded-full bg-primary-500"
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <DayPicker
        mode="single"
        selected={selectedDate}
        onSelect={setSelectedDate}
        showOutsideDays={true}
        className={cn(
          "p-6 rounded-xl border-2 w-full",
          isDarkMode
            ? "bg-slate-800 border-slate-700"
            : "bg-white border-gray-200"
        )}
        classNames={{
          months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
          month: "space-y-4 w-full",
          caption: cn(
            "flex justify-center pt-2 pb-4 relative items-center",
            isDarkMode ? "text-white" : "text-gray-900"
          ),
          caption_label: "text-lg font-semibold",
          nav: "space-x-1 flex items-center",
          nav_button: cn(
            "h-10 w-10 bg-transparent p-0 opacity-50 hover:opacity-100",
            "inline-flex items-center justify-center rounded-md",
            "border border-gray-300 dark:border-slate-600",
            isDarkMode ? "hover:bg-slate-700" : "hover:bg-gray-100"
          ),
          nav_button_previous: "absolute left-1",
          nav_button_next: "absolute right-1",
          table: "w-full border-collapse space-y-1",
          head_row: "flex justify-between",
          head_cell: cn(
            "rounded-md w-24 font-medium text-base text-center",
            isDarkMode ? "text-slate-400" : "text-gray-500"
          ),
          row: "flex w-full mt-2 justify-between",
          cell: cn(
            "h-24 w-24 text-center text-base p-0 relative",
            "focus-within:relative focus-within:z-20"
          ),
          day: cn(
            "h-24 w-24 p-0 font-normal text-lg",
            "inline-flex items-center justify-center rounded-lg",
            "hover:bg-primary-500/10 transition-colors",
            "focus:outline-none focus:ring-2 focus:ring-primary-500",
            isDarkMode ? "text-slate-300" : "text-gray-900"
          ),
          day_selected: cn(
            "bg-primary-500 text-white",
            "hover:bg-primary-600",
            "focus:bg-primary-600"
          ),
          day_today: cn(
            "bg-accent-500/20 font-semibold",
            isDarkMode ? "text-white" : "text-gray-900"
          ),
          day_outside: cn(
            "opacity-50",
            isDarkMode ? "text-slate-500" : "text-gray-400"
          ),
          day_disabled: "text-gray-400 opacity-50 cursor-not-allowed",
          day_hidden: "invisible",
        }}
        components={{
          IconLeft: (props) => <ChevronLeft className="h-4 w-4" {...props} />,
          IconRight: (props) => <ChevronRight className="h-4 w-4" {...props} />,
        }}
      />

      {/* Selected date holds display */}
      {selectedDate && (
        <div className={cn(
          "p-6 rounded-xl border-2",
          isDarkMode
            ? "bg-slate-800 border-slate-700"
            : "bg-white border-gray-200"
        )}>
          <h3 className={cn(
            "text-xl font-semibold mb-4",
            isDarkMode ? "text-white" : "text-gray-900"
          )}>
            {selectedDate.toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric'
            })}
          </h3>

          {loading ? (
            <p className={cn(
              "text-base",
              isDarkMode ? "text-slate-400" : "text-gray-500"
            )}>
              Loading holds...
            </p>
          ) : getHoldsForDate(selectedDate).length === 0 ? (
            <p className={cn(
              "text-base",
              isDarkMode ? "text-slate-400" : "text-gray-500"
            )}>
              No holds scheduled for this day
            </p>
          ) : (
            <div className="space-y-2">
              {getHoldsForDate(selectedDate).map((hold) => (
                <div
                  key={hold.id}
                  className={cn(
                    "p-3 rounded-md border",
                    isDarkMode
                      ? "bg-slate-700 border-slate-600"
                      : "bg-gray-50 border-gray-200"
                  )}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className={cn(
                        "font-medium",
                        isDarkMode ? "text-white" : "text-gray-900"
                      )}>
                        {hold.firefighter_name}
                      </p>
                      {hold.fire_station && (
                        <p className={cn(
                          "text-sm",
                          isDarkMode ? "text-slate-400" : "text-gray-500"
                        )}>
                          Station #{hold.fire_station}
                        </p>
                      )}
                    </div>
                    <span className={cn(
                      "text-xs px-2 py-1 rounded",
                      hold.status === 'completed'
                        ? "bg-green-500/20 text-green-400"
                        : hold.status === 'scheduled'
                        ? "bg-blue-500/20 text-blue-400"
                        : "bg-gray-500/20 text-gray-400"
                    )}>
                      {hold.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
