import { Firefighter, HoldDuration } from '../lib/supabase';
import { ScheduledHold } from './calendarUtils';

export interface ValidationResult {
  valid: boolean;
  error?: string;
  warning?: string;
}

/**
 * Validates that a hold date is valid for scheduling
 * Rules:
 * - Cannot be in the past (before today)
 * - Cannot be more than 90 days in the future
 */
export function validateHoldDate(date: Date): ValidationResult {
  if (!date || isNaN(date.getTime())) {
    return { valid: false, error: 'Invalid date provided' };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const holdDate = new Date(date);
  holdDate.setHours(0, 0, 0, 0);

  if (holdDate < today) {
    return { valid: false, error: 'Cannot schedule hold in the past' };
  }

  const maxFutureDate = new Date(today);
  maxFutureDate.setDate(maxFutureDate.getDate() + 90);

  if (holdDate > maxFutureDate) {
    return { valid: false, error: 'Cannot schedule hold more than 90 days in advance' };
  }

  return { valid: true };
}

/**
 * Validates hold status transitions
 * Valid transitions:
 * - scheduled → completed ✓
 * - scheduled → skipped ✓
 * - completed → scheduled ✗
 * - completed → skipped ✗
 * - skipped → completed ✗ (unless admin override)
 * - skipped → scheduled ✗
 */
export function validateStatusTransition(
  fromStatus: ScheduledHold['status'],
  toStatus: ScheduledHold['status'],
  isAdminOverride: boolean = false
): ValidationResult {
  if (fromStatus === toStatus) {
    return { valid: true };
  }

  // From scheduled: can go to completed or skipped
  if (fromStatus === 'scheduled') {
    if (toStatus === 'completed' || toStatus === 'skipped') {
      return { valid: true };
    }
  }

  // From completed: cannot change status
  if (fromStatus === 'completed') {
    return { valid: false, error: 'Cannot change status of completed hold' };
  }

  // From skipped: can only go to completed with admin override
  if (fromStatus === 'skipped') {
    if (toStatus === 'completed' && isAdminOverride) {
      return { valid: true };
    }
    return { valid: false, error: 'Cannot change status of skipped hold without admin override' };
  }

  return { valid: false, error: `Invalid status transition from ${fromStatus} to ${toStatus}` };
}

/**
 * Validates that a firefighter is eligible for a hold
 * Rules:
 * - Must be active (is_active = true)
 * - Must be available (is_available = true)
 * - Must not have more than 3 holds in the same week
 */
export function validateFirefighterForHold(
  firefighter: Firefighter,
  existingHolds: ScheduledHold[] = []
): ValidationResult {
  if (!firefighter) {
    return { valid: false, error: 'Firefighter not found' };
  }

  if (!firefighter.is_active) {
    return { valid: false, error: 'Firefighter is not active' };
  }

  if (!firefighter.is_available) {
    return { valid: false, error: 'Firefighter is not available for holds' };
  }

  // Check weekly hold limit
  const firefighterHolds = existingHolds.filter(
    h => h.firefighter_id === firefighter.id && h.status !== 'skipped'
  );

  if (firefighterHolds.length >= 3) {
    // Check if holds are in same week
    const holdsThisWeek = firefighterHolds.filter(h => {
      const holdDate = new Date(h.hold_date);
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      weekStart.setHours(0, 0, 0, 0);

      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 7);

      return holdDate >= weekStart && holdDate < weekEnd;
    });

    if (holdsThisWeek.length >= 3) {
      return { valid: false, error: 'Firefighter already has 3 holds this week' };
    }
  }

  return { valid: true };
}

/**
 * Validates that a new hold doesn't conflict with existing holds
 * Rules:
 * - Same firefighter cannot have multiple holds on same date
 * - Different firefighters can have holds on same date
 */
export function validateScheduleConflict(
  existingHolds: ScheduledHold[],
  newHold: { firefighter_id: string; hold_date: string }
): ValidationResult {
  const conflictingHold = existingHolds.find(
    h =>
      h.firefighter_id === newHold.firefighter_id &&
      h.hold_date.split('T')[0] === newHold.hold_date.split('T')[0] &&
      h.status !== 'skipped'
  );

  if (conflictingHold) {
    return {
      valid: false,
      error: `Firefighter already has a hold scheduled on ${newHold.hold_date.split('T')[0]}`
    };
  }

  return { valid: true };
}

/**
 * Validates fire station number
 * Rules:
 * - Must be a valid string number (1-99)
 * - Cannot be null or empty
 */
export function validateFireStation(station: string | null): ValidationResult {
  if (!station || station.trim() === '') {
    return { valid: false, error: 'Fire station is required' };
  }

  const stationNum = parseInt(station, 10);
  if (isNaN(stationNum) || stationNum < 1 || stationNum > 99) {
    return { valid: false, error: 'Fire station must be a number between 1 and 99' };
  }

  return { valid: true };
}

/**
 * Validates lent_to_shift assignment
 * Rules:
 * - Cannot lend firefighter to their own shift
 * - Must be a valid shift (A, B, or C)
 */
