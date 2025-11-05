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
    it("should render Shift A with circle icon", () => {
      render(<ShiftBadge shift="A" />);
      
      const badge = screen.getByLabelText("Shift A (circle)");
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveTextContent("●");
      expect(badge).toHaveTextContent("A");
    });

    it("should render Shift B with square icon", () => {
      render(<ShiftBadge shift="B" />);
      
      const badge = screen.getByLabelText("Shift B (square)");
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveTextContent("■");
      expect(badge).toHaveTextContent("B");
    });

    it("should render Shift C with triangle icon", () => {
      render(<ShiftBadge shift="C" />);
      
      const badge = screen.getByLabelText("Shift C (triangle)");
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveTextContent("▲");
      expect(badge).toHaveTextContent("C");
    });
  });

  describe("Color-Blind Accessibility (WCAG 1.4.1)", () => {
    it("should have distinct icons for each shift", () => {
      const { rerender } = render(<ShiftBadge shift="A" />);
      const shiftA = screen.getByLabelText("Shift A (circle)");
      expect(shiftA).toHaveTextContent("●");

      rerender(<ShiftBadge shift="B" />);
      const shiftB = screen.getByLabelText("Shift B (square)");
      expect(shiftB).toHaveTextContent("■");

      rerender(<ShiftBadge shift="C" />);
      const shiftC = screen.getByLabelText("Shift C (triangle)");
      expect(shiftC).toHaveTextContent("▲");
    });

    it("should mark icons as decorative with aria-hidden", () => {
      const { container } = render(<ShiftBadge shift="A" />);
      
      // Icon should be decorative (aria-hidden)
      const icon = container.querySelector('[aria-hidden="true"]');
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveTextContent("●");
    });

    it("should have descriptive aria-label including shape", () => {
      render(<ShiftBadge shift="A" />);
      const badge = screen.getByLabelText("Shift A (circle)");
      expect(badge).toHaveAttribute("aria-label", "Shift A (circle)");
    });

    it("should not rely on color alone (has icon + text)", () => {
      const { container } = render(<ShiftBadge shift="B" />);
      
      const badge = container.querySelector("span");
      // Should have both icon and text content
      expect(badge).toHaveTextContent("■");
      expect(badge).toHaveTextContent("B");
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
      const badge = screen.getByLabelText("Shift C (triangle)");
      expect(badge.className).toContain("bg-sky-600");
      expect(badge.className).toContain("text-white");
    });

    it("should have consistent badge styling", () => {
      render(<ShiftBadge shift="A" />);
      const badge = screen.getByLabelText("Shift A (circle)");
      
      // Should have standard badge styles
      expect(badge.className).toContain("inline-flex");
      expect(badge.className).toContain("items-center");
      expect(badge.className).toContain("gap-1");
      expect(badge.className).toContain("px-2");
      expect(badge.className).toContain("py-0.5");
      expect(badge.className).toContain("text-xs");
      expect(badge.className).toContain("font-bold");
      expect(badge.className).toContain("rounded");
      expect(badge.className).toContain("border-2");
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

    it("should hide decorative icon from screen readers", () => {
      const { container } = render(<ShiftBadge shift="B" />);
      const icon = container.querySelector('[aria-hidden="true"]');
      expect(icon).toBeInTheDocument();
    });

    it("should provide meaningful label for all shifts", () => {
      const { rerender } = render(<ShiftBadge shift="A" />);
      expect(screen.getByLabelText("Shift A (circle)")).toBeInTheDocument();

      rerender(<ShiftBadge shift="B" />);
      expect(screen.getByLabelText("Shift B (square)")).toBeInTheDocument();

      rerender(<ShiftBadge shift="C" />);
      expect(screen.getByLabelText("Shift C (triangle)")).toBeInTheDocument();
    });
  });

  describe("Layout", () => {
    it("should use inline-flex for icon and text alignment", () => {
      render(<ShiftBadge shift="A" />);
      const badge = screen.getByLabelText("Shift A (circle)");
      expect(badge.className).toContain("inline-flex");
      expect(badge.className).toContain("items-center");
    });

    it("should have gap between icon and text", () => {
      render(<ShiftBadge shift="B" />);
      const badge = screen.getByLabelText("Shift B (square)");
      expect(badge.className).toContain("gap-1");
    });
  });
});
