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
import { CalendarM3 } from './CalendarM3';

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
 * Calendar Component with Feature Flag
 *
 * Switches between MaterialM and legacy versions.
 * MaterialM version uses OKLCH color palette and updated spacing.
 */
export function Calendar(props: CalendarProps) {
  const useMaterialM = useFeatureFlag('MATERIALM');

  if (!useMaterialM) {
    return <CalendarLegacy {...props} />;
  }

  return <CalendarM3 {...props} />;
}