export function validateLentToShift(
  firefighterShift: 'A' | 'B' | 'C',
  lentToShift: 'A' | 'B' | 'C' | null
): ValidationResult {
  if (!lentToShift) {
    return { valid: true }; // Optional field
  }

  if (!['A', 'B', 'C'].includes(lentToShift)) {
    return { valid: false, error: 'Invalid shift. Must be A, B, or C' };
  }

  if (firefighterShift === lentToShift) {
    return { valid: false, error: 'Cannot lend firefighter to their own shift' };
  }

  return { valid: true };
}

/**
 * Validates that notes are provided when required
 * Rules:
 * - Notes required for skipped holds
 * - Notes optional for completed/scheduled holds
 */
export function validateHoldNotes(
  status: ScheduledHold['status'],
  notes: string | null
): ValidationResult {
  if (status === 'skipped' && (!notes || notes.trim() === '')) {
    return { valid: false, error: 'Notes are required when skipping a hold' };
  }

  return { valid: true };
}

/**
 * Validates 72-hour rule
 * Rules:
 * - If member has worked >72 hours prior to hold date, they are skipped
 * - If hold would make them exceed 72 hours, they are skipped
 * - Member remains at position #0 when skipped
 *
 * @param firefighter Firefighter to check
 * @param holdDuration Duration of the hold being scheduled (12h or 24h)
 * @returns ValidationResult with warning if would exceed 72 hours
 */
export function validate72HourRule(
  firefighter: Firefighter,
  holdDuration: HoldDuration
): ValidationResult {
  const hoursWorked = firefighter.hours_worked_this_period || 0;
  const holdHours = holdDuration === '12h' ? 12 : 24;
  const totalHours = hoursWorked + holdHours;

  // NOTE: Changed from blocking to warning-only per user feedback
  // User stated: "There is no way to accurately calculate that without manually
  // checking through the scheduling program"
  // Hours tracking is informational only and should not block scheduling

  // Warning if already over 72 hours (was blocking before)
  if (hoursWorked > 72) {
    return {
      valid: true,  // ✅ Changed from false to true - allow scheduling
      warning: `⚠️ ${firefighter.name} has already worked ${hoursWorked} hours this period (exceeds 72-hour limit). Manual verification recommended.`
    };
  }

  // Warning if hold would cause them to exceed 72 hours (was blocking before)
  if (totalHours > 72) {
    return {
      valid: true,  // ✅ Changed from false to true - allow scheduling
      warning: `⚠️ ${firefighter.name} has worked ${hoursWorked} hours. Adding this ${holdDuration} hold would total ${totalHours} hours (exceeds 72-hour limit). Manual verification recommended.`
    };
  }

  // Warning if getting close to limit (within 12 hours)
  if (totalHours > 60) {
    return {
      valid: true,
      warning: `${firefighter.name} will have ${totalHours} hours after this hold (approaching 72-hour limit).`
    };
  }

  return { valid: true };
}

/**
 * Checks if a hold is locked (created more than 1 week ago)
 * Rules:
 * - Holds are locked 1 week (7 days) after creation
 * - Locked holds cannot be edited or canceled without admin override
 *
 * @param hold The hold to check
 * @returns true if hold is locked, false otherwise
 */
export function isHoldLocked(hold: ScheduledHold): boolean {
  const createdDate = new Date(hold.created_at);
  const now = new Date();
  const daysSinceCreation = (now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24);

  return daysSinceCreation > 7;
}

/**
 * Validates that a hold can be edited
 * Rules:
 * - Cannot edit locked holds (>1 week old) without admin override
 *
 * @param hold The hold to check
 * @param isAdminOverride Whether admin is overriding the lock
 * @returns ValidationResult
 */
export function validateHoldEditable(
  hold: ScheduledHold,
  isAdminOverride: boolean = false
): ValidationResult {
  if (isHoldLocked(hold) && !isAdminOverride) {
    return {
      valid: false,
      error: 'This hold is locked (created more than 1 week ago) and cannot be edited. Contact an administrator for override.'
    };
  }

  return { valid: true };
}

/**
 * Validates hold duration
 * Rules:
 * - Must be either '12h' or '24h'
 * - Defaults to '24h' if not specified
 */
export function validateHoldDuration(duration: string | null | undefined): ValidationResult {
  if (!duration) {
    return { valid: true, warning: 'No duration specified, defaulting to 24h' };
  }

  if (duration !== '12h' && duration !== '24h') {
    return { valid: false, error: 'Hold duration must be either 12h or 24h' };
  }

  return { valid: true };
}

/**
 * Validates hold start time
 * Rules:
 * - Must be in HH:MM or HH:MM:SS format
 * - Defaults to 07:00 if not specified
 */
export function validateStartTime(startTime: string | null | undefined): ValidationResult {
  if (!startTime) {
    return { valid: true, warning: 'No start time specified, defaulting to 07:00' };
  }

  // Check if time is in valid format (HH:MM or HH:MM:SS)
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/;
  if (!timeRegex.test(startTime)) {
    return { valid: false, error: 'Start time must be in HH:MM or HH:MM:SS format' };
  }

  return { valid: true };
}
