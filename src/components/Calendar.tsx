/**
 * Calendar Component
 *
 * Main calendar orchestrator that coordinates all calendar sub-components.
 * Automatically switches between MaterialM and legacy styling based on feature flag.
 *
 * Orchestrates:
 * - CalendarHeader: Month navigation and title
 * - CalendarGrid: Weekday headers and day cells
 * - DayModal: Modal for viewing/editing holds
 * - CalendarLegend: Color legend
 *
 * @example
 * ```tsx
 * <Calendar
 *   firefighters={firefighters}
 *   scheduledHolds={holds}
 *   onScheduleHold={handleSchedule}
 *   currentShift={currentShift}
 * />
 * ```
 */

import { useState, useMemo } from "react";
import { useFeatureFlag } from "../hooks/useFeatureFlag";
import { Firefighter, Shift, HoldDuration } from "../lib/supabase";
import {
  getMonthDays,
  attachScheduledHolds,
  ScheduledHold,
  CalendarDay,
} from "../utils/calendarUtils";
import { CardM3 } from "./m3/CardM3";
import { CalendarHeader } from './calendar/CalendarHeader';
import { CalendarGrid } from './calendar/CalendarGrid';
import { DayModal } from './calendar/DayModal';
import { CalendarLegend } from './calendar/CalendarLegend';
import { CalendarLegacy } from './CalendarLegacy';

interface CalendarProps {
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

/**
 * MaterialM Calendar Component
 */
function CalendarM3({
  firefighters,
  scheduledHolds,
  onScheduleHold,
  onRemoveHold,
  onMarkCompleted,
  loading,
  isAdminMode = false,
  isDarkMode = true,
  currentShift,
}: CalendarProps) {
  // State (minimal - only navigation and modal)
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<CalendarDay | null>(null);
  const [selectedFirefighter, setSelectedFirefighter] = useState<Firefighter | null>(null);

  // Computed values
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const calendarDays = useMemo(() => {
    const days = getMonthDays(year, month);
    return attachScheduledHolds(days, scheduledHolds, firefighters);
  }, [year, month, scheduledHolds, firefighters]);

  // Month navigation handlers
  function goToPreviousMonth() {
    setCurrentDate(new Date(year, month - 1, 1));
  }

  function goToNextMonth() {
    setCurrentDate(new Date(year, month + 1, 1));
  }

  // Day selection handler
  function handleDayClick(day: CalendarDay) {
    if (!day.isCurrentMonth) return;
    setSelectedDay(day);
  }

  // Modal close handler
  function handleCloseModal() {
    setSelectedDay(null);
    setSelectedFirefighter(null);
  }

  // Hold scheduling handler
  function handleScheduleHold(
    holdDate: string,
    firefighter: Firefighter,
    station?: string,
    duration?: HoldDuration,
    startTime?: string
  ) {
    onScheduleHold(holdDate, firefighter, station, duration, startTime);
    // Modal close is handled by DayModal based on "add another" checkbox
  }

  return (
    <CardM3 elevation={1} className="overflow-hidden">
      {/* Header section */}
      <CardM3.Header>
        <CalendarHeader
          currentDate={currentDate}
          onPreviousMonth={goToPreviousMonth}
          onNextMonth={goToNextMonth}
          currentShift={currentShift}
          isDarkMode={isDarkMode}
        />
      </CardM3.Header>

      {/* Calendar grid section */}
      <CardM3.Body>
        <CalendarGrid
          calendarDays={calendarDays}
          onDayClick={handleDayClick}
          loading={loading}
          isAdminMode={isAdminMode}
          currentShift={currentShift}
          isDarkMode={isDarkMode}
        />
      </CardM3.Body>

      {/* Legend section */}
      <CardM3.Footer>
        <CalendarLegend isDarkMode={isDarkMode} />
      </CardM3.Footer>

      {/* Day modal */}
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
        isDarkMode={isDarkMode}
        currentShift={currentShift}
      />
    </CardM3>
  );
}

/**
 * Calendar Component with Feature Flag
 *
 * Switches between MaterialM and legacy versions.
 */
export function Calendar(props: CalendarProps) {
  const useMaterialM = useFeatureFlag('MATERIALM');

  if (!useMaterialM) {
    return <CalendarLegacy {...props} />;
  }

  return <CalendarM3 {...props} />;
}
