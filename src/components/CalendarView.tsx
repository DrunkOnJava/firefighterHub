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
import { IconButton } from './ui/IconButton';
import { gridUtilities } from '../styles';

interface CalendarViewProps {
  firefighters: Firefighter[];
  scheduledHolds: ScheduledHold[];
  onScheduleHold: (
    holdDate: string,
    firefighter: Firefighter,
    station?: string,
    duration?: HoldDuration,
    startTime?: string,
    isVoluntary?: boolean
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
    startTime?: string,
    isVoluntary?: boolean
  ) => {
    onScheduleHold(holdDate, firefighter, station, duration, startTime, isVoluntary);
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
      <div className="bg-[#3A4149] border-b-2 border-[#252A32] px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Month/Year Display */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <Calendar className="w-6 h-6 text-red-500" />
              <h2 className="text-2xl font-bold text-gray-100">
                {MONTH_NAMES[month]} {year}
              </h2>
            </div>
            <button
              onClick={goToToday}
              className="px-3 py-1 text-sm bg-[#2F3640] hover:bg-[#353D47] text-slate-300 rounded-md border border-[#252A32] transition-colors"
            >
              Today
            </button>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-2">
            <IconButton
              icon={ChevronLeft}
              label="Previous month"
              onClick={goToPreviousMonth}
              variant="default"
              size="md"
              isDarkMode={true}
            />
            <IconButton
              icon={ChevronRight}
              label="Next month"
              onClick={goToNextMonth}
              variant="default"
              size="md"
              isDarkMode={true}
            />
            <button
              className="ml-2 px-4 py-2 bg-gradient-to-br from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white rounded-md font-medium shadow-lg shadow-red-900/50 transition-all flex items-center gap-2"
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

      {/* Calendar Grid - using grid system utilities */}
      <div className="flex-1 p-6 overflow-auto">
        <div className={`${gridUtilities.calendar.container} gap-px bg-[#252A32] border border-[#252A32] rounded-lg overflow-hidden shadow-xl`}>
          {/* Weekday Headers */}
          {WEEKDAYS.map((day) => (
            <div
              key={day}
              className="bg-[#2F3640] px-3 py-4 text-center font-semibold text-slate-400 text-sm"
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
                    ? 'bg-[#2A3039] text-gray-600 cursor-default'
                    : 'bg-[#3A4149] text-gray-100 hover:bg-[#424A54] cursor-pointer'
                  }
                  ${isCurrentDay && !isOtherMonth ? 'ring-2 ring-inset ring-red-500' : ''}
                  ${hasScheduled && !isOtherMonth ? 'border-l-4 border-l-red-500' : ''}
                `}
              >
                {/* Day Number - Increased from text-sm to text-base for better scannability (VH Audit Priority 3.1) */}
                <div className={`
                  text-base font-medium mb-2
                  ${isCurrentDay ? 'text-red-400' : ''}
                  ${isOtherMonth ? 'text-gray-600' : 'text-slate-300'}
                `}>
                  {day.date.getDate()}
                </div>

                {/* Hold Indicator Badge */}
                {hasScheduled && !isOtherMonth && (
                  <div className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
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
                            ? 'bg-emerald-900/40 text-emerald-300 border border-emerald-700/50'
                            : 'bg-blue-900/40 text-blue-300 border border-blue-700/50'
                          }
                        `}
                      >
                        {hold.firefighter_name}
                      </div>
                    ))}
                    {day.scheduledHolds.length > 2 && (
                      <div className="text-xs text-slate-500 px-2">
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

      {/* Statistics Cards - using grid system utilities */}
      <div className={`${gridUtilities.form.grid4Col} px-6 pb-6`}>
        {/* Open Vacancies */}
        <div className="bg-gradient-to-br from-[#3A4149] to-[#353D47] border-2 border-red-900/50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-8 h-8 text-red-500" />
            <span className="text-3xl font-bold text-gray-100">{stats.openVacancies}</span>
          </div>
          <div className="text-sm text-slate-400">Open Vacancies</div>
        </div>

        {/* Scheduled */}
        <div className="bg-gradient-to-br from-[#3A4149] to-[#353D47] border-2 border-[#252A32] rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <Calendar className="w-8 h-8 text-blue-400" />
            <span className="text-3xl font-bold text-gray-100">{stats.scheduled}</span>
          </div>
          <div className="text-sm text-slate-400">Scheduled</div>
        </div>

        {/* Completed */}
        <div className="bg-gradient-to-br from-[#3A4149] to-[#353D47] border-2 border-emerald-900/50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-500" />
            <span className="text-3xl font-bold text-gray-100">{stats.completed}</span>
          </div>
          <div className="text-sm text-slate-400">Completed</div>
        </div>

        {/* Active Members */}
        <div className="bg-gradient-to-br from-[#3A4149] to-[#353D47] border-2 border-amber-900/50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-8 h-8 text-amber-500" />
            <span className="text-3xl font-bold text-gray-100">{stats.activeMembers}</span>
          </div>
          <div className="text-sm text-slate-400">Active Members</div>
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
