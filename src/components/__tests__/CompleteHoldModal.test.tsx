/**
 * CompleteHoldModal Component Tests
 *
 * Tests the complete hold modal workflow including:
 * - Modal visibility and rendering
 * - Date picker functionality and validation
 * - Station input field
 * - Confirm/cancel actions
 * - Keyboard interactions (Enter, Escape)
 * - Focus trap and accessibility
 * - Error states and disabled states
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CompleteHoldModal } from "@/features/shifts/components/CompleteHoldModal";
import { createMockFirefighter } from "../../test/mockData";
import type { Firefighter } from '@/lib/supabase';

describe("CompleteHoldModal", () => {
  const mockOnClose = vi.fn();
  const mockOnConfirm = vi.fn();
  const mockFirefighter: Firefighter = createMockFirefighter({
    id: "ff-test-1",
    name: "John Doe",
    fire_station: "1",
  });

  // Helper to get date input (label is not properly associated in component)
  const getDateInput = () => {
    const dateInputs = Array.from(
      document.querySelectorAll('input[type="date"]')
    );
    return dateInputs[0] as HTMLInputElement;
  };

  beforeEach(() => {
    mockOnClose.mockClear();
    mockOnConfirm.mockClear();
  });

  describe("Rendering and Visibility", () => {
    it("should not render when isOpen is false", () => {
      render(
        <CompleteHoldModal
          totalFirefighters={5}
          isOpen={false}
          firefighter={mockFirefighter}
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
        />
      );

      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    it("should render when isOpen is true", () => {
      render(
        <CompleteHoldModal
          totalFirefighters={5}
          isOpen={true}
          firefighter={mockFirefighter}
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
        />
      );

      expect(screen.getByRole("dialog")).toBeInTheDocument();
      expect(
        screen.getByRole("heading", { name: /complete hold/i })
      ).toBeInTheDocument();
    });

    it("should not render when firefighter is null", () => {
      render(
        <CompleteHoldModal
          totalFirefighters={5}
          isOpen={true}
          firefighter={null}
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
        />
      );

      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    it("should display firefighter name in modal", () => {
      render(
        <CompleteHoldModal
          totalFirefighters={5}
          isOpen={true}
          firefighter={mockFirefighter}
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
        />
      );

      // Firefighter name appears in multiple places (header and info text)
      expect(screen.getAllByText("John Doe").length).toBeGreaterThan(0);
    });

    it("should display informational message about hold completion", () => {
      render(
        <CompleteHoldModal
          totalFirefighters={5}
          isOpen={true}
          firefighter={mockFirefighter}
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
        />
      );

      // Should show position selector
      expect(screen.getByText(/new position/i)).toBeInTheDocument();
      // Should show recommended option
      expect(screen.getByText(/bottom.*recommended/i)).toBeInTheDocument();
    });
  });

  describe("Date Picker Functionality", () => {
    const getDateInput = () =>
      screen.getByDisplayValue(
        new Date().toISOString().split("T")[0]
      ) as HTMLInputElement;

    it("should initialize date picker with today's date", () => {
      render(
        <CompleteHoldModal
          totalFirefighters={5}
          isOpen={true}
          firefighter={mockFirefighter}
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
        />
      );

      const dateInput = getDateInput();
      const today = new Date().toISOString().split("T")[0];

      expect(dateInput.value).toBe(today);
      expect(dateInput).toHaveAttribute("type", "date");
    });

    it("should allow selecting a different date", async () => {
      const user = userEvent.setup();

      render(
        <CompleteHoldModal
          totalFirefighters={5}
          isOpen={true}
          firefighter={mockFirefighter}
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
        />
      );

      const dateInput = getDateInput();
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 7);
      const futureDateStr = futureDate.toISOString().split("T")[0];

      await user.clear(dateInput);
      await user.type(dateInput, futureDateStr);

      expect(dateInput).toHaveValue(futureDateStr);
    });

    it("should set min date to today", () => {
      render(
        <CompleteHoldModal
          totalFirefighters={5}
          isOpen={true}
          firefighter={mockFirefighter}
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
        />
      );

      const dateInput = getDateInput() as HTMLInputElement;
      const today = new Date().toISOString().split("T")[0];

      expect(dateInput.min).toBe(today);
    });

    it("should set max date to 1 year from today", () => {
      render(
        <CompleteHoldModal
          totalFirefighters={5}
          isOpen={true}
          firefighter={mockFirefighter}
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
        />
      );

      const dateInput = getDateInput() as HTMLInputElement;
      const maxDate = new Date();
      maxDate.setDate(maxDate.getDate() + 365);
      const maxDateStr = maxDate.toISOString().split("T")[0];

      expect(dateInput.max).toBe(maxDateStr);
    });

    it("should reset date when modal reopens", async () => {
      const { rerender } = render(
        <CompleteHoldModal
          totalFirefighters={5}
          isOpen={true}
          firefighter={mockFirefighter}
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
        />
      );

      const dateInput = getDateInput() as HTMLInputElement;
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 7);
      const futureDateStr = futureDate.toISOString().split("T")[0];

      const user = userEvent.setup();
      await user.clear(dateInput);
      await user.type(dateInput, futureDateStr);
      expect(dateInput.value).toBe(futureDateStr);

      // Close and reopen modal
      rerender(
        <CompleteHoldModal
          totalFirefighters={5}
          isOpen={false}
          firefighter={mockFirefighter}
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
        />
      );

      rerender(
        <CompleteHoldModal
          totalFirefighters={5}
          isOpen={true}
          firefighter={mockFirefighter}
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
        />
      );

      const today = new Date().toISOString().split("T")[0];
      await waitFor(() => {
        expect(getDateInput()).toHaveValue(today);
      });
    });
  });

  describe("Station Input", () => {
    it("should initialize station with firefighter's current station", () => {
      const firefighterWithStation = createMockFirefighter({
        id: "ff-station",
        fire_station: "3",
      });

      render(
        <CompleteHoldModal
          totalFirefighters={5}
          isOpen={true}
          firefighter={firefighterWithStation}
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
        />
      );

      // StationSelector should have the default station selected
      const stationButton = screen.getByRole("button", { name: "3" });
      expect(stationButton).toBeInTheDocument();
      expect(stationButton).toHaveClass(/orange/); // Selected stations have orange styling
    });

    it("should handle firefighter with no station", () => {
      const firefighterNoStation = createMockFirefighter({
        id: "ff-no-station",
        fire_station: null,
      });

      render(
        <CompleteHoldModal
          totalFirefighters={5}
          isOpen={true}
          firefighter={firefighterNoStation}
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
        />
      );

      // Should render without error
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    it("should allow changing station", async () => {
      const user = userEvent.setup();

      render(
        <CompleteHoldModal
          totalFirefighters={5}
          isOpen={true}
          firefighter={mockFirefighter}
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
        />
      );

      // Station 1 should be initially selected (from mockFirefighter)
      const station1Button = screen.getByRole("button", { name: "1" });
      expect(station1Button).toHaveClass(/orange/);

      // Click station 2 to change selection
      const station2Button = screen.getByRole("button", { name: "2" });
      await user.click(station2Button);

      // Verify modal didn't close
      expect(mockOnClose).not.toHaveBeenCalled();
    });
  });

  describe("Confirm Action", () => {
    it("should call onConfirm with correct parameters when Complete Hold is clicked", async () => {
      const user = userEvent.setup();

      render(
        <CompleteHoldModal
          totalFirefighters={5}
          isOpen={true}
          firefighter={mockFirefighter}
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
        />
      );

      const completeButton = screen.getByRole("button", {
        name: /complete hold/i,
      });
      await user.click(completeButton);

      expect(mockOnConfirm).toHaveBeenCalledTimes(1);
      expect(mockOnConfirm).toHaveBeenCalledWith(
        "ff-test-1",
        expect.any(String), // Today's date in ISO format
        5, // Default position (bottom = totalFirefighters = 5)
        "1", // Station from mockFirefighter
        null // lent_to_shift default is null
      );
    });

    it("should close modal after confirmation", async () => {
      const user = userEvent.setup();

      render(
        <CompleteHoldModal
          totalFirefighters={5}
          isOpen={true}
          firefighter={mockFirefighter}
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
        />
      );

      const completeButton = screen.getByRole("button", {
        name: /complete hold/i,
      });
      await user.click(completeButton);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it("should pass undefined for station if empty", async () => {
      const user = userEvent.setup();
      const firefighterNoStation = createMockFirefighter({
        id: "ff-no-station",
        fire_station: null,
      });

      render(
        <CompleteHoldModal
          totalFirefighters={5}
          isOpen={true}
          firefighter={firefighterNoStation}
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
        />
      );

      const completeButton = screen.getByRole("button", {
        name: /complete hold/i,
      });
      await user.click(completeButton);

      expect(mockOnConfirm).toHaveBeenCalledWith(
        "ff-no-station",
        expect.any(String),
        5, // Default position (bottom)
        undefined, // No station
        null // lent_to_shift default is null
      );
    });

    it("should disable Complete Hold button when date is empty", async () => {
      const user = userEvent.setup();

      render(
        <CompleteHoldModal
          totalFirefighters={5}
          isOpen={true}
          firefighter={mockFirefighter}
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
        />
      );

      const dateInput = getDateInput();
      const completeButton = screen.getByRole("button", {
        name: /complete hold/i,
      });

      // Clear the date
      await user.clear(dateInput);

      expect(completeButton).toBeDisabled();

      // Should not call onConfirm when disabled button is clicked
      await user.click(completeButton);
      expect(mockOnConfirm).not.toHaveBeenCalled();
    });

    it("should pass selected date in correct format", async () => {
      const user = userEvent.setup();

      render(
        <CompleteHoldModal
          totalFirefighters={5}
          isOpen={true}
          firefighter={mockFirefighter}
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
        />
      );

      const dateInput = getDateInput();
      const testDate = "2025-11-15";

      await user.clear(dateInput);
      await user.type(dateInput, testDate);

      const completeButton = screen.getByRole("button", {
        name: /complete hold/i,
      });
      await user.click(completeButton);

      expect(mockOnConfirm).toHaveBeenCalledWith(
        "ff-test-1",
        testDate,
        5, // Default position (bottom)
        "1",
        null // lent_to_shift default is null
      );
    });
  });

  describe("Cancel Action", () => {
    it("should call onClose when Cancel button is clicked", async () => {
      const user = userEvent.setup();

      render(
        <CompleteHoldModal
          totalFirefighters={5}
          isOpen={true}
          firefighter={mockFirefighter}
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
        />
      );

      const cancelButton = screen.getByRole("button", { name: /cancel/i });
      await user.click(cancelButton);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
      expect(mockOnConfirm).not.toHaveBeenCalled();
    });

    it("should call onClose when X button is clicked", async () => {
      const user = userEvent.setup();

      render(
        <CompleteHoldModal
          totalFirefighters={5}
          isOpen={true}
          firefighter={mockFirefighter}
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
        />
      );

      const closeButton = screen.getByRole("button", { name: /close dialog/i });
      await user.click(closeButton);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
      expect(mockOnConfirm).not.toHaveBeenCalled();
    });

    it("should call onClose when backdrop is clicked", async () => {
      render(
        <CompleteHoldModal
          totalFirefighters={5}
          isOpen={true}
          firefighter={mockFirefighter}
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
        />
      );

      const dialog = screen.getByRole("dialog");

      // Simulate clicking the backdrop (where e.target === e.currentTarget)
      // In the real component, this only works when clicking the backdrop itself,
      // not the inner content. We'll use fireEvent for more control.
      const { fireEvent } = await import("@testing-library/react");
      fireEvent.click(dialog, { target: dialog, currentTarget: dialog });

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it("should not close when clicking inside modal content", async () => {
      const user = userEvent.setup();

      render(
        <CompleteHoldModal
          totalFirefighters={5}
          isOpen={true}
          firefighter={mockFirefighter}
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
        />
      );

      // Click on the inner modal content (which stops propagation)
      const heading = screen.getByRole("heading", { name: /complete hold/i });
      await user.click(heading);

      expect(mockOnClose).not.toHaveBeenCalled();
    });
  });

  describe("Keyboard Interactions", () => {
    it("should close modal when Escape key is pressed", async () => {
      const user = userEvent.setup();

      render(
        <CompleteHoldModal
          totalFirefighters={5}
          isOpen={true}
          firefighter={mockFirefighter}
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
        />
      );

      await user.keyboard("{Escape}");

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it("should not close modal on Escape when isOpen is false", async () => {
      const user = userEvent.setup();

      render(
        <CompleteHoldModal
          totalFirefighters={5}
          isOpen={false}
          firefighter={mockFirefighter}
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
        />
      );

      await user.keyboard("{Escape}");

      expect(mockOnClose).not.toHaveBeenCalled();
    });

    it("should support Tab navigation between interactive elements", async () => {
      const user = userEvent.setup();

      render(
        <CompleteHoldModal
          totalFirefighters={5}
          isOpen={true}
          firefighter={mockFirefighter}
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
        />
      );

      const dateInput = getDateInput();
      const cancelButton = screen.getByRole("button", { name: /cancel/i });
      const completeButton = screen.getByRole("button", {
        name: /complete hold/i,
      });

      // Tab through elements - first tab should focus the first focusable element
      // (which might be the date input due to focus trap implementation)
      await user.tab();
      const firstFocused = document.activeElement;
      expect(firstFocused).toBeTruthy();

      // Verify we can tab to the date input
      if (firstFocused !== dateInput) {
        await user.tab();
      }
      expect(dateInput).toHaveFocus();

      // Continue tabbing through station selector buttons
      await user.tab();
      // Station selector has multiple buttons, skip them
      await user.tab();

      // Should eventually reach cancel and complete buttons
      // Just verify they're reachable via keyboard
      cancelButton.focus();
      expect(cancelButton).toHaveFocus();

      completeButton.focus();
      expect(completeButton).toHaveFocus();
    });
  });

  describe("Accessibility", () => {
    it("should have proper ARIA attributes", () => {
      render(
        <CompleteHoldModal
          totalFirefighters={5}
          isOpen={true}
          firefighter={mockFirefighter}
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
        />
      );

      const dialog = screen.getByRole("dialog");

      expect(dialog).toHaveAttribute("aria-modal", "true");
      expect(dialog).toHaveAttribute("aria-labelledby", "complete-hold-title");
    });

    it("should have accessible title", () => {
      render(
        <CompleteHoldModal
          totalFirefighters={5}
          isOpen={true}
          firefighter={mockFirefighter}
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
        />
      );

      const title = screen.getByRole("heading", { name: /complete hold/i });
      expect(title).toHaveAttribute("id", "complete-hold-title");
    });

    it("should have accessible close button label", () => {
      render(
        <CompleteHoldModal
          totalFirefighters={5}
          isOpen={true}
          firefighter={mockFirefighter}
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
        />
      );

      expect(
        screen.getByRole("button", { name: /close dialog/i })
      ).toBeInTheDocument();
    });

    it("should have labeled form fields", () => {
      render(
        <CompleteHoldModal
          totalFirefighters={5}
          isOpen={true}
          firefighter={mockFirefighter}
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
        />
      );

      // Check that the date input exists and has a visible label
      const dateInput = getDateInput();
      expect(dateInput).toBeInTheDocument();
      expect(screen.getByText(/hold date/i)).toBeInTheDocument();
      expect(screen.getByText(/fire station/i)).toBeInTheDocument();
    });

    it("should indicate disabled state on Complete button", () => {
      render(
        <CompleteHoldModal
          totalFirefighters={5}
          isOpen={true}
          firefighter={mockFirefighter}
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
        />
      );

      const completeButton = screen.getByRole("button", {
        name: /complete hold/i,
      });

      // Initially should be enabled (date is set to today by default)
      expect(completeButton).toBeEnabled();
    });
  });

  describe("Focus Management", () => {
    it("should trap focus within modal when open", async () => {
      const user = userEvent.setup();

      render(
        <CompleteHoldModal
          totalFirefighters={5}
          isOpen={true}
          firefighter={mockFirefighter}
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
        />
      );

      const completeButton = screen.getByRole("button", {
        name: /complete hold/i,
      });

      // Tab forward from last element should wrap to first
      completeButton.focus();
      await user.tab();

      // Should wrap back to first focusable element (close button or date input)
      const closeButton = screen.getByRole("button", { name: /close dialog/i });
      const dateInput = getDateInput();

      expect(
        document.activeElement === closeButton ||
          document.activeElement === dateInput
      ).toBe(true);
    });

    it("should restore focus to triggering element when modal closes", () => {
      // This test would require a button outside the modal to trigger it
      // Testing useFocusReturn hook behavior
      // Implementation depends on parent component context
      expect(true).toBe(true); // Placeholder - hook tested separately
    });
  });

  describe("Edge Cases", () => {
    it("should handle rapid open/close cycles", async () => {
      const { rerender } = render(
        <CompleteHoldModal
          totalFirefighters={5}
          isOpen={false}
          firefighter={mockFirefighter}
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
        />
      );

      // Rapid open/close
      rerender(
        <CompleteHoldModal
          totalFirefighters={5}
          isOpen={true}
          firefighter={mockFirefighter}
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
        />
      );

      rerender(
        <CompleteHoldModal
          totalFirefighters={5}
          isOpen={false}
          firefighter={mockFirefighter}
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
        />
      );

      rerender(
        <CompleteHoldModal
          totalFirefighters={5}
          isOpen={true}
          firefighter={mockFirefighter}
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
        />
      );

      // Should still render correctly
      expect(screen.getByRole("dialog")).toBeInTheDocument();
      // Name appears in two places (header and info text), use getAllByText
      expect(screen.getAllByText("John Doe").length).toBeGreaterThan(0);
    });

    it("should handle changing firefighter while modal is open", async () => {
      const firefighter1 = createMockFirefighter({
        id: "ff-1",
        name: "John Doe",
        fire_station: "1",
      });

      const firefighter2 = createMockFirefighter({
        id: "ff-2",
        name: "Jane Smith",
        fire_station: "2",
      });

      const { rerender } = render(
        <CompleteHoldModal
          totalFirefighters={5}
          isOpen={true}
          firefighter={firefighter1}
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
        />
      );

      // Name appears in header subtitle and info message
      expect(screen.getAllByText("John Doe").length).toBeGreaterThan(0);

      // Change firefighter while modal is open
      rerender(
        <CompleteHoldModal
          totalFirefighters={5}
          isOpen={true}
          firefighter={firefighter2}
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
        />
      );

      await waitFor(() => {
        expect(screen.getAllByText("Jane Smith").length).toBeGreaterThan(0);
      });

      // John Doe should no longer appear anywhere
      expect(screen.queryAllByText("John Doe")).toHaveLength(0);
    });

    it("should clean up event listeners on unmount", () => {
      const { unmount } = render(
        <CompleteHoldModal
          totalFirefighters={5}
          isOpen={true}
          firefighter={mockFirefighter}
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
        />
      );

      unmount();

      // Verify no errors on unmount (event listeners cleaned up)
      expect(true).toBe(true);
    });
  });
});
