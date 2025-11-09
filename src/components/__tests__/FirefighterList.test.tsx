/**
 * FirefighterList Component Tests
 *
 * Tests the firefighter roster including:
 * - Hold history button visibility in admin vs read-only mode
 * - Roster display and sorting
 * - Admin action buttons
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FirefighterList } from "../FirefighterList";
import { createMockFirefighter } from "../../test/mockData";
import type { Firefighter } from "../../lib/supabase";

describe("FirefighterList Component", () => {
  const mockOnAdd = vi.fn();
  const mockOnCompleteHold = vi.fn();
  const mockOnDelete = vi.fn();
  const mockOnDeactivate = vi.fn();
  const mockOnReactivate = vi.fn();
  const mockOnTransferShift = vi.fn();
  const mockOnResetAll = vi.fn();
  const mockOnReorder = vi.fn();

  const mockFirefighters: Firefighter[] = [
    createMockFirefighter({
      id: "ff-1",
      name: "John Doe",
      order_position: 0,
      is_available: true,
      last_hold_date: "2025-10-20T00:00:00Z",
      fire_station: "1",
    }),
    createMockFirefighter({
      id: "ff-2",
      name: "Jane Smith",
      order_position: 1,
      is_available: true,
      last_hold_date: "2025-10-15T00:00:00Z",
      fire_station: "2",
    }),
    createMockFirefighter({
      id: "ff-3",
      name: "Bob Johnson",
      order_position: 2,
      is_available: true,
      last_hold_date: null,
      fire_station: "3",
    }),
  ];

  beforeEach(() => {
    mockOnAdd.mockClear();
    mockOnCompleteHold.mockClear();
    mockOnDelete.mockClear();
    mockOnDeactivate.mockClear();
    mockOnReactivate.mockClear();
    mockOnTransferShift.mockClear();
    mockOnResetAll.mockClear();
    mockOnReorder.mockClear();
  });

  describe("Feature: Hold history button visibility", () => {
    it("should show hold history button in admin mode", () => {
      render(
        <FirefighterList
          firefighters={mockFirefighters}
          deactivatedFirefighters={[]}
          onAdd={mockOnAdd}
          onCompleteHold={mockOnCompleteHold}
          onDelete={mockOnDelete}
          onDeactivate={mockOnDeactivate}
          onReactivate={mockOnReactivate}
          onTransferShift={mockOnTransferShift}
          onResetAll={mockOnResetAll}
          onReorder={mockOnReorder}
          isAdminMode={true}
          currentShift="A"
        />
      );

      // Should show hold history buttons (one for each firefighter)
      const historyButtons = screen.getAllByLabelText("View hold history");
      expect(historyButtons).toHaveLength(mockFirefighters.length);
    });

    it("should NOT show hold history button in read-only mode", () => {
      render(
        <FirefighterList
          firefighters={mockFirefighters}
          deactivatedFirefighters={[]}
          onAdd={mockOnAdd}
          onCompleteHold={mockOnCompleteHold}
          onDelete={mockOnDelete}
          onDeactivate={mockOnDeactivate}
          onReactivate={mockOnReactivate}
          onTransferShift={mockOnTransferShift}
          onResetAll={mockOnResetAll}
          onReorder={mockOnReorder}
          isAdminMode={false}
          currentShift="A"
        />
      );

      // Should NOT show hold history buttons in read-only mode
      const historyButtons = screen.queryAllByLabelText("View hold history");
      expect(historyButtons).toHaveLength(0);
    });

    it("should still show last hold date text in read-only mode", () => {
      render(
        <FirefighterList
          firefighters={mockFirefighters}
          deactivatedFirefighters={[]}
          onAdd={mockOnAdd}
          onCompleteHold={mockOnCompleteHold}
          onDelete={mockOnDelete}
          onDeactivate={mockOnDeactivate}
          onReactivate={mockOnReactivate}
          onTransferShift={mockOnTransferShift}
          onResetAll={mockOnResetAll}
          onReorder={mockOnReorder}
          isAdminMode={false}
          currentShift="A"
        />
      );

      // Last hold dates should still be visible
      expect(screen.getByText("Oct 19, 2025")).toBeInTheDocument();
      expect(screen.getByText("Oct 14, 2025")).toBeInTheDocument();
      expect(screen.getByText("Never")).toBeInTheDocument();
    });

    it("should allow clicking hold history button in admin mode", async () => {
      const user = userEvent.setup();

      render(
        <FirefighterList
          firefighters={mockFirefighters}
          deactivatedFirefighters={[]}
          onAdd={mockOnAdd}
          onCompleteHold={mockOnCompleteHold}
          onDelete={mockOnDelete}
          onDeactivate={mockOnDeactivate}
          onReactivate={mockOnReactivate}
          onTransferShift={mockOnTransferShift}
          onResetAll={mockOnResetAll}
          onReorder={mockOnReorder}
          isAdminMode={true}
          currentShift="A"
        />
      );

      const historyButtons = screen.getAllByLabelText("View hold history");
      await user.click(historyButtons[0]);

      // Profile modal should open (we can't test the modal itself here, but we can verify the click works)
      // The actual modal rendering is tested in FirefighterProfileModal.test.tsx
    });
  });

  describe("Admin action buttons visibility", () => {
    it("should show admin action buttons in admin mode", () => {
      render(
        <FirefighterList
          firefighters={mockFirefighters}
          deactivatedFirefighters={[]}
          onAdd={mockOnAdd}
          onCompleteHold={mockOnCompleteHold}
          onDelete={mockOnDelete}
          onDeactivate={mockOnDeactivate}
          onReactivate={mockOnReactivate}
          onTransferShift={mockOnTransferShift}
          onResetAll={mockOnResetAll}
          onReorder={mockOnReorder}
          isAdminMode={true}
          currentShift="A"
        />
      );

      // Should show transfer, deactivate, and delete buttons
      const transferButtons = screen.getAllByTitle("Transfer shift");
      const deactivateButtons = screen.getAllByTitle("Deactivate");
      const deleteButtons = screen.getAllByTitle("Delete permanently");

      expect(transferButtons).toHaveLength(mockFirefighters.length);
      expect(deactivateButtons).toHaveLength(mockFirefighters.length);
      expect(deleteButtons).toHaveLength(mockFirefighters.length);
    });

    it("should NOT show admin action buttons in read-only mode", () => {
      render(
        <FirefighterList
          firefighters={mockFirefighters}
          deactivatedFirefighters={[]}
          onAdd={mockOnAdd}
          onCompleteHold={mockOnCompleteHold}
          onDelete={mockOnDelete}
          onDeactivate={mockOnDeactivate}
          onReactivate={mockOnReactivate}
          onTransferShift={mockOnTransferShift}
          onResetAll={mockOnResetAll}
          onReorder={mockOnReorder}
          isAdminMode={false}
          currentShift="A"
        />
      );

      // Should NOT show admin action buttons
      expect(screen.queryByTitle("Transfer shift")).not.toBeInTheDocument();
      expect(screen.queryByTitle("Deactivate")).not.toBeInTheDocument();
      expect(screen.queryByTitle("Delete permanently")).not.toBeInTheDocument();
    });
  });

  describe("Roster display", () => {
    it("should display all firefighters with correct information", () => {
      render(
        <FirefighterList
          firefighters={mockFirefighters}
          deactivatedFirefighters={[]}
          onAdd={mockOnAdd}
          onCompleteHold={mockOnCompleteHold}
          onDelete={mockOnDelete}
          onDeactivate={mockOnDeactivate}
          onReactivate={mockOnReactivate}
          onTransferShift={mockOnTransferShift}
          onResetAll={mockOnResetAll}
          onReorder={mockOnReorder}
          isAdminMode={true}
          currentShift="A"
        />
      );

      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("Jane Smith")).toBeInTheDocument();
      expect(screen.getByText("Bob Johnson")).toBeInTheDocument();

      // Station numbers should be visible
      expect(screen.getByText("Station #1")).toBeInTheDocument();
      expect(screen.getByText("Station #2")).toBeInTheDocument();
      expect(screen.getByText("Station #3")).toBeInTheDocument();
    });

    it("should show correct rotation order positions", () => {
      render(
        <FirefighterList
          firefighters={mockFirefighters}
          deactivatedFirefighters={[]}
          onAdd={mockOnAdd}
          onCompleteHold={mockOnCompleteHold}
          onDelete={mockOnDelete}
          onDeactivate={mockOnDeactivate}
          onReactivate={mockOnReactivate}
          onTransferShift={mockOnTransferShift}
          onResetAll={mockOnResetAll}
          onReorder={mockOnReorder}
          isAdminMode={true}
          currentShift="A"
        />
      );

      // First firefighter should have "NEXT" badge
      expect(screen.getByText("NEXT")).toBeInTheDocument();
    });
  });
});
