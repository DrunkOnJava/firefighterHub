// TECHNICAL DEBT: This hook is doing too much - violates Single Responsibility Principle
// Consider splitting into: useFirefightersData, useFirefighterMutations, useFirefighterRealtimeSync
// Currently 465 lines handling: data fetching, mutations, optimistic updates, logging, and real-time sync

import { useCallback, useEffect, useState } from "react";
import { Firefighter, HoldDuration, Shift, supabase } from "../lib/supabase";
import { assignPositions, sortFirefighters } from "../utils/rotationLogic";
import { ConfirmOptions } from "./useConfirm";
import { useOperationLoading } from "./useOperationLoading";
import { ToastType } from "./useToast";

export function useFirefighters(
  showToast: (message: string, type: ToastType) => void,
  currentShift: Shift,
  confirmAction?: (options: ConfirmOptions) => Promise<boolean>
) {
  const [firefighters, setFirefighters] = useState<Firefighter[]>([]);
  const [deactivatedFirefighters, setDeactivatedFirefighters] = useState<
    Firefighter[]
  >([]);
  const [loading, setLoading] = useState(true);
  const {
    startLoading,
    stopLoading,
    isLoading: isOperationLoading,
    loadingStates,
  } = useOperationLoading();

  const loadFirefighters = useCallback(async () => {
    try {
      const { data: activeData, error: activeError } = await supabase
        .from("firefighters")
        .select("*")
        .eq("shift", currentShift)
        .eq("is_active", true)
        .order("order_position");

      if (activeError) throw activeError;

      // ✅ FIX: Use sortFirefighters instead of recalculatePositions
      // recalculatePositions was overwriting positions set by markHoldCompleted
      // We trust the database positions, just need to sort for display
      const sorted = sortFirefighters(activeData || []);
      setFirefighters(sorted);

      const { data: deactivatedData, error: deactivatedError } = await supabase
        .from("firefighters")
        .select("*")
        .eq("shift", currentShift)
        .eq("is_active", false)
        .order("name");

      if (deactivatedError) throw deactivatedError;
      setDeactivatedFirefighters(deactivatedData || []);
    } catch (error) {
      console.error("Error loading firefighters:", error);
      showToast(
        "Could not load firefighters. Check your connection and refresh.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  }, [currentShift, showToast]);

  useEffect(() => {
    loadFirefighters();

    /**
     * Real-time subscription with error handling and auto-reconnect
     *
     * Features:
     * - Exponential backoff retry (1s → 2s → 4s → 8s → 16s → 30s max)
     * - Automatic reconnection on connection loss
     * - Toast deduplication to prevent notification spam
     * - Clean channel cleanup on unmount
     * - Max 10 retry attempts before giving up
     *
     * IMPORTANT: This useEffect depends on `loadFirefighters` and `showToast`.
     * Both callbacks MUST be wrapped in useCallback to prevent unnecessary
     * resubscriptions and WebSocket connection churn.
     *
     * Example of proper usage in parent component:
     * ```typescript
     * const loadFirefighters = useCallback(async () => {
     *   // fetch logic
     * }, [currentShift]);
     *
     * const showToast = useCallback((message: string, type: ToastType) => {
     *   toast({ message, type });
     * }, []);
     * ```
     *
     * Without useCallback wrapping, this subscription will reconnect on every
     * render, causing excessive WebSocket connections and potential connection
     * limit issues (200 concurrent on Supabase free tier).
     */
    let retryCount = 0;
    let retryTimeout: ReturnType<typeof setTimeout> | null = null;
    let isSubscribed = true;
    let hasShownErrorToast = false;
    let wasConnected = false; // Track if we've ever connected
    let currentChannel: ReturnType<typeof supabase.channel> | null = null;
    const MAX_RETRIES = 10; // Maximum retry attempts before giving up
    const lastToastAt: Record<string, number> = {}; // Dedupe toasts

    /**
     * Shows a toast notification with deduplication to prevent spam.
     * Same message will be suppressed if shown within the debounce window.
     */
    const showToastOnce = (
      message: string,
      type: ToastType,
      debounceMs = 10000
    ) => {
      const now = Date.now();
      const lastShown = lastToastAt[message] || 0;

      if (now - lastShown >= debounceMs) {
        showToast(message, type);
        lastToastAt[message] = now;
      }
    };

    const setupSubscription = async () => {
      if (!isSubscribed) return null;

      // Ensure any prior channel is gone before creating a new one
      if (currentChannel) {
        await supabase.removeChannel(currentChannel);
      }

      const channel = supabase
        .channel(`firefighters_${currentShift}`)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "firefighters",
            filter: `shift=eq.${currentShift}`,
          },
          (payload) => {
            console.log("🔄 Firefighters changed:", payload.eventType);
            loadFirefighters();
            retryCount = 0; // Reset retry count on successful message
            hasShownErrorToast = false; // Reset error toast flag on success
          }
        )
        .subscribe((status, err) => {
          if (status === "SUBSCRIBED") {
            console.log("✅ Real-time subscription active (firefighters)");
            wasConnected = true; // Mark that we've successfully connected

            // Check state BEFORE resetting counters so reconnection toast can fire
            const hadFailures = retryCount > 0 || hasShownErrorToast;

            // Reset after we've remembered the prior state
            retryCount = 0;
            hasShownErrorToast = false;

            if (hadFailures) {
              showToastOnce("Real-time updates reconnected", "success");
            }
          } else if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
            // Always retry on genuine errors
            console.warn("⚠️ Real-time subscription error:", status, err);

            // Show user-facing error notification on first failure
            if (!hasShownErrorToast) {
              showToastOnce(
                "Live updates temporarily unavailable. Roster will refresh automatically when connection is restored.",
                "error"
              );
              hasShownErrorToast = true;
            }

            // Check if we've exceeded maximum retries
            if (retryCount >= MAX_RETRIES) {
              console.error(
                `❌ Max retries (${MAX_RETRIES}) reached. Stopping reconnection attempts.`
              );
              showToastOnce(
                "Unable to establish live updates. Please refresh the page to try again.",
                "error"
              );
              return;
            }

            // Exponential backoff: 1s, 2s, 4s, 8s, 16s, 30s (max)
            const delay = Math.min(1000 * Math.pow(2, retryCount), 30000);
            retryCount++;

            console.log(
              `🔄 Retrying in ${
                delay / 1000
              }s... (attempt ${retryCount}/${MAX_RETRIES})`
            );

            retryTimeout = setTimeout(async () => {
              if (isSubscribed) {
                if (currentChannel) {
                  await supabase.removeChannel(currentChannel);
                }
                currentChannel = await setupSubscription();
              }
            }, delay);
          } else if (status === "CLOSED") {
            // Only retry on CLOSED if we were previously connected (disconnect scenario)
            // Ignore CLOSED during initial connection (normal state transition)
            if (wasConnected) {
              console.warn("🔌 Real-time connection closed unexpectedly");

              if (!hasShownErrorToast) {
                showToastOnce(
                  "Live updates temporarily unavailable. Roster will refresh automatically when connection is restored.",
                  "error"
                );
                hasShownErrorToast = true;
              }

              if (retryCount < MAX_RETRIES) {
                const delay = Math.min(1000 * Math.pow(2, retryCount), 30000);
                retryCount++;

                console.log(
                  `🔄 Retrying in ${
                    delay / 1000
                  }s... (attempt ${retryCount}/${MAX_RETRIES})`
                );

                retryTimeout = setTimeout(async () => {
                  if (isSubscribed) {
                    if (currentChannel) {
                      await supabase.removeChannel(currentChannel);
                    }
                    currentChannel = await setupSubscription();
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
            } else {
              // CLOSED during initial connection is normal, just log it
              console.log("🔌 Real-time connection initializing...");
            }
          }
        });

      currentChannel = channel;
      return channel;
    };

    // Initialize subscription (async but fire-and-forget is OK here)
    setupSubscription();

    return () => {
      isSubscribed = false;
      if (retryTimeout) clearTimeout(retryTimeout);
      // Note: removeChannel in cleanup can remain synchronous - useEffect cleanup
      // cannot be async, and the Promise is safely ignored on unmount
      if (currentChannel) supabase.removeChannel(currentChannel);
      console.log("🛑 Unsubscribed from firefighters real-time updates");
    };
  }, [loadFirefighters, currentShift, showToast]);

  async function logActivity(
    firefighterName: string,
    actionType: string,
    details?: string,
    firefighterId?: string
  ) {
    try {
      await supabase.from("activity_log").insert({
        firefighter_id: firefighterId,
        firefighter_name: firefighterName,
        action_type: actionType,
        description: details || actionType, // description is required, use details or actionType as fallback
        details: details || null,
        shift: currentShift,
      });
    } catch (error) {
      console.error("Error logging activity:", error);
    }
  }

  async function addFirefighter(
    name: string,
    fireStation: string,
    certificationLevel?: string | null,
    apparatusClearances?: {
      ambulance?: boolean;
      brushTruck?: boolean;
      engine?: boolean;
      tanker?: boolean;
      truck?: boolean;
      boat?: boolean;
      utv?: boolean;
      rescueSquad?: boolean;
    },
    certifications?: {
      isFTO?: boolean;
      isBLS?: boolean;
      isALS?: boolean;
    }
  ) {
    startLoading("add");
    const available = firefighters.filter((ff) => ff.is_available);
    const maxPosition =
      available.length > 0
        ? Math.max(...available.map((ff) => ff.order_position))
        : -1;

    const tempId = `temp-${Date.now()}`;
    const optimisticFirefighter: Firefighter = {
      id: tempId,
      name,
      fire_station: fireStation || null,
      order_position: maxPosition + 1,
      is_available: true,
      is_active: true,
      shift: currentShift,
      last_hold_date: null,
      certification_level: certificationLevel || null,
      apparatus_ambulance: apparatusClearances?.ambulance || false,
      apparatus_brush_truck: apparatusClearances?.brushTruck || false,
      apparatus_engine: apparatusClearances?.engine || false,
      apparatus_tanker: apparatusClearances?.tanker || false,
      apparatus_truck: apparatusClearances?.truck || false,
      apparatus_boat: apparatusClearances?.boat || false,
      apparatus_utv: apparatusClearances?.utv || false,
      apparatus_rescue_squad: apparatusClearances?.rescueSquad || false,
      is_fto: certifications?.isFTO || false,
      is_bls: certifications?.isBLS || false,
      is_als: certifications?.isALS || false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setFirefighters((prev) => [...prev, optimisticFirefighter]);

    try {
      const { data, error } = await supabase
        .from("firefighters")
        .insert({
          name,
          fire_station: fireStation || null,
          order_position: maxPosition + 1,
          is_available: true,
          is_active: true,
          shift: currentShift,
          certification_level: certificationLevel || null,
          apparatus_ambulance: apparatusClearances?.ambulance || false,
          apparatus_brush_truck: apparatusClearances?.brushTruck || false,
          apparatus_engine: apparatusClearances?.engine || false,
          apparatus_tanker: apparatusClearances?.tanker || false,
          apparatus_truck: apparatusClearances?.truck || false,
          apparatus_boat: apparatusClearances?.boat || false,
          apparatus_utv: apparatusClearances?.utv || false,
          apparatus_rescue_squad: apparatusClearances?.rescueSquad || false,
          is_fto: certifications?.isFTO || false,
          is_bls: certifications?.isBLS || false,
          is_als: certifications?.isALS || false,
        })
        .select()
        .maybeSingle();

      if (error) throw error;
      if (data) {
        setFirefighters((prev) =>
          prev.map((ff) => (ff.id === tempId ? data : ff))
        );
        const position = (data.order_position || 0) + 1;
        showToast(
          `${name} joined the rotation at position ${position}`,
          "success"
        );
        await logActivity(name, "added", "Added to hold list", data.id);
      }
    } catch (error) {
      console.error("Error adding firefighter:", error);
      setFirefighters((prev) => prev.filter((ff) => ff.id !== tempId));
      showToast("Could not add team member. Please try again.", "error");
    } finally {
      stopLoading("add");
    }
  }

  async function completeHold(
    id: string,
    holdDate: string,
    newPosition: number,
    station?: string,
    lentToShift?: Shift | null,
    duration: HoldDuration = "24h",
    startTime: string = "07:00"
  ) {
    const firefighter = firefighters.find((ff) => ff.id === id);
    if (!firefighter || !firefighter.is_available) return;

    const previousFirefighters = [...firefighters];

    // Move firefighter to specified position (1-indexed from user, convert to 0-indexed)
    const targetPosition = newPosition - 1;

    // Remove the firefighter from current position
    const withoutFirefighter = firefighters.filter((ff) => ff.id !== id);

    // Insert at target position
    const updatedFirefighters = [
      ...withoutFirefighter.slice(0, targetPosition),
      { ...firefighter, last_hold_date: holdDate },
      ...withoutFirefighter.slice(targetPosition),
    ];

    // Assign positions based on array order (don't use recalculatePositions which sorts!)
    const normalized = assignPositions(updatedFirefighters);
    setFirefighters(normalized);

    try {
      for (const ff of normalized) {
        const updates: { order_position: number; last_hold_date?: string } = {
          order_position: ff.order_position,
        };
        if (ff.id === id) {
          updates.last_hold_date = holdDate;
        }

        const { error } = await supabase
          .from("firefighters")
          .update(updates)
          .eq("id", ff.id);

        if (error) throw error;
      }

      const stationToUse = station || firefighter.fire_station || null;
      const { error: insertError } = await supabase
        .from("scheduled_holds")
        .insert({
          firefighter_id: id,
          firefighter_name: firefighter.name,
          scheduled_date: holdDate, // Required field (legacy)
          hold_date: holdDate, // Newer field for consistency
          fire_station: stationToUse,
          status: "completed",
          completed_at: new Date().toISOString(),
          shift: currentShift,
          lent_to_shift: lentToShift || null,
          duration: duration,
          start_time: startTime,
        });

      if (insertError) {
        console.error("Error inserting scheduled hold:", insertError);
      }

      const date = new Date(holdDate);
      const formattedDate = date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      const stationMsg = stationToUse ? ` at Station #${stationToUse}` : "";
      const positionMsg =
        newPosition === firefighters.length
          ? "moved to the end of the line"
          : `moved to position ${newPosition}`;
      showToast(
        `${firefighter.name} finished their hold${stationMsg} for ${formattedDate} and ${positionMsg}`,
        "success"
      );
      await logActivity(
        firefighter.name,
        "completed_hold",
        `Completed hold and moved to position ${newPosition}`,
        id
      );
    } catch (error) {
      console.error("Error completing hold:", error);
      setFirefighters(previousFirefighters);
      showToast("Could not complete hold. Please try again.", "error");
    }
  }

  async function deleteFirefighter(id: string) {
    const firefighter = firefighters.find((ff) => ff.id === id);
    if (!firefighter) return;

    // Use confirmAction if provided, otherwise fall back to window.confirm
    const confirmed = confirmAction
      ? await confirmAction({
          title: "Remove Firefighter?",
          message: `Remove ${firefighter.name} from your roster?`,
          confirmText: "Remove",
          cancelText: "Cancel",
          variant: "danger",
          consequences: [
            "Their hold history will be preserved on the calendar",
            "This action cannot be undone",
          ],
        })
      : confirm(
          `Remove ${firefighter.name} from your roster?\n\nTheir hold history will be preserved on the calendar. This cannot be undone.`
        );

    if (!confirmed) return;

    const previousFirefighters = [...firefighters];
    setFirefighters((prev) => prev.filter((ff) => ff.id !== id));

    try {
      // Delete firefighter - their holds remain in database with firefighter_name
      // The holds will still show on calendar since firefighter_name is denormalized
      const { error } = await supabase
        .from("firefighters")
        .delete()
        .eq("id", id);

      if (error) throw error;

      showToast(
        `${firefighter.name} removed - hold history preserved`,
        "success"
      );
      await logActivity(
        firefighter.name,
        "removed",
        "Removed from rotation (hold history preserved)"
      );
    } catch (error) {
      console.error("Error deleting firefighter:", error);
      setFirefighters(previousFirefighters);
      showToast("Could not remove team member. Please try again.", "error");
    }
  }

  async function resetAll() {
    const confirmed = confirmAction
      ? await confirmAction({
          title: "Delete Entire Roster?",
          message:
            "This will remove all firefighters and cancel all scheduled holds.",
          confirmText: "Delete Roster",
          cancelText: "Cancel",
          variant: "danger",
          consequences: [
            "All firefighters will be removed",
            "All scheduled holds will be cancelled",
            "This action is permanent",
          ],
        })
      : confirm(
          "Delete your entire roster?\n\nThis will remove all firefighters and cancel all scheduled holds. This action is permanent."
        );

    if (!confirmed) return;

    try {
      const { error } = await supabase
        .from("firefighters")
        .delete()
        .neq("id", "00000000-0000-0000-0000-000000000000");

      if (error) throw error;
      showToast("All team members removed from roster", "info");
    } catch (error) {
      console.error("Error resetting firefighters:", error);
      showToast("Could not reset roster. Please try again.", "error");
    }
  }

  async function masterReset() {
    const firstConfirmed = confirmAction
      ? await confirmAction({
          title: "MASTER RESET - WARNING",
          message: "This will permanently delete ALL data from ALL shifts!",
          confirmText: "Continue",
          cancelText: "Cancel",
          variant: "danger",
          consequences: [
            "ALL firefighters from ALL shifts",
            "ALL scheduled holds",
            "ALL activity logs",
            "ALL completed holds",
            "This action CANNOT be undone!",
          ],
        })
      : confirm(
          "MASTER RESET - WARNING\n\nThis will permanently delete:\n• ALL firefighters from ALL shifts\n• ALL scheduled holds\n• ALL activity logs\n• ALL completed holds\n\nThis action CANNOT be undone!\n\nAre you absolutely sure?"
        );

    if (!firstConfirmed) return;

    const finalConfirmed = confirmAction
      ? await confirmAction({
          title: "Final Confirmation",
          message: "Delete EVERYTHING and start fresh?",
          confirmText: "Delete Everything",
          cancelText: "Cancel",
          variant: "danger",
          consequences: [
            "This is your last chance to cancel",
            "All data will be permanently deleted",
          ],
        })
      : confirm("Final confirmation: Delete EVERYTHING and start fresh?");

    if (!finalConfirmed) return;

    const previousFirefighters = [...firefighters];
    setFirefighters([]);

    try {
      const { error: firefightersError } = await supabase
        .from("firefighters")
        .delete()
        .neq("id", "00000000-0000-0000-0000-000000000000");

      if (firefightersError) throw firefightersError;

      const { error: holdsError } = await supabase
        .from("scheduled_holds")
        .delete()
        .neq("id", "00000000-0000-0000-0000-000000000000");

      if (holdsError) throw holdsError;

      const { error: activityError } = await supabase
        .from("activity_log")
        .delete()
        .neq("id", "00000000-0000-0000-0000-000000000000");

      if (activityError) throw activityError;

      showToast("System reset complete. Starting fresh!", "success");
    } catch (error) {
      console.error("Error performing master reset:", error);
      setFirefighters(previousFirefighters);
      showToast("Master reset failed. Please try again.", "error");
    }
  }

  async function reorderFirefighters(reorderedFirefighters: Firefighter[]) {
    const previousFirefighters = [...firefighters];

    try {
      const updatedWithPositions = assignPositions(reorderedFirefighters);
      setFirefighters(updatedWithPositions);

      for (const ff of updatedWithPositions) {
        const { error } = await supabase
          .from("firefighters")
          .update({ order_position: ff.order_position })
          .eq("id", ff.id);

        if (error) throw error;
      }

      await logActivity("System", `Roster order updated manually`);
    } catch (error) {
      console.error("Error reordering firefighters:", error);
      setFirefighters(previousFirefighters);
      showToast("Could not update order. Please try again.", "error");
    }
  }

  async function deactivateFirefighter(id: string) {
    const firefighter = firefighters.find((ff) => ff.id === id);
    if (!firefighter) return;

    const confirmed = confirmAction
      ? await confirmAction({
          title: "Deactivate Firefighter?",
          message: `Deactivate ${firefighter.name}?`,
          confirmText: "Deactivate",
          cancelText: "Cancel",
          variant: "warning",
          consequences: [
            "They will be removed from the roster",
            "All their history and completed holds will be preserved",
            "They can be reactivated later",
          ],
        })
      : confirm(
          `Deactivate ${firefighter.name}?\n\nThey will be removed from the roster but all their history and completed holds will be preserved.`
        );

    if (!confirmed) return;

    const previousFirefighters = [...firefighters];
    setFirefighters((prev) => prev.filter((ff) => ff.id !== id));

    try {
      const { error } = await supabase
        .from("firefighters")
        .update({ is_active: false })
        .eq("id", id);

      if (error) throw error;

      showToast(`${firefighter.name} deactivated`, "success");
      await logActivity(
        firefighter.name,
        "deactivated",
        "Deactivated from roster (history preserved)",
        id
      );
    } catch (error) {
      console.error("Error deactivating firefighter:", error);
      setFirefighters(previousFirefighters);
      showToast("Could not deactivate. Please try again.", "error");
    }
  }

  async function transferShift(id: string, newShift: Shift) {
    const firefighter = firefighters.find((ff) => ff.id === id);
    if (!firefighter) return;

    const previousFirefighters = [...firefighters];
    setFirefighters((prev) => prev.filter((ff) => ff.id !== id));

    try {
      // Get all firefighters in the new shift to find last position
      const { data: newShiftFFs, error: fetchError } = await supabase
        .from("firefighters")
        .select("*")
        .eq("shift", newShift)
        .eq("is_active", true)
        .order("order_position", { ascending: false });

      if (fetchError) throw fetchError;

      // Place at last position in new shift
      const lastPosition =
        newShiftFFs && newShiftFFs.length > 0
          ? newShiftFFs[0].order_position + 1
          : 0;

      const { error } = await supabase
        .from("firefighters")
        .update({
          shift: newShift,
          order_position: lastPosition,
          last_hold_date: null, // Reset hold date when transferring
        })
        .eq("id", id);

      if (error) throw error;

      showToast(
        `${firefighter.name} transferred to Shift ${newShift} at last position`,
        "success"
      );
      await logActivity(
        firefighter.name,
        "shift_transfer",
        `Transferred from Shift ${firefighter.shift} to Shift ${newShift} (placed at end)`,
        id
      );
    } catch (error) {
      console.error("Error transferring shift:", error);
      setFirefighters(previousFirefighters);
      showToast("Could not transfer shift. Please try again.", "error");
    }
  }

  async function reactivateFirefighter(id: string, _position: number) {
    void _position; // Legacy parameter maintained for API compatibility
    const firefighter = deactivatedFirefighters.find((ff) => ff.id === id);
    if (!firefighter) return;

    const previousFirefighters = [...firefighters];
    const previousDeactivated = [...deactivatedFirefighters];

    try {
      // Always place at position 0 (top of rotation)
      const updatedList = [
        { ...firefighter, is_active: true, is_available: true },
        ...firefighters,
      ];
      const reordered = assignPositions(updatedList);
      setFirefighters(reordered);
      setDeactivatedFirefighters((prev) => prev.filter((ff) => ff.id !== id));

      for (const ff of reordered) {
        const { error } = await supabase
          .from("firefighters")
          .update({
            order_position: ff.order_position,
            is_active: ff.id === id ? true : ff.is_active,
            is_available: ff.id === id ? true : ff.is_available,
          })
          .eq("id", ff.id);

        if (error) throw error;
      }

      showToast(`${firefighter.name} reactivated at position 1`, "success");
      await logActivity(
        firefighter.name,
        "reactivated",
        "Reactivated and placed at position 1",
        id
      );
    } catch (error) {
      console.error("Error reactivating firefighter:", error);
      setFirefighters(previousFirefighters);
      setDeactivatedFirefighters(previousDeactivated);
      showToast("Could not reactivate. Please try again.", "error");
    }
  }

  return {
    firefighters,
    deactivatedFirefighters,
    loading,
    addFirefighter,
    completeHold,
    deleteFirefighter,
    deactivateFirefighter,
    reactivateFirefighter,
    transferShift,
    resetAll,
    masterReset,
    reorderFirefighters,
    isOperationLoading,
    loadingStates,
  };
}
