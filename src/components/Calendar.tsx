/**
 * Calendar Component (Refactored Orchestrator)
 * 
 * Simplified calendar component that orchestrates sub-components:
 * - CalendarHeader: Navigation and title
 * - CalendarGrid: Weekday headers and day cells (desktop/tablet)
 * - MobileWeekView: Single week view for mobile devices
 * - DayModal: Modal for viewing/editing holds
 * - CalendarLegend: Color legend
 * 
 * Mobile Optimizations:
 * - Uses MobileWeekView on mobile (< 768px) with horizontal swipe
 * - Bottom sheet day modal on mobile
 * - Larger touch targets for mobile interactions
 */

import { useState, useMemo } from "react";
import { useDevice } from "../hooks/useDevice";
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
import { MobileWeekView } from './mobile/MobileWeekView';
import { BottomSheet } from './mobile/BottomSheet';

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
  onSkipFirefighter?: (firefighterId: string) => void;
  loading: boolean;
  isAdminMode?: boolean;
  currentShift: Shift;
}

export function Calendar({
  firefighters,
  scheduledHolds,
  onScheduleHold,
  onRemoveHold,
  onMarkCompleted,
  onSkipFirefighter,
  loading,
  isAdminMode = false,
  currentShift,
}: CalendarProps) {
  const device = useDevice();
  
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

  function goToToday() {
    const today = new Date();
    setCurrentDate(new Date(today.getFullYear(), today.getMonth(), 1));
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

  // Firefighter selection handler with skip support
  function handleFirefighterSelect(ff: Firefighter | null) {
    if (ff === null && onSkipFirefighter) {
      // Skip the next firefighter (move them to bottom)
      const nextInRotation = firefighters
        .filter(f => f.is_available)
        .sort((a, b) => a.order_position - b.order_position)[0];
      
      if (nextInRotation) {
        onSkipFirefighter(nextInRotation.id);
      }
    } else if (ff) {
      setSelectedFirefighter(ff);
    }
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
    <div className="
      bg-card rounded-xl p-4 border border-border/20
      shadow-sm overflow-hidden
    ">
      {/* Header section */}
      <div className="border-b border-border/10 pb-3">
        <CalendarHeader
          currentDate={currentDate}
          onPreviousMonth={goToPreviousMonth}
          onNextMonth={goToNextMonth}
          onGoToToday={goToToday}
          currentShift={currentShift}
        />
      </div>

      {/* Calendar grid section */}
      <div className="p-4 w-full">
        {device.isMobile ? (
          <MobileWeekView
            currentDate={currentDate}
            onDateChange={setCurrentDate}
            firefighters={firefighters}
            scheduledHolds={scheduledHolds}
            onDayClick={handleDayClick}
            currentShift={currentShift}
          />
        ) : (
          <CalendarGrid
            calendarDays={calendarDays}
            onDayClick={handleDayClick}
            onPreviousMonth={goToPreviousMonth}
            onNextMonth={goToNextMonth}
            loading={loading}
            isAdminMode={isAdminMode}
            currentShift={currentShift}
          />
        )}
      </div>

      {/* Day modal - Use BottomSheet on mobile, regular modal on desktop */}
      {device.isMobile ? (
        <BottomSheet
          isOpen={selectedDay !== null}
          onClose={handleCloseModal}
          title={selectedDay ? selectedDay.date.toLocaleDateString() : ''}
          height="auto"
        >
          {selectedDay && (
            <div className="px-6 py-4">
              <DayModal
                isOpen={selectedDay !== null}
                selectedDay={selectedDay}
                onClose={handleCloseModal}
                firefighters={firefighters}
                selectedFirefighter={selectedFirefighter}
                onFirefighterSelect={handleFirefighterSelect}
                onScheduleHold={handleScheduleHold}
                onRemoveHold={onRemoveHold}
                onMarkCompleted={onMarkCompleted}
                onSkipFirefighter={onSkipFirefighter}
                isAdminMode={isAdminMode}
                currentShift={currentShift}
              />
            </div>
          )}
        </BottomSheet>
      ) : (
        <DayModal
          isOpen={selectedDay !== null}
          selectedDay={selectedDay}
          onClose={handleCloseModal}
          firefighters={firefighters}
          selectedFirefighter={selectedFirefighter}
          onFirefighterSelect={handleFirefighterSelect}
          onScheduleHold={handleScheduleHold}
          onRemoveHold={onRemoveHold}
          onMarkCompleted={onMarkCompleted}
          onSkipFirefighter={onSkipFirefighter}
          isAdminMode={isAdminMode}
          currentShift={currentShift}
        />
      )}
    </div>
  );
}
