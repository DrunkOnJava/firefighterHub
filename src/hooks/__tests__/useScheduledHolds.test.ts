/**
 * useScheduledHolds Hook Tests
 *
 * Tests the scheduled holds management hook including:
 * - Data fetching and filtering by shift and date range
 * - CRUD operations (scheduleHold, markHoldCompleted, removeScheduledHold)
 * - Optimistic updates
 * - Error handling
 */

import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Firefighter } from "../../lib/supabase";
import {
  clearErrorSimulation,
  resetMockDatabase,
  setMockScheduledHolds,
  setMockFirefighters,
  simulateError,
} from "../../test/supabaseMockV2";
import type { ScheduledHold } from "../../utils/calendarUtils";
import { useScheduledHolds } from "../useScheduledHolds";

// Mock the supabase module
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

// Mock global fetch for Edge Function calls
global.fetch = vi.fn();

describe("useScheduledHolds", () => {
  const mockToast = vi.fn();

  beforeEach(() => {
    resetMockDatabase();
    mockToast.mockClear();
    clearErrorSimulation();
    
    // Reset fetch mock before each test
    (global.fetch as any).mockReset();
    
    // Default successful Edge Function response - matches request data
    (global.fetch as any).mockImplementation(async (url: string, options: any) => {
      const body = JSON.parse(options.body);
      
      // Return hold data matching the request
      return {
        ok: true,
        json: async () => ({
          id: `mock-${Date.now()}`,
          ...body,
          status: 'scheduled',
          notes: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          completed_at: null,
          lent_to_shift: null,
          is_completed: false,
          scheduled_date: body.hold_date,
        }),
      };
    });
  });

  describe("loadScheduledHolds()", () => {
    it("should load scheduled holds for current shift only", async () => {
      const shiftAHolds: ScheduledHold[] = [
        {
          id: "hold1",
          firefighter_id: "ff1",
          firefighter_name: "John Doe",
          hold_date: "2025-10-28",
          shift: "A",
          status: "scheduled",
          fire_station: null,
          notes: null,
          duration: "24h",
          start_time: "07:00",
          created_at: "2025-10-27T00:00:00Z",
          updated_at: "2025-10-27T00:00:00Z",
          completed_at: null,
          lent_to_shift: null,
          is_completed: false,
          is_voluntary: false,
          scheduled_date: "2025-10-27",
        },
      ];

      const shiftBHolds: ScheduledHold[] = [
        {
          id: "hold2",
          firefighter_id: "ff2",
          firefighter_name: "Jane Smith",
          hold_date: "2025-10-28",
          shift: "B",
          status: "scheduled",
          fire_station: null,
          notes: null,
          duration: "24h",
          start_time: "07:00",
          created_at: "2025-10-27T00:00:00Z",
          updated_at: "2025-10-27T00:00:00Z",
          completed_at: null,
          lent_to_shift: null,
          is_completed: false,
          is_voluntary: false,
          scheduled_date: "2025-10-27",
        },
      ];

      setMockScheduledHolds([...shiftAHolds, ...shiftBHolds]);

      const { result } = renderHook(() => useScheduledHolds(mockToast, "A"));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.scheduledHolds.length).toBe(1);
      expect(result.current.scheduledHolds[0].shift).toBe("A");
    });

    it("should filter by date range (current month -1 to +3 months)", async () => {
      const today = new Date();
      const oldDate = new Date(today.getFullYear(), today.getMonth() - 2, 15); // Too old
      const recentDate = new Date(today.getFullYear(), today.getMonth(), 15); // Within range
      const futureDate = new Date(
        today.getFullYear(),
        today.getMonth() + 5,
        15
      ); // Too far

      const holds: ScheduledHold[] = [
        {
          id: "hold1",
          firefighter_id: "ff1",
          firefighter_name: "Old Hold",
          hold_date: oldDate.toISOString().split("T")[0],
          shift: "A",
          status: "scheduled",
          fire_station: null,
          notes: null,
          duration: "24h",
          start_time: "07:00",
          created_at: "2025-01-01T00:00:00Z",
          updated_at: "2025-01-01T00:00:00Z",
          completed_at: null,
          lent_to_shift: null,
          is_completed: false,
          is_voluntary: false,
          scheduled_date: "2025-10-27",
        },
        {
          id: "hold2",
          firefighter_id: "ff2",
          firefighter_name: "Recent Hold",
          hold_date: recentDate.toISOString().split("T")[0],
          shift: "A",
          status: "scheduled",
          fire_station: null,
          notes: null,
          duration: "24h",
          start_time: "07:00",
          created_at: "2025-01-01T00:00:00Z",
          updated_at: "2025-01-01T00:00:00Z",
          completed_at: null,
          lent_to_shift: null,
          is_completed: false,
          is_voluntary: false,
          scheduled_date: "2025-10-27",
        },
        {
          id: "hold3",
          firefighter_id: "ff3",
          firefighter_name: "Future Hold",
          hold_date: futureDate.toISOString().split("T")[0],
          shift: "A",
          status: "scheduled",
          fire_station: null,
          notes: null,
          duration: "24h",
          start_time: "07:00",
          created_at: "2025-01-01T00:00:00Z",
          updated_at: "2025-01-01T00:00:00Z",
          completed_at: null,
          lent_to_shift: null,
          is_completed: false,
          is_voluntary: false,
          scheduled_date: "2025-10-27",
        },
      ];

      setMockScheduledHolds(holds);

      const { result } = renderHook(() => useScheduledHolds(mockToast, "A"));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Should only include the recent hold (within range)
      expect(result.current.scheduledHolds.length).toBe(1);
      expect(result.current.scheduledHolds[0].firefighter_name).toBe(
        "Recent Hold"
      );
    });

    it("should sort holds by date (ascending)", async () => {
      const holds: ScheduledHold[] = [
        {
          id: "hold1",
          firefighter_id: "ff1",
          firefighter_name: "Last",
          hold_date: "2025-10-30",
          shift: "A",
          status: "scheduled",
          fire_station: null,
          notes: null,
          duration: "24h",
          start_time: "07:00",
          created_at: "2025-10-27T00:00:00Z",
          updated_at: "2025-10-27T00:00:00Z",
          completed_at: null,
          lent_to_shift: null,
          is_completed: false,
          is_voluntary: false,
          scheduled_date: "2025-10-27",
        },
        {
          id: "hold2",
          firefighter_id: "ff2",
          firefighter_name: "First",
          hold_date: "2025-10-28",
          shift: "A",
          status: "scheduled",
          fire_station: null,
          notes: null,
          duration: "24h",
          start_time: "07:00",
          created_at: "2025-10-27T00:00:00Z",
          updated_at: "2025-10-27T00:00:00Z",
          completed_at: null,
          lent_to_shift: null,
          is_completed: false,
          is_voluntary: false,
          scheduled_date: "2025-10-27",
        },
      ];

      setMockScheduledHolds(holds);

      const { result } = renderHook(() => useScheduledHolds(mockToast, "A"));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.scheduledHolds[0].firefighter_name).toBe("First");
      expect(result.current.scheduledHolds[1].firefighter_name).toBe("Last");
    });

    it("should handle empty state", async () => {
      setMockScheduledHolds([]);

      const { result } = renderHook(() => useScheduledHolds(mockToast, "A"));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.scheduledHolds.length).toBe(0);
    });

    it("should handle error when fetch fails", async () => {
      simulateError("Network error", false);

      const { result } = renderHook(() => useScheduledHolds(mockToast, "A"));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(mockToast).toHaveBeenCalledWith(
        "Could not load scheduled holds. Check your connection and refresh.",
        "error"
      );

      clearErrorSimulation();
    });
  });

  describe("scheduleHold()", () => {
    it("should create a new scheduled hold", async () => {
      const { result } = renderHook(() => useScheduledHolds(mockToast, "A"));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const firefighter: Firefighter = {
        id: "ff1",
        name: "John Doe",
        shift: "A",
        is_active: true,
        is_available: true,
        order_position: 0,
        fire_station: "1",
        last_hold_date: null,
        certification_level: "FF1",
        apparatus_ambulance: false,
        apparatus_brush_truck: false,
        apparatus_engine: false,
        apparatus_tanker: false,
        apparatus_truck: false,
        apparatus_boat: false,
        apparatus_utv: false,
        apparatus_rescue_squad: false,
        is_fto: false,
        is_bls: false,
        is_als: false,
        created_at: "2025-01-01T00:00:00Z",
        updated_at: "2025-01-01T00:00:00Z",
      };

      await result.current.scheduleHold("2025-10-30", firefighter, "1");

      await waitFor(() => {
        const holds = result.current.scheduledHolds;
        const created = holds.find(
          (h) => h.firefighter_id === "ff1" && h.hold_date === "2025-10-30"
        );
        expect(created).toBeDefined();
        expect(created?.status).toBe("scheduled");
        expect(created?.fire_station).toBe("1");
      });

      expect(mockToast).toHaveBeenCalledWith(
        expect.stringContaining("John Doe"),
        "success"
      );
    });

    it("should handle error on creation failure", async () => {
      const { result } = renderHook(() => useScheduledHolds(mockToast, "A"));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Make fetch fail for this test
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: "Insert failed" }),
      });

      const firefighter: Firefighter = {
        id: "ff1",
        name: "John Doe",
        shift: "A",
        is_active: true,
        is_available: true,
        order_position: 0,
        fire_station: null,
        last_hold_date: null,
        certification_level: null,
        apparatus_ambulance: false,
        apparatus_brush_truck: false,
        apparatus_engine: false,
        apparatus_tanker: false,
        apparatus_truck: false,
        apparatus_boat: false,
        apparatus_utv: false,
        apparatus_rescue_squad: false,
        is_fto: false,
        is_bls: false,
        is_als: false,
        created_at: "2025-01-01T00:00:00Z",
        updated_at: "2025-01-01T00:00:00Z",
      };

      await result.current.scheduleHold("2025-10-30", firefighter);

      expect(mockToast).toHaveBeenCalledWith(
        "Could not schedule hold. Please try again.",
        "error"
      );
    });
  });

  describe("markHoldCompleted()", () => {
    it("should mark a scheduled hold as completed", async () => {
      const firefighter: Firefighter = {
        id: "ff1",
        name: "John Doe",
        shift: "A",
        is_active: true,
        is_available: true,
        order_position: 0,
        fire_station: null,
        last_hold_date: null,
        certification_level: null,
        apparatus_ambulance: false,
        apparatus_brush_truck: false,
        apparatus_engine: false,
        apparatus_tanker: false,
        apparatus_truck: false,
        apparatus_boat: false,
        apparatus_utv: false,
        apparatus_rescue_squad: false,
        is_fto: false,
        is_bls: false,
        is_als: false,
        created_at: "2025-01-01T00:00:00Z",
        updated_at: "2025-01-01T00:00:00Z",
      };

      const hold: ScheduledHold = {
        id: "hold1",
        firefighter_id: "ff1",
        firefighter_name: "John Doe",
        hold_date: "2025-10-28",
        shift: "A",
        status: "scheduled",
        fire_station: null,
        notes: null,
        duration: "24h",
        start_time: "07:00",
        created_at: "2025-10-27T00:00:00Z",
        updated_at: "2025-10-27T00:00:00Z",
        completed_at: null,
        lent_to_shift: null,
        is_completed: false,
          is_voluntary: false,
        scheduled_date: "2025-10-27",
      };

      setMockFirefighters([firefighter]);
      setMockScheduledHolds([hold]);

      const { result } = renderHook(() => useScheduledHolds(mockToast, "A"));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Verify initial state
      expect(result.current.scheduledHolds).toHaveLength(1);
      expect(result.current.scheduledHolds[0].status).toBe("scheduled");

      await result.current.markHoldCompleted(hold);

      // The optimistic update should happen immediately
      await waitFor(() => {
        const updated = result.current.scheduledHolds.find(
          (h) => h.id === "hold1"
        );
        if (!updated) {
          throw new Error("Hold not found after completion");
        }
        expect(updated.status).toBe("completed");
        expect(updated.completed_at).toBeDefined();
      }, { timeout: 3000 });
    });
  });

  describe("removeScheduledHold()", () => {
    it("should delete a scheduled hold", async () => {
      const hold: ScheduledHold = {
        id: "hold1",
        firefighter_id: "ff1",
        firefighter_name: "John Doe",
        hold_date: "2025-10-28",
        shift: "A",
        status: "scheduled",
        fire_station: null,
        notes: null,
        duration: "24h",
        start_time: "07:00",
        created_at: "2025-10-27T00:00:00Z",
        updated_at: "2025-10-27T00:00:00Z",
        completed_at: null,
        lent_to_shift: null,
        is_completed: false,
          is_voluntary: false,
        scheduled_date: "2025-10-27",
      };

      setMockScheduledHolds([hold]);

      const { result } = renderHook(() => useScheduledHolds(mockToast, "A"));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await result.current.removeScheduledHold("hold1");

      await waitFor(() => {
        expect(result.current.scheduledHolds.length).toBe(0);
      });

      expect(mockToast).toHaveBeenCalledWith(
        expect.stringContaining("canceled"),
        "success"
      );
    });

    it("should handle error on deletion failure", async () => {
      const hold: ScheduledHold = {
        id: "hold1",
        firefighter_id: "ff1",
        firefighter_name: "John Doe",
        hold_date: "2025-10-28",
        shift: "A",
        status: "scheduled",
        fire_station: null,
        notes: null,
        duration: "24h",
        start_time: "07:00",
        created_at: "2025-10-27T00:00:00Z",
        updated_at: "2025-10-27T00:00:00Z",
        completed_at: null,
        lent_to_shift: null,
        is_completed: false,
          is_voluntary: false,
        scheduled_date: "2025-10-27",
      };

      setMockScheduledHolds([hold]);

      const { result } = renderHook(() => useScheduledHolds(mockToast, "A"));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      simulateError("Delete failed", false);

      await result.current.removeScheduledHold("hold1");

      await waitFor(() => {
        // Should rollback
        expect(result.current.scheduledHolds.length).toBe(1);
      });

      expect(mockToast).toHaveBeenCalledWith(
        "Could not remove hold. Please try again.",
        "error"
      );

      clearErrorSimulation();
    });
  });
});
