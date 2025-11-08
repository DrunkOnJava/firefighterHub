/**
 * ShiftBadge Component Tests
 *
 * Tests the shift badge component including:
 * - Color-blind safe indicators (shapes/icons)
 * - Accessibility (WCAG 1.4.1 compliance)
 * - Visual rendering for each shift
 * - Aria labels for screen readers
 */

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ShiftBadge } from "../ShiftBadge";

describe("ShiftBadge", () => {
  describe("Rendering", () => {
    it("should render Shift A with circle shape", () => {
      render(<ShiftBadge shift="A" />);
      
      const badge = screen.getByLabelText("Shift A (circle)");
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveTextContent("A");
      expect(badge.className).toContain("rounded-full");
    });

    it("should render Shift B with square shape", () => {
      render(<ShiftBadge shift="B" />);
      
      const badge = screen.getByLabelText("Shift B (square)");
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveTextContent("B");
      expect(badge.className).toContain("rounded-none");
    });

    it("should render Shift C with diamond shape", () => {
      render(<ShiftBadge shift="C" />);
      
      const badge = screen.getByLabelText("Shift C (diamond)");
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveTextContent("C");
      expect(badge.className).toContain("rotate-45");
    });
  });

  describe("Color-Blind Accessibility (WCAG 1.4.1)", () => {
    it("should have distinct shapes for each shift", () => {
      const { rerender } = render(<ShiftBadge shift="A" />);
      const shiftA = screen.getByLabelText("Shift A (circle)");
      expect(shiftA).toHaveTextContent("A");
      expect(shiftA.className).toContain("rounded-full");

      rerender(<ShiftBadge shift="B" />);
      const shiftB = screen.getByLabelText("Shift B (square)");
      expect(shiftB).toHaveTextContent("B");
      expect(shiftB.className).toContain("rounded-none");

      rerender(<ShiftBadge shift="C" />);
      const shiftC = screen.getByLabelText("Shift C (diamond)");
      expect(shiftC).toHaveTextContent("C");
      expect(shiftC.className).toContain("rotate-45");
    });

    it("should have descriptive aria-label including shape", () => {
      render(<ShiftBadge shift="A" />);
      const badge = screen.getByLabelText("Shift A (circle)");
      expect(badge).toHaveAttribute("aria-label", "Shift A (circle)");
    });

    it("should use shape differentiation not just color", () => {
      const { container } = render(<ShiftBadge shift="B" />);
      
      const badge = container.querySelector("span");
      expect(badge).toHaveTextContent("B");
      expect(badge?.className).toContain("rounded-none");
    });
  });

  describe("Visual Styling", () => {
    it("should apply green colors for Shift A", () => {
      render(<ShiftBadge shift="A" />);
      const badge = screen.getByLabelText("Shift A (circle)");
      expect(badge.className).toContain("bg-green-600");
      expect(badge.className).toContain("text-white");
    });

    it("should apply red colors for Shift B", () => {
      render(<ShiftBadge shift="B" />);
      const badge = screen.getByLabelText("Shift B (square)");
      expect(badge.className).toContain("bg-red-600");
      expect(badge.className).toContain("text-white");
    });

    it("should apply sky colors for Shift C", () => {
      render(<ShiftBadge shift="C" />);
      const badge = screen.getByLabelText("Shift C (diamond)");
      expect(badge.className).toContain("bg-sky-600");
      expect(badge.className).toContain("text-white");
    });

    it("should have consistent badge styling", () => {
      render(<ShiftBadge shift="A" />);
      const badge = screen.getByLabelText("Shift A (circle)");
      
      // Should have standard badge styles
      expect(badge.className).toContain("inline-flex");
      expect(badge.className).toContain("items-center");
      expect(badge.className).toContain("justify-center");
      expect(badge.className).toContain("w-7");
      expect(badge.className).toContain("h-7");
      expect(badge.className).toContain("text-xs");
      expect(badge.className).toContain("font-bold");
      expect(badge.className).toContain("border");
    });
  });

  describe("Custom Classes", () => {
    it("should accept and apply custom className prop", () => {
      render(<ShiftBadge shift="A" className="custom-class" />);
      const badge = screen.getByLabelText("Shift A (circle)");
      expect(badge.className).toContain("custom-class");
    });

    it("should work without custom className", () => {
      render(<ShiftBadge shift="B" />);
      const badge = screen.getByLabelText("Shift B (square)");
      expect(badge).toBeInTheDocument();
    });
  });

  describe("Screen Reader Support", () => {
    it("should announce shift with shape description", () => {
      render(<ShiftBadge shift="A" />);
      const badge = screen.getByLabelText("Shift A (circle)");
      expect(badge).toHaveAttribute("aria-label", "Shift A (circle)");
    });

    it("should provide meaningful label for all shifts", () => {
      const { rerender } = render(<ShiftBadge shift="A" />);
      expect(screen.getByLabelText("Shift A (circle)")).toBeInTheDocument();

      rerender(<ShiftBadge shift="B" />);
      expect(screen.getByLabelText("Shift B (square)")).toBeInTheDocument();

      rerender(<ShiftBadge shift="C" />);
      expect(screen.getByLabelText("Shift C (diamond)")).toBeInTheDocument();
    });
  });

  describe("Layout", () => {
    it("should use inline-flex for alignment", () => {
      render(<ShiftBadge shift="A" />);
      const badge = screen.getByLabelText("Shift A (circle)");
      expect(badge.className).toContain("inline-flex");
      expect(badge.className).toContain("items-center");
    });

    it("should be square shaped for proper alignment", () => {
      render(<ShiftBadge shift="B" />);
      const badge = screen.getByLabelText("Shift B (square)");
      expect(badge.className).toContain("w-7");
      expect(badge.className).toContain("h-7");
    });
  });
});
