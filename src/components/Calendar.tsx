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

import { useFeatureFlag } from "../hooks/useFeatureFlag";
import { Firefighter, Shift, HoldDuration } from "../lib/supabase";
import { ScheduledHold } from "../utils/calendarUtils";
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
// Temporarily using legacy calendar - MaterialM version needs layout refinement
// The MaterialM conversion was making the calendar too cramped
// TODO: Fix MaterialM calendar layout to match legacy spacing
function CalendarM3(props: CalendarProps) {
  return <CalendarLegacy {...props} />;
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
