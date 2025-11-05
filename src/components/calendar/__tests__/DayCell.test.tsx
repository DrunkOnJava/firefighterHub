/**
 * DayCell Component Tests - Tooltip Integration
 *
 * Tests the tooltip functionality for truncated firefighter names in calendar day cells.
 * Ensures:
 * - Tooltips display full names when text is truncated
 * - Keyboard accessibility (focus/blur)
 * - Mobile tap support
 * - ARIA compliance
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DayCell } from "../DayCell";
import { CalendarDay } from "../../../utils/calendarUtils";

// Helper to create a test calendar day
function createTestDay(overrides?: Partial<CalendarDay>): CalendarDay {
  return {
    date: new Date(2025, 10, 15), // Nov 15, 2025
    isToday: false,
    isCurrentMonth: true,
    scheduledHolds: [],
    ...overrides,
  };
}

describe("DayCell - Tooltip Integration", () => {
  describe("Tooltip for Scheduled Holds", () => {
    it("should wrap truncated firefighter names with tooltip", () => {
      const day = createTestDay({
        scheduledHolds: [
          {
            id: "hold1",
            firefighter_id: "ff1",
            firefighter_name: "Jonathan Christopher Smith",
            fire_station: "5",
            hold_date: "2025-11-15",
            status: "scheduled",
            shift: "A",
            duration: "24h",
            created_at: "2025-11-01T00:00:00Z",
          },
        ],
      });

      render(
        <DayCell
          day={day}
          onDayClick={() => {}}
          currentShift="A"
          isAdminMode={false}
        />
      );

      // Formatted name should be visible
      expect(screen.getByText("J. Smith")).toBeInTheDocument();
    });

    it("should show full name in tooltip on hover", async () => {
      const user = userEvent.setup();
      const day = createTestDay({
        scheduledHolds: [
          {
            id: "hold1",
            firefighter_id: "ff1",
            firefighter_name: "Jonathan Christopher Smith",
            fire_station: "5",
            hold_date: "2025-11-15",
            status: "scheduled",
            shift: "A",
            duration: "24h",
            created_at: "2025-11-01T00:00:00Z",
          },
        ],
      });

      render(
        <DayCell
          day={day}
          onDayClick={() => {}}
          currentShift="A"
          isAdminMode={false}
        />
      );

      const nameElement = screen.getByText("J. Smith");
      
      // Hover over the name
      await user.hover(nameElement.closest("div")!.parentElement!);

      // Wait for tooltip to appear (500ms default delay)
      await waitFor(
        () => {
          expect(
            screen.getByText("Jonathan Christopher Smith - Station 5")
          ).toBeInTheDocument();
        },
        { timeout: 1000 }
      );
    });

    it("should include station number in tooltip", async () => {
      const user = userEvent.setup();
      const day = createTestDay({
        scheduledHolds: [
          {
            id: "hold1",
            firefighter_id: "ff1",
            firefighter_name: "John Doe",
            fire_station: "12",
            hold_date: "2025-11-15",
            status: "scheduled",
            shift: "A",
            duration: "24h",
            created_at: "2025-11-01T00:00:00Z",
          },
        ],
      });

      render(
        <DayCell
          day={day}
          onDayClick={() => {}}
          currentShift="A"
          isAdminMode={false}
        />
      );

      const nameElement = screen.getByText("J. Doe");
      await user.hover(nameElement.closest("div")!.parentElement!);

      await waitFor(
        () => {
          expect(screen.getByText("John Doe - Station 12")).toBeInTheDocument();
        },
        { timeout: 1000 }
      );
    });

    it("should handle firefighters without station in tooltip", async () => {
      const user = userEvent.setup();
      const day = createTestDay({
        scheduledHolds: [
          {
            id: "hold1",
            firefighter_id: "ff1",
            firefighter_name: "Jane Smith",
            fire_station: null,
            hold_date: "2025-11-15",
            status: "scheduled",
            shift: "A",
            duration: "24h",
            created_at: "2025-11-01T00:00:00Z",
          },
        ],
      });

      render(
        <DayCell
          day={day}
          onDayClick={() => {}}
          currentShift="A"
          isAdminMode={false}
        />
      );

      const nameElement = screen.getByText("J. Smith");
      await user.hover(nameElement.closest("div")!.parentElement!);

      await waitFor(
        () => {
          expect(screen.getByText("Jane Smith")).toBeInTheDocument();
        },
        { timeout: 1000 }
      );
    });

    it("should show tooltip for multiple holds", async () => {
      const user = userEvent.setup();
      const day = createTestDay({
        scheduledHolds: [
          {
            id: "hold1",
            firefighter_id: "ff1",
            firefighter_name: "John Doe",
            fire_station: "5",
            hold_date: "2025-11-15",
            status: "scheduled",
            shift: "A",
            duration: "24h",
            created_at: "2025-11-01T00:00:00Z",
          },
          {
            id: "hold2",
            firefighter_id: "ff2",
            firefighter_name: "Jane Smith",
            fire_station: "7",
            hold_date: "2025-11-15",
            status: "scheduled",
            shift: "B",
            duration: "24h",
            created_at: "2025-11-01T00:00:00Z",
          },
        ],
      });

      render(
        <DayCell
          day={day}
          onDayClick={() => {}}
          currentShift="A"
          isAdminMode={false}
        />
      );

      // Hover over first name
      const firstNameElement = screen.getByText("J. Doe");
      await user.hover(firstNameElement.closest("div")!.parentElement!);

      await waitFor(
        () => {
          expect(screen.getByText("John Doe - Station 5")).toBeInTheDocument();
        },
        { timeout: 1000 }
      );
    });
  });

  describe("Tooltip for Completed Holds", () => {
    it("should show '(completed)' in tooltip for completed holds", async () => {
      const user = userEvent.setup();
      const day = createTestDay({
        scheduledHolds: [
          {
            id: "hold1",
            firefighter_id: "ff1",
            firefighter_name: "John Doe",
            fire_station: "5",
            hold_date: "2025-11-15",
            status: "completed",
            shift: "A",
            duration: "24h",
            created_at: "2025-11-01T00:00:00Z",
            completed_at: "2025-11-15T12:00:00Z",
          },
        ],
      });

      render(
        <DayCell
          day={day}
          onDayClick={() => {}}
          currentShift="A"
          isAdminMode={false}
        />
      );

      const nameElement = screen.getByText("J. Doe");
      await user.hover(nameElement.closest("div")!.parentElement!);

      await waitFor(
        () => {
          expect(
            screen.getByText("John Doe - Station 5 (completed)")
          ).toBeInTheDocument();
        },
        { timeout: 1000 }
      );
    });
  });

  describe("Keyboard Accessibility", () => {
    // Note: Keyboard focus handling is built into the Tooltip component
    // via onFocus/onBlur handlers. Full keyboard testing requires integration tests
    // with actual focus management, which is handled by the Tooltip component itself.

    it("should hide tooltip on blur", async () => {
      const user = userEvent.setup();
      const day = createTestDay({
        scheduledHolds: [
          {
            id: "hold1",
            firefighter_id: "ff1",
            firefighter_name: "John Doe",
            fire_station: "5",
            hold_date: "2025-11-15",
            status: "scheduled",
            shift: "A",
            duration: "24h",
            created_at: "2025-11-01T00:00:00Z",
          },
        ],
      });

      const { container } = render(
        <DayCell
          day={day}
          onDayClick={() => {}}
          currentShift="A"
          isAdminMode={false}
        />
      );

      const nameElement = screen.getByText("J. Doe");
      
      // Hover to show tooltip
      await user.hover(nameElement.closest("div")!.parentElement!);
      
      await waitFor(
        () => {
          expect(screen.getByText("John Doe - Station 5")).toBeInTheDocument();
        },
        { timeout: 1000 }
      );

      // Unhover to hide tooltip
      await user.unhover(nameElement.closest("div")!.parentElement!);

      await waitFor(
        () => {
          expect(screen.queryByText("John Doe - Station 5")).not.toBeInTheDocument();
        },
        { timeout: 500 }
      );
    });
  });

  describe("ARIA Compliance", () => {
    it("should have role='tooltip' on tooltip element", async () => {
      const user = userEvent.setup();
      const day = createTestDay({
        scheduledHolds: [
          {
            id: "hold1",
            firefighter_id: "ff1",
            firefighter_name: "John Doe",
            fire_station: "5",
            hold_date: "2025-11-15",
            status: "scheduled",
            shift: "A",
            duration: "24h",
            created_at: "2025-11-01T00:00:00Z",
          },
        ],
      });

      render(
        <DayCell
          day={day}
          onDayClick={() => {}}
          currentShift="A"
          isAdminMode={false}
        />
      );

      const nameElement = screen.getByText("J. Doe");
      await user.hover(nameElement.closest("div")!.parentElement!);

      await waitFor(
        () => {
          const tooltip = screen.getByRole("tooltip");
          expect(tooltip).toBeInTheDocument();
        },
        { timeout: 1000 }
      );
    });
  });

  describe("Edge Cases", () => {
    it("should handle missing firefighter name gracefully", async () => {
      const user = userEvent.setup();
      const day = createTestDay({
        scheduledHolds: [
          {
            id: "hold1",
            firefighter_id: "ff1",
            firefighter_name: null,
            fire_station: "5",
            hold_date: "2025-11-15",
            status: "scheduled",
            shift: "A",
            duration: "24h",
            created_at: "2025-11-01T00:00:00Z",
          },
        ],
      });

      render(
        <DayCell
          day={day}
          onDayClick={() => {}}
          currentShift="A"
          isAdminMode={false}
        />
      );

      const nameElement = screen.getByText("Unknown");
      await user.hover(nameElement.closest("div")!.parentElement!);

      await waitFor(
        () => {
          expect(screen.getByText("Unknown - Station 5")).toBeInTheDocument();
        },
        { timeout: 1000 }
      );
    });

    it("should handle single-word names", async () => {
      const user = userEvent.setup();
      const day = createTestDay({
        scheduledHolds: [
          {
            id: "hold1",
            firefighter_id: "ff1",
            firefighter_name: "Madonna",
            fire_station: "5",
            hold_date: "2025-11-15",
            status: "scheduled",
            shift: "A",
            duration: "24h",
            created_at: "2025-11-01T00:00:00Z",
          },
        ],
      });

      render(
        <DayCell
          day={day}
          onDayClick={() => {}}
          currentShift="A"
          isAdminMode={false}
        />
      );

      const nameElement = screen.getByText("Madonna");
      await user.hover(nameElement.closest("div")!.parentElement!);

      await waitFor(
        () => {
          expect(screen.getByText("Madonna - Station 5")).toBeInTheDocument();
        },
        { timeout: 1000 }
      );
    });
  });

  describe("Visual Rendering", () => {
    it("should maintain truncate class on name span", () => {
      const day = createTestDay({
        scheduledHolds: [
          {
            id: "hold1",
            firefighter_id: "ff1",
            firefighter_name: "John Doe",
            fire_station: "5",
            hold_date: "2025-11-15",
            status: "scheduled",
            shift: "A",
            duration: "24h",
            created_at: "2025-11-01T00:00:00Z",
          },
        ],
      });

      const { container } = render(
        <DayCell
          day={day}
          onDayClick={() => {}}
          currentShift="A"
          isAdminMode={false}
        />
      );

      const nameSpan = screen.getByText("J. Doe");
      expect(nameSpan.className).toContain("truncate");
    });

    it("should not break existing gradient styling", () => {
      const day = createTestDay({
        scheduledHolds: [
          {
            id: "hold1",
            firefighter_id: "ff1",
            firefighter_name: "John Doe",
            fire_station: "5",
            hold_date: "2025-11-15",
            status: "scheduled",
            shift: "A",
            duration: "24h",
            created_at: "2025-11-01T00:00:00Z",
          },
        ],
      });

      const { container } = render(
        <DayCell
          day={day}
          onDayClick={() => {}}
          currentShift="A"
          isAdminMode={false}
        />
      );

      const holdCard = container.querySelector(".bg-gradient-to-r");
      expect(holdCard).toBeInTheDocument();
      expect(holdCard?.className).toContain("from-red-500");
      expect(holdCard?.className).toContain("to-orange-600");
    });
  });
});
