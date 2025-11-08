import type { RealtimeChannel } from "@supabase/supabase-js";
import { useCallback, useEffect, useRef } from "react";
import { Shift, supabase } from "../lib/supabase";
import { ToastType } from "./useToast";

interface UseFirefightersRealtimeParams {
  currentShift: Shift;
  onDataChange: () => void;
  showToast: (message: string, type: ToastType) => void;
}

/**
 * Hook for real-time subscriptions to firefighters
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
 * const { loadFirefighters } = useFirefightersData(currentShift);
 * 
 * const showToast = useCallback((message: string, type: ToastType) => {
 *   toast({ message, type });
 * }, []);
 * 
 * useFirefightersRealtime({
 *   currentShift,
 *   onDataChange: loadFirefighters, // Already wrapped in useCallback
 *   showToast,
 * });
 * ```
 *
 * IMPORTANT: Callbacks MUST be memoized with useCallback to prevent subscription
 * recreation on every render, which would cause WebSocket connection churn and
 * hit Supabase's 200 concurrent connection limit on the free tier.
 */
export function useFirefightersRealtime({
  currentShift,
  onDataChange,
  showToast,
}: UseFirefightersRealtimeParams): void {
  const retryCountRef = useRef(0);
  const retryTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const hasShownErrorToastRef = useRef(false);
  const wasConnectedRef = useRef(false);
  const isIntentionalDisconnectRef = useRef(false);
  const lastToastAtRef = useRef<Record<string, number>>({});
  const isSubscribedRef = useRef(true);

  const MAX_RETRIES = 10;

  /**
   * Shows a toast notification with deduplication to prevent spam.
   * Same message will be suppressed if shown within the debounce window.
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

  const setupSubscription = useCallback(async () => {
    if (!isSubscribedRef.current) return null;

    // Ensure any prior channel is gone before creating a new one
    if (channelRef.current) {
      isIntentionalDisconnectRef.current = true;
      await supabase.removeChannel(channelRef.current);
      await new Promise((resolve) => setTimeout(resolve, 100));
      isIntentionalDisconnectRef.current = false;
    }

    // Add extra delay on initial connection to let Supabase real-time initialize
    if (!wasConnectedRef.current) {
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    const channel = supabase
      .channel(`firefighters:${currentShift}`, {
        config: { private: true, broadcast: { self: false, ack: false } },
      })
      .on("broadcast", { event: "*" }, (payload) => {
        console.log("🔄 Firefighters changed:", payload.payload.type);
        onDataChange();
        retryCountRef.current = 0;
        hasShownErrorToastRef.current = false;
      })
      .subscribe((status, err) => {
        if (status === "SUBSCRIBED") {
          console.log("✅ Real-time subscription active (firefighters)");
          wasConnectedRef.current = true;

          const hadFailures =
            retryCountRef.current > 0 || hasShownErrorToastRef.current;

          retryCountRef.current = 0;
          hasShownErrorToastRef.current = false;

          if (hadFailures) {
            showToastOnce("Real-time updates reconnected", "success");
          }
        } else if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
          console.warn("⚠️ Real-time subscription error:", status, err);

          if (!hasShownErrorToastRef.current) {
            showToastOnce(
              "Live updates temporarily unavailable. Roster will refresh automatically when connection is restored.",
              "error"
            );
            hasShownErrorToastRef.current = true;
          }

          if (retryCountRef.current >= MAX_RETRIES) {
            console.error(
              `❌ Max retries (${MAX_RETRIES}) reached. Stopping reconnection attempts.`
            );
            showToastOnce(
              "Unable to establish live updates. Please refresh the page to try again.",
              "error"
            );
            return;
          }

          const delay = Math.min(
            1000 * Math.pow(2, retryCountRef.current),
            30000
          );
          retryCountRef.current++;

          console.log(
            `🔄 Retrying in ${delay / 1000}s... (attempt ${
              retryCountRef.current
            }/${MAX_RETRIES})`
          );

          retryTimeoutRef.current = setTimeout(async () => {
            if (isSubscribedRef.current) {
              if (channelRef.current) {
                await supabase.removeChannel(channelRef.current);
              }
              channelRef.current = await setupSubscription();
            }
          }, delay);
        } else if (status === "CLOSED") {
          if (wasConnectedRef.current && !isIntentionalDisconnectRef.current) {
            console.warn("🔌 Real-time connection closed unexpectedly");

            if (!hasShownErrorToastRef.current) {
              showToastOnce(
                "Live updates temporarily unavailable. Roster will refresh automatically when connection is restored.",
                "error"
              );
              hasShownErrorToastRef.current = true;
            }

            if (retryCountRef.current < MAX_RETRIES) {
              const delay = Math.min(
                1000 * Math.pow(2, retryCountRef.current),
                30000
              );
              retryCountRef.current++;

              console.log(
                `🔄 Retrying in ${delay / 1000}s... (attempt ${
                  retryCountRef.current
                }/${MAX_RETRIES})`
              );

              retryTimeoutRef.current = setTimeout(async () => {
                if (isSubscribedRef.current) {
                  if (channelRef.current) {
                    await supabase.removeChannel(channelRef.current);
                  }
                  channelRef.current = await setupSubscription();
                }
              }, delay);
            } else {
              console.error(
                `❌ Max retries (${MAX_RETRIES}) reached. Stopping reconnection attempts.`
              );
              showToastOnce(
                "Unable to establish live updates. Please refresh the page to try again.",
                "error"
              );
            }
          } else if (isIntentionalDisconnectRef.current) {
            console.log("🔌 Real-time connection closed (intentional)");
          } else {
            console.log("🔌 Real-time connection initializing...");
          }
        }
      });

    channelRef.current = channel;
    return channel;
  }, [currentShift, onDataChange, showToastOnce]);

  useEffect(() => {
    isSubscribedRef.current = true;
    setupSubscription();

    return () => {
      isSubscribedRef.current = false;
      isIntentionalDisconnectRef.current = true;
      if (retryTimeoutRef.current) clearTimeout(retryTimeoutRef.current);
      if (channelRef.current) supabase.removeChannel(channelRef.current);
      console.log("🛑 Unsubscribed from firefighters real-time updates");
    };
  }, [setupSubscription]);
}
