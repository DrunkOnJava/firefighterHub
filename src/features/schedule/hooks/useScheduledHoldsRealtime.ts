import type { RealtimeChannel } from "@supabase/supabase-js";
import { useCallback, useEffect, useRef } from "react";
import { Shift, supabase } from '@/lib/supabase';
import { ToastType } from "@/hooks/useToast";

interface UseScheduledHoldsRealtimeParams {
  currentShift: Shift;
  onDataChange: () => void;
  showToast: (message: string, type: ToastType) => void;
}

/**
 * Hook for real-time subscriptions to scheduled holds
 * Separated from data fetching and mutations for better code organization (SRP)
 *
 * Features:
 * - Exponential backoff retry (1s → 2s → 4s → 8s → 16s → 30s max)
 * - Automatic reconnection on connection loss
 * - Channel-specific subscriptions per shift
 * - Graceful cleanup on component unmount
 * - Prevents channel leaks during reconnection attempts
 * - Toast deduplication to prevent notification spam
 *
 * @param currentShift - The shift to subscribe to (A, B, or C)
 * @param onDataChange - Callback invoked when data changes via real-time events.
 *                       **MUST be wrapped in useCallback** to prevent subscription recreation.
 * @param showToast - Toast notification function.
 *                    **MUST be wrapped in useCallback** to prevent subscription recreation.
 *
 * @example
 * ```typescript
 * // ✅ Correct: Callbacks wrapped in useCallback
 * const handleDataChange = useCallback(() => {
 *   loadScheduledHolds();
 * }, [loadScheduledHolds]);
 *
 * const handleShowToast = useCallback((message: string, type: ToastType) => {
 *   toast({ message, type });
 * }, []);
 *
 * useScheduledHoldsRealtime({
 *   currentShift,
 *   onDataChange: handleDataChange,
 *   showToast: handleShowToast,
 * });
 *
 * // ❌ Wrong: Inline functions will cause reconnection on every render
 * useScheduledHoldsRealtime({
 *   currentShift,
 *   onDataChange: () => loadScheduledHolds(),
 *   showToast: (msg, type) => toast({ message: msg, type }),
 * });
 * ```
 *
 * Note: Failing to wrap callbacks in useCallback will cause the subscription
 * to reconnect on every render, leading to excessive WebSocket connections
 * and potential connection limit issues (200 concurrent on Supabase free tier).
 */
