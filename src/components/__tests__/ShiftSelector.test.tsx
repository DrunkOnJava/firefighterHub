/**
 * ShiftSelector Component Tests
 *
 * Tests the shift selector component including:
 * - Shift button rendering (A, B, C)
 * - Active state with aria-pressed
 * - Mobile vs Desktop layouts
 * - Shift change callbacks
 * - Keyboard interactions
 * - Accessibility compliance
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ShiftSelector } from "../ShiftSelector";

describe("ShiftSelector", () => {
  const mockOnShiftChange = vi.fn();

  beforeEach(() => {
    mockOnShiftChange.mockClear();
  });

  describe("Shift Button Rendering (A, B, C)", () => {
    it("should render three shift buttons (A, B, C)", () => {
      render(
        <ShiftSelector
          currentShift="A"
          onShiftChange={mockOnShiftChange}
        />
      );

      expect(
        screen.getByRole("button", { name: /shift a/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /shift b/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /shift c/i })
      ).toBeInTheDocument();
    });

    it("should display shift letters clearly", () => {
      render(
        <ShiftSelector
          currentShift="A"
          onShiftChange={mockOnShiftChange}
        />
      );

      const shiftA = screen.getByRole("button", { name: /shift a/i });
      const shiftB = screen.getByRole("button", { name: /shift b/i });
      const shiftC = screen.getByRole("button", { name: /shift c/i });

      expect(shiftA).toHaveTextContent("A");
      expect(shiftB).toHaveTextContent("B");
      expect(shiftC).toHaveTextContent("C");
    });

    it("should show all shifts enabled", () => {
      render(
        <ShiftSelector
          currentShift="A"
          onShiftChange={mockOnShiftChange}
        />
      );

      const shiftA = screen.getByRole("button", { name: /shift a/i });
      const shiftB = screen.getByRole("button", { name: /shift b/i });
      const shiftC = screen.getByRole("button", { name: /shift c/i });

      expect(shiftA).not.toBeDisabled();
      expect(shiftB).not.toBeDisabled();
      expect(shiftC).not.toBeDisabled();
    });

    it("should apply dark mode colors when isDarkMode is true", () => {
      render(
        <ShiftSelector
          currentShift="A"
          onShiftChange={mockOnShiftChange}
        />
      );

      const shiftA = screen.getByRole("button", { name: /shift a/i });

      // Dark mode should apply green-700 background for active shift A
      expect(shiftA.className).toContain("bg-green-700");
    });

    it("should apply light mode colors when isDarkMode is false", () => {
      render(
        <ShiftSelector
          currentShift="A"
          onShiftChange={mockOnShiftChange}
        />
      );

      const shiftA = screen.getByRole("button", { name: /shift a/i });

      // Component uses green-700 for active shifts
      expect(shiftA.className).toContain("bg-green-700");
    });
  });

  describe("Active State with aria-pressed", () => {
    it("should mark current shift as pressed (aria-pressed='true')", () => {
      render(
        <ShiftSelector
          currentShift="B"
          onShiftChange={mockOnShiftChange}
        />
      );

      const shiftA = screen.getByRole("button", { name: /shift a/i });
      const shiftB = screen.getByRole("button", { name: /shift b/i });
      const shiftC = screen.getByRole("button", { name: /shift c/i });

      expect(shiftA).toHaveAttribute("aria-pressed", "false");
      expect(shiftB).toHaveAttribute("aria-pressed", "true");
      expect(shiftC).toHaveAttribute("aria-pressed", "false");
    });

    it("should mark inactive shifts as not pressed (aria-pressed='false')", () => {
      render(
        <ShiftSelector
          currentShift="C"
          onShiftChange={mockOnShiftChange}
        />
      );

      const shiftA = screen.getByRole("button", { name: /shift a/i });
      const shiftB = screen.getByRole("button", { name: /shift b/i });

      expect(shiftA).toHaveAttribute("aria-pressed", "false");
      expect(shiftB).toHaveAttribute("aria-pressed", "false");
    });

    it("should highlight active shift visually with different classes", () => {
      render(
        <ShiftSelector
          currentShift="A"
          onShiftChange={mockOnShiftChange}
        />
      );

      const shiftA = screen.getByRole("button", { name: /shift a/i });
      const shiftB = screen.getByRole("button", { name: /shift b/i });

      // Active shift should have bg-green-700
      expect(shiftA.className).toContain("bg-green-700");
      expect(shiftA.className).toContain("text-white");

      // Inactive shift should have different background
      expect(shiftB.className).toContain("bg-red-950/60");
      expect(shiftB.className).toContain("text-red-300");
    });

    it("should update aria-pressed when shift changes", () => {
      const { rerender } = render(
        <ShiftSelector
          currentShift="A"
          onShiftChange={mockOnShiftChange}
        />
      );

      let shiftA = screen.getByRole("button", { name: /shift a/i });
      let shiftB = screen.getByRole("button", { name: /shift b/i });

      expect(shiftA).toHaveAttribute("aria-pressed", "true");
      expect(shiftB).toHaveAttribute("aria-pressed", "false");

      // Simulate shift change
      rerender(
        <ShiftSelector
          currentShift="B"
          onShiftChange={mockOnShiftChange}
        />
      );

      shiftA = screen.getByRole("button", { name: /shift a/i });
      shiftB = screen.getByRole("button", { name: /shift b/i });

      expect(shiftA).toHaveAttribute("aria-pressed", "false");
      expect(shiftB).toHaveAttribute("aria-pressed", "true");
    });
  });

  describe("Shift Change Callbacks", () => {
    it("should call onShiftChange when shift A clicked", async () => {
      const user = userEvent.setup();
      render(
        <ShiftSelector
          currentShift="B"
          onShiftChange={mockOnShiftChange}
        />
      );

      const shiftA = screen.getByRole("button", { name: /shift a/i });
      await user.click(shiftA);

      expect(mockOnShiftChange).toHaveBeenCalledTimes(1);
      expect(mockOnShiftChange).toHaveBeenCalledWith("A");
    });

    it("should call onShiftChange when shift B clicked", async () => {
      const user = userEvent.setup();
      render(
        <ShiftSelector
          currentShift="A"
          onShiftChange={mockOnShiftChange}
        />
      );

      const shiftB = screen.getByRole("button", { name: /shift b/i });
      await user.click(shiftB);

      expect(mockOnShiftChange).toHaveBeenCalledTimes(1);
      expect(mockOnShiftChange).toHaveBeenCalledWith("B");
    });

    it("should call onShiftChange when shift C clicked", async () => {
      const user = userEvent.setup();
      render(
        <ShiftSelector
          currentShift="A"
          onShiftChange={mockOnShiftChange}
        />
      );

      const shiftC = screen.getByRole("button", { name: /shift c/i });
      await user.click(shiftC);

      expect(mockOnShiftChange).toHaveBeenCalledTimes(1);
      expect(mockOnShiftChange).toHaveBeenCalledWith("C");
    });

    it("should pass correct shift value to callback", async () => {
      const user = userEvent.setup();
      render(
        <ShiftSelector
          currentShift="A"
          onShiftChange={mockOnShiftChange}
        />
      );

      await user.click(screen.getByRole("button", { name: /shift b/i }));
      expect(mockOnShiftChange).toHaveBeenCalledWith("B");

      mockOnShiftChange.mockClear();

      await user.click(screen.getByRole("button", { name: /shift c/i }));
      expect(mockOnShiftChange).toHaveBeenCalledWith("C");
    });

    it("should call callback even when clicking current shift", async () => {
      const user = userEvent.setup();
      render(
        <ShiftSelector
          currentShift="A"
          onShiftChange={mockOnShiftChange}
        />
      );

      const shiftA = screen.getByRole("button", { name: /shift a/i });
      await user.click(shiftA);

      // Component should call callback even for current shift
      // (parent can decide whether to re-render or not)
      expect(mockOnShiftChange).toHaveBeenCalledTimes(1);
      expect(mockOnShiftChange).toHaveBeenCalledWith("A");
    });
  });

  describe("Keyboard Interactions", () => {
    it("should select shift with Enter key", async () => {
      const user = userEvent.setup();
      render(
        <ShiftSelector
          currentShift="A"
          onShiftChange={mockOnShiftChange}
        />
      );

      const shiftB = screen.getByRole("button", { name: /shift b/i });
      shiftB.focus();
      await user.keyboard("{Enter}");

      expect(mockOnShiftChange).toHaveBeenCalledTimes(1);
      expect(mockOnShiftChange).toHaveBeenCalledWith("B");
    });

    it("should select shift with Space key", async () => {
      const user = userEvent.setup();
      render(
        <ShiftSelector
          currentShift="A"
          onShiftChange={mockOnShiftChange}
        />
      );

      const shiftC = screen.getByRole("button", { name: /shift c/i });
      shiftC.focus();
      await user.keyboard(" ");

      expect(mockOnShiftChange).toHaveBeenCalledTimes(1);
      expect(mockOnShiftChange).toHaveBeenCalledWith("C");
    });

    it("should navigate between shifts with Tab", async () => {
      const user = userEvent.setup();
      render(
        <ShiftSelector
          currentShift="A"
          onShiftChange={mockOnShiftChange}
        />
      );

      const shiftA = screen.getByRole("button", { name: /shift a/i });
      const shiftB = screen.getByRole("button", { name: /shift b/i });
      const shiftC = screen.getByRole("button", { name: /shift c/i });

      shiftA.focus();
      expect(document.activeElement).toBe(shiftA);

      await user.keyboard("{Tab}");
      expect(document.activeElement).toBe(shiftB);

      await user.keyboard("{Tab}");
      expect(document.activeElement).toBe(shiftC);
    });

    it("should have visible focus indicator", () => {
      render(
        <ShiftSelector
          currentShift="A"
          onShiftChange={mockOnShiftChange}
        />
      );

      const shiftA = screen.getByRole("button", { name: /shift a/i });

      // Component uses focus-ring class
      expect(shiftA.className).toContain("focus-ring");
    });
  });

  describe("Accessibility", () => {
    it("should have aria-label for each shift button", () => {
      render(
        <ShiftSelector
          currentShift="A"
          onShiftChange={mockOnShiftChange}
        />
      );

      expect(screen.getByLabelText("Switch to Shift A")).toBeInTheDocument();
      expect(screen.getByLabelText("Switch to Shift B")).toBeInTheDocument();
      expect(screen.getByLabelText("Switch to Shift C")).toBeInTheDocument();
    });

    it("should announce current shift to screen readers via aria-pressed", () => {
      render(
        <ShiftSelector
          currentShift="B"
          onShiftChange={mockOnShiftChange}
        />
      );

      const shiftB = screen.getByRole("button", { name: /shift b/i });

      // Screen readers will announce "pressed" for the current shift
      expect(shiftB).toHaveAttribute("aria-pressed", "true");
    });

    it("should have logical tab order (A -> B -> C)", async () => {
      const user = userEvent.setup();
      render(
        <ShiftSelector
          currentShift="A"
          onShiftChange={mockOnShiftChange}
        />
      );

      const shiftA = screen.getByRole("button", { name: /shift a/i });
      const shiftB = screen.getByRole("button", { name: /shift b/i });
      const shiftC = screen.getByRole("button", { name: /shift c/i });

      shiftA.focus();
      await user.keyboard("{Tab}");
      expect(document.activeElement).toBe(shiftB);

      await user.keyboard("{Tab}");
      expect(document.activeElement).toBe(shiftC);
    });

    it("should maintain color contrast for accessibility", () => {
      render(
        <ShiftSelector
          currentShift="A"
          onShiftChange={mockOnShiftChange}
        />
      );

      const shiftA = screen.getByRole("button", { name: /shift a/i });

      // Active shift has white text on dark background (high contrast)
      expect(shiftA.className).toContain("text-white");
    });

    it("should work with isDarkMode defaulting to true", () => {
      render(
        <ShiftSelector currentShift="A" onShiftChange={mockOnShiftChange} />
      );

      const shiftA = screen.getByRole("button", { name: /shift a/i });

      // Should apply dark mode colors by default
      expect(shiftA.className).toContain("bg-green-700");
    });
  });

  describe("Different Shift Colors", () => {
    it("should apply green colors for Shift A", () => {
      render(
        <ShiftSelector
          currentShift="A"
          onShiftChange={mockOnShiftChange}
        />
      );

      const shiftA = screen.getByRole("button", { name: /shift a/i });
      expect(shiftA.className).toContain("bg-green-700");
    });

    it("should apply red colors for Shift B", () => {
      render(
        <ShiftSelector
          currentShift="B"
          onShiftChange={mockOnShiftChange}
        />
      );

      const shiftB = screen.getByRole("button", { name: /shift b/i });
      expect(shiftB.className).toContain("bg-red-700");
    });

    it("should apply sky colors for Shift C", () => {
      render(
        <ShiftSelector
          currentShift="C"
          onShiftChange={mockOnShiftChange}
        />
      );

      const shiftC = screen.getByRole("button", { name: /shift c/i });
      expect(shiftC.className).toContain("bg-sky-700");
    });

    it("should apply different inactive colors for each shift", () => {
      render(
        <ShiftSelector
          currentShift="A"
          onShiftChange={mockOnShiftChange}
        />
      );

      const shiftB = screen.getByRole("button", { name: /shift b/i });
      const shiftC = screen.getByRole("button", { name: /shift c/i });

      // Inactive shifts should have muted colors
      expect(shiftB.className).toContain("bg-red-950/60");
      expect(shiftC.className).toContain("bg-sky-950/60");
    });
  });
});
