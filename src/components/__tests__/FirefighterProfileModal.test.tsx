/**
 * FirefighterProfileModal Component Tests
 *
 * Tests the firefighter profile modal including:
 * - Modal visibility and rendering
 * - Hold history loading (infinite loop regression test)
 * - Timezone consistency for date displays
 * - Profile display mode
 * - Profile edit mode (admin only)
 * - Apparatus certifications display
 * - Qualifications display
 * - Hold detail modal
 * - Keyboard interactions
 * - Accessibility
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FirefighterProfileModal } from "../FirefighterProfileModal";
import { createMockFirefighter } from "../../test/mockData";
import type { Firefighter } from "../../lib/supabase";
import {
  resetMockDatabase,
  setMockScheduledHolds,
  simulateError,
  clearErrorSimulation,
} from "../../test/supabaseMockV2";

// Mock Supabase client
vi.mock("../../lib/supabase", async () => {
  const actual = await vi.importActual("../../lib/supabase");
  const { createMockSupabaseClient } = await import(
    "../../test/supabaseMockV2"
  );
  return {
    ...actual,
    supabase: createMockSupabaseClient(),
  };
});

describe("FirefighterProfileModal", () => {
  const mockOnClose = vi.fn();
  const mockFirefighter: Firefighter = createMockFirefighter({
    id: "ff-profile-1",
    name: "John Doe",
    fire_station: "1",
    shift: "A",
    certification_level: "FF2",
    last_hold_date: "2025-10-20T00:00:00Z",
    apparatus_ambulance: true,
    apparatus_engine: true,
    apparatus_truck: true,
    is_fto: true,
    is_bls: true,
    is_als: false,
  });

  const mockHoldRecords = [
    {
      id: "hold-1",
      firefighter_id: "ff-profile-1",
      hold_date: "2025-10-20T00:00:00Z",
      fire_station: "1",
      status: "completed",
      completed_at: "2025-10-20T18:30:00Z",
      created_at: "2025-10-15T10:00:00Z",
    },
    {
      id: "hold-2",
      firefighter_id: "ff-profile-1",
      hold_date: "2025-10-15T00:00:00Z",
      fire_station: "2",
      status: "completed",
      completed_at: "2025-10-15T19:00:00Z",
      created_at: "2025-10-10T14:00:00Z",
    },
    {
      id: "hold-3",
      firefighter_id: "ff-profile-1",
      hold_date: "2025-11-05T00:00:00Z",
      fire_station: "1",
      status: "scheduled",
      completed_at: null,
      created_at: "2025-10-25T09:00:00Z",
    },
  ];

  beforeEach(() => {
    resetMockDatabase();
    mockOnClose.mockClear();
    clearErrorSimulation();
  });

  describe("Rendering and Visibility", () => {
    it("should not render when isOpen is false", () => {
      render(
        <FirefighterProfileModal
          isOpen={false}
          firefighter={mockFirefighter}
          onClose={mockOnClose}
        />
      );

      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    it("should render when isOpen is true", () => {
      render(
        <FirefighterProfileModal
          isOpen={true}
          firefighter={mockFirefighter}
          onClose={mockOnClose}
        />
      );

      expect(screen.getByRole("dialog")).toBeInTheDocument();
      expect(
        screen.getByRole("heading", { name: "John Doe" })
      ).toBeInTheDocument();
    });

    it("should not render when firefighter is null", () => {
      render(
        <FirefighterProfileModal
          isOpen={true}
          firefighter={null}
          onClose={mockOnClose}
        />
      );

      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    it("should display firefighter profile subtitle", () => {
      render(
        <FirefighterProfileModal
          isOpen={true}
          firefighter={mockFirefighter}
          onClose={mockOnClose}
        />
      );

      expect(screen.getByText("Firefighter Profile")).toBeInTheDocument();
    });

    it("should display close button", () => {
      render(
        <FirefighterProfileModal
          isOpen={true}
          firefighter={mockFirefighter}
          onClose={mockOnClose}
        />
      );

      const closeButton = screen.getByRole("button", {
        name: /close profile dialog/i,
      });
      expect(closeButton).toBeInTheDocument();
    });
  });

  describe("Hold History Loading - Infinite Loop Prevention", () => {
    it("should load hold history and display it", async () => {
      setMockScheduledHolds(mockHoldRecords);

      render(
        <FirefighterProfileModal
          isOpen={true}
          firefighter={mockFirefighter}
          onClose={mockOnClose}
        />
      );

      // Wait for loading to complete
      await waitFor(() => {
        expect(screen.queryByText(/loading history/i)).not.toBeInTheDocument();
      });

      // Verify hold records are displayed (may appear multiple times)
      const holdDates = screen.getAllByText(/Oct 20, 2025/i);
      expect(holdDates.length).toBeGreaterThan(0);
    });

    it("should not reload history when modal stays open", async () => {
      setMockScheduledHolds(mockHoldRecords);

      const { rerender } = render(
        <FirefighterProfileModal
          isOpen={true}
          firefighter={mockFirefighter}
          onClose={mockOnClose}
        />
      );

      await waitFor(() => {
        expect(screen.queryByText(/loading history/i)).not.toBeInTheDocument();
      });

      // Re-render without changing props
      rerender(
        <FirefighterProfileModal
          isOpen={true}
          firefighter={mockFirefighter}
          onClose={mockOnClose}
        />
      );

      // History should still be visible without reload (may appear multiple times)
      const holdDates = screen.getAllByText(/Oct 20, 2025/i);
      expect(holdDates.length).toBeGreaterThan(0);
    });

    it("should reset state when modal closes and reopens", async () => {
      setMockScheduledHolds(mockHoldRecords);

      const { rerender } = render(
        <FirefighterProfileModal
          isOpen={true}
          firefighter={mockFirefighter}
          onClose={mockOnClose}
        />
      );

      await waitFor(() => {
        expect(screen.queryByText(/loading history/i)).not.toBeInTheDocument();
      });

      // Close modal
      rerender(
        <FirefighterProfileModal
          isOpen={false}
          firefighter={mockFirefighter}
          onClose={mockOnClose}
        />
      );

      // Reopen modal
      rerender(
        <FirefighterProfileModal
          isOpen={true}
          firefighter={mockFirefighter}
          onClose={mockOnClose}
        />
      );

      // History should reload and display
      await waitFor(() => {
        expect(screen.getByText(/Oct 20, 2025/i)).toBeInTheDocument();
      });
    });

    it("should handle hold history query errors gracefully", async () => {
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      // Simulate database error
      simulateError("Database error", true);

      render(
        <FirefighterProfileModal
          isOpen={true}
          firefighter={mockFirefighter}
          onClose={mockOnClose}
        />
      );

      await waitFor(() => {
        expect(screen.queryByText(/loading history/i)).not.toBeInTheDocument();
      });

      // Should show "no holds" message on error
      expect(screen.getByText(/no previous holds/i)).toBeInTheDocument();
      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });
  });

  describe("Timezone Consistency - Date Display", () => {
    it("should display last hold date in UTC timezone", () => {
      render(
        <FirefighterProfileModal
          isOpen={true}
          firefighter={mockFirefighter}
          onClose={mockOnClose}
        />
      );

      // Last hold date should use UTC timezone
      const lastHoldText = screen.getByText(/Oct 20, 2025/i);
      expect(lastHoldText).toBeInTheDocument();
    });

    it("should display hold history dates consistently in UTC", async () => {
      setMockScheduledHolds(mockHoldRecords);

      render(
        <FirefighterProfileModal
          isOpen={true}
          firefighter={mockFirefighter}
          onClose={mockOnClose}
        />
      );

      await waitFor(() => {
        expect(screen.queryByText(/loading history/i)).not.toBeInTheDocument();
      });

      // All dates should be formatted consistently (may appear multiple times)
      expect(screen.getAllByText(/Oct 20, 2025/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/Oct 15, 2025/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/Nov 5, 2025/i).length).toBeGreaterThan(0);
    });

    it("should handle null last_hold_date", () => {
      const firefighterNoHold = createMockFirefighter({
        ...mockFirefighter,
        last_hold_date: null,
      });

      render(
        <FirefighterProfileModal
          isOpen={true}
          firefighter={firefighterNoHold}
          onClose={mockOnClose}
        />
      );

      expect(screen.getByText("Never")).toBeInTheDocument();
    });
  });

  describe("Profile Display Mode", () => {
    it("should display firefighter basic info", () => {
      render(
        <FirefighterProfileModal
          isOpen={true}
          firefighter={mockFirefighter}
          onClose={mockOnClose}
        />
      );

      expect(screen.getByText("John Doe")).toBeInTheDocument();
      // "Shift" appears multiple times, use getAllByText
      expect(screen.getAllByText(/shift/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/station/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/#1/i).length).toBeGreaterThan(0);
    });

    it("should display certification level", () => {
      render(
        <FirefighterProfileModal
          isOpen={true}
          firefighter={mockFirefighter}
          onClose={mockOnClose}
        />
      );

      expect(screen.getByText("FF2")).toBeInTheDocument();
    });

    it("should display qualifications badges", () => {
      render(
        <FirefighterProfileModal
          isOpen={true}
          firefighter={mockFirefighter}
          onClose={mockOnClose}
        />
      );

      expect(screen.getByText("FTO")).toBeInTheDocument();
      expect(screen.getByText("BLS")).toBeInTheDocument();
      expect(screen.queryByText("ALS")).not.toBeInTheDocument(); // Not set
    });

    it("should show 'No qualifications' when none are set", () => {
      const firefighterNoQuals = createMockFirefighter({
        ...mockFirefighter,
        is_fto: false,
        is_bls: false,
        is_als: false,
      });

      render(
        <FirefighterProfileModal
          isOpen={true}
          firefighter={firefighterNoQuals}
          onClose={mockOnClose}
        />
      );

      expect(screen.getByText(/no qualifications/i)).toBeInTheDocument();
    });

    it("should display apparatus clearances", () => {
      render(
        <FirefighterProfileModal
          isOpen={true}
          firefighter={mockFirefighter}
          onClose={mockOnClose}
        />
      );

      expect(screen.getByText("Ambulance")).toBeInTheDocument();
      expect(screen.getByText("Engine")).toBeInTheDocument();
      expect(screen.getByText("Truck")).toBeInTheDocument();
    });

    it("should show 'No apparatus clearances' when none are set", () => {
      const firefighterNoApparatus = createMockFirefighter({
        ...mockFirefighter,
        apparatus_ambulance: false,
        apparatus_engine: false,
        apparatus_truck: false,
        apparatus_tanker: false,
        apparatus_brush_truck: false,
        apparatus_boat: false,
        apparatus_utv: false,
        apparatus_rescue_squad: false,
      });

      render(
        <FirefighterProfileModal
          isOpen={true}
          firefighter={firefighterNoApparatus}
          onClose={mockOnClose}
        />
      );

      expect(screen.getByText(/no apparatus clearances/i)).toBeInTheDocument();
    });
  });

  describe("Hold History Display", () => {
    it("should display hold count statistics", async () => {
      setMockScheduledHolds(mockHoldRecords);

      render(
        <FirefighterProfileModal
          isOpen={true}
          firefighter={mockFirefighter}
          onClose={mockOnClose}
        />
      );

      await waitFor(() => {
        expect(screen.queryByText(/loading history/i)).not.toBeInTheDocument();
      });

      // 2 completed, 1 scheduled
      expect(screen.getByText("2")).toBeInTheDocument(); // Completed count
      expect(screen.getByText("1")).toBeInTheDocument(); // Scheduled count
      // "Completed" appears multiple times, use getAllByText
      expect(screen.getAllByText("Completed").length).toBeGreaterThan(0);
      expect(screen.getAllByText("Scheduled").length).toBeGreaterThan(0);
    });

    it("should show 'No previous holds' when history is empty", async () => {
      setMockScheduledHolds([]);

      render(
        <FirefighterProfileModal
          isOpen={true}
          firefighter={mockFirefighter}
          onClose={mockOnClose}
        />
      );

      await waitFor(() => {
        expect(screen.queryByText(/loading history/i)).not.toBeInTheDocument();
      });

      expect(screen.getByText(/no previous holds/i)).toBeInTheDocument();
      expect(
        screen.getByText(/has not completed any holds yet/i)
      ).toBeInTheDocument();
    });

    it("should display first 3 holds by default when more than 3 exist", async () => {
      const manyHolds = Array.from({ length: 5 }, (_, i) => ({
        id: `hold-${i}`,
        firefighter_id: "ff-profile-1",
        hold_date: `2025-10-${20 - i}T00:00:00Z`,
        fire_station: "1",
        status: "completed",
        completed_at: `2025-10-${20 - i}T18:00:00Z`,
        created_at: `2025-10-${15 - i}T10:00:00Z`,
      }));

      setMockScheduledHolds(manyHolds);

      render(
        <FirefighterProfileModal
          isOpen={true}
          firefighter={mockFirefighter}
          onClose={mockOnClose}
        />
      );

      await waitFor(() => {
        expect(screen.queryByText(/loading history/i)).not.toBeInTheDocument();
      });

      // Should show "Show All X Holds" button
      expect(screen.getByText(/show all 5 holds/i)).toBeInTheDocument();
    });

    it("should expand to show all holds when clicking 'Show All'", async () => {
      const manyHolds = Array.from({ length: 5 }, (_, i) => ({
        id: `hold-${i}`,
        firefighter_id: "ff-profile-1",
        hold_date: `2025-10-${20 - i}T00:00:00Z`,
        fire_station: "1",
        status: "completed",
        completed_at: `2025-10-${20 - i}T18:00:00Z`,
        created_at: `2025-10-${15 - i}T10:00:00Z`,
      }));

      setMockScheduledHolds(manyHolds);
      const user = userEvent.setup();

      render(
        <FirefighterProfileModal
          isOpen={true}
          firefighter={mockFirefighter}
          onClose={mockOnClose}
        />
      );

      await waitFor(() => {
        expect(screen.queryByText(/loading history/i)).not.toBeInTheDocument();
      });

      const showAllButton = screen.getByText(/show all 5 holds/i);
      await user.click(showAllButton);

      // Button text should change
      expect(screen.getByText(/show less/i)).toBeInTheDocument();
    });

    it("should not show expand button when holds <= 3", async () => {
      setMockScheduledHolds(mockHoldRecords.slice(0, 2));

      render(
        <FirefighterProfileModal
          isOpen={true}
          firefighter={mockFirefighter}
          onClose={mockOnClose}
        />
      );

      await waitFor(() => {
        expect(screen.queryByText(/loading history/i)).not.toBeInTheDocument();
      });

      expect(screen.queryByText(/show all/i)).not.toBeInTheDocument();
    });
  });

  describe("Hold Detail Modal", () => {
    it("should open detail modal when clicking a hold record", async () => {
      setMockScheduledHolds(mockHoldRecords);
      const user = userEvent.setup();

      render(
        <FirefighterProfileModal
          isOpen={true}
          firefighter={mockFirefighter}
          onClose={mockOnClose}
        />
      );

      await waitFor(() => {
        expect(screen.queryByText(/loading history/i)).not.toBeInTheDocument();
      });

      // Click first hold record
      const holdButtons = screen.getAllByRole("button");
      const firstHold = holdButtons.find((btn) =>
        btn.textContent?.includes("Oct 20, 2025")
      );
      expect(firstHold).toBeDefined();
      await user.click(firstHold!);

      // Detail modal should appear
      expect(screen.getByText("Hold Details")).toBeInTheDocument();
    });

    it("should display detailed hold information in detail modal", async () => {
      setMockScheduledHolds(mockHoldRecords);
      const user = userEvent.setup();

      render(
        <FirefighterProfileModal
          isOpen={true}
          firefighter={mockFirefighter}
          onClose={mockOnClose}
        />
      );

      await waitFor(() => {
        expect(screen.queryByText(/loading history/i)).not.toBeInTheDocument();
      });

      const holdButtons = screen.getAllByRole("button");
      const firstHold = holdButtons.find((btn) =>
        btn.textContent?.includes("Oct 20, 2025")
      );
      await user.click(firstHold!);

      // Should show detailed date format
      expect(screen.getByText(/Monday, October 20, 2025/i)).toBeInTheDocument();
      // "Station #1" appears multiple times, use getAllByText
      expect(screen.getAllByText(/Station #1/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/Completed/i).length).toBeGreaterThan(0);
    });

    it("should close detail modal when clicking close button", async () => {
      setMockScheduledHolds(mockHoldRecords);
      const user = userEvent.setup();

      render(
        <FirefighterProfileModal
          isOpen={true}
          firefighter={mockFirefighter}
          onClose={mockOnClose}
        />
      );

      await waitFor(() => {
        expect(screen.queryByText(/loading history/i)).not.toBeInTheDocument();
      });

      const holdButtons = screen.getAllByRole("button");
      const firstHold = holdButtons.find((btn) =>
        btn.textContent?.includes("Oct 20, 2025")
      );
      await user.click(firstHold!);

      expect(screen.getByText("Hold Details")).toBeInTheDocument();

      // Close detail modal
      const closeButtons = screen.getAllByRole("button", { name: /close/i });
      const detailCloseButton = closeButtons.find(
        (btn) => btn.textContent === "Close"
      );
      await user.click(detailCloseButton!);

      expect(screen.queryByText("Hold Details")).not.toBeInTheDocument();
    });
  });

  describe("Profile Edit Mode - Admin Only", () => {
    it("should not show edit button in read-only mode", () => {
      render(
        <FirefighterProfileModal
          isOpen={true}
          firefighter={mockFirefighter}
          onClose={mockOnClose}
          isAdminMode={false}
        />
      );

      expect(
        screen.queryByRole("button", { name: /edit profile/i })
      ).not.toBeInTheDocument();
    });

    it("should show edit button in admin mode", () => {
      render(
        <FirefighterProfileModal
          isOpen={true}
          firefighter={mockFirefighter}
          onClose={mockOnClose}
          isAdminMode={true}
        />
      );

      expect(
        screen.getByRole("button", { name: /edit profile/i })
      ).toBeInTheDocument();
    });

    it("should enter edit mode when clicking edit button", async () => {
      const user = userEvent.setup();

      render(
        <FirefighterProfileModal
          isOpen={true}
          firefighter={mockFirefighter}
          onClose={mockOnClose}
          isAdminMode={true}
        />
      );

      const editButton = screen.getByRole("button", { name: /edit profile/i });
      await user.click(editButton);

      // Button should change to "Save"
      expect(
        screen.getByRole("button", { name: /save changes/i })
      ).toBeInTheDocument();
    });

    it("should show editable fields in edit mode", async () => {
      const user = userEvent.setup();

      render(
        <FirefighterProfileModal
          isOpen={true}
          firefighter={mockFirefighter}
          onClose={mockOnClose}
          isAdminMode={true}
        />
      );

      const editButton = screen.getByRole("button", { name: /edit profile/i });
      await user.click(editButton);

      // Name input
      const nameInput = screen.getByDisplayValue("John Doe");
      expect(nameInput).toBeInTheDocument();
      expect(nameInput.tagName).toBe("INPUT");

      // Shift dropdown - find select element containing value "A"
      const selects = screen.getAllByRole("combobox");
      const shiftSelect = selects.find(
        (select) => (select as HTMLSelectElement).value === "A"
      );
      expect(shiftSelect).toBeDefined();

      // Station input
      const stationInput = screen.getByDisplayValue("1");
      expect(stationInput).toBeInTheDocument();
    });

    it("should allow editing firefighter name", async () => {
      const user = userEvent.setup();

      render(
        <FirefighterProfileModal
          isOpen={true}
          firefighter={mockFirefighter}
          onClose={mockOnClose}
          isAdminMode={true}
        />
      );

      await user.click(screen.getByRole("button", { name: /edit profile/i }));

      const nameInput = screen.getByDisplayValue("John Doe");
      await user.clear(nameInput);
      await user.type(nameInput, "Jane Smith");

      expect(nameInput).toHaveValue("Jane Smith");
    });

    it("should show checkboxes for qualifications in edit mode", async () => {
      const user = userEvent.setup();

      render(
        <FirefighterProfileModal
          isOpen={true}
          firefighter={mockFirefighter}
          onClose={mockOnClose}
          isAdminMode={true}
        />
      );

      await user.click(screen.getByRole("button", { name: /edit profile/i }));

      expect(
        screen.getByLabelText(/FTO \(Field Training Officer\)/i)
      ).toBeInTheDocument();
      expect(
        screen.getByLabelText(/BLS \(Basic Life Support\)/i)
      ).toBeInTheDocument();
      expect(
        screen.getByLabelText(/ALS \(Advanced Life Support\)/i)
      ).toBeInTheDocument();
    });

    it("should show checkboxes for apparatus in edit mode", async () => {
      const user = userEvent.setup();

      render(
        <FirefighterProfileModal
          isOpen={true}
          firefighter={mockFirefighter}
          onClose={mockOnClose}
          isAdminMode={true}
        />
      );

      await user.click(screen.getByRole("button", { name: /edit profile/i }));

      // Should show all apparatus types as checkboxes
      expect(screen.getByLabelText(/ambulance/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/^engine/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/^truck/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/tanker/i)).toBeInTheDocument();
    });
  });

  describe("Keyboard Interactions", () => {
    it("should close modal when pressing Escape key", async () => {
      const user = userEvent.setup();

      render(
        <FirefighterProfileModal
          isOpen={true}
          firefighter={mockFirefighter}
          onClose={mockOnClose}
        />
      );

      await user.keyboard("{Escape}");

      expect(mockOnClose).toHaveBeenCalled();
    });

    it("should close modal when clicking backdrop", async () => {
      const user = userEvent.setup();

      render(
        <FirefighterProfileModal
          isOpen={true}
          firefighter={mockFirefighter}
          onClose={mockOnClose}
        />
      );

      const backdrop = screen.getByRole("dialog");
      await user.click(backdrop);

      expect(mockOnClose).toHaveBeenCalled();
    });

    it("should not close when clicking modal content", async () => {
      const user = userEvent.setup();

      render(
        <FirefighterProfileModal
          isOpen={true}
          firefighter={mockFirefighter}
          onClose={mockOnClose}
        />
      );

      const modalContent = screen.getByText("Firefighter Profile");
      await user.click(modalContent);

      expect(mockOnClose).not.toHaveBeenCalled();
    });
  });

  describe("Accessibility", () => {
    it("should have proper ARIA labels", () => {
      render(
        <FirefighterProfileModal
          isOpen={true}
          firefighter={mockFirefighter}
          onClose={mockOnClose}
        />
      );

      const dialog = screen.getByRole("dialog");
      expect(dialog).toHaveAttribute("aria-modal", "true");
      expect(dialog).toHaveAttribute("aria-labelledby", "profile-modal-title");
    });

    it("should have accessible close button", () => {
      render(
        <FirefighterProfileModal
          isOpen={true}
          firefighter={mockFirefighter}
          onClose={mockOnClose}
        />
      );

      const closeButton = screen.getByRole("button", {
        name: /close profile dialog/i,
      });
      expect(closeButton).toBeInTheDocument();
    });

    it("should have accessible edit/save button in admin mode", () => {
      render(
        <FirefighterProfileModal
          isOpen={true}
          firefighter={mockFirefighter}
          onClose={mockOnClose}
          isAdminMode={true}
        />
      );

      const editButton = screen.getByRole("button", { name: /edit profile/i });
      expect(editButton).toHaveAttribute("aria-label", "Edit profile");
    });
  });
});
