import { describe, it, expect } from 'vitest';
import {
  getMonthDays,
  attachScheduledHolds,
  formatDateForDB,
  parseDateStringLocal,
  formatMonthYear,
  getMonthDateRange,
  autoScheduleNextHolds,
  getNextAvailableFirefighter,
  getInitials,
  type ScheduledHold,
} from './calendarUtils';
import { createMockFirefighter, mockScheduledHolds } from '../test/mockData';

describe('calendarUtils', () => {
  describe('formatDateForDB', () => {
    it('returns YYYY-MM-DD format', () => {
      const date = new Date(2025, 9, 27); // October 27, 2025 (month is 0-indexed)
      const result = formatDateForDB(date);
      expect(result).toBe('2025-10-27');
    });

    it('pads single-digit months and days with zeros', () => {
      const date = new Date(2025, 0, 5); // January 5, 2025
      const result = formatDateForDB(date);
      expect(result).toBe('2025-01-05');
    });

    it('handles timezone correctly (uses local date)', () => {
      const date = new Date(2025, 11, 31); // December 31, 2025
      const result = formatDateForDB(date);
      expect(result).toBe('2025-12-31');
    });
  });

  describe('parseDateStringLocal', () => {
    it('parses ISO string to Date object', () => {
      const result = parseDateStringLocal('2025-10-27');
      expect(result).toBeInstanceOf(Date);
      expect(result.getFullYear()).toBe(2025);
      expect(result.getMonth()).toBe(9); // October (0-indexed)
      expect(result.getDate()).toBe(27);
    });

    it('handles timezone correctly (parses as local, not UTC)', () => {
      const result = parseDateStringLocal('2025-01-15');
      expect(result.getFullYear()).toBe(2025);
      expect(result.getMonth()).toBe(0); // January
      expect(result.getDate()).toBe(15);
    });

    it('maintains date consistency with formatDateForDB', () => {
      const originalDate = new Date(2025, 5, 15); // June 15, 2025
      const formatted = formatDateForDB(originalDate);
      const parsed = parseDateStringLocal(formatted);

      expect(parsed.getFullYear()).toBe(originalDate.getFullYear());
      expect(parsed.getMonth()).toBe(originalDate.getMonth());
      expect(parsed.getDate()).toBe(originalDate.getDate());
    });
  });

  describe('getMonthDays', () => {
    it('returns correct number of days for month', () => {
      // January 2025 has 31 days
      const days = getMonthDays(2025, 0);
      const currentMonthDays = days.filter(d => d.isCurrentMonth);
      expect(currentMonthDays).toHaveLength(31);
    });

    it('handles leap years', () => {
      // February 2024 is a leap year (29 days)
      const days = getMonthDays(2024, 1);
      const currentMonthDays = days.filter(d => d.isCurrentMonth);
      expect(currentMonthDays).toHaveLength(29);

      // February 2025 is not a leap year (28 days)
      const days2025 = getMonthDays(2025, 1);
      const currentMonthDays2025 = days2025.filter(d => d.isCurrentMonth);
      expect(currentMonthDays2025).toHaveLength(28);
    });

    it('includes padding days from previous/next month', () => {
      const days = getMonthDays(2025, 9); // October 2025
      // Should always have 42 days (6 weeks)
      expect(days).toHaveLength(42);

      // Check that some days are from previous month
      const prevMonthDays = days.filter(d => !d.isCurrentMonth && d.date < new Date(2025, 9, 1));
      expect(prevMonthDays.length).toBeGreaterThan(0);

      // Check that some days are from next month
      const nextMonthDays = days.filter(d => !d.isCurrentMonth && d.date > new Date(2025, 9, 31));
      expect(nextMonthDays.length).toBeGreaterThan(0);
    });

    it('marks isCurrentMonth correctly', () => {
      const days = getMonthDays(2025, 9); // October 2025
      days.forEach(day => {
        if (day.date.getMonth() === 9 && day.date.getFullYear() === 2025) {
          expect(day.isCurrentMonth).toBe(true);
        } else {
          expect(day.isCurrentMonth).toBe(false);
        }
      });
    });

    it('marks isToday correctly', () => {
      const today = new Date();
      const days = getMonthDays(today.getFullYear(), today.getMonth());

      const todayDay = days.find(d => d.isToday);
      if (todayDay) {
        expect(todayDay.date.getDate()).toBe(today.getDate());
      }
    });

    it('marks isWeekend correctly', () => {
      const days = getMonthDays(2025, 9);
      days.forEach(day => {
        const dayOfWeek = day.date.getDay();
        if (dayOfWeek === 0 || dayOfWeek === 6) {
          expect(day.isWeekend).toBe(true);
        } else {
          expect(day.isWeekend).toBe(false);
        }
      });
    });

    it('marks isPast correctly', () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const days = getMonthDays(2025, 9);
      days.forEach(day => {
        const dayDate = new Date(day.date);
        dayDate.setHours(0, 0, 0, 0);

        if (dayDate < today) {
          expect(day.isPast).toBe(true);
        } else {
          expect(day.isPast).toBe(false);
        }
      });
    });

    it('initializes scheduledHolds as empty array', () => {
      const days = getMonthDays(2025, 9);
      days.forEach(day => {
        expect(day.scheduledHolds).toEqual([]);
      });
    });
  });

  describe('attachScheduledHolds', () => {
    it('attaches holds to correct calendar days', () => {
      const days = getMonthDays(2025, 10); // November 2025
      const holds: ScheduledHold[] = [
        {
          ...mockScheduledHolds[0],
          hold_date: '2025-11-15T00:00:00Z',
        },
      ];

      const result = attachScheduledHolds(days, holds, []);

      const nov15 = result.find(d => d.date.getDate() === 15 && d.date.getMonth() === 10);
      expect(nov15?.scheduledHolds).toHaveLength(1);
      expect(nov15?.scheduledHolds[0].firefighter_name).toBe('John Doe');
    });

    it('handles multiple holds on same day', () => {
      const days = getMonthDays(2025, 10);
      const holds: ScheduledHold[] = [
        {
          ...mockScheduledHolds[0],
          hold_date: '2025-11-15T00:00:00Z',
        },
        {
          ...mockScheduledHolds[1],
          hold_date: '2025-11-15T00:00:00Z',
        },
      ];

      const result = attachScheduledHolds(days, holds, []);

      const nov15 = result.find(d => d.date.getDate() === 15 && d.date.getMonth() === 10);
      expect(nov15?.scheduledHolds).toHaveLength(2);
    });

    it('handles days with no holds', () => {
      const days = getMonthDays(2025, 10);
      const holds: ScheduledHold[] = [];

      const result = attachScheduledHolds(days, holds, []);

      result.forEach(day => {
        expect(day.scheduledHolds).toEqual([]);
      });
    });

    it('creates past holds from firefighter last_hold_date', () => {
      const days = getMonthDays(2025, 9); // October 2025
      const firefighters = [
        createMockFirefighter({
          id: 'ff-1',
          name: 'John Doe',
          last_hold_date: '2025-10-20T00:00:00Z',
        }),
      ];

      const result = attachScheduledHolds(days, [], firefighters);

      const oct20 = result.find(d => d.date.getDate() === 20 && d.date.getMonth() === 9);
      expect(oct20?.scheduledHolds).toHaveLength(1);
      expect(oct20?.scheduledHolds[0].status).toBe('completed');
      expect(oct20?.scheduledHolds[0].firefighter_name).toBe('John Doe');
    });

    it('does not duplicate holds if already in scheduled_holds', () => {
      const days = getMonthDays(2025, 9);
      const firefighters = [
        createMockFirefighter({
          id: 'ff-1',
          name: 'John Doe',
          last_hold_date: '2025-10-20T00:00:00Z',
        }),
      ];
      const holds: ScheduledHold[] = [
        {
          id: 'hold-1',
          firefighter_id: 'ff-1',
          firefighter_name: 'John Doe',
          hold_date: '2025-10-20T00:00:00Z',
          status: 'completed',
          shift: 'A',
          fire_station: '1',
          notes: null,
          created_at: '2025-10-20T00:00:00Z',
          updated_at: '2025-10-20T00:00:00Z',
          completed_at: '2025-10-20T00:00:00Z',
        },
      ];

      const result = attachScheduledHolds(days, holds, firefighters);

      const oct20 = result.find(d => d.date.getDate() === 20 && d.date.getMonth() === 9);
      expect(oct20?.scheduledHolds).toHaveLength(1); // Should not duplicate
    });
  });

  describe('formatMonthYear', () => {
    it('formats month and year correctly', () => {
      const date = new Date(2025, 9, 15); // October 15, 2025
      const result = formatMonthYear(date);
      expect(result).toBe('October 2025');
    });

    it('handles different months', () => {
      expect(formatMonthYear(new Date(2025, 0, 1))).toBe('January 2025');
      expect(formatMonthYear(new Date(2025, 11, 1))).toBe('December 2025');
    });
  });

  describe('getMonthDateRange', () => {
    it('returns first and last day of month', () => {
      const result = getMonthDateRange(2025, 9); // October 2025

      expect(result.start).toBe('2025-10-01');
      expect(result.end).toBe('2025-10-31');
    });

    it('handles February in leap year', () => {
      const result = getMonthDateRange(2024, 1); // February 2024
      expect(result.end).toBe('2024-02-29');
    });

    it('handles February in non-leap year', () => {
      const result = getMonthDateRange(2025, 1); // February 2025
      expect(result.end).toBe('2025-02-28');
    });

    it('handles months with 30 days', () => {
      const result = getMonthDateRange(2025, 3); // April 2025
      expect(result.end).toBe('2025-04-30');
    });
  });

  describe('autoScheduleNextHolds', () => {
    it('schedules holds for specified number of days', () => {
      const firefighters = [
        createMockFirefighter({ id: '1', order_position: 0, is_available: true }),
        createMockFirefighter({ id: '2', order_position: 1, is_available: true }),
      ];
      const startDate = new Date(2025, 10, 1); // November 1, 2025

      const result = autoScheduleNextHolds(firefighters, startDate, 5);

      expect(result).toHaveLength(5);
      expect(result[0].date).toBe('2025-11-01');
      expect(result[4].date).toBe('2025-11-05');
    });

    it('rotates through available firefighters', () => {
      const firefighters = [
        createMockFirefighter({ id: '1', order_position: 0, is_available: true, name: 'First' }),
        createMockFirefighter({ id: '2', order_position: 1, is_available: true, name: 'Second' }),
      ];
      const startDate = new Date(2025, 10, 1);

      const result = autoScheduleNextHolds(firefighters, startDate, 4);

      expect(result[0].firefighter.name).toBe('First');
      expect(result[1].firefighter.name).toBe('Second');
      expect(result[2].firefighter.name).toBe('First'); // Rotates back
      expect(result[3].firefighter.name).toBe('Second');
    });

    it('returns empty array if no available firefighters', () => {
      const firefighters = [
        createMockFirefighter({ is_available: false }),
      ];
      const startDate = new Date(2025, 10, 1);

      const result = autoScheduleNextHolds(firefighters, startDate, 5);

      expect(result).toEqual([]);
    });

    it('only uses available firefighters', () => {
      const firefighters = [
        createMockFirefighter({ id: '1', order_position: 0, is_available: true, name: 'Available' }),
        createMockFirefighter({ id: '2', order_position: 1, is_available: false, name: 'Unavailable' }),
      ];
      const startDate = new Date(2025, 10, 1);

      const result = autoScheduleNextHolds(firefighters, startDate, 3);

      result.forEach(scheduled => {
        expect(scheduled.firefighter.name).toBe('Available');
      });
    });

    it('respects order_position for rotation order', () => {
      const firefighters = [
        createMockFirefighter({ id: '1', order_position: 2, is_available: true, name: 'Third' }),
        createMockFirefighter({ id: '2', order_position: 0, is_available: true, name: 'First' }),
        createMockFirefighter({ id: '3', order_position: 1, is_available: true, name: 'Second' }),
      ];
      const startDate = new Date(2025, 10, 1);

      const result = autoScheduleNextHolds(firefighters, startDate, 3);

      expect(result[0].firefighter.name).toBe('First');
      expect(result[1].firefighter.name).toBe('Second');
      expect(result[2].firefighter.name).toBe('Third');
    });
  });

  describe('getNextAvailableFirefighter', () => {
    it('returns firefighter with lowest order_position', () => {
      const firefighters = [
        createMockFirefighter({ id: '1', order_position: 2, is_available: true, name: 'Third' }),
        createMockFirefighter({ id: '2', order_position: 0, is_available: true, name: 'First' }),
        createMockFirefighter({ id: '3', order_position: 1, is_available: true, name: 'Second' }),
      ];

      const result = getNextAvailableFirefighter(firefighters);

      expect(result?.name).toBe('First');
    });

    it('returns null if no available firefighters', () => {
      const firefighters = [
        createMockFirefighter({ is_available: false }),
        createMockFirefighter({ is_available: false }),
      ];

      const result = getNextAvailableFirefighter(firefighters);

      expect(result).toBeNull();
    });

    it('skips unavailable firefighters', () => {
      const firefighters = [
        createMockFirefighter({ id: '1', order_position: 0, is_available: false, name: 'Unavailable' }),
        createMockFirefighter({ id: '2', order_position: 1, is_available: true, name: 'Available' }),
      ];

      const result = getNextAvailableFirefighter(firefighters);

      expect(result?.name).toBe('Available');
    });

    it('handles empty array', () => {
      const result = getNextAvailableFirefighter([]);
      expect(result).toBeNull();
    });
  });

  describe('getInitials', () => {
    it('returns first two letters for single word', () => {
      expect(getInitials('John')).toBe('JO');
    });

    it('returns first letter of each word for two words', () => {
      expect(getInitials('John Doe')).toBe('JD');
    });

    it('returns first two initials for multiple words', () => {
      expect(getInitials('John Michael Doe')).toBe('JM');
    });

    it('handles extra whitespace', () => {
      expect(getInitials('  John   Doe  ')).toBe('JD');
    });

    it('handles single letter names', () => {
      expect(getInitials('J D')).toBe('JD');
    });

    it('returns uppercase letters', () => {
      expect(getInitials('john doe')).toBe('JD');
    });

    it('handles empty string', () => {
      expect(getInitials('')).toBe('');
    });
  });
});
