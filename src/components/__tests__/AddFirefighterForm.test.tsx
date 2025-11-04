/**
 * AddFirefighterForm Component Tests
 *
 * Tests the add firefighter form including:
 * - Collapsed/expanded state toggle
 * - Form rendering and field visibility
 * - Name input validation (required, min length)
 * - Station input (optional)
 * - Submit action with validation
 * - Cancel action and form reset
 * - Keyboard interactions
 * - Accessibility compliance
 * - Error states and messages
 */

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AddFirefighterForm } from "../AddFirefighterForm";

describe("AddFirefighterForm", () => {
  const mockOnAdd = vi.fn();

  beforeEach(() => {
    mockOnAdd.mockClear();
  });

  describe("Collapsed/Expanded State Toggle", () => {
    it("should render collapsed button by default", () => {
      render(<AddFirefighterForm onAdd={mockOnAdd} />);

      expect(
        screen.getByRole("button", { name: /add team member/i })
      ).toBeInTheDocument();
      expect(screen.queryByLabelText(/full name/i)).not.toBeInTheDocument();
    });

    it("should expand form when add button clicked", async () => {
      const user = userEvent.setup();
      render(<AddFirefighterForm onAdd={mockOnAdd} />);

      const addButton = screen.getByRole("button", {
        name: /add team member/i,
      });
      await user.click(addButton);

      expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/station number/i)).toBeInTheDocument();
    });

    it("should show UserPlus icon on collapsed button", () => {
      render(<AddFirefighterForm onAdd={mockOnAdd} />);

      const addButton = screen.getByRole("button", {
        name: /add team member/i,
      });
      const svg = addButton.querySelector("svg");
      expect(svg).toBeInTheDocument();
    });

    it("should collapse form after successful submission", async () => {
      const user = userEvent.setup();
      render(<AddFirefighterForm onAdd={mockOnAdd} />);

      // Expand form
      await user.click(
        screen.getByRole("button", { name: /add team member/i })
      );

      // Fill and submit
      const nameInput = screen.getByLabelText(/full name/i);
      await user.type(nameInput, "John Doe");

      const submitButton = screen.getByLabelText(
        /add firefighter to rotation/i
      );
      await user.click(submitButton);

      // Should collapse back to button
      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: /add team member/i })
        ).toBeInTheDocument();
      });
    });

    it("should collapse form when cancel clicked", async () => {
      const user = userEvent.setup();
      render(<AddFirefighterForm onAdd={mockOnAdd} />);

      // Expand form
      await user.click(
        screen.getByRole("button", { name: /add team member/i })
      );

      // Click cancel
      await user.click(screen.getByRole("button", { name: /cancel adding/i }));

      // Should collapse back to button
      expect(
        screen.getByRole("button", { name: /add team member/i })
      ).toBeInTheDocument();
    });
  });

  describe("Form Rendering and Field Visibility", () => {
    beforeEach(async () => {
      const user = userEvent.setup();
      render(<AddFirefighterForm onAdd={mockOnAdd} />);
      await user.click(
        screen.getByRole("button", { name: /add team member/i })
      );
    });

    it("should display name input field", () => {
      expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    });

    it("should display station number input field", () => {
      expect(screen.getByLabelText(/station number/i)).toBeInTheDocument();
    });

    it("should display submit button", () => {
      expect(
        screen.getByLabelText(/add firefighter to rotation/i)
      ).toBeInTheDocument();
    });

    it("should display cancel button", () => {
      expect(
        screen.getByRole("button", { name: /cancel adding/i })
      ).toBeInTheDocument();
    });

    it("should have placeholder text for name input", () => {
      const nameInput = screen.getByLabelText(/full name/i);
      expect(nameInput).toHaveAttribute(
        "placeholder",
        "Full name (e.g., John Smith)"
      );
    });

    it("should have placeholder text for station input", () => {
      const stationInput = screen.getByLabelText(/station number/i);
      expect(stationInput).toHaveAttribute(
        "placeholder",
        "Station number (optional)"
      );
    });

    it("should autofocus on name input when expanded", () => {
      const nameInput = screen.getByLabelText(/full name/i);
      expect(nameInput).toHaveFocus();
    });
  });

  describe("Name Input Validation", () => {
    beforeEach(async () => {
      const user = userEvent.setup();
      render(<AddFirefighterForm onAdd={mockOnAdd} />);
      await user.click(
        screen.getByRole("button", { name: /add team member/i })
      );
    });

    it("should require name (cannot submit empty)", () => {
      const submitButton = screen.getByLabelText(
        /add firefighter to rotation/i
      );
      expect(submitButton).toBeDisabled();
    });

    it("should show error when name is empty on blur", async () => {
      const user = userEvent.setup();
      const nameInput = screen.getByLabelText(/full name/i);

      await user.click(nameInput);
      await user.tab(); // Blur

      await waitFor(() => {
        expect(screen.getByRole("alert")).toHaveTextContent(
          /name is required/i
        );
      });
    });

    it("should show error when name is less than 2 characters", async () => {
      const user = userEvent.setup();
      const nameInput = screen.getByLabelText(/full name/i);

      await user.type(nameInput, "A");
      await user.tab(); // Blur

      await waitFor(() => {
        expect(screen.getByRole("alert")).toHaveTextContent(
          /name must be at least 2 characters/i
        );
      });
    });

    it("should trim whitespace from name", async () => {
      const user = userEvent.setup();
      const nameInput = screen.getByLabelText(/full name/i);

      await user.type(nameInput, "  John Doe  ");

      const submitButton = screen.getByLabelText(
        /add firefighter to rotation/i
      );
      await user.click(submitButton);

      expect(mockOnAdd).toHaveBeenCalledWith("John Doe", "");
    });

    it("should accept valid names (letters, spaces, hyphens)", async () => {
      const user = userEvent.setup();
      const nameInput = screen.getByLabelText(/full name/i);

      await user.type(nameInput, "Mary-Jane Smith");
      await user.tab();

      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    });

    it("should clear error when valid name is entered", async () => {
      const user = userEvent.setup();
      const nameInput = screen.getByLabelText(/full name/i);

      // Trigger error
      await user.click(nameInput);
      await user.tab();
      expect(screen.getByRole("alert")).toBeInTheDocument();

      // Fix error
      await user.type(nameInput, "John Doe");

      await waitFor(() => {
        expect(screen.queryByRole("alert")).not.toBeInTheDocument();
      });
    });

    it("should enable submit button when valid name entered", async () => {
      const user = userEvent.setup();
      const nameInput = screen.getByLabelText(/full name/i);
      const submitButton = screen.getByLabelText(
        /add firefighter to rotation/i
      );

      expect(submitButton).toBeDisabled();

      await user.type(nameInput, "John Doe");

      expect(submitButton).not.toBeDisabled();
    });

    it("should mark name input as invalid when error present", async () => {
      const user = userEvent.setup();
      const nameInput = screen.getByLabelText(/full name/i);

      await user.click(nameInput);
      await user.tab();

      await waitFor(() => {
        expect(nameInput).toHaveAttribute("aria-invalid", "true");
      });
    });

    it("should associate error message with input via aria-describedby", async () => {
      const user = userEvent.setup();
      const nameInput = screen.getByLabelText(/full name/i);

      await user.click(nameInput);
      await user.tab();

      await waitFor(() => {
        expect(nameInput).toHaveAttribute("aria-describedby", "name-error");
        expect(screen.getByRole("alert")).toHaveAttribute("id", "name-error");
      });
    });
  });

  describe("Station Input Handling", () => {
    beforeEach(async () => {
      const user = userEvent.setup();
      render(<AddFirefighterForm onAdd={mockOnAdd} />);
      await user.click(
        screen.getByRole("button", { name: /add team member/i })
      );
    });

    it("should allow station to be optional", async () => {
      const user = userEvent.setup();
      const nameInput = screen.getByLabelText(/full name/i);

      await user.type(nameInput, "John Doe");

      const submitButton = screen.getByLabelText(
        /add firefighter to rotation/i
      );
      await user.click(submitButton);

      expect(mockOnAdd).toHaveBeenCalledWith("John Doe", "");
    });

    it("should accept station number input", async () => {
      const user = userEvent.setup();
      const nameInput = screen.getByLabelText(/full name/i);
      const stationInput = screen.getByLabelText(/station number/i);

      await user.type(nameInput, "John Doe");
      await user.type(stationInput, "5");

      const submitButton = screen.getByLabelText(
        /add firefighter to rotation/i
      );
      await user.click(submitButton);

      expect(mockOnAdd).toHaveBeenCalledWith("John Doe", "5");
    });

    it("should trim whitespace from station number", async () => {
      const user = userEvent.setup();
      const nameInput = screen.getByLabelText(/full name/i);
      const stationInput = screen.getByLabelText(/station number/i);

      await user.type(nameInput, "John Doe");
      await user.type(stationInput, "  3  ");

      const submitButton = screen.getByLabelText(
        /add firefighter to rotation/i
      );
      await user.click(submitButton);

      expect(mockOnAdd).toHaveBeenCalledWith("John Doe", "3");
    });

    it("should allow any text in station field", async () => {
      const user = userEvent.setup();
      const nameInput = screen.getByLabelText(/full name/i);
      const stationInput = screen.getByLabelText(/station number/i);

      await user.type(nameInput, "John Doe");
      await user.type(stationInput, "Station 10");

      const submitButton = screen.getByLabelText(
        /add firefighter to rotation/i
      );
      await user.click(submitButton);

      expect(mockOnAdd).toHaveBeenCalledWith("John Doe", "Station 10");
    });
  });

  describe("Submit Action with Validation", () => {
    beforeEach(async () => {
      const user = userEvent.setup();
      render(<AddFirefighterForm onAdd={mockOnAdd} />);
      await user.click(
        screen.getByRole("button", { name: /add team member/i })
      );
    });

    it("should call onAdd with name and station when submitted", async () => {
      const user = userEvent.setup();
      const nameInput = screen.getByLabelText(/full name/i);
      const stationInput = screen.getByLabelText(/station number/i);

      await user.type(nameInput, "Jane Smith");
      await user.type(stationInput, "2");

      const submitButton = screen.getByLabelText(
        /add firefighter to rotation/i
      );
      await user.click(submitButton);

      expect(mockOnAdd).toHaveBeenCalledTimes(1);
      expect(mockOnAdd).toHaveBeenCalledWith("Jane Smith", "2");
    });

    it("should reset form fields after successful submission", async () => {
      const user = userEvent.setup();
      const nameInput = screen.getByLabelText(/full name/i);
      const stationInput = screen.getByLabelText(/station number/i);

      await user.type(nameInput, "John Doe");
      await user.type(stationInput, "5");

      const submitButton = screen.getByLabelText(
        /add firefighter to rotation/i
      );
      await user.click(submitButton);

      // Re-expand form to check fields are cleared
      await user.click(
        screen.getByRole("button", { name: /add team member/i })
      );

      const newNameInput = screen.getByLabelText(/full name/i);
      const newStationInput = screen.getByLabelText(/station number/i);

      expect(newNameInput).toHaveValue("");
      expect(newStationInput).toHaveValue("");
    });

    it("should clear errors after successful submission", async () => {
      const user = userEvent.setup();
      const nameInput = screen.getByLabelText(/full name/i);

      // Trigger error
      await user.click(nameInput);
      await user.tab();
      expect(screen.getByRole("alert")).toBeInTheDocument();

      // Fix and submit
      await user.type(nameInput, "John Doe");

      const submitButton = screen.getByLabelText(
        /add firefighter to rotation/i
      );
      await user.click(submitButton);

      // Re-expand to check error is gone
      await user.click(
        screen.getByRole("button", { name: /add team member/i })
      );
      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    });

    it("should not submit when name is invalid", async () => {
      const user = userEvent.setup();
      const nameInput = screen.getByLabelText(/full name/i);

      await user.type(nameInput, "A"); // Too short

      const submitButton = screen.getByLabelText(
        /add firefighter to rotation/i
      );
      await user.click(submitButton);

      expect(mockOnAdd).not.toHaveBeenCalled();
    });

    it("should prevent form submission with Enter key on invalid form", async () => {
      const user = userEvent.setup();
      const nameInput = screen.getByLabelText(/full name/i);

      await user.click(nameInput);
      await user.keyboard("{Enter}");

      expect(mockOnAdd).not.toHaveBeenCalled();
    });

    it("should submit form with Enter key when valid", async () => {
      const user = userEvent.setup();
      const nameInput = screen.getByLabelText(/full name/i);

      await user.type(nameInput, "John Doe");
      await user.keyboard("{Enter}");

      expect(mockOnAdd).toHaveBeenCalledWith("John Doe", "");
    });
  });

  describe("Cancel Action and Form Reset", () => {
    beforeEach(async () => {
      const user = userEvent.setup();
      render(<AddFirefighterForm onAdd={mockOnAdd} />);
      await user.click(
        screen.getByRole("button", { name: /add team member/i })
      );
    });

    it("should call cancel handler when cancel clicked", async () => {
      const user = userEvent.setup();
      await user.click(screen.getByRole("button", { name: /cancel adding/i }));

      expect(
        screen.getByRole("button", { name: /add team member/i })
      ).toBeInTheDocument();
    });

    it("should clear form fields on cancel", async () => {
      const user = userEvent.setup();
      const nameInput = screen.getByLabelText(/full name/i);
      const stationInput = screen.getByLabelText(/station number/i);

      await user.type(nameInput, "John Doe");
      await user.type(stationInput, "5");
      await user.click(screen.getByRole("button", { name: /cancel adding/i }));

      // Re-expand to check fields are cleared
      await user.click(
        screen.getByRole("button", { name: /add team member/i })
      );

      expect(screen.getByLabelText(/full name/i)).toHaveValue("");
      expect(screen.getByLabelText(/station number/i)).toHaveValue("");
    });

    it("should clear errors on cancel", async () => {
      const user = userEvent.setup();
      const nameInput = screen.getByLabelText(/full name/i);

      // Trigger error
      await user.click(nameInput);
      await user.tab();
      expect(screen.getByRole("alert")).toBeInTheDocument();

      // Cancel
      await user.click(screen.getByRole("button", { name: /cancel adding/i }));

      // Re-expand to check error is gone
      await user.click(
        screen.getByRole("button", { name: /add team member/i })
      );
      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    });

    it("should not call onAdd when cancelled", async () => {
      const user = userEvent.setup();
      const nameInput = screen.getByLabelText(/full name/i);

      await user.type(nameInput, "John Doe");
      await user.click(screen.getByRole("button", { name: /cancel adding/i }));

      expect(mockOnAdd).not.toHaveBeenCalled();
    });
  });

  describe("Keyboard Interactions", () => {
    beforeEach(async () => {
      const user = userEvent.setup();
      render(<AddFirefighterForm onAdd={mockOnAdd} />);
      await user.click(
        screen.getByRole("button", { name: /add team member/i })
      );
    });

    it("should tab through form fields in order", async () => {
      const user = userEvent.setup();
      const nameInput = screen.getByLabelText(/full name/i);
      const stationInput = screen.getByLabelText(/station number/i);
      const cancelButton = screen.getByLabelText(/cancel adding/i);

      expect(nameInput).toHaveFocus(); // Autofocus

      await user.tab();
      expect(stationInput).toHaveFocus();

      // Submit button is disabled, so Tab skips it
      await user.tab();
      expect(cancelButton).toHaveFocus();
    });

    it("should submit with Enter key in name field", async () => {
      const user = userEvent.setup();
      const nameInput = screen.getByLabelText(/full name/i);

      await user.type(nameInput, "John Doe");
      await user.keyboard("{Enter}");

      expect(mockOnAdd).toHaveBeenCalledWith("John Doe", "");
    });

    it("should submit with Enter key in station field", async () => {
      const user = userEvent.setup();
      const nameInput = screen.getByLabelText(/full name/i);
      const stationInput = screen.getByLabelText(/station number/i);

      await user.type(nameInput, "John Doe");
      await user.click(stationInput);
      await user.type(stationInput, "3");
      await user.keyboard("{Enter}");

      expect(mockOnAdd).toHaveBeenCalledWith("John Doe", "3");
    });

    it("should activate submit button with Space key", async () => {
      const user = userEvent.setup();
      const nameInput = screen.getByLabelText(/full name/i);

      await user.type(nameInput, "John Doe");

      const submitButton = screen.getByLabelText(
        /add firefighter to rotation/i
      );
      submitButton.focus();
      await user.keyboard(" ");

      expect(mockOnAdd).toHaveBeenCalledWith("John Doe", "");
    });

    it("should activate cancel button with Space key", async () => {
      const user = userEvent.setup();
      const cancelButton = screen.getByLabelText(/cancel adding/i);

      cancelButton.focus();
      await user.keyboard(" ");

      expect(
        screen.getByRole("button", { name: /add team member/i })
      ).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    beforeEach(async () => {
      const user = userEvent.setup();
      render(<AddFirefighterForm onAdd={mockOnAdd} />);
      await user.click(
        screen.getByRole("button", { name: /add team member/i })
      );
    });

    it("should have proper ARIA labels on all form fields", () => {
      expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/station number/i)).toBeInTheDocument();
    });

    it("should have accessible form validation messages", async () => {
      const user = userEvent.setup();
      const nameInput = screen.getByLabelText(/full name/i);

      await user.click(nameInput);
      await user.tab();

      await waitFor(() => {
        const errorMessage = screen.getByRole("alert");
        expect(errorMessage).toBeInTheDocument();
        expect(errorMessage).toHaveTextContent(/name is required/i);
      });
    });

    it("should announce errors to screen readers via role=alert", async () => {
      const user = userEvent.setup();
      const nameInput = screen.getByLabelText(/full name/i);

      await user.click(nameInput);
      await user.tab();

      await waitFor(() => {
        expect(screen.getByRole("alert")).toBeInTheDocument();
      });
    });

    it("should have logical tab order", async () => {
      const user = userEvent.setup();

      // Tab order when button is disabled: name -> station -> cancel
      expect(screen.getByLabelText(/full name/i)).toHaveFocus();

      await user.tab();
      expect(screen.getByLabelText(/station number/i)).toHaveFocus();

      // Submit button is disabled, so Tab skips it
      await user.tab();
      expect(screen.getByLabelText(/cancel adding/i)).toHaveFocus();
    });

    it("should have visible focus indicators", () => {
      const nameInput = screen.getByLabelText(/full name/i);
      const submitButton = screen.getByLabelText(
        /add firefighter to rotation/i
      );

      // Component uses focus-ring class
      expect(nameInput.className).toContain("focus-ring");
      expect(submitButton.className).toContain("focus-ring");
    });

    it("should use semantic HTML for form", () => {
      const submitButton = screen.getByLabelText(
        /add firefighter to rotation/i
      );
      const form = submitButton.closest("form");
      expect(form).toBeInTheDocument();
    });
  });

  describe("Dark/Light Mode Theming", () => {
    it("should apply design token styles", async () => {
      const user = userEvent.setup();
      render(<AddFirefighterForm onAdd={mockOnAdd} />);

      const addButton = screen.getByRole("button", {
        name: /add team member/i,
      });
      expect(addButton.className).toContain("bg-blue-600");

      await user.click(addButton);

      const form = screen.getByLabelText(/full name/i).closest("form");
      expect(form?.className).toBeDefined();
    });

    it("should use centralized design tokens", async () => {
      const user = userEvent.setup();
      render(<AddFirefighterForm onAdd={mockOnAdd} />);

      await user.click(
        screen.getByRole("button", { name: /add team member/i })
      );

      const form = screen.getByLabelText(/full name/i).closest("form");
      expect(form).toBeInTheDocument();
    });

    it("should render without isDarkMode prop", () => {
      render(<AddFirefighterForm onAdd={mockOnAdd} />);

      const addButton = screen.getByRole("button", {
        name: /add team member/i,
      });
      expect(addButton.className).toContain("bg-blue-600");
    });
  });
});
