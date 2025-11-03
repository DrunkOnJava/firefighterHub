import { useCallback, useEffect, useRef, useState } from "react";
import { Firefighter, Shift, supabase } from "../lib/supabase";
import { sortFirefighters } from "../utils/rotationLogic";

interface UseFirefightersDataReturn {
  firefighters: Firefighter[];
  deactivatedFirefighters: Firefighter[];
  isLoading: boolean;
  error: string | null;
  loadFirefighters: () => Promise<void>;
}

/**
 * Hook for fetching firefighters data
 * Separated from mutations for better code organization (SRP)
 *
 * Implements race condition protection:
 * - AbortController cancels in-flight requests on unmount/re-fetch
 * - Epoch counter prevents stale responses from overwriting newer state
 */
export function useFirefightersData(
  currentShift: Shift
): UseFirefightersDataReturn {
  const [firefighters, setFirefighters] = useState<Firefighter[]>([]);
  const [deactivatedFirefighters, setDeactivatedFirefighters] = useState<
    Firefighter[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const loadEpochRef = useRef(0);
  const abortRef = useRef<AbortController | null>(null);

  const loadFirefighters = useCallback(async () => {
    // Bump epoch and create a fresh controller to prevent race conditions
    const myEpoch = ++loadEpochRef.current;
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      setIsLoading(true);
      setError(null);

      // Load active firefighters
      const { data: activeData, error: activeError } = await supabase
        .from("firefighters")
        .select("*")
        .eq("shift", currentShift)
        .eq("is_active", true)
        .order("order_position", { ascending: true })
        .abortSignal(controller.signal);

      if (activeError) throw activeError;

      // ✅ Use sortFirefighters to trust database positions
      // We don't recalculate positions here - that happens in mutations
      const sorted = sortFirefighters(activeData || []);

      // Commit only if still the latest request and not aborted
      if (loadEpochRef.current === myEpoch && !controller.signal.aborted) {
        setFirefighters(sorted);
      }

      // Load deactivated firefighters
      const { data: deactivatedData, error: deactivatedError } = await supabase
        .from("firefighters")
        .select("*")
        .eq("shift", currentShift)
        .eq("is_active", false)
        .order("name", { ascending: true })
        .abortSignal(controller.signal);

      if (deactivatedError) throw deactivatedError;

      if (loadEpochRef.current === myEpoch && !controller.signal.aborted) {
        setDeactivatedFirefighters(deactivatedData || []);
      }
    } catch (err) {
      // AbortError is benign - just means we cancelled the request
      if ((err as Error)?.name === "AbortError") return;

      console.error("Error loading firefighters:", err);
      setError(
        err instanceof Error ? err.message : "Failed to load firefighters"
      );
    } finally {
      if (loadEpochRef.current === myEpoch && !controller.signal.aborted) {
        setIsLoading(false);
      }
    }
  }, [currentShift]);

  useEffect(() => {
    loadFirefighters();
    return () => {
      abortRef.current?.abort();
    };
  }, [loadFirefighters]);

  return {
    firefighters,
    deactivatedFirefighters,
    isLoading,
    error,
    loadFirefighters,
  };
}
