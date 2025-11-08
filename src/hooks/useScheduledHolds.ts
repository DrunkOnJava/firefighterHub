/**
 * Composite hook for scheduled holds management
 * 
 * ✅ REFACTORED: Now follows Single Responsibility Principle
 * - Data fetching: useScheduledHoldsData
 * - Mutations: useScheduledHoldsMutations
 * - Real-time sync: useScheduledHoldsRealtime
 * 
 * This hook serves as a facade to maintain backward compatibility
 * while using the new split architecture internally.
 * 
 * Benefits of split architecture:
 * - Each piece is independently testable
 * - Easier to reason about and maintain
 * - Cleaner separation of concerns
 * - No optimistic updates = simpler state management
 */

import { useCallback } from "react";
import { Firefighter, HoldDuration, Shift } from "../lib/supabase";
import { ToastType } from "./useToast";
import { useScheduledHoldsData } from "./useScheduledHoldsData";
import { useScheduledHoldsMutations } from "./useScheduledHoldsMutations";
import { useScheduledHoldsRealtime } from "./useScheduledHoldsRealtime";

export function useScheduledHolds(
  showToast: (message: string, type: ToastType) => void,
  currentShift: Shift
) {
  // 1. Data fetching hook
  const {
    scheduledHolds,
    isLoading: loading,
    error,
    loadScheduledHolds,
  } = useScheduledHoldsData(currentShift);

  // 2. Memoize callbacks for real-time hook (prevent subscription churn)
  const memoizedShowToast = useCallback(showToast, []);
  const memoizedLoadScheduledHolds = useCallback(loadScheduledHolds, [
    loadScheduledHolds,
  ]);

  // 3. Real-time sync hook
  useScheduledHoldsRealtime({
    currentShift,
    onDataChange: memoizedLoadScheduledHolds,
    showToast: memoizedShowToast,
  });

  // 4. Mutations hook
  const mutations = useScheduledHoldsMutations({
    currentShift,
    scheduledHolds,
    showToast,
    onSuccess: memoizedLoadScheduledHolds,
  });

  // Log error if data fetch failed
  if (error) {
    showToast(error, "error");
  }

  // Return combined API (maintains backward compatibility)
  return {
    scheduledHolds,
    loading,
    ...mutations,
  };
}

// Export mutation function signatures for type safety
export type ScheduleHoldFn = (
  date: string,
  firefighter: Firefighter,
  station: string,
  duration: HoldDuration,
  startTime: string,
  isVoluntary: boolean
) => Promise<void>;

export type RemoveScheduledHoldFn = (holdId: string) => Promise<void>;

export type MarkHoldCompletedFn = (
  holdId: string,
  firefighterId: string,
  date: string
) => Promise<void>;
