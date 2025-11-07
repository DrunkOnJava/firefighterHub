/**
 * Hold Management - Error Handling Tests
 *
 * Tests error paths and edge cases for all utility functions
 * Ensures robust handling of invalid inputs and unexpected states
 */

import { describe, expect, it } from "vitest";
import { createMockFirefighter } from "../test/mockData";
import {
  attachScheduledHolds,
  autoScheduleNextHolds,
  formatDateForDB,
  getNextAvailableFirefighter,
  parseDateStringLocal,
} from "./calendarUtils";
import {
  formatHoldListMessage,
  moveToBottom,
  recalculatePositions,
  sortFirefighters,
} from "./rotationLogic";

describe("Error Handling - Calendar Utils", () => {
  describe("getNextAvailableFirefighter", () => {
    it("should return null for null input", () => {
      const result = getNextAvailableFirefighter(null as any);

      expect(result).toBeNull();
    });

    it("should return null for undefined input", () => {
      const result = getNextAvailableFirefighter(undefined as any);

      expect(result).toBeNull();
    });

    it("should handle empty array gracefully", () => {
      const result = getNextAvailableFirefighter([]);

      expect(result).toBeNull();
    });

    it("should handle firefighters with corrupted order_position", () => {
      const firefighters = [
        createMockFirefighter({
          id: "1",
          order_position: NaN as any,
          is_available: true,
        }),
        createMockFirefighter({
          id: "2",
          order_position: 1,
          is_available: true,
        }),
      ];

      // Should still work, sorting NaN to end
      const result = getNextAvailableFirefighter(firefighters);

      expect(result).not.toBeNull();
      expect(result?.id).toBe("2"); // Valid position wins
    });

    it("should handle all unavailable firefighters", () => {
      const firefighters = [
        createMockFirefighter({ is_available: false }),
        createMockFirefighter({ is_available: false }),
      ];

      const result = getNextAvailableFirefighter(firefighters);

      expect(result).toBeNull();
    });
  });

  describe("autoScheduleNextHolds", () => {
    it("should return empty array for null firefighters", () => {
      const result = autoScheduleNextHolds(null as any, new Date(), 5);

      expect(result).toEqual([]);
    });

    it("should return empty array for undefined firefighters", () => {
      const result = autoScheduleNextHolds(undefined as any, new Date(), 5);

      expect(result).toEqual([]);
    });

    it("should return empty array for empty firefighters", () => {
      const result = autoScheduleNextHolds([], new Date(), 5);

      expect(result).toEqual([]);
    });

    it("should handle zero days to schedule", () => {
      const firefighters = [createMockFirefighter({ is_available: true })];

      const result = autoScheduleNextHolds(firefighters, new Date(), 0);

      expect(result).toHaveLength(0);
    });

    it("should handle negative days to schedule", () => {
      const firefighters = [createMockFirefighter({ is_available: true })];

      const result = autoScheduleNextHolds(firefighters, new Date(), -5);

      // Should handle gracefully (return empty or throw)
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeLessThanOrEqual(0);
    });

    it("should handle very large days to schedule (365 days)", () => {
      const firefighters = [createMockFirefighter({ is_available: true })];

      const result = autoScheduleNextHolds(firefighters, new Date(), 365);

      expect(result).toHaveLength(365);
      expect(result[0].date).toBeTruthy();
      expect(result[364].date).toBeTruthy();
    });

    it("should handle all unavailable firefighters", () => {
      const firefighters = [
        createMockFirefighter({ is_available: false }),
        createMockFirefighter({ is_available: false }),
      ];

      const result = autoScheduleNextHolds(firefighters, new Date(), 5);

      expect(result).toEqual([]);
    });

    it("should handle invalid start date gracefully", () => {
      const firefighters = [createMockFirefighter({ is_available: true })];

      // Should return empty array instead of throwing
      const result = autoScheduleNextHolds(firefighters, new Date("invalid"), 5);
      expect(result).toEqual([]);
    });
  });

  describe("formatDateForDB", () => {
    it("should throw for invalid date", () => {
      expect(() => {
        formatDateForDB(new Date("invalid"));
      }).toThrow();
    });

    it("should throw for null date", () => {
      expect(() => {
        formatDateForDB(null as any);
      }).toThrow();
    });

    it("should throw for undefined date", () => {
      expect(() => {
        formatDateForDB(undefined as any);
      }).toThrow();
    });

    it("should handle dates at epoch boundary", () => {
      const epoch = new Date(0);
      const result = formatDateForDB(epoch);

      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it("should handle far future dates", () => {
      const future = new Date(9999, 11, 31);
      const result = formatDateForDB(future);

      expect(result).toMatch(/^9999-12-31$/);
    });
  });

  describe("parseDateStringLocal", () => {
    it("should throw for malformed date string", () => {
      expect(() => {
        parseDateStringLocal("invalid-date");
      }).toThrow();
    });

    it("should throw for null input", () => {
      expect(() => {
        parseDateStringLocal(null as any);
      }).toThrow();
    });

    it("should throw for undefined input", () => {
      expect(() => {
        parseDateStringLocal(undefined as any);
      }).toThrow();
    });

    it("should throw for empty string", () => {
      expect(() => {
        parseDateStringLocal("");
      }).toThrow();
    });

    it("should throw for incomplete date string", () => {
      expect(() => {
        parseDateStringLocal("2025-11");
      }).toThrow();
    });

    it("should handle date string with invalid month", () => {
      expect(() => {
        parseDateStringLocal("2025-13-01");
      }).toThrow();
    });

    it("should handle date string with invalid day", () => {
      expect(() => {
        parseDateStringLocal("2025-11-32");
      }).toThrow();
    });
  });

  describe("attachScheduledHolds", () => {
    it("should handle null holds array", () => {
      const days = [
        {
          date: new Date(2025, 10, 15),
          dayNumber: 15,
          isCurrentMonth: true,
          isToday: false,
          isWeekend: false,
          isPast: false,
          scheduledHolds: [],
        },
      ];

      const result = attachScheduledHolds(days, null as any, []);

      expect(result[0].scheduledHolds).toHaveLength(0);
    });

    it("should handle null firefighters array", () => {
      const days = [
        {
          date: new Date(2025, 10, 15),
          dayNumber: 15,
          isCurrentMonth: true,
          isToday: false,
          isWeekend: false,
          isPast: false,
          scheduledHolds: [],
        },
      ];

      const result = attachScheduledHolds(days, [], null as any);

      expect(result[0].scheduledHolds).toHaveLength(0);
    });

    it("should handle holds with invalid date formats gracefully", () => {
      const days = [
        {
          date: new Date(2025, 10, 15),
          dayNumber: 15,
          isCurrentMonth: true,
          isToday: false,
          isWeekend: false,
          isPast: false,
          scheduledHolds: [],
        },
      ];

      const holdsWithBadDate = [
        {
          id: "bad-1",
          firefighter_id: "ff-1",
          firefighter_name: "Test",
          hold_date: "invalid-date",
          status: "scheduled" as const,
          shift: "A" as const,
          fire_station: "1",
          lent_to_shift: null,
          notes: null,
          duration: "24h" as const,
          start_time: "07:00",
          created_at: "",
          updated_at: "",
          completed_at: null,
          is_completed: false,
          is_voluntary: false,
          scheduled_date: "2025-10-15",
        },
      ];

      // Should not crash, just skip invalid holds
      const result = attachScheduledHolds(days, holdsWithBadDate, []);

      expect(result).toBeDefined();
    });
  });
});

describe("Error Handling - Rotation Logic", () => {
  describe("moveToBottom", () => {
    it("should return unchanged array for non-existent ID", () => {
      const firefighters = [
        createMockFirefighter({
          id: "1",
          order_position: 0,
          is_available: true,
        }),
        createMockFirefighter({
          id: "2",
          order_position: 1,
          is_available: true,
        }),
      ];

      const result = moveToBottom(firefighters, "non-existent");

      expect(result).toEqual(firefighters);
    });

    it("should handle null firefighter ID", () => {
      const firefighters = [createMockFirefighter({ is_available: true })];

      const result = moveToBottom(firefighters, null as any);

      expect(result).toEqual(firefighters);
    });

    it("should handle undefined firefighter ID", () => {
      const firefighters = [createMockFirefighter({ is_available: true })];

      const result = moveToBottom(firefighters, undefined as any);

      expect(result).toEqual(firefighters);
    });

    it("should handle empty firefighters array", () => {
      const result = moveToBottom([], "1");

      expect(result).toEqual([]);
    });

    it("should return unchanged for unavailable firefighter", () => {
      const firefighters = [
        createMockFirefighter({
          id: "1",
          is_available: false,
          order_position: 0,
        }),
      ];

      const result = moveToBottom(firefighters, "1");

      expect(result).toEqual(firefighters);
    });
  });

  describe("recalculatePositions", () => {
    it("should handle empty array", () => {
      const result = recalculatePositions([]);

      expect(result).toEqual([]);
    });

    it("should handle single firefighter", () => {
      const firefighters = [
        createMockFirefighter({ order_position: 10, is_available: true }),
      ];

      const result = recalculatePositions(firefighters);

      expect(result[0].order_position).toBe(0);
    });

    it("should handle all unavailable firefighters", () => {
      const firefighters = [
        createMockFirefighter({ order_position: 0, is_available: false }),
        createMockFirefighter({ order_position: 1, is_available: false }),
      ];

      const result = recalculatePositions(firefighters);

      // Unavailable should be at end with sequential positions
      expect(result[0].order_position).toBe(0);
      expect(result[1].order_position).toBe(1);
    });

    it("should handle null in array", () => {
      const firefighters = [
        createMockFirefighter({ order_position: 0, is_available: true }),
        null as any,
        createMockFirefighter({ order_position: 2, is_available: true }),
      ];

      // Should filter out null
      const result = recalculatePositions(firefighters.filter(Boolean));

      expect(result).toHaveLength(2);
    });
  });

  describe("sortFirefighters", () => {
    it("should handle empty array", () => {
      const result = sortFirefighters([]);

      expect(result).toEqual([]);
    });

    it("should handle null/undefined in array", () => {
      const firefighters = [
        createMockFirefighter({ order_position: 0 }),
        null as any,
        undefined as any,
      ].filter(Boolean);

      const result = sortFirefighters(firefighters);

      expect(result).toHaveLength(1);
    });

    it("should handle firefighters with same order_position", () => {
      const firefighters = [
        createMockFirefighter({
          id: "1",
          order_position: 0,
          is_available: true,
        }),
        createMockFirefighter({
          id: "2",
          order_position: 0,
          is_available: true,
        }),
      ];

      const result = sortFirefighters(firefighters);

      expect(result).toHaveLength(2);
      // Order should be stable
    });
  });

  describe("formatHoldListMessage", () => {
    it("should handle null firefighters", () => {
      const result = formatHoldListMessage(null as any);

      expect(result).toContain("No firefighters");
    });

    it("should handle undefined firefighters", () => {
      const result = formatHoldListMessage(undefined as any);

      expect(result).toContain("No firefighters");
    });

    it("should handle empty array", () => {
      const result = formatHoldListMessage([]);

      expect(result).toContain("No firefighters");
    });

    it("should handle firefighters with missing names", () => {
      const firefighters = [
        createMockFirefighter({ name: "", is_available: true }),
      ];

      const result = formatHoldListMessage(firefighters);

      expect(result).toBeDefined();
      // Should handle empty name gracefully
    });

    it("should handle firefighters with null fire_station", () => {
      const firefighters = [
        createMockFirefighter({
          fire_station: null as any,
          is_available: true,
        }),
      ];

      const result = formatHoldListMessage(firefighters);

      expect(result).toContain("Station #?");
    });

    it("should handle firefighters with null last_hold_date", () => {
      const firefighters = [
        createMockFirefighter({ last_hold_date: null, is_available: true }),
      ];

      const result = formatHoldListMessage(firefighters);

      expect(result).toContain("Not yet");
    });
  });
});
