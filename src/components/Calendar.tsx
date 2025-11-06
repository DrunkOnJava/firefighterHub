/**
 * Calendar Component
 *
 * Main calendar orchestrator that coordinates all calendar sub-components.
 * Uses MaterialM design system with OKLCH color palette and updated spacing.
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

export { CalendarM3 as Calendar } from './CalendarM3';
