/**
 * Composite hook for firefighters management
 * 
 * ✅ REFACTORED: Now follows Single Responsibility Principle
 * - Data fetching: useFirefightersData
 * - Mutations: useFirefightersMutations
 * - Real-time sync: useFirefightersRealtime
 * - Activity logging: useActivityLogger
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

import { useCallback, useEffect, useRef } from "react";
import { Shift } from "../lib/supabase";
import { ConfirmOptions } from "./useConfirm";
import { ToastType } from "./useToast";
import { useActivityLogger } from "./useActivityLogger";
import { useFirefightersData } from "./useFirefightersData";
import { useFirefightersMutations } from "./useFirefightersMutations";
import { useFirefightersRealtime } from "./useFirefightersRealtime";

export function useFirefighters(
  showToast: (message: string, type: ToastType) => void,
  currentShift: Shift,
  confirmAction?: (options: ConfirmOptions) => Promise<boolean>
) {
  // 1. Data fetching hook
  const {
    firefighters,
    deactivatedFirefighters,
    isLoading: loading,
    error,
    loadFirefighters,
  } = useFirefightersData(currentShift);

  // 2. Activity logging hook
  const { logActivity } = useActivityLogger(currentShift);

  // 3. Memoize callbacks for real-time hook (prevent subscription churn)
  const memoizedShowToast = useCallback(showToast, [showToast]);
  const memoizedLoadFirefighters = useCallback(loadFirefighters, [
    loadFirefighters,
  ]);

  // 4. Real-time sync hook
  useFirefightersRealtime({
    currentShift,
    onDataChange: memoizedLoadFirefighters,
    showToast: memoizedShowToast,
  });

  // 5. Mutations hook
  const mutations = useFirefightersMutations({
    currentShift,
    firefighters,
    deactivatedFirefighters,
    showToast,
    confirmAction,
    logActivity,
    onSuccess: memoizedLoadFirefighters,
  });

  // Log error if data fetch failed (safe inside effect to avoid render loops)
  const previousErrorRef = useRef<string | null>(null);
  useEffect(() => {
    if (!error) {
      previousErrorRef.current = null;
      return;
    }

    if (previousErrorRef.current !== error) {
      showToast(error, "error");
      previousErrorRef.current = error;
    }
  }, [error, showToast]);

  // Return combined API (maintains backward compatibility)
  return {
    firefighters,
    deactivatedFirefighters,
    loading,
    ...mutations,
    // Note: isOperationLoading and loadingStates removed (no longer needed without optimistic updates)
  };
}
