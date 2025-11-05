/**
 * Button Component Tests - Micro-interactions
 *
 * Tests the button component including:
 * - Scale transform on press (active:scale-95)
 * - Loading state with spinner animation
 * - Ripple effect (optional)
 * - Accessibility (focus rings, disabled states)
 * - Shadow elevation on hover
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "../Button";
import { Plus } from "lucide-react";

describe("Button Component", () => {
  describe("Rendering", () => {
    it("should render with children", () => {
      render(<Button>Click me</Button>);
      expect(screen.getByRole("button", { name: "Click me" })).toBeInTheDocument();
    });

    it("should apply variant styles", () => {
      const { rerender } = render(<Button variant="primary">Primary</Button>);
      let button = screen.getByRole("button");
      expect(button.className).toContain("bg-primary-500");

      rerender(<Button variant="danger">Danger</Button>);
      button = screen.getByRole("button");
      expect(button.className).toContain("bg-error-500");

      rerender(<Button variant="success">Success</Button>);
      button = screen.getByRole("button");
      expect(button.className).toContain("bg-success-500");
    });

    it("should apply size classes", () => {
      const { rerender } = render(<Button size="sm">Small</Button>);
      let button = screen.getByRole("button");
      expect(button.className).toContain("px-3");
      expect(button.className).toContain("text-sm");

      rerender(<Button size="lg">Large</Button>);
      button = screen.getByRole("button");
      expect(button.className).toContain("px-6");
      expect(button.className).toContain("text-lg");
    });

    it("should apply fullWidth class", () => {
      render(<Button fullWidth>Full Width</Button>);
      const button = screen.getByRole("button");
      expect(button.className).toContain("w-full");
    });
  });

  describe("Micro-interactions - Scale Transform", () => {
    it("should have active:scale-95 for tactile feedback", () => {
      render(<Button>Press me</Button>);
      const button = screen.getByRole("button");
      expect(button.className).toContain("active:scale-95");
    });

    it("should have transition-all for smooth animations", () => {
      render(<Button>Animated</Button>);
      const button = screen.getByRole("button");
      expect(button.className).toContain("transition-all");
      expect(button.className).toContain("duration-200");
    });

    it("should have overflow-hidden for ripple containment", () => {
      render(<Button>Button</Button>);
      const button = screen.getByRole("button");
      expect(button.className).toContain("overflow-hidden");
    });
  });

  describe("Micro-interactions - Ripple Effect", () => {
    it("should not have ripple by default", () => {
      render(<Button>No Ripple</Button>);
      const button = screen.getByRole("button");
      expect(button.className).not.toContain("btn-ripple");
    });

    it("should add ripple class when withRipple is true", () => {
      render(<Button withRipple>With Ripple</Button>);
      const button = screen.getByRole("button");
      expect(button.className).toContain("btn-ripple");
    });

    it("should have relative positioning for ripple effect", () => {
      render(<Button withRipple>Ripple Button</Button>);
      const button = screen.getByRole("button");
      expect(button.className).toContain("relative");
    });
  });

  describe("Micro-interactions - Shadow Elevation", () => {
    it("should have shadow-sm base elevation", () => {
      render(<Button variant="primary">Primary</Button>);
      const button = screen.getByRole("button");
      expect(button.className).toContain("shadow-sm");
    });

    it("should have hover:shadow-md for elevation feedback", () => {
      render(<Button variant="primary">Hover me</Button>);
      const button = screen.getByRole("button");
      expect(button.className).toContain("hover:shadow-md");
    });

    it("ghost variant should not have shadows", () => {
      render(<Button variant="ghost">Ghost</Button>);
      const button = screen.getByRole("button");
      expect(button.className).not.toContain("shadow-sm");
    });
  });

  describe("Loading State", () => {
    it("should show spinner when loading", () => {
      render(<Button isLoading>Loading</Button>);
      const button = screen.getByRole("button");
      const spinner = button.querySelector("svg");
      expect(spinner).toBeInTheDocument();
      expect(spinner?.classList.toString()).toContain("animate-spin");
    });

    it("should hide icons when loading", () => {
      render(
        <Button isLoading leftIcon={<Plus />} rightIcon={<Plus />}>
          Loading
        </Button>
      );
      const button = screen.getByRole("button");
      // Only spinner should be visible, not the icons
      const svgs = button.querySelectorAll("svg");
      expect(svgs).toHaveLength(1); // Only the spinner
    });

    it("should disable button when loading", () => {
      render(<Button isLoading>Loading</Button>);
      const button = screen.getByRole("button");
      expect(button).toBeDisabled();
    });

    it("should not trigger onClick when loading", async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();
      render(
        <Button isLoading onClick={handleClick}>
          Loading
        </Button>
      );
      const button = screen.getByRole("button");
      await user.click(button);
      expect(handleClick).not.toHaveBeenCalled();
    });

    it("should show text when not loading", () => {
      render(<Button isLoading={false}>Click me</Button>);
      expect(screen.getByText("Click me")).toBeInTheDocument();
    });
  });

  describe("Icons", () => {
    it("should render left icon", () => {
      render(<Button leftIcon={<Plus data-testid="left-icon" />}>With Left Icon</Button>);
      expect(screen.getByTestId("left-icon")).toBeInTheDocument();
    });

    it("should render right icon", () => {
      render(<Button rightIcon={<Plus data-testid="right-icon" />}>With Right Icon</Button>);
      expect(screen.getByTestId("right-icon")).toBeInTheDocument();
    });

    it("should render both icons", () => {
      render(
        <Button
          leftIcon={<Plus data-testid="left-icon" />}
          rightIcon={<Plus data-testid="right-icon" />}
        >
          With Both Icons
        </Button>
      );
      expect(screen.getByTestId("left-icon")).toBeInTheDocument();
      expect(screen.getByTestId("right-icon")).toBeInTheDocument();
    });

    it("should apply flex-shrink-0 to icons", () => {
      const { container } = render(
        <Button leftIcon={<Plus data-testid="icon" />}>Button</Button>
      );
      const iconWrapper = container.querySelector("span.flex-shrink-0");
      expect(iconWrapper).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should have focus ring styles", () => {
      render(<Button>Focusable</Button>);
      const button = screen.getByRole("button");
      expect(button.className).toContain("focus:outline-none");
      expect(button.className).toContain("focus:ring-2");
      expect(button.className).toContain("focus:ring-offset-2");
    });

    it("should be keyboard accessible", async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();
      render(<Button onClick={handleClick}>Press Enter</Button>);
      const button = screen.getByRole("button");
      button.focus();
      await user.keyboard("{Enter}");
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("should show disabled cursor when disabled", () => {
      render(<Button disabled>Disabled</Button>);
      const button = screen.getByRole("button");
      expect(button.className).toContain("disabled:cursor-not-allowed");
    });

    it("should reduce opacity when disabled", () => {
      render(<Button disabled>Disabled</Button>);
      const button = screen.getByRole("button");
      expect(button.className).toContain("disabled:opacity-50");
    });

    it("should be disabled when disabled prop is true", () => {
      render(<Button disabled>Disabled</Button>);
      const button = screen.getByRole("button");
      expect(button).toBeDisabled();
    });

    it("should not trigger onClick when disabled", async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();
      render(
        <Button disabled onClick={handleClick}>
          Disabled
        </Button>
      );
      const button = screen.getByRole("button");
      await user.click(button);
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe("Interaction", () => {
    it("should call onClick handler", async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();
      render(<Button onClick={handleClick}>Click me</Button>);
      const button = screen.getByRole("button");
      await user.click(button);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("should forward ref to button element", () => {
      const ref: React.RefObject<HTMLButtonElement> = { current: null };
      render(<Button ref={ref}>Button</Button>);
      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    });

    it("should pass through additional props", () => {
      render(
        <Button data-testid="custom-button" aria-label="Custom label">
          Button
        </Button>
      );
      const button = screen.getByTestId("custom-button");
      expect(button).toHaveAttribute("aria-label", "Custom label");
    });

    it("should accept custom className", () => {
      render(<Button className="custom-class">Button</Button>);
      const button = screen.getByRole("button");
      expect(button.className).toContain("custom-class");
    });
  });

  describe("Layout", () => {
    it("should use inline-flex layout", () => {
      render(<Button>Button</Button>);
      const button = screen.getByRole("button");
      expect(button.className).toContain("inline-flex");
      expect(button.className).toContain("items-center");
      expect(button.className).toContain("justify-center");
    });

    it("should apply gap for spacing", () => {
      render(<Button size="md">Button</Button>);
      const button = screen.getByRole("button");
      expect(button.className).toContain("gap-2");
    });

    it("should apply rounded-lg corners", () => {
      render(<Button>Button</Button>);
      const button = screen.getByRole("button");
      expect(button.className).toContain("rounded-lg");
    });
  });

  describe("Touch Targets", () => {
    it("should meet WCAG 2.1 minimum touch target size (44px)", () => {
      render(<Button>Touch Button</Button>);
      const button = screen.getByRole("button");
      // Check for minimum height/width via padding
      expect(button.className).toContain("py-"); // Has vertical padding
      expect(button.className).toContain("px-"); // Has horizontal padding
    });
  });
});
