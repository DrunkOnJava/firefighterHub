import { useCallback, useEffect, useRef, useState } from "react";
import { ScheduledHold, Shift, supabase } from "../lib/supabase";

interface UseScheduledHoldsDataReturn {
  scheduledHolds: ScheduledHold[];
  isLoading: boolean;
  error: string | null;
  loadScheduledHolds: () => Promise<void>;
}

/**
 * Hook for fetching scheduled holds data
 * Separated from mutations for better code organization (SRP)
 *
 * Implements race condition protection:
 * - AbortController cancels in-flight requests on unmount/re-fetch
 * - Epoch counter prevents stale responses from overwriting newer state
 */
export function useScheduledHoldsData(
  currentShift: Shift
): UseScheduledHoldsDataReturn {
  const [scheduledHolds, setScheduledHolds] = useState<ScheduledHold[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const loadEpochRef = useRef(0);
  const abortRef = useRef<AbortController | null>(null);

  const loadScheduledHolds = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Guard against stale responses (e.g., rapid shift changes A→B→A)
      const myEpoch = ++loadEpochRef.current;

      // Cancel any in-flight requests from previous calls
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      const { data, error: fetchError } = await supabase
        .from("scheduled_holds")
        .select("*")
        .eq("shift", currentShift)
        .order("hold_date", { ascending: true })
        .abortSignal(controller.signal);

      if (fetchError) throw fetchError;

      // Only commit if this response is still fresh (not stale)
      if (loadEpochRef.current === myEpoch && !controller.signal.aborted) {
        setScheduledHolds(data || []);
      }
    } catch (err) {
      // AbortError is benign (user navigated away or new request started)
      if (err instanceof Error && err.name === "AbortError") {
        return;
      }
      console.error("Error loading scheduled holds:", err);
      setError(err instanceof Error ? err.message : "Failed to load holds");
    } finally {
      setIsLoading(false);
    }
  }, [currentShift]);

  useEffect(() => {
    loadScheduledHolds();

    // Cleanup: abort any pending requests on unmount
    return () => {
      abortRef.current?.abort();
    };
  }, [currentShift]); // Use currentShift directly to avoid infinite loop

  return {
    scheduledHolds,
    isLoading,
    error,
    loadScheduledHolds,
  };
}