export function useScheduledHoldsRealtime({
  currentShift,
  onDataChange,
  showToast,
}: UseScheduledHoldsRealtimeParams) {
  const retryCountRef = useRef(0);
  const retryTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasShownErrorToastRef = useRef(false);
  const isSubscribedRef = useRef(true);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const wasConnectedRef = useRef(false); // Track if we've ever connected
  const lastToastAtRef = useRef<Record<string, number>>({}); // Dedupe toasts
  const MAX_RETRIES = 10;

  /**
   * Shows a toast notification with deduplication to prevent spam.
   * Same message will be suppressed if shown within the debounce window.
   * @param message - Toast message to display
   * @param type - Toast type (error, success, info, etc.)
   * @param debounceMs - Minimum milliseconds between showing same message (default: 10000)
   */
  const showToastOnce = useCallback(
    (message: string, type: ToastType, debounceMs = 10000) => {
      const now = Date.now();
      const lastShown = lastToastAtRef.current[message] || 0;

      if (now - lastShown >= debounceMs) {
        showToast(message, type);
        lastToastAtRef.current[message] = now;
      }
    },
    [showToast]
  );

  useEffect(() => {
    isSubscribedRef.current = true;
    retryCountRef.current = 0;
    hasShownErrorToastRef.current = false;
    wasConnectedRef.current = false; // Reset connection state

    const setupSubscription = async () => {
      if (!isSubscribedRef.current) return null;

      // Ensure any prior channel is gone before creating a new one
      await channelRef.current?.unsubscribe();

      const channel = supabase
        .channel(`scheduled_holds_${currentShift}`)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "scheduled_holds",
            filter: `shift=eq.${currentShift}`,
          },
          (payload) => {
            console.log("🔄 Scheduled holds changed:", payload.eventType);
            onDataChange();
            retryCountRef.current = 0; // Reset retry count on successful message
            hasShownErrorToastRef.current = false; // Reset error toast flag on success
          }
        )
        .subscribe((status, err) => {
          if (status === "SUBSCRIBED") {
            console.log("✅ Real-time subscription active (scheduled_holds)");
            wasConnectedRef.current = true; // Mark that we've successfully connected

            // Check state BEFORE resetting counters so reconnection toast can fire
            const hadFailures =
              retryCountRef.current > 0 || hasShownErrorToastRef.current;

            // Reset after we've remembered the prior state
            retryCountRef.current = 0;
            hasShownErrorToastRef.current = false;

            if (hadFailures) {
              showToastOnce("Real-time updates reconnected", "success");
            }
          } else if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
            // Always retry on genuine errors
            console.warn("⚠️ Real-time subscription error:", status, err);

            // Show user-facing error notification on first failure
            if (!hasShownErrorToastRef.current) {
              showToastOnce(
                "Live updates temporarily unavailable. Calendar will refresh automatically when connection is restored.",
                "error"
              );
              hasShownErrorToastRef.current = true;
            }

            // Retry with exponential backoff
            if (retryCountRef.current < MAX_RETRIES) {
              retryCountRef.current++;
              // Exponential backoff: 1s, 2s, 4s, 8s, 16s, 30s (capped)
              const delay = Math.min(
                1000 * Math.pow(2, retryCountRef.current - 1),
                30000
              );
              console.log(
                `⏳ Retrying connection in ${delay / 1000}s (attempt ${
                  retryCountRef.current
                }/${MAX_RETRIES})`
              );

              if (retryTimeoutRef.current) {
                clearTimeout(retryTimeoutRef.current);
              }

              retryTimeoutRef.current = setTimeout(async () => {
                console.log("🔄 Attempting to reconnect...");
                await channelRef.current?.unsubscribe();
                channelRef.current = await setupSubscription();
              }, delay);
            } else {
              console.error(
                "❌ Max retries reached. Real-time updates disabled. Please refresh the page."
              );
              showToastOnce(
                "Unable to restore live updates. Please refresh the page.",
                "error"
              );
            }
          } else if (status === "CLOSED") {
            // Only retry on CLOSED if we were previously connected (disconnect scenario)
            // Ignore CLOSED during initial connection (normal state transition)
            if (wasConnectedRef.current) {
              console.warn("🔌 Real-time connection closed unexpectedly");

              if (!hasShownErrorToastRef.current) {
                showToastOnce(
                  "Live updates temporarily unavailable. Calendar will refresh automatically when connection is restored.",
                  "error"
                );
                hasShownErrorToastRef.current = true;
              }

              if (retryCountRef.current < MAX_RETRIES) {
                retryCountRef.current++;
                const delay = Math.min(
                  1000 * Math.pow(2, retryCountRef.current - 1),
                  30000
                );
                console.log(
                  `⏳ Retrying connection in ${delay / 1000}s (attempt ${
                    retryCountRef.current
                  }/${MAX_RETRIES})`
                );

                if (retryTimeoutRef.current) {
                  clearTimeout(retryTimeoutRef.current);
                }

                retryTimeoutRef.current = setTimeout(async () => {
                  console.log("🔄 Attempting to reconnect...");
                  await channelRef.current?.unsubscribe();
                  channelRef.current = await setupSubscription();
                }, delay);
              } else {
                console.error(
                  "❌ Max retries reached. Real-time updates disabled. Please refresh the page."
                );
                showToastOnce(
                  "Unable to restore live updates. Please refresh the page.",
                  "error"
                );
              }
            } else {
              // CLOSED during initial connection is normal, just log it
              console.log("🔌 Real-time connection initializing...");
            }
          }
        });

      channelRef.current = channel;
      return channel;
    };

    // Initialize subscription (async but fire-and-forget is OK here)
    setupSubscription();

    // Cleanup on unmount
    return () => {
      isSubscribedRef.current = false;
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
      // Note: unsubscribe in cleanup can remain synchronous - useEffect cleanup
      // cannot be async, and the Promise is safely ignored on unmount
      if (channelRef.current && typeof channelRef.current.unsubscribe === 'function') {
        channelRef.current.unsubscribe();
      }
    };
  }, [currentShift, onDataChange, showToast, showToastOnce]);
}
