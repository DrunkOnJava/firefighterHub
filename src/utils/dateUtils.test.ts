import { describe, it, expect } from 'vitest';
import {
  formatHoldDate,
  formatHoldDateLong,
  formatHoldDateShort,
  getHoldDayOfWeek,
  isValidDate,
  formatStation,
} from './dateUtils';

describe('Date Utilities', () => {
  describe('formatHoldDate', () => {
    it('should format a date string with short month', () => {
      const result = formatHoldDate('2024-01-15');
      expect(result).toBe('Jan 15, 2024');
    });

    it('should handle dates with time component', () => {
      const result = formatHoldDate('2024-01-15T10:30:00');
      expect(result).toBe('Jan 15, 2024');
    });

    it('should return N/A for null', () => {
      const result = formatHoldDate(null);
      expect(result).toBe('N/A');
    });

    it('should return N/A for undefined', () => {
      const result = formatHoldDate(undefined);
      expect(result).toBe('N/A');
    });

    it('should handle invalid date strings gracefully', () => {
      const result = formatHoldDate('invalid-date');
      expect(result).toBe('Invalid Date');
    });
  });

  describe('formatHoldDateLong', () => {
    it('should format a date with full month name', () => {
      const result = formatHoldDateLong('2024-01-15');
      expect(result).toBe('January 15, 2024');
    });

    it('should return N/A for null', () => {
      const result = formatHoldDateLong(null);
      expect(result).toBe('N/A');
    });
  });

  describe('formatHoldDateShort', () => {
    it('should format a date without year', () => {
      const result = formatHoldDateShort('2024-01-15');
      expect(result).toBe('Jan 15');
    });

    it('should return N/A for null', () => {
      const result = formatHoldDateShort(null);
      expect(result).toBe('N/A');
    });
  });

  describe('getHoldDayOfWeek', () => {
    it('should return the day of week', () => {
      const result = getHoldDayOfWeek('2024-01-15');
      expect(result).toBe('Monday');
    });

    it('should handle dates with time component', () => {
      const result = getHoldDayOfWeek('2024-01-15T10:30:00');
      expect(result).toBe('Monday');
    });

    it('should return Invalid Date for invalid date', () => {
      const result = getHoldDayOfWeek('invalid-date');
      expect(result).toBe('Invalid Date');
    });
  });

  describe('isValidDate', () => {
    it('should return true for valid date strings', () => {
      expect(isValidDate('2024-01-15')).toBe(true);
      expect(isValidDate('2024-01-15T10:30:00')).toBe(true);
    });

    it('should return false for invalid date strings', () => {
      expect(isValidDate('invalid-date')).toBe(false);
      expect(isValidDate('2024-13-40')).toBe(false);
    });

    it('should return false for null', () => {
      expect(isValidDate(null)).toBe(false);
    });

    it('should return false for undefined', () => {
      expect(isValidDate(undefined)).toBe(false);
    });

    it('should return false for empty string', () => {
      expect(isValidDate('')).toBe(false);
    });
  });

  describe('formatStation', () => {
    describe('short format (default)', () => {
      it('should format station number with hash', () => {
        expect(formatStation('2')).toBe('#2');
        expect(formatStation('2', 'short')).toBe('#2');
      });

      it('should handle single-digit stations', () => {
        expect(formatStation('1', 'short')).toBe('#1');
      });

      it('should handle multi-digit stations', () => {
        expect(formatStation('42', 'short')).toBe('#42');
      });

      it('should return empty string for null', () => {
        expect(formatStation(null)).toBe('');
        expect(formatStation(null, 'short')).toBe('');
      });
    });

    describe('long format', () => {
      it('should format station number with "Station" prefix', () => {
        expect(formatStation('2', 'long')).toBe('Station 2');
      });

      it('should handle single-digit stations', () => {
        expect(formatStation('1', 'long')).toBe('Station 1');
      });

      it('should handle multi-digit stations', () => {
        expect(formatStation('42', 'long')).toBe('Station 42');
      });

      it('should return empty string for null', () => {
        expect(formatStation(null, 'long')).toBe('');
      });
    });

    describe('edge cases', () => {
      it('should handle station numbers with leading zeros', () => {
        expect(formatStation('02', 'short')).toBe('#02');
        expect(formatStation('02', 'long')).toBe('Station 02');
      });

      it('should handle alphanumeric station identifiers', () => {
        expect(formatStation('2A', 'short')).toBe('#2A');
        expect(formatStation('2A', 'long')).toBe('Station 2A');
      });
    });
  });
});
