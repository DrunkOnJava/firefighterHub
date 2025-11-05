/**
 * Calendar Component (Refactored Orchestrator)
 * 
 * Simplified calendar component that orchestrates sub-components:
 * - CalendarHeader: Navigation and title
 * - CalendarGrid: Weekday headers and day cells
 * - DayModal: Modal for viewing/editing holds
 * - CalendarLegend: Color legend
 * 
 * Reduced from 910 lines to ~160 lines by extracting components.
 * Uses design tokens for consistent styling.
 */

import { useState, useMemo } from "react";
import { Firefighter, Shift, HoldDuration } from "../lib/supabase";
import {
  getMonthDays,
  attachScheduledHolds,
  ScheduledHold,
  CalendarDay,
} from "../utils/calendarUtils";
import { CalendarHeader } from './calendar/CalendarHeader';
import { CalendarGrid } from './calendar/CalendarGrid';
import { DayModal } from './calendar/DayModal';
import { CalendarLegend } from './calendar/CalendarLegend';
import { colors, tokens } from '../styles';

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

export function CalendarLegacy({
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
    <div
      className={`
        ${colors.structural.bg.card}
        ${colors.structural.border.default}
        ${tokens.borders.radius.xl}
        ${tokens.spacing.card.md}
        border-2
        ${tokens.shadows.sm}
        overflow-hidden
      `}
    >
      {/* Header section */}
      <div className={`
        border-b-2
        ${isDarkMode ? 'border-gray-700' : 'border-gray-300'}
        ${tokens.spacing.card.md}
      `}>
        <CalendarHeader
          currentDate={currentDate}
          onPreviousMonth={goToPreviousMonth}
          onNextMonth={goToNextMonth}
          currentShift={currentShift}
          isDarkMode={isDarkMode}
        />
      </div>

      {/* Calendar grid section */}
      <div className={`${tokens.spacing.card.md} w-full`}>
        <CalendarGrid
          calendarDays={calendarDays}
          onDayClick={handleDayClick}
          loading={loading}
          isAdminMode={isAdminMode}
          currentShift={currentShift}
          isDarkMode={isDarkMode}
        />
      </div>

      {/* Legend section */}
      <div className={`
        border-t-2
        ${isDarkMode ? 'border-gray-700' : 'border-gray-300'}
        ${tokens.spacing.card.md}
      `}>
        <CalendarLegend isDarkMode={isDarkMode} />
      </div>

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
    </div>
  );
}
