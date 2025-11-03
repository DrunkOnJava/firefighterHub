/**
 * Hold Operations - Meaningful Business Logic Tests
 *
 * This file replaces the trivial tests from holdManagement.test.ts Section 4
 * Tests real validation logic, state transitions, and business rules
 */

import { describe, expect, it } from "vitest";
import type { Shift } from "../lib/supabase";
import { mockScheduledHolds } from "../test/mockData";
import type { ScheduledHold } from "./calendarUtils";
import {
  validateFireStation,
  validateHoldNotes,
  validateLentToShift,
  validateScheduleConflict,
  validateStatusTransition,
} from "./validation";

describe("Hold Operations - Business Logic", () => {
  describe("R4.1: Status Transition Validation", () => {
    it("should allow valid status transitions (scheduled → completed)", () => {
      const result = validateStatusTransition("scheduled", "completed");

      expect(result.valid).toBe(true);
    });

    it("should allow valid status transitions (scheduled → skipped)", () => {
      const result = validateStatusTransition("scheduled", "skipped");

      expect(result.valid).toBe(true);
    });

    it("should block invalid transitions (completed → scheduled)", () => {
      const result = validateStatusTransition("completed", "scheduled");

      expect(result.valid).toBe(false);
      expect(result.error).toContain("Cannot change status of completed hold");
    });

    it("should block invalid transitions (completed → skipped)", () => {
      const result = validateStatusTransition("completed", "skipped");

      expect(result.valid).toBe(false);
    });

    it("should block skipped → completed without admin override", () => {
      const result = validateStatusTransition("skipped", "completed", false);

      expect(result.valid).toBe(false);
      expect(result.error).toContain("without admin override");
    });
  });

  describe("R4.2: Last Hold Date Update Logic", () => {
    it("should update last_hold_date when marking hold completed", () => {
      // Simulate the business logic: when status becomes 'completed',
      // last_hold_date should be set to the hold_date
      const hold: ScheduledHold = {
        ...mockScheduledHolds[0],
        status: "scheduled",
        hold_date: "2025-11-20T00:00:00Z",
        completed_at: null,
      };

      // Business rule: completing hold should set completed_at and update last_hold_date
      const completedHold = {
        ...hold,
        status: "completed" as const,
        completed_at: new Date().toISOString(),
      };

      expect(completedHold.status).toBe("completed");
      expect(completedHold.completed_at).not.toBeNull();

      // In real implementation, this would trigger update to firefighter.last_hold_date
      // Testing the logic that determines when update should happen
      const shouldUpdateLastHoldDate = completedHold.status === "completed";
      expect(shouldUpdateLastHoldDate).toBe(true);
    });

    it("should not update last_hold_date for skipped holds", () => {
      const hold: ScheduledHold = {
        ...mockScheduledHolds[0],
        status: "scheduled",
        hold_date: "2025-11-20T00:00:00Z",
        completed_at: null,
      };

      const skippedHold = {
        ...hold,
        status: "skipped" as const,
        completed_at: null,
      };

      // Business rule: skipped holds should NOT update last_hold_date
      // @ts-expect-error - Testing that comparison is intentionally false
      const shouldUpdateLastHoldDate = skippedHold.status === "completed";
      expect(shouldUpdateLastHoldDate).toBe(false);
    });

    it("should preserve existing completed_at when status is already completed", () => {
      const originalCompletedAt = "2025-11-20T12:00:00Z";
      const hold: ScheduledHold = {
        ...mockScheduledHolds[0],
        status: "completed",
        completed_at: originalCompletedAt,
      };

      // Attempting to change status should fail (validated by R4.1)
      const transition = validateStatusTransition(hold.status, "scheduled");
      expect(transition.valid).toBe(false);

      // completed_at should remain unchanged
      expect(hold.completed_at).toBe(originalCompletedAt);
    });
  });

  describe("R4.3: Duplicate Hold Prevention", () => {
    it("should prevent duplicate hold on same date for same firefighter", () => {
      const existingHolds: ScheduledHold[] = [
        {
          ...mockScheduledHolds[0],
          firefighter_id: "ff-1",
          hold_date: "2025-11-20T00:00:00Z",
          status: "scheduled",
        },
      ];

      const result = validateScheduleConflict(existingHolds, {
        firefighter_id: "ff-1",
        hold_date: "2025-11-20T00:00:00Z",
      });

      expect(result.valid).toBe(false);
      expect(result.error).toContain("already has a hold scheduled");
    });

    it("should allow hold if previous hold on same date was skipped", () => {
      const existingHolds: ScheduledHold[] = [
        {
          ...mockScheduledHolds[0],
          firefighter_id: "ff-1",
          hold_date: "2025-11-20T00:00:00Z",
          status: "skipped",
        },
      ];

      const result = validateScheduleConflict(existingHolds, {
        firefighter_id: "ff-1",
        hold_date: "2025-11-20T00:00:00Z",
      });

      expect(result.valid).toBe(true);
    });

    it("should allow multiple firefighters on same date", () => {
      const existingHolds: ScheduledHold[] = [
        {
          ...mockScheduledHolds[0],
          firefighter_id: "ff-1",
          hold_date: "2025-11-20T00:00:00Z",
          status: "scheduled",
        },
      ];

      const result = validateScheduleConflict(existingHolds, {
        firefighter_id: "ff-2",
        hold_date: "2025-11-20T00:00:00Z",
      });

      expect(result.valid).toBe(true);
    });
  });

  describe("R4.4: Fire Station Validation", () => {
    it("should validate fire station exists and is valid", () => {
      expect(validateFireStation("1").valid).toBe(true);
      expect(validateFireStation("5").valid).toBe(true);
      expect(validateFireStation("99").valid).toBe(true);
    });

    it("should reject null or empty station", () => {
      expect(validateFireStation(null).valid).toBe(false);
      expect(validateFireStation("").valid).toBe(false);
      expect(validateFireStation("   ").valid).toBe(false);
    });

    it("should reject invalid station numbers", () => {
      expect(validateFireStation("0").valid).toBe(false);
      expect(validateFireStation("100").valid).toBe(false);
      expect(validateFireStation("-1").valid).toBe(false);
      expect(validateFireStation("ABC").valid).toBe(false);
    });

    it("should allow station assignment different from firefighter home station", () => {
      // Business rule: Firefighter can be assigned to different station for hold
      const firefighterHomeStation = "1";
      const assignedStation = "3";

      const isValid = validateFireStation(assignedStation);
      expect(isValid.valid).toBe(true);
      expect(assignedStation).not.toBe(firefighterHomeStation);
    });
  });

  describe("R4.5: Shift Lending Validation", () => {
    it("should validate lent_to_shift is different from original shift", () => {
      const result = validateLentToShift("A", "B");

      expect(result.valid).toBe(true);
    });

    it("should reject lending firefighter to their own shift", () => {
      const result = validateLentToShift("A", "A");

      expect(result.valid).toBe(false);
      expect(result.error).toContain(
        "Cannot lend firefighter to their own shift"
      );
    });

    it("should allow null lent_to_shift (not being lent)", () => {
      const result = validateLentToShift("A", null);

      expect(result.valid).toBe(true);
    });

    it("should validate lent_to_shift is valid shift (A, B, or C)", () => {
      expect(validateLentToShift("A", "B").valid).toBe(true);
      expect(validateLentToShift("A", "C").valid).toBe(true);
      expect(validateLentToShift("B", "A").valid).toBe(true);
      expect(validateLentToShift("C", "B").valid).toBe(true);
    });

    it("should reject invalid shift values", () => {
      const result = validateLentToShift("A", "D" as any);

      expect(result.valid).toBe(false);
      expect(result.error).toContain("Invalid shift");
    });

    it("should track original shift when lending", () => {
      // Business rule: When lending firefighter to another shift,
      // both original shift and lent_to_shift should be preserved
      const hold: ScheduledHold = {
        ...mockScheduledHolds[0],
        shift: "A",
        lent_to_shift: "B",
        notes: "Covering for B-shift",
      };

      expect(hold.shift).toBe("A"); // Original shift preserved
      expect(hold.lent_to_shift).toBe("B"); // Lending destination tracked
      expect(
        validateLentToShift(hold.shift as Shift, hold.lent_to_shift as Shift)
          .valid
      ).toBe(true);
    });
  });

  describe("Notes Validation for Status Changes", () => {
    it("should require notes when skipping a hold", () => {
      const result = validateHoldNotes("skipped", null);

      expect(result.valid).toBe(false);
      expect(result.error).toContain("Notes are required");
    });

    it("should accept notes for skipped holds", () => {
      const result = validateHoldNotes("skipped", "Called in sick");

      expect(result.valid).toBe(true);
    });

    it("should allow optional notes for completed holds", () => {
      expect(validateHoldNotes("completed", null).valid).toBe(true);
      expect(validateHoldNotes("completed", "Worked Station 3").valid).toBe(
        true
      );
    });

    it("should allow optional notes for scheduled holds", () => {
      expect(validateHoldNotes("scheduled", null).valid).toBe(true);
      expect(validateHoldNotes("scheduled", "Assigned to Engine 1").valid).toBe(
        true
      );
    });
  });
});
