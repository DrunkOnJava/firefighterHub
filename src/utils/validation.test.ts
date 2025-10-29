import { describe, it, expect } from 'vitest';
import {
  validateHoldDate,
  validateStatusTransition,
  validateFirefighterForHold,
  validateScheduleConflict,
  validateFireStation,
  validateLentToShift,
  validateHoldNotes,
} from './validation';
import { createMockFirefighter, mockScheduledHolds } from '../test/mockData';
import type { ScheduledHold } from './calendarUtils';

describe('Validation Utilities', () => {
  describe('validateHoldDate', () => {
    it('should accept valid future date', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      const result = validateHoldDate(tomorrow);

      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should accept today as valid date', () => {
      const today = new Date();

      const result = validateHoldDate(today);

      expect(result.valid).toBe(true);
    });

    it('should reject past dates', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      const result = validateHoldDate(yesterday);

      expect(result.valid).toBe(false);
      expect(result.error).toBe('Cannot schedule hold in the past');
    });

    it('should reject dates more than 90 days in future', () => {
      const farFuture = new Date();
      farFuture.setDate(farFuture.getDate() + 91);

      const result = validateHoldDate(farFuture);

      expect(result.valid).toBe(false);
      expect(result.error).toBe('Cannot schedule hold more than 90 days in advance');
    });

    it('should accept date exactly 90 days in future', () => {
      const ninetyDays = new Date();
      ninetyDays.setDate(ninetyDays.getDate() + 90);

      const result = validateHoldDate(ninetyDays);

      expect(result.valid).toBe(true);
    });

    it('should reject invalid date', () => {
      const result = validateHoldDate(new Date('invalid'));

      expect(result.valid).toBe(false);
      expect(result.error).toBe('Invalid date provided');
    });

    it('should reject null date', () => {
      const result = validateHoldDate(null as any);

      expect(result.valid).toBe(false);
      expect(result.error).toBe('Invalid date provided');
    });
  });

  describe('validateStatusTransition', () => {
    it('should allow scheduled → completed transition', () => {
      const result = validateStatusTransition('scheduled', 'completed');

      expect(result.valid).toBe(true);
    });

    it('should allow scheduled → skipped transition', () => {
      const result = validateStatusTransition('scheduled', 'skipped');

      expect(result.valid).toBe(true);
    });

    it('should block completed → scheduled transition', () => {
      const result = validateStatusTransition('completed', 'scheduled');

      expect(result.valid).toBe(false);
      expect(result.error).toBe('Cannot change status of completed hold');
    });

    it('should block completed → skipped transition', () => {
      const result = validateStatusTransition('completed', 'skipped');

      expect(result.valid).toBe(false);
      expect(result.error).toBe('Cannot change status of completed hold');
    });

    it('should block skipped → completed without admin override', () => {
      const result = validateStatusTransition('skipped', 'completed', false);

      expect(result.valid).toBe(false);
      expect(result.error).toBe('Cannot change status of skipped hold without admin override');
    });

    it('should allow skipped → completed with admin override', () => {
      const result = validateStatusTransition('skipped', 'completed', true);

      expect(result.valid).toBe(true);
    });

    it('should block skipped → scheduled transition', () => {
      const result = validateStatusTransition('skipped', 'scheduled');

      expect(result.valid).toBe(false);
      expect(result.error).toBe('Cannot change status of skipped hold without admin override');
    });

    it('should allow same status transition', () => {
      expect(validateStatusTransition('scheduled', 'scheduled').valid).toBe(true);
      expect(validateStatusTransition('completed', 'completed').valid).toBe(true);
      expect(validateStatusTransition('skipped', 'skipped').valid).toBe(true);
    });
  });

  describe('validateFirefighterForHold', () => {
    it('should accept active and available firefighter', () => {
      const firefighter = createMockFirefighter({
        is_active: true,
        is_available: true,
      });

      const result = validateFirefighterForHold(firefighter);

      expect(result.valid).toBe(true);
    });

    it('should reject inactive firefighter', () => {
      const firefighter = createMockFirefighter({
        is_active: false,
        is_available: true,
      });

      const result = validateFirefighterForHold(firefighter);

      expect(result.valid).toBe(false);
      expect(result.error).toBe('Firefighter is not active');
    });

    it('should reject unavailable firefighter', () => {
      const firefighter = createMockFirefighter({
        is_active: true,
        is_available: false,
      });

      const result = validateFirefighterForHold(firefighter);

      expect(result.valid).toBe(false);
      expect(result.error).toBe('Firefighter is not available for holds');
    });

    it('should reject null firefighter', () => {
      const result = validateFirefighterForHold(null as any);

      expect(result.valid).toBe(false);
      expect(result.error).toBe('Firefighter not found');
    });

    it('should accept firefighter with less than 3 holds this week', () => {
      const firefighter = createMockFirefighter({
        id: 'ff-1',
        is_active: true,
        is_available: true,
      });

      const today = new Date();
      const holds: ScheduledHold[] = [
        { ...mockScheduledHolds[0], firefighter_id: 'ff-1', hold_date: today.toISOString() },
        { ...mockScheduledHolds[0], firefighter_id: 'ff-1', hold_date: new Date(today.getTime() + 86400000).toISOString() },
      ];

      const result = validateFirefighterForHold(firefighter, holds);

      expect(result.valid).toBe(true);
    });

    it('should reject firefighter with 3+ holds this week', () => {
      const firefighter = createMockFirefighter({
        id: 'ff-1',
        is_active: true,
        is_available: true,
      });

      const today = new Date();
      const holds: ScheduledHold[] = [
        { ...mockScheduledHolds[0], firefighter_id: 'ff-1', hold_date: today.toISOString(), status: 'scheduled' },
        { ...mockScheduledHolds[0], firefighter_id: 'ff-1', hold_date: new Date(today.getTime() + 86400000).toISOString(), status: 'scheduled' },
        { ...mockScheduledHolds[0], firefighter_id: 'ff-1', hold_date: new Date(today.getTime() + 172800000).toISOString(), status: 'scheduled' },
      ];

      const result = validateFirefighterForHold(firefighter, holds);

      expect(result.valid).toBe(false);
      expect(result.error).toBe('Firefighter already has 3 holds this week');
    });

    it('should not count skipped holds toward weekly limit', () => {
      const firefighter = createMockFirefighter({
        id: 'ff-1',
        is_active: true,
        is_available: true,
      });

      const today = new Date();
      const holds: ScheduledHold[] = [
        { ...mockScheduledHolds[0], firefighter_id: 'ff-1', hold_date: today.toISOString(), status: 'skipped' },
        { ...mockScheduledHolds[0], firefighter_id: 'ff-1', hold_date: new Date(today.getTime() + 86400000).toISOString(), status: 'skipped' },
        { ...mockScheduledHolds[0], firefighter_id: 'ff-1', hold_date: new Date(today.getTime() + 172800000).toISOString(), status: 'skipped' },
      ];

      const result = validateFirefighterForHold(firefighter, holds);

      expect(result.valid).toBe(true);
    });
  });

  describe('validateScheduleConflict', () => {
    it('should allow hold when no conflicts exist', () => {
      const existingHolds: ScheduledHold[] = [
        { ...mockScheduledHolds[0], firefighter_id: 'ff-1', hold_date: '2025-11-20T00:00:00Z' },
      ];

      const result = validateScheduleConflict(existingHolds, {
        firefighter_id: 'ff-1',
        hold_date: '2025-11-21T00:00:00Z',
      });

      expect(result.valid).toBe(true);
    });

    it('should allow different firefighters on same date', () => {
      const existingHolds: ScheduledHold[] = [
        { ...mockScheduledHolds[0], firefighter_id: 'ff-1', hold_date: '2025-11-20T00:00:00Z' },
      ];

      const result = validateScheduleConflict(existingHolds, {
        firefighter_id: 'ff-2',
        hold_date: '2025-11-20T00:00:00Z',
      });

      expect(result.valid).toBe(true);
    });

    it('should reject same firefighter on same date', () => {
      const existingHolds: ScheduledHold[] = [
        { ...mockScheduledHolds[0], firefighter_id: 'ff-1', hold_date: '2025-11-20T00:00:00Z', status: 'scheduled' },
      ];

      const result = validateScheduleConflict(existingHolds, {
        firefighter_id: 'ff-1',
        hold_date: '2025-11-20T00:00:00Z',
      });

      expect(result.valid).toBe(false);
      expect(result.error).toContain('already has a hold scheduled on 2025-11-20');
    });

    it('should allow same firefighter on same date if existing hold is skipped', () => {
      const existingHolds: ScheduledHold[] = [
        { ...mockScheduledHolds[0], firefighter_id: 'ff-1', hold_date: '2025-11-20T00:00:00Z', status: 'skipped' },
      ];

      const result = validateScheduleConflict(existingHolds, {
        firefighter_id: 'ff-1',
        hold_date: '2025-11-20T00:00:00Z',
      });

      expect(result.valid).toBe(true);
    });

    it('should handle holds with different time zones on same date', () => {
      const existingHolds: ScheduledHold[] = [
        { ...mockScheduledHolds[0], firefighter_id: 'ff-1', hold_date: '2025-11-20T08:00:00Z', status: 'scheduled' },
      ];

      const result = validateScheduleConflict(existingHolds, {
        firefighter_id: 'ff-1',
        hold_date: '2025-11-20T18:00:00Z',
      });

      expect(result.valid).toBe(false); // Same calendar date, different times
    });
  });

  describe('validateFireStation', () => {
    it('should accept valid station number', () => {
      expect(validateFireStation('1').valid).toBe(true);
      expect(validateFireStation('5').valid).toBe(true);
      expect(validateFireStation('99').valid).toBe(true);
    });

    it('should reject null station', () => {
      const result = validateFireStation(null);

      expect(result.valid).toBe(false);
      expect(result.error).toBe('Fire station is required');
    });

    it('should reject empty station', () => {
      const result = validateFireStation('');

      expect(result.valid).toBe(false);
      expect(result.error).toBe('Fire station is required');
    });

    it('should reject station number < 1', () => {
      const result = validateFireStation('0');

      expect(result.valid).toBe(false);
      expect(result.error).toBe('Fire station must be a number between 1 and 99');
    });

    it('should reject station number > 99', () => {
      const result = validateFireStation('100');

      expect(result.valid).toBe(false);
      expect(result.error).toBe('Fire station must be a number between 1 and 99');
    });

    it('should reject non-numeric station', () => {
      const result = validateFireStation('ABC');

      expect(result.valid).toBe(false);
      expect(result.error).toBe('Fire station must be a number between 1 and 99');
    });

    it('should handle station with whitespace', () => {
      expect(validateFireStation('  5  ').valid).toBe(true);
    });
  });

  describe('validateLentToShift', () => {
    it('should allow null lent_to_shift (optional field)', () => {
      const result = validateLentToShift('A', null);

      expect(result.valid).toBe(true);
    });

    it('should allow lending to different shift', () => {
      expect(validateLentToShift('A', 'B').valid).toBe(true);
      expect(validateLentToShift('A', 'C').valid).toBe(true);
      expect(validateLentToShift('B', 'A').valid).toBe(true);
    });

    it('should reject lending to same shift', () => {
      const result = validateLentToShift('A', 'A');

      expect(result.valid).toBe(false);
      expect(result.error).toBe('Cannot lend firefighter to their own shift');
    });

    it('should reject invalid shift value', () => {
      const result = validateLentToShift('A', 'D' as any);

      expect(result.valid).toBe(false);
      expect(result.error).toBe('Invalid shift. Must be A, B, or C');
    });
  });

  describe('validateHoldNotes', () => {
    it('should require notes for skipped holds', () => {
      const result = validateHoldNotes('skipped', null);

      expect(result.valid).toBe(false);
      expect(result.error).toBe('Notes are required when skipping a hold');
    });

    it('should require non-empty notes for skipped holds', () => {
      const result = validateHoldNotes('skipped', '   ');

      expect(result.valid).toBe(false);
      expect(result.error).toBe('Notes are required when skipping a hold');
    });

    it('should accept notes for skipped holds', () => {
      const result = validateHoldNotes('skipped', 'Called in sick');

      expect(result.valid).toBe(true);
    });

    it('should allow null notes for scheduled holds', () => {
      const result = validateHoldNotes('scheduled', null);

      expect(result.valid).toBe(true);
    });

    it('should allow null notes for completed holds', () => {
      const result = validateHoldNotes('completed', null);

      expect(result.valid).toBe(true);
    });

    it('should allow notes for scheduled holds', () => {
      const result = validateHoldNotes('scheduled', 'Station 3 assignment');

      expect(result.valid).toBe(true);
    });
  });
});
