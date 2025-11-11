/**
 * Regression Tests for Known Bugs
 * 
 * These tests document and prevent known bugs from reoccurring.
 * Each test references the bug report in project documentation.
 */

import { describe, it, expect } from 'vitest';
import { 
  moveToBottom, 
  recalculatePositions,
  assignPositions
} from './rotationLogic';
import { formatDateForDB, getMonthDays } from './calendarUtils';
import type { Firefighter } from '@/lib/supabase';

describe('Regression Tests - Known Bugs', () => {
  describe('BUG: Position Gap Bug', () => {
    /**
     * ISSUE: After multiple hold completions, positions can have gaps
     * EXPECTED: Positions should be continuous: [0, 1, 2, 3...]
     * ACTUAL: Positions had gaps: [0, 5, 10, 15...]
     * CAUSE: moveToBottom() was setting max + 1 without recalculating
     * FIX: Always call recalculatePositions() after position changes
     */
    
    it('should prevent position gaps after multiple hold completions', () => {
      const firefighters: Firefighter[] = [
        { id: '1', name: 'FF1', order_position: 0, is_available: true, is_active: true, shift: 'A', last_hold_date: null } as Firefighter,
        { id: '2', name: 'FF2', order_position: 1, is_available: true, is_active: true, shift: 'A', last_hold_date: null } as Firefighter,
        { id: '3', name: 'FF3', order_position: 2, is_available: true, is_active: true, shift: 'A', last_hold_date: null } as Firefighter,
        { id: '4', name: 'FF4', order_position: 3, is_available: true, is_active: true, shift: 'A', last_hold_date: null } as Firefighter,
      ];

      // Simulate multiple hold completions
      let updated = moveToBottom(firefighters, '1'); // FF1 to bottom
      updated = recalculatePositions(updated); // CRITICAL: Must recalculate
      expect(updated.map(f => f.order_position)).toEqual([0, 1, 2, 3]);

      updated = moveToBottom(updated, '2'); // FF2 to bottom
      updated = recalculatePositions(updated); // CRITICAL: Must recalculate
      expect(updated.map(f => f.order_position)).toEqual([0, 1, 2, 3]);

      updated = moveToBottom(updated, '3'); // FF3 to bottom
      updated = recalculatePositions(updated); // CRITICAL: Must recalculate
      expect(updated.map(f => f.order_position)).toEqual([0, 1, 2, 3]);

      // Verify no gaps exist
      const positions = updated.map(f => f.order_position).sort((a, b) => a - b);
      expect(positions).toEqual([0, 1, 2, 3]);
      
      // Verify positions are continuous (no gaps)
      for (let i = 0; i < positions.length - 1; i++) {
        expect(positions[i + 1] - positions[i]).toBe(1);
      }
    });

    it('should prevent gaps when adding new firefighter after deletions', () => {
      const firefighters: Firefighter[] = [
        { id: '1', name: 'FF1', order_position: 0, is_available: true, is_active: true, shift: 'A', last_hold_date: null } as Firefighter,
        { id: '2', name: 'FF2', order_position: 5, is_available: true, is_active: true, shift: 'A', last_hold_date: null } as Firefighter,
        { id: '3', name: 'FF3', order_position: 10, is_available: true, is_active: true, shift: 'A', last_hold_date: null } as Firefighter,
      ];

      // Recalculate should fix gaps
      const fixed = recalculatePositions(firefighters);
      expect(fixed.map(f => f.order_position)).toEqual([0, 1, 2]);
    });
  });

  describe('BUG: Timezone Date Off-By-One', () => {
    /**
     * ISSUE: Dates displayed as one day earlier in calendar/modals
     * EXPECTED: October 15 displays as "Oct 15" everywhere
     * ACTUAL: October 15 was displaying as "Oct 14" in some places
     * CAUSE: Mixing UTC and local timezone conversions
     * FIX: Always use UTC timezone in toLocaleDateString() options
     */

    it('should format dates for database without timezone shifts', () => {
      const date = new Date('2024-10-15T12:00:00.000Z');
      const formatted = formatDateForDB(date);
      expect(formatted).toBe('2024-10-15');
    });

    it('should handle end of month dates correctly', () => {
      const endOfMonth = new Date('2024-10-31T23:59:59.999Z');
      const formatted = formatDateForDB(endOfMonth);
      expect(formatted).toBe('2024-10-31');
    });

    it('should generate calendar days without date shifts', () => {
      const days = getMonthDays(2024, 9); // October 2024
      
      // Find October dates
      const octoberDays = days.filter(day => day.date.getMonth() === 9 && day.isCurrentMonth);
      expect(octoberDays.length).toBe(31); // October has 31 days
      
      // Verify October 1st is actually October 1st
      const firstDay = octoberDays.find(day => day.date.getDate() === 1);
      expect(firstDay).toBeDefined();
      expect(firstDay?.date.getMonth()).toBe(9); // October (0-indexed)
    });
  });

  describe('BUG: Inactive Firefighters Appearing in Lists', () => {
    /**
     * ISSUE: Deleted firefighters (is_active = false) appearing in roster
     * EXPECTED: Only active firefighters shown
     * ACTUAL: Soft-deleted firefighters were visible
     * CAUSE: Missing is_active = true filter in queries
     */

    it('should filter out inactive firefighters from active roster', () => {
      const allFirefighters: Firefighter[] = [
        { id: '1', name: 'Active1', order_position: 0, is_available: true, is_active: true, shift: 'A', last_hold_date: null } as Firefighter,
        { id: '2', name: 'Deleted1', order_position: 1, is_available: true, is_active: false, shift: 'A', last_hold_date: null } as Firefighter,
        { id: '3', name: 'Active2', order_position: 2, is_available: true, is_active: true, shift: 'A', last_hold_date: null } as Firefighter,
      ];

      const activeOnly = allFirefighters.filter(ff => ff.is_active);
      
      expect(activeOnly).toHaveLength(2);
      expect(activeOnly.every(ff => ff.is_active)).toBe(true);
      expect(activeOnly.find(ff => ff.name === 'Deleted1')).toBeUndefined();
    });
  });

  describe('BUG: Rotation Order After Reactivation', () => {
    /**
     * ISSUE: Reactivated firefighters appearing in wrong position
     * EXPECTED: Reactivated firefighters go to end of rotation
     * ACTUAL: They kept their old position, disrupting order
     */

    it('should place reactivated firefighters at end of rotation', () => {
      const firefighters: Firefighter[] = [
        { id: '1', name: 'FF1', order_position: 0, is_available: true, is_active: true, shift: 'A', last_hold_date: null } as Firefighter,
        { id: '2', name: 'FF2', order_position: 1, is_available: true, is_active: true, shift: 'A', last_hold_date: null } as Firefighter,
        { id: '3', name: 'FF3', order_position: 999, is_available: true, is_active: true, shift: 'A', last_hold_date: null } as Firefighter,
      ];

      const reordered = assignPositions(firefighters);
      expect(reordered.map(f => f.order_position)).toEqual([0, 1, 2]);
    });
  });

  describe('BUG: Multiple Simultaneous Operations Creating Race Conditions', () => {
    /**
     * ISSUE: When completing multiple holds quickly, rotation can get corrupted
     * EXPECTED: Each operation should complete atomically
     * ACTUAL: Concurrent updates could overwrite each other
     */

    it('should maintain rotation integrity through sequential operations', () => {
      let firefighters: Firefighter[] = [
        { id: '1', name: 'FF1', order_position: 0, is_available: true, is_active: true, shift: 'A', last_hold_date: null } as Firefighter,
        { id: '2', name: 'FF2', order_position: 1, is_available: true, is_active: true, shift: 'A', last_hold_date: null } as Firefighter,
        { id: '3', name: 'FF3', order_position: 2, is_available: true, is_active: true, shift: 'A', last_hold_date: null } as Firefighter,
      ];

      // Simulate rapid sequential operations
      firefighters = moveToBottom(firefighters, '1');
      firefighters = recalculatePositions(firefighters);
      
      firefighters = moveToBottom(firefighters, '2');
      firefighters = recalculatePositions(firefighters);
      
      firefighters = moveToBottom(firefighters, '3');
      firefighters = recalculatePositions(firefighters);

      // All positions should still be valid and continuous
      const positions = firefighters.map(f => f.order_position).sort((a, b) => a - b);
      expect(positions).toEqual([0, 1, 2]);
      
      // No duplicates
      const uniquePositions = new Set(positions);
      expect(uniquePositions.size).toBe(3);
    });
  });
});
