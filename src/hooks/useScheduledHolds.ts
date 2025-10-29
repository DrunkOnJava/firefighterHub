// TECHNICAL DEBT: Similar to useFirefighters, this hook is large (224 lines) and handles multiple concerns
// Consider splitting data fetching, mutations, and real-time sync into separate hooks

import { useEffect, useState, useCallback } from "react";
import { supabase, Firefighter, Shift, HoldDuration } from "../lib/supabase";
import { ScheduledHold } from "../utils/calendarUtils";
import { ToastType } from "./useToast";
import { moveToBottom } from "../utils/rotationLogic";
// recalculatePositions removed - not needed after fixing rotation bug
// validate72HourRule removed - hours worked tracking removed per user feedback

export function useScheduledHolds(
  showToast: (message: string, type: ToastType) => void,
  currentShift: Shift
) {
  const [scheduledHolds, setScheduledHolds] = useState<ScheduledHold[]>([]);
  const [loading, setLoading] = useState(true);

  const loadScheduledHolds = useCallback(async () => {
    try {
      setLoading(true);
      const today = new Date();
      const startOfMonth = new Date(
        today.getFullYear(),
        today.getMonth() - 1,
        1
      );
      const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 3, 0);

      const startStr = startOfMonth.toISOString().split("T")[0];
      const endStr = endOfMonth.toISOString().split("T")[0];

      const { data, error } = await supabase
        .from("scheduled_holds")
        .select("*")
        .eq("shift", currentShift)
        .gte("hold_date", startStr)
        .lte("hold_date", endStr)
        .order("hold_date");

      if (error) throw error;
      setScheduledHolds(data || []);
    } catch (error) {
      console.error("Error loading scheduled holds:", error);
      showToast(
        "Could not load scheduled holds. Check your connection and refresh.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  }, [currentShift, showToast]);

  useEffect(() => {
    loadScheduledHolds();

    // Real-time subscription with error handling and auto-reconnect
    let retryCount = 0;
    let retryTimeout: ReturnType<typeof setTimeout> | null = null;
    let isSubscribed = true;

    const setupSubscription = () => {
      if (!isSubscribed) return;

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
            loadScheduledHolds();
            retryCount = 0; // Reset retry count on successful message
          }
        )
        .subscribe((status, err) => {
          if (status === "SUBSCRIBED") {
            console.log("✅ Real-time subscription active (scheduled_holds)");
            retryCount = 0;
          } else if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
            console.warn("⚠️ Real-time subscription error:", status, err);

            // Exponential backoff: 1s, 2s, 4s, 8s, 16s, 30s (max)
            const delay = Math.min(1000 * Math.pow(2, retryCount), 30000);
            retryCount++;

            console.log(
              `🔄 Retrying in ${delay / 1000}s... (attempt ${retryCount})`
            );

            retryTimeout = setTimeout(() => {
              if (isSubscribed) {
                supabase.removeChannel(channel);
                setupSubscription();
              }
            }, delay);
          } else if (status === "CLOSED") {
            console.log("🔌 Real-time connection closed");
            if (isSubscribed && retryCount < 10) {
              retryTimeout = setTimeout(() => setupSubscription(), 2000);
            }
          }
        });

      return channel;
    };

    const channel = setupSubscription();

    return () => {
      isSubscribed = false;
      if (retryTimeout) clearTimeout(retryTimeout);
      if (channel) supabase.removeChannel(channel);
      console.log("🛑 Unsubscribed from scheduled_holds real-time updates");
    };
  }, [loadScheduledHolds, currentShift]);

  async function removeScheduledHold(holdId: string) {
    const previousHolds = [...scheduledHolds];
    const hold = scheduledHolds.find((h) => h.id === holdId);
    if (!hold) return;

    setScheduledHolds((prev) => prev.filter((h) => h.id !== holdId));

    try {
      // Delete the hold entirely
      const { error } = await supabase
        .from("scheduled_holds")
        .delete()
        .eq("id", holdId);

      if (error) throw error;

      // If this was a completed hold, reset the firefighter to top of rotation
      if (hold.status === "completed" && hold.firefighter_id) {
        const { data: firefighterData } = await supabase
          .from("firefighters")
          .select("*")
          .eq("id", hold.firefighter_id)
          .single();

        if (firefighterData) {
          const { data: allShiftFFs } = await supabase
            .from("firefighters")
            .select("*")
            .eq("shift", firefighterData.shift)
            .eq("is_active", true)
            .order("order_position");

          if (allShiftFFs) {
            // Move this firefighter to position 0, shift others down
            const reordered = allShiftFFs.filter(
              (ff) => ff.id !== hold.firefighter_id
            );
            reordered.unshift(firefighterData);

            // Update all positions
            for (let i = 0; i < reordered.length; i++) {
              await supabase
                .from("firefighters")
                .update({
                  order_position: i,
                  last_hold_date:
                    reordered[i].id === hold.firefighter_id
                      ? null
                      : reordered[i].last_hold_date,
                })
                .eq("id", reordered[i].id);
            }
          }
        }
        showToast(
          `Hold canceled - ${hold.firefighter_name} moved to top of rotation`,
          "success"
        );
      } else {
        showToast(`Hold canceled for ${hold.firefighter_name}`, "success");
      }
    } catch (error) {
      console.error("Error removing hold:", error);
      setScheduledHolds(previousHolds);
      showToast("Could not remove hold. Please try again.", "error");
    }
  }

  async function scheduleHold(
    holdDate: string,
    firefighter: Firefighter,
    station?: string,
    duration: HoldDuration = '24h',
    startTime: string = '07:00'
  ) {
    // REMOVED: 72-hour rule validation - hours worked tracking removed per user feedback
    // User stated: "There is no way to accurately calculate that without manually
    // checking through the scheduling program"

    const stationToUse = station || firefighter.fire_station || null;
    const tempId = `temp-${Date.now()}`;

    const optimisticHold: ScheduledHold = {
      id: tempId,
      firefighter_id: firefighter.id,
      firefighter_name: firefighter.name,
      hold_date: holdDate,
      fire_station: stationToUse,
      status: "scheduled",
      shift: currentShift,
      lent_to_shift: null, // Default to null, can be set later
      notes: null,
      duration: duration,
      start_time: startTime,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      completed_at: null,
    };

    setScheduledHolds((prev) => [...prev, optimisticHold]);

    try {
      const { data, error } = await supabase
        .from("scheduled_holds")
        .insert({
          firefighter_id: firefighter.id,
          firefighter_name: firefighter.name,
          hold_date: holdDate,
          fire_station: stationToUse,
          status: "scheduled",
          shift: currentShift,
          duration: duration,
          start_time: startTime,
        })
        .select()
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setScheduledHolds((prev) =>
          prev.map((h) => (h.id === tempId ? data : h))
        );
      }

      const date = new Date(holdDate);
      const formattedDate = date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      const stationMsg = stationToUse ? ` at Station #${stationToUse}` : "";
      showToast(
        `Hold assigned to ${firefighter.name}${stationMsg} for ${formattedDate}`,
        "success"
      );
    } catch (error: unknown) {
      console.error("Error scheduling hold:", error);
      setScheduledHolds((prev) => prev.filter((h) => h.id !== tempId));

      const err = error as { code?: string };
      if (err?.code === "23505") {
        showToast(
          "This date is already taken. Choose another date or reassign the existing hold.",
          "error"
        );
      } else {
        showToast("Could not schedule hold. Please try again.", "error");
      }
    }
  }

  async function markHoldCompleted(hold: ScheduledHold) {
    const previousHolds = [...scheduledHolds];
    setScheduledHolds((prev) =>
      prev.map((h) =>
        h.id === hold.id
          ? {
              ...h,
              status: "completed" as const,
              completed_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            }
          : h
      )
    );

    try {
      const { error: holdError } = await supabase
        .from("scheduled_holds")
        .update({
          status: "completed",
          completed_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", hold.id);

      if (holdError) throw holdError;

      const { data: allFirefighters, error: fetchError } = await supabase
        .from("firefighters")
        .select("*")
        .eq("shift", currentShift)
        .order("order_position");

      if (fetchError) throw fetchError;

      if (allFirefighters) {
        // ✅ FIX: Properly move firefighter to bottom without re-sorting
        // Step 1: Separate the completed firefighter from the rest
        const completedFF = allFirefighters.find(ff => ff.id === hold.firefighter_id);
        const otherFFs = allFirefighters.filter(ff => ff.id !== hold.firefighter_id && ff.is_available);
        const unavailableFFs = allFirefighters.filter(ff => ff.id !== hold.firefighter_id && !ff.is_available);

        if (!completedFF) {
          throw new Error('Firefighter not found');
        }

        // Step 2: Reassign positions - completed FF goes to the end
        const updatedCompletedFF = {
          ...completedFF,
          last_hold_date: hold.hold_date,
          order_position: otherFFs.length  // Last position among available
        };

        // Step 3: Reassign sequential positions to other available firefighters
        const reorderedOthers = otherFFs.map((ff, index) => ({
          ...ff,
          order_position: index
        }));

        // Step 4: Combine: others first, then completed FF, then unavailable
        const updatedFirefighters = [
          ...reorderedOthers,
          updatedCompletedFF,
          ...unavailableFFs.map((ff, index) => ({
            ...ff,
            order_position: otherFFs.length + 1 + index
          }))
        ];

        for (const ff of updatedFirefighters) {
          const updates: {
            order_position: number;
            last_hold_date?: string;
            updated_at?: string;
          } = { order_position: ff.order_position };

          if (ff.id === hold.firefighter_id) {
            // ✅ FIX: Ensure date format is consistent (YYYY-MM-DD only, no time)
            updates.last_hold_date = hold.hold_date.split('T')[0];
            updates.updated_at = new Date().toISOString();

            console.log('✅ Updating firefighter after hold completion:', {
              name: ff.name,
              holdDate: hold.hold_date,
              lastHoldDate: updates.last_hold_date,
              newPosition: updates.order_position,
            });
          }

          const { error: updateError } = await supabase
            .from("firefighters")
            .update(updates)
            .eq("id", ff.id);

          if (updateError) {
            console.error("❌ Error updating firefighter:", updateError);
            throw updateError;  // ✅ FIX: Throw error instead of silently continuing
          }
        }
      }

      showToast(
        `${hold.firefighter_name}'s hold completed and moved to end of rotation`,
        "success"
      );
    } catch (error) {
      console.error("Error marking hold completed:", error);
      setScheduledHolds(previousHolds);
      showToast("Could not mark hold as completed. Please try again.", "error");
    }
  }

  return {
    scheduledHolds,
    loading,
    scheduleHold,
    removeScheduledHold,
    markHoldCompleted,
  };
}
