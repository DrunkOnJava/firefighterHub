import { describe, it, expect } from 'vitest';
import {
  sortFirefighters,
  recalculatePositions,
  assignPositions,
  moveToBottom,
  formatHoldListMessage,
} from './rotationLogic';
import { createMockFirefighter } from '../test/mockData';

describe('rotationLogic', () => {
  describe('sortFirefighters', () => {
    it('sorts available firefighters by order_position ascending', () => {
      const firefighters = [
        createMockFirefighter({ id: '1', order_position: 2, is_available: true }),
        createMockFirefighter({ id: '2', order_position: 0, is_available: true }),
        createMockFirefighter({ id: '3', order_position: 1, is_available: true }),
      ];

      const result = sortFirefighters(firefighters);

      expect(result[0].id).toBe('2');
      expect(result[1].id).toBe('3');
      expect(result[2].id).toBe('1');
    });

    it('places unavailable firefighters after available ones', () => {
      const firefighters = [
        createMockFirefighter({ id: '1', order_position: 0, is_available: false }),
        createMockFirefighter({ id: '2', order_position: 1, is_available: true }),
        createMockFirefighter({ id: '3', order_position: 2, is_available: true }),
      ];

      const result = sortFirefighters(firefighters);

      expect(result[0].is_available).toBe(true);
      expect(result[1].is_available).toBe(true);
      expect(result[2].is_available).toBe(false);
      expect(result[2].id).toBe('1');
    });

    it('handles mixed available and unavailable firefighters correctly', () => {
      const firefighters = [
        createMockFirefighter({ id: '1', order_position: 5, is_available: false }),
        createMockFirefighter({ id: '2', order_position: 1, is_available: true }),
        createMockFirefighter({ id: '3', order_position: 10, is_available: false }),
        createMockFirefighter({ id: '4', order_position: 0, is_available: true }),
      ];

      const result = sortFirefighters(firefighters);

      // First two should be available, sorted by position
      expect(result[0].id).toBe('4');
      expect(result[0].is_available).toBe(true);
      expect(result[1].id).toBe('2');
      expect(result[1].is_available).toBe(true);
      // Last two should be unavailable
      expect(result[2].is_available).toBe(false);
      expect(result[3].is_available).toBe(false);
    });

    it('handles empty array', () => {
      const result = sortFirefighters([]);
      expect(result).toEqual([]);
    });

    it('handles single firefighter', () => {
      const firefighter = createMockFirefighter({ id: '1' });
      const result = sortFirefighters([firefighter]);
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('1');
    });

    it('does not mutate original array', () => {
      const firefighters = [
        createMockFirefighter({ id: '1', order_position: 1 }),
        createMockFirefighter({ id: '2', order_position: 0 }),
      ];
      const original = [...firefighters];

      sortFirefighters(firefighters);

      expect(firefighters).toEqual(original);
    });
  });

  describe('recalculatePositions', () => {
    it('normalizes gaps in positions (converts [0, 5, 10] to [0, 1, 2])', () => {
      const firefighters = [
        createMockFirefighter({ id: '1', order_position: 0, is_available: true }),
        createMockFirefighter({ id: '2', order_position: 5, is_available: true }),
        createMockFirefighter({ id: '3', order_position: 10, is_available: true }),
      ];

      const result = recalculatePositions(firefighters);

      expect(result[0].order_position).toBe(0);
      expect(result[1].order_position).toBe(1);
      expect(result[2].order_position).toBe(2);
    });

    it('assigns sequential positions 0, 1, 2... to available firefighters', () => {
      const firefighters = [
        createMockFirefighter({ id: '1', order_position: 10, is_available: true }),
        createMockFirefighter({ id: '2', order_position: 20, is_available: true }),
        createMockFirefighter({ id: '3', order_position: 30, is_available: true }),
      ];

      const result = recalculatePositions(firefighters);

      expect(result.map(ff => ff.order_position)).toEqual([0, 1, 2]);
    });

    it('keeps unavailable firefighters at the end', () => {
      const firefighters = [
        createMockFirefighter({ id: '1', order_position: 0, is_available: true }),
        createMockFirefighter({ id: '2', order_position: 5, is_available: false }),
        createMockFirefighter({ id: '3', order_position: 1, is_available: true }),
      ];

      const result = recalculatePositions(firefighters);

      // Available firefighters first (positions 0, 1)
      expect(result[0].is_available).toBe(true);
      expect(result[0].order_position).toBe(0);
      expect(result[1].is_available).toBe(true);
      expect(result[1].order_position).toBe(1);
      // Unavailable last (position 2)
      expect(result[2].is_available).toBe(false);
      expect(result[2].order_position).toBe(2);
    });

    it('handles mixed available and unavailable correctly', () => {
      const firefighters = [
        createMockFirefighter({ id: '1', order_position: 100, is_available: false }),
        createMockFirefighter({ id: '2', order_position: 50, is_available: true }),
        createMockFirefighter({ id: '3', order_position: 200, is_available: false }),
        createMockFirefighter({ id: '4', order_position: 10, is_available: true }),
      ];

      const result = recalculatePositions(firefighters);

      expect(result[0].id).toBe('4'); // lowest position available
      expect(result[0].order_position).toBe(0);
      expect(result[1].id).toBe('2'); // second lowest position available
      expect(result[1].order_position).toBe(1);
      expect(result[2].order_position).toBe(2); // first unavailable
      expect(result[3].order_position).toBe(3); // second unavailable
    });

    it('handles empty array', () => {
      const result = recalculatePositions([]);
      expect(result).toEqual([]);
    });

    it('handles array with only unavailable firefighters', () => {
      const firefighters = [
        createMockFirefighter({ id: '1', order_position: 5, is_available: false }),
        createMockFirefighter({ id: '2', order_position: 10, is_available: false }),
      ];

      const result = recalculatePositions(firefighters);

      expect(result[0].order_position).toBe(0);
      expect(result[1].order_position).toBe(1);
    });
  });

  describe('assignPositions', () => {
    it('assigns sequential positions 0, 1, 2, 3...', () => {
      const firefighters = [
        createMockFirefighter({ id: '1', order_position: 99 }),
        createMockFirefighter({ id: '2', order_position: 50 }),
        createMockFirefighter({ id: '3', order_position: 10 }),
      ];

      const result = assignPositions(firefighters);

      expect(result[0].order_position).toBe(0);
      expect(result[1].order_position).toBe(1);
      expect(result[2].order_position).toBe(2);
    });

    it('preserves order of input array', () => {
      const firefighters = [
        createMockFirefighter({ id: 'first' }),
        createMockFirefighter({ id: 'second' }),
        createMockFirefighter({ id: 'third' }),
      ];

      const result = assignPositions(firefighters);

      expect(result[0].id).toBe('first');
      expect(result[1].id).toBe('second');
      expect(result[2].id).toBe('third');
    });

    it('handles empty array', () => {
      const result = assignPositions([]);
      expect(result).toEqual([]);
    });

    it('does not mutate original array', () => {
      const firefighters = [
        createMockFirefighter({ id: '1', order_position: 5 }),
      ];
      const originalPosition = firefighters[0].order_position;

      assignPositions(firefighters);

      expect(firefighters[0].order_position).toBe(originalPosition);
    });
  });

  describe('moveToBottom', () => {
    it('moves firefighter to max position + 1', () => {
      const firefighters = [
        createMockFirefighter({ id: '1', order_position: 0, is_available: true }),
        createMockFirefighter({ id: '2', order_position: 1, is_available: true }),
        createMockFirefighter({ id: '3', order_position: 2, is_available: true }),
      ];

      const result = moveToBottom(firefighters, '1');

      const movedFirefighter = result.find(ff => ff.id === '1');
      expect(movedFirefighter?.order_position).toBe(3); // max (2) + 1
    });

    it('only moves available firefighters', () => {
      const firefighters = [
        createMockFirefighter({ id: '1', order_position: 0, is_available: false }),
        createMockFirefighter({ id: '2', order_position: 1, is_available: true }),
      ];

      const result = moveToBottom(firefighters, '1');

      // Should return unchanged because firefighter is unavailable
      expect(result[0].order_position).toBe(0);
    });

    it('returns unchanged array if firefighter not found', () => {
      const firefighters = [
        createMockFirefighter({ id: '1', order_position: 0 }),
      ];

      const result = moveToBottom(firefighters, 'nonexistent');

      expect(result).toEqual(firefighters);
    });

    it('returns unchanged if firefighter is unavailable', () => {
      const firefighters = [
        createMockFirefighter({ id: '1', order_position: 0, is_available: false }),
        createMockFirefighter({ id: '2', order_position: 1, is_available: true }),
      ];

      const result = moveToBottom(firefighters, '1');

      expect(result).toEqual(firefighters);
    });

    it('calculates max position based on available firefighters only', () => {
      const firefighters = [
        createMockFirefighter({ id: '1', order_position: 0, is_available: true }),
        createMockFirefighter({ id: '2', order_position: 1, is_available: true }),
        createMockFirefighter({ id: '3', order_position: 10, is_available: false }), // Unavailable with high position
      ];

      const result = moveToBottom(firefighters, '1');

      const movedFirefighter = result.find(ff => ff.id === '1');
      expect(movedFirefighter?.order_position).toBe(2); // max of available (1) + 1, not 11
    });

    it('handles moving the only firefighter', () => {
      const firefighters = [
        createMockFirefighter({ id: '1', order_position: 0, is_available: true }),
      ];

      const result = moveToBottom(firefighters, '1');

      expect(result[0].order_position).toBe(1); // max (0) + 1
    });
  });

  describe('formatHoldListMessage', () => {
    it('formats available firefighters correctly', () => {
      const firefighters = [
        createMockFirefighter({
          name: 'John Doe',
          fire_station: '1',
          last_hold_date: '2025-10-20T00:00:00Z',
          order_position: 0,
          is_available: true,
        }),
        createMockFirefighter({
          name: 'Jane Smith',
          fire_station: '2',
          last_hold_date: '2025-10-15T00:00:00Z',
          order_position: 1,
          is_available: true,
        }),
      ];

      const result = formatHoldListMessage(firefighters, 'A-shift');

      expect(result).toContain('Hold list A-shift hold list:');
      expect(result).toContain('John Doe');
      expect(result).toContain('Station #1');
      expect(result).toContain('Jane Smith');
      expect(result).toContain('Station #2');
    });

    it('handles empty list', () => {
      const result = formatHoldListMessage([], 'B-shift');

      expect(result).toContain('No firefighters currently in rotation');
    });

    it('includes station numbers', () => {
      const firefighters = [
        createMockFirefighter({
          name: 'Test User',
          fire_station: '5',
          is_available: true,
        }),
      ];

      const result = formatHoldListMessage(firefighters);

      expect(result).toContain('Station #5');
    });

    it('formats last hold dates correctly', () => {
      const firefighters = [
        createMockFirefighter({
          name: 'Test User',
          last_hold_date: '2025-10-27T12:00:00Z', // Use midday to avoid timezone edge cases
          is_available: true,
        }),
      ];

      const result = formatHoldListMessage(firefighters);

      // Should format as M/D (e.g., "10/27")
      // Note: Actual date shown may vary by timezone, just check it contains a valid date format
      expect(result).toMatch(/\d{1,2}\/\d{1,2}/);
    });

    it('handles firefighters with no last_hold_date', () => {
      const firefighters = [
        createMockFirefighter({
          name: 'New Firefighter',
          last_hold_date: null,
          is_available: true,
        }),
      ];

      const result = formatHoldListMessage(firefighters);

      expect(result).toContain('Not yet');
    });

    it('handles firefighters with no station', () => {
      const firefighters = [
        createMockFirefighter({
          name: 'Test User',
          fire_station: null,
          is_available: true,
        }),
      ];

      const result = formatHoldListMessage(firefighters);

      expect(result).toContain('Station #?');
    });

    it('only includes available firefighters', () => {
      const firefighters = [
        createMockFirefighter({
          name: 'Available',
          order_position: 0,
          is_available: true,
        }),
        createMockFirefighter({
          name: 'Unavailable',
          order_position: 1,
          is_available: false,
        }),
      ];

      const result = formatHoldListMessage(firefighters);

      expect(result).toContain('Available');
      expect(result).not.toContain('Unavailable');
    });

    it('sorts by order_position', () => {
      const firefighters = [
        createMockFirefighter({
          name: 'Third',
          order_position: 2,
          is_available: true,
        }),
        createMockFirefighter({
          name: 'First',
          order_position: 0,
          is_available: true,
        }),
        createMockFirefighter({
          name: 'Second',
          order_position: 1,
          is_available: true,
        }),
      ];

      const result = formatHoldListMessage(firefighters);

      const firstIndex = result.indexOf('First');
      const secondIndex = result.indexOf('Second');
      const thirdIndex = result.indexOf('Third');

      expect(firstIndex).toBeLessThan(secondIndex);
      expect(secondIndex).toBeLessThan(thirdIndex);
    });
  });
});
