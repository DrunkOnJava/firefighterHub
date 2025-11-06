/**
 * CalendarView Component
 *
 * Modern calendar component with monthly grid layout, navigation,
 * and statistics cards. Matches the Hold Rotation Manager design.
 */

import { useState, useMemo } from "react";
import { Calendar, ChevronLeft, ChevronRight, Plus, Clock, CheckCircle2, Users } from "lucide-react";
import { Firefighter, Shift, HoldDuration } from "../lib/supabase";
import {
  getMonthDays,
  attachScheduledHolds,
  ScheduledHold,
  CalendarDay,
} from "../utils/calendarUtils";
import { DayModal } from './calendar/DayModal';
import { colors, tokens } from "../styles";

interface CalendarViewProps {
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
  currentShift: Shift;
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export function CalendarView({
  firefighters,
  scheduledHolds,
  onScheduleHold,
  onRemoveHold,
  onMarkCompleted,
  isAdminMode = false,
  currentShift,
}: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<CalendarDay | null>(null);
  const [selectedFirefighter, setSelectedFirefighter] = useState<Firefighter | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const calendarDays = useMemo(() => {
    const days = getMonthDays(year, month);
    return attachScheduledHolds(days, scheduledHolds, firefighters);
  }, [year, month, scheduledHolds, firefighters]);

  // Calculate statistics
  const stats = useMemo(() => {
    const openVacancies = 0; // This would come from a vacancies system
    const scheduled = scheduledHolds.filter(h => h.status === 'scheduled').length;
    const completed = scheduledHolds.filter(h => h.status === 'completed').length;
    const activeMembers = firefighters.filter(f => f.is_active).length;

    return { openVacancies, scheduled, completed, activeMembers };
  }, [scheduledHolds, firefighters]);

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const handleDayClick = (day: CalendarDay) => {
    if (!day.isCurrentMonth) return;
    setSelectedDay(day);
  };

  const handleCloseModal = () => {
    setSelectedDay(null);
    setSelectedFirefighter(null);
  };

  const handleScheduleHold = (
    holdDate: string,
    firefighter: Firefighter,
    station?: string,
    duration?: HoldDuration,
    startTime?: string
  ) => {
    onScheduleHold(holdDate, firefighter, station, duration, startTime);
  };

  const isToday = (day: CalendarDay) => {
    const today = new Date();
    return day.date.getDate() === today.getDate() &&
           day.date.getMonth() === today.getMonth() &&
           day.date.getFullYear() === today.getFullYear();
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className={`${colors.structural.bg.surface} border-b-2 ${colors.structural.border.default} px-6 py-4`}>
        <div className="flex items-center justify-between">
          {/* Month/Year Display */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <Calendar className={`w-6 h-6 ${colors.semantic.error.text}`} />
              <h2 className={`text-2xl font-bold ${colors.structural.text.primary}`}>
                {MONTH_NAMES[month]} {year}
              </h2>
            </div>
            <button
              onClick={goToToday}
              className={`px-3 py-1 text-sm ${colors.interactive.button.default} ${colors.interactive.hover.bg} ${colors.structural.text.secondary} rounded-md border ${colors.structural.border.default} transition-colors`}
            >
              Today
            </button>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={goToPreviousMonth}
              className={`p-2 ${colors.interactive.hover.bg} rounded-md transition-colors`}
              aria-label="Previous month"
            >
              <ChevronLeft className={`w-5 h-5 ${colors.structural.text.secondary}`} />
            </button>
            <button
              onClick={goToNextMonth}
              className={`p-2 ${colors.interactive.hover.bg} rounded-md transition-colors`}
              aria-label="Next month"
            >
              <ChevronRight className={`w-5 h-5 ${colors.structural.text.secondary}`} />
            </button>
            <button
              className={`ml-2 px-4 py-2 ${colors.semantic.error.gradient} ${colors.semantic.error.hover} text-white rounded-md font-medium ${tokens.shadows.lg} transition-all flex items-center gap-2`}
              onClick={() => {
                const today = calendarDays.find(d => isToday(d));
                if (today) handleDayClick(today);
              }}
            >
              <Plus className="w-4 h-4" />
              Create Vacancy
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="flex-1 p-6 overflow-auto">
        <div className={`grid grid-cols-7 gap-px ${colors.structural.border.default} border ${colors.structural.border.default} rounded-lg overflow-hidden ${tokens.shadows.xl}`}>
          {/* Weekday Headers */}
          {WEEKDAYS.map((day) => (
            <div
              key={day}
              className={`${colors.structural.bg.surface} px-3 py-4 text-center font-semibold ${colors.structural.text.secondary} text-sm`}
            >
              {day}
            </div>
          ))}

          {/* Day Cells */}
          {calendarDays.map((day, index) => {
            const isCurrentDay = isToday(day);
            const hasScheduled = day.scheduledHolds?.length > 0;
            const isOtherMonth = !day.isCurrentMonth;

            return (
              <button
                key={index}
                onClick={() => handleDayClick(day)}
                disabled={isOtherMonth}
                className={`
                  relative min-h-[100px] p-3 text-left transition-all
                  ${isOtherMonth
                    ? `${colors.structural.bg.app} ${colors.structural.text.tertiary} cursor-default`
                    : `${colors.structural.bg.card} ${colors.structural.text.primary} ${colors.interactive.hover.bg} cursor-pointer`
                  }
                  ${isCurrentDay && !isOtherMonth ? 'ring-2 ring-inset ring-red-500' : ''}
                  ${hasScheduled && !isOtherMonth ? 'border-l-4 border-l-red-500' : ''}
                `}
              >
                {/* Day Number */}
                <div className={`
                  text-sm font-semibold mb-2
                  ${isCurrentDay ? colors.semantic.error.text : ''}
                  ${isOtherMonth ? colors.structural.text.tertiary : colors.structural.text.secondary}
                `}>
                  {day.date.getDate()}
                </div>

                {/* Hold Indicator Badge */}
                {hasScheduled && !isOtherMonth && (
                  <div className={`absolute top-2 right-2 ${colors.semantic.error.solid} text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold`}>
                    {day.scheduledHolds.length}
                  </div>
                )}

                {/* Hold Preview */}
                {hasScheduled && !isOtherMonth && day.scheduledHolds.length > 0 && (
                  <div className="space-y-1 mt-1">
                    {day.scheduledHolds.slice(0, 2).map((hold) => (
                      <div
                        key={hold.id}
                        className={`
                          text-xs px-2 py-1 rounded truncate
                          ${hold.status === 'completed'
                            ? `${colors.semantic.success.light} ${colors.semantic.success.text} border ${colors.semantic.success.border}`
                            : `${colors.semantic.scheduled.light} ${colors.semantic.scheduled.text} border ${colors.semantic.scheduled.border}`
                          }
                        `}
                      >
                        {hold.firefighter_name}
                      </div>
                    ))}
                    {day.scheduledHolds.length > 2 && (
                      <div className={`text-xs ${colors.structural.text.tertiary} px-2`}>
                        +{day.scheduledHolds.length - 2} more
                      </div>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-4 gap-4 px-6 pb-6">
        {/* Open Vacancies */}
        <div className={`${colors.structural.bg.card} border-2 ${colors.semantic.error.border} rounded-lg p-4`}>
          <div className="flex items-center justify-between mb-2">
            <Clock className={`w-8 h-8 ${colors.semantic.error.text}`} />
            <span className={`text-3xl font-bold ${colors.structural.text.primary}`}>{stats.openVacancies}</span>
          </div>
          <div className={`text-sm ${colors.structural.text.secondary}`}>Open Vacancies</div>
        </div>

        {/* Scheduled */}
        <div className={`${colors.structural.bg.card} border-2 ${colors.structural.border.default} rounded-lg p-4`}>
          <div className="flex items-center justify-between mb-2">
            <Calendar className={`w-8 h-8 ${colors.semantic.scheduled.text}`} />
            <span className={`text-3xl font-bold ${colors.structural.text.primary}`}>{stats.scheduled}</span>
          </div>
          <div className={`text-sm ${colors.structural.text.secondary}`}>Scheduled</div>
        </div>

        {/* Completed */}
        <div className={`${colors.structural.bg.card} border-2 ${colors.semantic.success.border} rounded-lg p-4`}>
          <div className="flex items-center justify-between mb-2">
            <CheckCircle2 className={`w-8 h-8 ${colors.semantic.success.text}`} />
            <span className={`text-3xl font-bold ${colors.structural.text.primary}`}>{stats.completed}</span>
          </div>
          <div className={`text-sm ${colors.structural.text.secondary}`}>Completed</div>
        </div>

        {/* Active Members */}
        <div className={`${colors.structural.bg.card} border-2 ${colors.semantic.warning.border} rounded-lg p-4`}>
          <div className="flex items-center justify-between mb-2">
            <Users className={`w-8 h-8 ${colors.semantic.warning.text}`} />
            <span className={`text-3xl font-bold ${colors.structural.text.primary}`}>{stats.activeMembers}</span>
          </div>
          <div className={`text-sm ${colors.structural.text.secondary}`}>Active Members</div>
        </div>
      </div>

      {/* Day Modal */}
      <DayModal
        isOpen={selectedDay !== null}
        selectedDay={selectedDay}
        onClose={handleCloseModal}
        firefighters={firefighters}
        selectedFirefighter={selectedFirefighter}
        onFirefighterSelect={setSelectedFirefighter}
        onScheduleHold={handleScheduleHold}
        onRemoveHold={onRemoveHold}
        onMarkCompleted={onMarkCompleted}
        isAdminMode={isAdminMode}
        isDarkMode={true}
        currentShift={currentShift}
      />
    </div>
  );
}
