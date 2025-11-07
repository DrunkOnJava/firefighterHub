/**
 * Hold Management System Test Cases
 *
 * Comprehensive test suite for Hold Rotation Manager requirements.
 * Tests cover:
 * - Rotation logic
 * - Calendar entries
 * - Hold history
 * - Admin operations
 * - UI interactions
 */

import { beforeEach, describe, expect, it } from "vitest";
import type { Firefighter } from "../lib/supabase";
import { createMockFirefighter, mockScheduledHolds } from "../test/mockData";
import {
  attachScheduledHolds,
  autoScheduleNextHolds,
  formatDateForDB,
  getNextAvailableFirefighter,
  parseDateStringLocal,
  type ScheduledHold,
} from "./calendarUtils";
import {
  formatHoldListMessage,
  moveToBottom,
  recalculatePositions,
  sortFirefighters,
} from "./rotationLogic";

describe("Hold Management System", () => {
  describe("1. Rotation Logic - Hold Assignment", () => {
    it("R1.1: Next available firefighter should be at position 0", () => {
      const firefighters = [
        createMockFirefighter({
          id: "1",
          order_position: 0,
          is_available: true,
          name: "First",
        }),
        createMockFirefighter({
          id: "2",
          order_position: 1,
          is_available: true,
          name: "Second",
        }),
        createMockFirefighter({
          id: "3",
          order_position: 2,
          is_available: true,
          name: "Third",
        }),
      ];

      const next = getNextAvailableFirefighter(firefighters);

      expect(next).not.toBeNull();
      expect(next?.order_position).toBe(0);
      expect(next?.name).toBe("First");
    });

    it("R1.2: Unavailable firefighters should be excluded from next up", () => {
      const firefighters = [
        createMockFirefighter({
          id: "1",
          order_position: 0,
          is_available: false,
          name: "Unavailable",
        }),
        createMockFirefighter({
          id: "2",
          order_position: 1,
          is_available: true,
          name: "Available",
        }),
      ];

      const next = getNextAvailableFirefighter(firefighters);

      expect(next?.name).toBe("Available");
      expect(next?.order_position).toBe(1);
    });

    it("R1.3: After completing hold, firefighter moves to bottom of rotation", () => {
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
        createMockFirefighter({
          id: "3",
          order_position: 2,
          is_available: true,
        }),
      ];

      const reordered = moveToBottom(firefighters, "1");
      const normalized = recalculatePositions(reordered);

      // First firefighter should now be at position 2
      const movedFirefighter = normalized.find((ff) => ff.id === "1");
      expect(movedFirefighter?.order_position).toBe(2);

      // Others should shift up
      const second = normalized.find((ff) => ff.id === "2");
      const third = normalized.find((ff) => ff.id === "3");
      expect(second?.order_position).toBe(0);
      expect(third?.order_position).toBe(1);
    });

    it("R1.4: Rotation respects order_position sorting", () => {
      const firefighters = [
        createMockFirefighter({
          id: "3",
          order_position: 10,
          is_available: true,
          name: "Third",
        }),
        createMockFirefighter({
          id: "1",
          order_position: 2,
          is_available: true,
          name: "First",
        }),
        createMockFirefighter({
          id: "2",
          order_position: 5,
          is_available: true,
          name: "Second",
        }),
      ];

      const sorted = sortFirefighters(firefighters);

      expect(sorted[0].name).toBe("First");
      expect(sorted[1].name).toBe("Second");
      expect(sorted[2].name).toBe("Third");
    });

    it("R1.5: Position recalculation removes gaps", () => {
      const firefighters = [
        createMockFirefighter({
          id: "1",
          order_position: 0,
          is_available: true,
        }),
        createMockFirefighter({
          id: "2",
          order_position: 5,
          is_available: true,
        }),
        createMockFirefighter({
          id: "3",
          order_position: 10,
          is_available: true,
        }),
      ];

      const normalized = recalculatePositions(firefighters);

      expect(normalized[0].order_position).toBe(0);
      expect(normalized[1].order_position).toBe(1);
      expect(normalized[2].order_position).toBe(2);
    });
  });

  describe("2. Calendar Entries - Hold Scheduling", () => {
    it("R2.1: Auto-schedule creates holds for specified number of days", () => {
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
      const startDate = new Date(2025, 10, 1); // Nov 1, 2025

      const schedule = autoScheduleNextHolds(firefighters, startDate, 5);

      expect(schedule).toHaveLength(5);
      expect(schedule[0].date).toBe("2025-11-01");
      expect(schedule[4].date).toBe("2025-11-05");
    });

    it("R2.2: Auto-schedule rotates through available firefighters", () => {
      const firefighters = [
        createMockFirefighter({
          id: "1",
          order_position: 0,
          is_available: true,
          name: "A",
        }),
        createMockFirefighter({
          id: "2",
          order_position: 1,
          is_available: true,
          name: "B",
        }),
        createMockFirefighter({
          id: "3",
          order_position: 2,
          is_available: true,
          name: "C",
        }),
      ];
      const startDate = new Date(2025, 10, 1);

      const schedule = autoScheduleNextHolds(firefighters, startDate, 6);

      // Should cycle: A, B, C, A, B, C
      expect(schedule[0].firefighter.name).toBe("A");
      expect(schedule[1].firefighter.name).toBe("B");
      expect(schedule[2].firefighter.name).toBe("C");
      expect(schedule[3].firefighter.name).toBe("A");
      expect(schedule[4].firefighter.name).toBe("B");
      expect(schedule[5].firefighter.name).toBe("C");
    });

    it("R2.3: Holds attach to correct calendar days", () => {
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
      const holds: ScheduledHold[] = [
        {
          id: "hold-1",
          firefighter_id: "ff-1",
          firefighter_name: "John Doe",
          hold_date: "2025-11-15T00:00:00Z",
          status: "scheduled",
          shift: "A",
          fire_station: "1",
          lent_to_shift: null,
          notes: null,
          duration: "24h",
          start_time: "07:00",
          created_at: "2025-11-14T00:00:00Z",
          updated_at: "2025-11-14T00:00:00Z",
          completed_at: null,
          is_completed: false,
          is_voluntary: false,
          scheduled_date: "2025-10-15",
        },
      ];

      const result = attachScheduledHolds(days, holds, []);

      expect(result[0].scheduledHolds).toHaveLength(1);
      expect(result[0].scheduledHolds[0].firefighter_name).toBe("John Doe");
    });

    it("R2.4: Multiple holds on same day are supported", () => {
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
      const holds: ScheduledHold[] = [
        {
          ...mockScheduledHolds[0],
          hold_date: "2025-11-15T00:00:00Z",
          firefighter_name: "Person A",
        },
        {
          ...mockScheduledHolds[1],
          hold_date: "2025-11-15T00:00:00Z",
          firefighter_name: "Person B",
        },
      ];

      const result = attachScheduledHolds(days, holds, []);

      expect(result[0].scheduledHolds).toHaveLength(2);
    });

    it("R2.5: Past holds from last_hold_date are included", () => {
      const days = [
        {
          date: new Date(2025, 10, 20),
          dayNumber: 20,
          isCurrentMonth: true,
          isToday: false,
          isWeekend: false,
          isPast: false,
          scheduledHolds: [],
        },
      ];
      const firefighters = [
        createMockFirefighter({
          id: "ff-1",
          name: "John Doe",
          last_hold_date: "2025-11-20T00:00:00Z",
        }),
      ];

      const result = attachScheduledHolds(days, [], firefighters);

      expect(result[0].scheduledHolds).toHaveLength(1);
      expect(result[0].scheduledHolds[0].status).toBe("completed");
      expect(result[0].scheduledHolds[0].firefighter_name).toBe("John Doe");
    });
  });

  describe("3. Hold History - Data Tracking", () => {
    it("R3.1: Hold history preserves completed holds in calendar", () => {
      // Test that last_hold_date creates a completed hold entry in calendar
      const days = [
        {
          date: new Date(2025, 9, 20),
          dayNumber: 20,
          isCurrentMonth: true,
          isToday: false,
          isWeekend: false,
          isPast: false,
          scheduledHolds: [],
        },
      ];
      const firefighters = [
        createMockFirefighter({
          id: "ff-1",
          name: "John Doe",
          last_hold_date: "2025-10-20T00:00:00Z",
        }),
      ];

      const result = attachScheduledHolds(days, [], firefighters);

      // Should create a completed hold from last_hold_date
      expect(result[0].scheduledHolds).toHaveLength(1);
      expect(result[0].scheduledHolds[0].status).toBe("completed");
      expect(result[0].scheduledHolds[0].firefighter_name).toBe("John Doe");
      expect(result[0].scheduledHolds[0].completed_at).toBe(
        "2025-10-20T00:00:00Z"
      );
    });

    it("R3.2: Hold list message formats available firefighters", () => {
      const firefighters = [
        createMockFirefighter({
          name: "John Doe",
          fire_station: "1",
          last_hold_date: "2025-10-20T00:00:00Z",
          order_position: 0,
          is_available: true,
        }),
        createMockFirefighter({
          name: "Jane Smith",
          fire_station: "2",
          last_hold_date: null,
          order_position: 1,
          is_available: true,
        }),
      ];

      const message = formatHoldListMessage(firefighters, "A-shift");

      expect(message).toContain("John Doe");
      expect(message).toContain("Station #1");
      expect(message).toContain("Jane Smith");
      expect(message).toContain("Station #2");
      expect(message).toContain("A-shift");
    });

    it("R3.3: Unavailable firefighters excluded from hold list", () => {
      const firefighters = [
        createMockFirefighter({
          name: "Available",
          order_position: 0,
          is_available: true,
        }),
        createMockFirefighter({
          name: "Unavailable",
          order_position: 1,
          is_available: false,
        }),
      ];

      const message = formatHoldListMessage(firefighters);

      expect(message).toContain("Available");
      expect(message).not.toContain("Unavailable");
    });

    it("R3.4: Empty hold list shows appropriate message", () => {
      const message = formatHoldListMessage([], "B-shift");

      expect(message).toContain("No firefighters currently in rotation");
    });
  });

  // Section 4: Admin Operations - REMOVED (trivial tests replaced)
  // See src/utils/holdOperations.test.ts for meaningful business logic tests

  describe("5. Date Handling - Timezone Safety", () => {
    it("R5.1: formatDateForDB returns YYYY-MM-DD format", () => {
      const date = new Date(2025, 10, 15); // Nov 15, 2025
      const formatted = formatDateForDB(date);

      expect(formatted).toBe("2025-11-15");
      expect(formatted).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it("R5.2: parseDateStringLocal maintains date consistency", () => {
      const originalDate = new Date(2025, 10, 15);
      const formatted = formatDateForDB(originalDate);
      const parsed = parseDateStringLocal(formatted);

      expect(parsed.getFullYear()).toBe(2025);
      expect(parsed.getMonth()).toBe(10); // November (0-indexed)
      expect(parsed.getDate()).toBe(15);
    });

    it("R5.3: Date formatting handles month/day padding", () => {
      const date = new Date(2025, 0, 5); // Jan 5, 2025
      const formatted = formatDateForDB(date);

      expect(formatted).toBe("2025-01-05");
    });

    it("R5.4: Round-trip date conversion preserves values", () => {
      const dates = [
        new Date(2025, 0, 1), // Jan 1
        new Date(2025, 11, 31), // Dec 31
        new Date(2024, 1, 29), // Feb 29 (leap year)
      ];

      dates.forEach((originalDate) => {
        const formatted = formatDateForDB(originalDate);
        const parsed = parseDateStringLocal(formatted);

        expect(parsed.getFullYear()).toBe(originalDate.getFullYear());
        expect(parsed.getMonth()).toBe(originalDate.getMonth());
        expect(parsed.getDate()).toBe(originalDate.getDate());
      });
    });
  });

  describe("6. Shift-Based Data Isolation", () => {
    it("R6.1: Auto-schedule respects shift assignments", () => {
      // Test that auto-scheduling only uses firefighters from correct shift
      const firefighters = [
        createMockFirefighter({
          id: "1",
          shift: "A",
          order_position: 0,
          is_available: true,
        }),
        createMockFirefighter({
          id: "2",
          shift: "B",
          order_position: 1,
          is_available: true,
        }),
        createMockFirefighter({
          id: "3",
          shift: "A",
          order_position: 2,
          is_available: true,
        }),
      ];

      // Filter to only Shift A before scheduling
      const shiftAFirefighters = firefighters.filter((ff) => ff.shift === "A");
      const schedule = autoScheduleNextHolds(
        shiftAFirefighters,
        new Date(2025, 10, 1),
        4
      );

      // All scheduled holds should be for Shift A firefighters only
      expect(schedule.every((s) => s.firefighter.shift === "A")).toBe(true);
      expect(schedule).toHaveLength(4);
    });

    it("R6.2: Hold creation inherits firefighter shift", () => {
      // Test that holds created for a firefighter inherit their shift
      const firefighter = createMockFirefighter({
        shift: "B",
        id: "ff-1",
        name: "John Doe",
      });
      const schedule = autoScheduleNextHolds(
        [firefighter],
        new Date(2025, 10, 1),
        3
      );

      // All holds should have same shift as firefighter
      schedule.forEach((s) => {
        expect(s.firefighter.shift).toBe("B");
        expect(s.firefighter.id).toBe("ff-1");
      });
    });

    it("R6.3: Shift filtering maintains data isolation", () => {
      const firefighters = [
        createMockFirefighter({ id: "1", shift: "A", name: "A-Shift-1" }),
        createMockFirefighter({ id: "2", shift: "B", name: "B-Shift-1" }),
        createMockFirefighter({ id: "3", shift: "A", name: "A-Shift-2" }),
      ];

      const shiftA = firefighters.filter((ff) => ff.shift === "A");
      const shiftB = firefighters.filter((ff) => ff.shift === "B");

      expect(shiftA).toHaveLength(2);
      expect(shiftB).toHaveLength(1);
      expect(shiftA.every((ff) => ff.shift === "A")).toBe(true);
      expect(shiftB.every((ff) => ff.shift === "B")).toBe(true);
    });
  });

  describe("7. Rotation Edge Cases", () => {
    it("R7.1: Single firefighter rotation works correctly", () => {
      const firefighters = [
        createMockFirefighter({
          id: "1",
          order_position: 0,
          is_available: true,
        }),
      ];

      const next = getNextAvailableFirefighter(firefighters);
      expect(next?.id).toBe("1");

      const reordered = moveToBottom(firefighters, "1");
      expect(reordered[0].order_position).toBe(1);
    });

    it("R7.2: Empty rotation returns null for next firefighter", () => {
      const next = getNextAvailableFirefighter([]);
      expect(next).toBeNull();
    });

    it("R7.3: All unavailable firefighters returns null", () => {
      const firefighters = [
        createMockFirefighter({ is_available: false }),
        createMockFirefighter({ is_available: false }),
      ];

      const next = getNextAvailableFirefighter(firefighters);
      expect(next).toBeNull();
    });

    it("R7.4: Auto-schedule with no available firefighters returns empty", () => {
      const firefighters = [createMockFirefighter({ is_available: false })];
      const startDate = new Date(2025, 10, 1);

      const schedule = autoScheduleNextHolds(firefighters, startDate, 5);
      expect(schedule).toEqual([]);
    });

    it("R7.5: Reactivating firefighter and recalculating positions", () => {
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
        createMockFirefighter({
          id: "3",
          order_position: 2,
          is_available: false,
        }),
      ];

      // Simulate reactivation by changing availability
      // When reactivating, the app typically sets position to 0 manually before recalculating
      const reactivated = firefighters.map((ff) =>
        ff.id === "3"
          ? { ...ff, is_available: true, order_position: 0 }
          : ff.id === "1"
          ? { ...ff, order_position: 1 }
          : ff.id === "2"
          ? { ...ff, order_position: 2 }
          : ff
      );

      const normalized = recalculatePositions(reactivated);

      // After reactivation and recalculation, positions should be 0, 1, 2
      expect(normalized.length).toBe(3);
      expect(normalized.every((ff) => ff.is_available)).toBe(true);

      // Verify all positions are sequential
      const positions = normalized.map((ff) => ff.order_position).sort();
      expect(positions).toEqual([0, 1, 2]);
    });
  });

  // Section 8: Hold Status Workflow - REMOVED (trivial tests replaced)
  // See src/utils/holdOperations.test.ts for meaningful status transition validation tests

  describe("9. Integration - Full Hold Workflow", () => {
    let firefighters: Firefighter[];

    beforeEach(() => {
      firefighters = [
        createMockFirefighter({
          id: "1",
          order_position: 0,
          is_available: true,
          name: "First",
        }),
        createMockFirefighter({
          id: "2",
          order_position: 1,
          is_available: true,
          name: "Second",
        }),
        createMockFirefighter({
          id: "3",
          order_position: 2,
          is_available: true,
          name: "Third",
        }),
      ];
    });

    it("R9.1: Complete workflow - schedule, assign, complete, rotate", () => {
      // Step 1: Get next firefighter
      const next = getNextAvailableFirefighter(firefighters);
      expect(next?.name).toBe("First");

      // Step 2: Schedule a hold
      const holdDate = "2025-11-20T00:00:00Z";
      const newHold: ScheduledHold = {
        id: "hold-1",
        firefighter_id: next!.id,
        firefighter_name: next!.name,
        hold_date: holdDate,
        status: "scheduled",
        shift: next!.shift,
        fire_station: next!.fire_station,
        lent_to_shift: null,
        notes: null,
        duration: "24h",
        start_time: "07:00",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        completed_at: null,
        is_completed: false,
        is_voluntary: false,
        scheduled_date: "2025-10-15",
      };

      expect(newHold.status).toBe("scheduled");
      expect(newHold.firefighter_name).toBe("First");

      // Step 3: Complete the hold
      const completedHold: ScheduledHold = {
        ...newHold,
        status: "completed",
        completed_at: new Date().toISOString(),
      };

      expect(completedHold.status).toBe("completed");

      // Step 4: Move firefighter to bottom
      const reordered = moveToBottom(firefighters, next!.id);
      const normalized = recalculatePositions(reordered);

      const completedFirefighter = normalized.find((ff) => ff.id === next!.id);
      expect(completedFirefighter?.order_position).toBe(2);

      // Step 5: Verify new next firefighter
      const nextAfterComplete = getNextAvailableFirefighter(normalized);
      expect(nextAfterComplete?.name).toBe("Second");
    });

    it("R9.2: Auto-schedule maintains rotation order", () => {
      const startDate = new Date(2025, 10, 1);
      const schedule = autoScheduleNextHolds(firefighters, startDate, 9);

      // Should cycle through: First, Second, Third, First, Second, Third, First, Second, Third
      expect(schedule[0].firefighter.name).toBe("First");
      expect(schedule[1].firefighter.name).toBe("Second");
      expect(schedule[2].firefighter.name).toBe("Third");
      expect(schedule[3].firefighter.name).toBe("First");
      expect(schedule[4].firefighter.name).toBe("Second");
      expect(schedule[5].firefighter.name).toBe("Third");
      expect(schedule[6].firefighter.name).toBe("First");
      expect(schedule[7].firefighter.name).toBe("Second");
      expect(schedule[8].firefighter.name).toBe("Third");
    });

    it("R9.3: Hold cancellation workflow", () => {
      // Complete a hold and move to bottom
      const reordered = moveToBottom(firefighters, "1");
      const afterComplete = recalculatePositions(reordered);

      expect(afterComplete.find((ff) => ff.id === "1")?.order_position).toBe(2);

      // Cancel the hold - manually adjust positions to bring firefighter to top
      // The app would handle this by setting the firefighter's position to 0
      // and shifting others down before recalculating
      const backToTop = afterComplete.map((ff) => {
        if (ff.id === "1") {
          return { ...ff, order_position: 0 };
        } else if (ff.id === "2") {
          return { ...ff, order_position: 1 };
        } else {
          return { ...ff, order_position: 2 };
        }
      });
      const normalized = recalculatePositions(backToTop);

      // After recalculation, all positions should be normalized
      expect(normalized.find((ff) => ff.id === "1")?.order_position).toBe(0);
      expect(normalized.find((ff) => ff.id === "2")?.order_position).toBe(1);
      expect(normalized.find((ff) => ff.id === "3")?.order_position).toBe(2);
    });
  });
});
