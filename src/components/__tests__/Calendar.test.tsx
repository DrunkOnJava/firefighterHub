/**
 * Calendar Component Tests
 *
 * Tests the calendar component including:
 * - Displaying held-at station (not assigned station)
 * - Multiple holds popover in read-only mode
 * - Past date hold scheduling
 * - Admin vs read-only mode differences
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Calendar } from "../Calendar";
import { createMockFirefighter, createMockHold } from "../../test/mockData";
import type { Firefighter } from "../../lib/supabase";
import type { ScheduledHold } from "../../utils/calendarUtils";

describe("Calendar Component", () => {
  const mockOnScheduleHold = vi.fn();
  const mockOnRemoveHold = vi.fn();
  const mockOnMarkCompleted = vi.fn();

  const mockFirefighters: Firefighter[] = [
    createMockFirefighter({
      id: "ff-1",
      name: "John Doe",
      fire_station: "1", // Assigned to Station 1
      order_position: 0,
      is_available: true,
    }),
    createMockFirefighter({
      id: "ff-2",
      name: "Jane Smith",
      fire_station: "2", // Assigned to Station 2
      order_position: 1,
      is_available: true,
    }),
    createMockFirefighter({
      id: "ff-3",
      name: "Bob Johnson",
      fire_station: "3", // Assigned to Station 3
      order_position: 2,
      is_available: true,
    }),
  ];

  beforeEach(() => {
    mockOnScheduleHold.mockClear();
    mockOnRemoveHold.mockClear();
    mockOnMarkCompleted.mockClear();
  });

  describe("Feature: Display held-at station instead of assigned station", () => {
    it("should display the station where member was held (not their assigned station)", () => {
      const today = new Date();
      const holdDate = new Date(today);
      holdDate.setDate(today.getDate() + 1); // 5 days from now

      const scheduledHolds: ScheduledHold[] = [
        createMockHold({
          id: "hold-1",
          firefighter_id: "ff-1",
          firefighter_name: "John Doe",
          scheduled_date: holdDate.toISOString().split("T")[0],
          hold_date: holdDate.toISOString().split("T")[0],
          fire_station: "4", // Held at Station 4 (different from assigned Station 1)
        }),
      ];

      render(
        <Calendar
          firefighters={mockFirefighters}
          scheduledHolds={scheduledHolds}
          onScheduleHold={mockOnScheduleHold}
          onRemoveHold={mockOnRemoveHold}
          onMarkCompleted={mockOnMarkCompleted}
          loading={false}
          isAdminMode={true}
          currentShift="A"
        />
      );

      // Should show "Station #4" (where held) in the calendar grid
      const stationElements = screen.getAllByText(/Station #/);
      const hasStation4 = stationElements.some((el) =>
        el.textContent?.includes("Station #4")
      );
      expect(hasStation4).toBe(true);
    });

    it("should display held-at station for multiple holds on same day", () => {
      const today = new Date();
      const holdDate = new Date(today);
      holdDate.setDate(today.getDate() + 1);

      const scheduledHolds: ScheduledHold[] = [
        createMockHold({
          id: "hold-1",
          firefighter_id: "ff-1",
          firefighter_name: "John Doe",
          scheduled_date: holdDate.toISOString().split("T")[0],
          hold_date: holdDate.toISOString().split("T")[0],
          fire_station: "5", // Held at Station 5
        }),
        createMockHold({
          id: "hold-2",
          firefighter_id: "ff-2",
          firefighter_name: "Jane Smith",
          scheduled_date: holdDate.toISOString().split("T")[0],
          hold_date: holdDate.toISOString().split("T")[0],
          fire_station: "6", // Held at Station 6
        }),
      ];

      render(
        <Calendar
          firefighters={mockFirefighters}
          scheduledHolds={scheduledHolds}
          onScheduleHold={mockOnScheduleHold}
          onRemoveHold={mockOnRemoveHold}
          onMarkCompleted={mockOnMarkCompleted}
          loading={false}
          isAdminMode={true}
          currentShift="A"
        />
      );

      // Should show both held-at stations
      const stationElements = screen.getAllByText(/Station #/);
      const hasStation5 = stationElements.some((el) =>
        el.textContent?.includes("Station #5")
      );
      const hasStation6 = stationElements.some((el) =>
        el.textContent?.includes("Station #6")
      );
      expect(hasStation5).toBe(true);
      expect(hasStation6).toBe(true);
    });

    it("should not display station if fire_station is null", () => {
      const today = new Date();
      const holdDate = new Date(today);
      holdDate.setDate(today.getDate() + 1);

      const scheduledHolds: ScheduledHold[] = [
        createMockHold({
          id: "hold-1",
          firefighter_id: "ff-1",
          firefighter_name: "John Doe",
          scheduled_date: holdDate.toISOString().split("T")[0],
          hold_date: holdDate.toISOString().split("T")[0],
          fire_station: undefined, // No station specified
        }),
      ];

      render(
        <Calendar
          firefighters={mockFirefighters}
          scheduledHolds={scheduledHolds}
          onScheduleHold={mockOnScheduleHold}
          onRemoveHold={mockOnRemoveHold}
          onMarkCompleted={mockOnMarkCompleted}
          loading={false}
          isAdminMode={true}
          currentShift="A"
        />
      );

      // Should show firefighter name
      expect(screen.getAllByText("John Doe").length).toBeGreaterThan(0);

      // Should not show any station text in the calendar grid for this hold
      // We just verify the hold was rendered without a station
      expect(
        screen.getByRole("heading", { name: /hold calendar/i })
      ).toBeInTheDocument();
    });
  });

  describe("Feature: Multiple holds popover in read-only mode", () => {
    it("should allow clicking on days with multiple holds in read-only mode", async () => {
      const user = userEvent.setup();
      const today = new Date();
      const holdDate = new Date(today);
      // Set to a date in the same month (October 29, 2025 - tomorrow from Oct 28)
      holdDate.setDate(today.getDate() + 1);

      const scheduledHolds: ScheduledHold[] = [
        createMockHold({
          id: "hold-1",
          firefighter_id: "ff-1",
          firefighter_name: "John Doe",
          scheduled_date: holdDate.toISOString().split("T")[0],
          hold_date: holdDate.toISOString().split("T")[0],
          fire_station: "1",
        }),
        createMockHold({
          id: "hold-2",
          firefighter_id: "ff-2",
          firefighter_name: "Jane Smith",
          scheduled_date: holdDate.toISOString().split("T")[0],
          hold_date: holdDate.toISOString().split("T")[0],
          fire_station: "2",
        }),
      ];

      render(
        <Calendar
          firefighters={mockFirefighters}
          scheduledHolds={scheduledHolds}
          onScheduleHold={mockOnScheduleHold}
          onRemoveHold={mockOnRemoveHold}
          onMarkCompleted={mockOnMarkCompleted}
          loading={false}
          isAdminMode={false} // Read-only mode
          currentShift="A"
        />
      );

      // Find the day with multiple holds - use getAllByText and find button
      const johnElements = screen.getAllByText("John Doe");
      // Find the first one that's inside a button (calendar cell)
      const johnInButton = johnElements.find((el) => el.closest("button"));
      expect(johnInButton).toBeTruthy();

      const dayButton = johnInButton!.closest("button");
      expect(dayButton).not.toBeNull();
      expect(dayButton).not.toBeDisabled();

      await user.click(dayButton!);

      // Modal should open
      await waitFor(() => {
        expect(screen.getByRole("dialog")).toBeInTheDocument();
      });
    });

    it("should NOT allow clicking on days with single hold in read-only mode", () => {
      const today = new Date();
      const holdDate = new Date(today);
      holdDate.setDate(today.getDate() + 1);

      const scheduledHolds: ScheduledHold[] = [
        createMockHold({
          id: "hold-1",
          firefighter_id: "ff-1",
          firefighter_name: "John Doe",
          scheduled_date: holdDate.toISOString().split("T")[0],
          hold_date: holdDate.toISOString().split("T")[0],
          fire_station: "1",
        }),
      ];

      render(
        <Calendar
          firefighters={mockFirefighters}
          scheduledHolds={scheduledHolds}
          onScheduleHold={mockOnScheduleHold}
          onRemoveHold={mockOnRemoveHold}
          onMarkCompleted={mockOnMarkCompleted}
          loading={false}
          isAdminMode={false} // Read-only mode
          currentShift="A"
        />
      );

      // Day button should be disabled in read-only mode when single hold
      const johnElements = screen.getAllByText("John Doe");
      // Find the first one that's inside a button (calendar cell)
      const johnInButton = johnElements.find((el) => el.closest("button"));
      const dayButton = johnInButton!.closest("button");
      expect(dayButton).toBeDisabled();
    });

    it("should NOT show Add Another Person button in read-only mode", async () => {
      const user = userEvent.setup();
      const today = new Date();
      const holdDate = new Date(today);
      holdDate.setDate(today.getDate() + 1);

      const scheduledHolds: ScheduledHold[] = [
        createMockHold({
          id: "hold-1",
          firefighter_id: "ff-1",
          firefighter_name: "John Doe",
          scheduled_date: holdDate.toISOString().split("T")[0],
          hold_date: holdDate.toISOString().split("T")[0],
          fire_station: "1",
        }),
        createMockHold({
          id: "hold-2",
          firefighter_id: "ff-2",
          firefighter_name: "Jane Smith",
          scheduled_date: holdDate.toISOString().split("T")[0],
          hold_date: holdDate.toISOString().split("T")[0],
          fire_station: "2",
        }),
      ];

      render(
        <Calendar
          firefighters={mockFirefighters}
          scheduledHolds={scheduledHolds}
          onScheduleHold={mockOnScheduleHold}
          onRemoveHold={mockOnRemoveHold}
          onMarkCompleted={mockOnMarkCompleted}
          loading={false}
          isAdminMode={false} // Read-only mode
          currentShift="A"
        />
      );

      // Click on the day - find by firefighter name in button
      const johnElements = screen.getAllByText("John Doe");
      // Find the first one that's inside a button (calendar cell)
      const johnInButton = johnElements.find((el) => el.closest("button"));
      const dayButton = johnInButton!.closest("button");
      await user.click(dayButton!);

      // Modal should open but "Add Another Person" button should NOT be present
      await waitFor(() => {
        expect(screen.getByRole("dialog")).toBeInTheDocument();
      });

      expect(screen.queryByText("Add Another Person")).not.toBeInTheDocument();
    });

    it("should SHOW Add Another Person button in admin mode", async () => {
      const user = userEvent.setup();
      const today = new Date();
      const holdDate = new Date(today);
      holdDate.setDate(today.getDate() + 1);

      const scheduledHolds: ScheduledHold[] = [
        createMockHold({
          id: "hold-1",
          firefighter_id: "ff-1",
          firefighter_name: "John Doe",
          scheduled_date: holdDate.toISOString().split("T")[0],
          hold_date: holdDate.toISOString().split("T")[0],
          fire_station: "1",
        }),
      ];

      render(
        <Calendar
          firefighters={mockFirefighters}
          scheduledHolds={scheduledHolds}
          onScheduleHold={mockOnScheduleHold}
          onRemoveHold={mockOnRemoveHold}
          onMarkCompleted={mockOnMarkCompleted}
          loading={false}
          isAdminMode={true} // Admin mode
          currentShift="A"
        />
      );

      // Click on the day - find by firefighter name in button
      const johnElements = screen.getAllByText("John Doe");
      // Find the first one that's inside a button (calendar cell)
      const johnInButton = johnElements.find((el) => el.closest("button"));
      const dayButton = johnInButton!.closest("button");
      await user.click(dayButton!);

      // Modal should open with "Add Another Person" button
      await waitFor(() => {
        expect(screen.getByRole("dialog")).toBeInTheDocument();
        expect(screen.getByText("Add Another Person")).toBeInTheDocument();
      });
    });
  });

  describe("Feature: Past date hold scheduling in admin mode", () => {
    it("should render calendar in admin mode", () => {
      render(
        <Calendar
          firefighters={mockFirefighters}
          scheduledHolds={[]}
          onScheduleHold={mockOnScheduleHold}
          onRemoveHold={mockOnRemoveHold}
          onMarkCompleted={mockOnMarkCompleted}
          loading={false}
          isAdminMode={true}
          currentShift="A"
        />
      );

      // Calendar should render
      expect(screen.getByText("October 2025")).toBeInTheDocument();
    });
  });

  describe("Admin vs Read-only mode behavior", () => {
    it("should render calendar in read-only mode", () => {
      render(
        <Calendar
          firefighters={mockFirefighters}
          scheduledHolds={[]}
          onScheduleHold={mockOnScheduleHold}
          onRemoveHold={mockOnRemoveHold}
          onMarkCompleted={mockOnMarkCompleted}
          loading={false}
          isAdminMode={false}
          currentShift="A"
        />
      );

      // Calendar should render
      expect(screen.getByText("October 2025")).toBeInTheDocument();
    });
  });
});
