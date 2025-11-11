import { useCallback } from "react";
import { ScheduledHold, Shift, supabase } from "../lib/supabase";

interface UseScheduledHoldsMutationsParams {
  currentShift: Shift;
  onSuccess?: () => void;
}

interface UseScheduledHoldsMutationsReturn {
  addScheduledHold: (
    firefighterId: string,
    firefighterName: string,
    holdDate: Date,
    fireStation: string,
    duration?: string,
    startTime?: string
  ) => Promise<void>;
  updateScheduledHold: (
    id: string,
    updates: Partial<ScheduledHold>
  ) => Promise<void>;
  deleteScheduledHold: (id: string) => Promise<void>;
  completeScheduledHold: (id: string) => Promise<void>;
  skipScheduledHold: (id: string) => Promise<void>;
}

/**
 * Hook for scheduled holds mutations (CUD operations)
 * Separated from data fetching for better code organization (SRP)
 */
export function useScheduledHoldsMutations({
  currentShift,
  onSuccess,
}: UseScheduledHoldsMutationsParams): UseScheduledHoldsMutationsReturn {
  const addScheduledHold = useCallback(
    async (
      firefighterId: string,
      firefighterName: string,
      holdDate: Date,
      fireStation: string,
      duration: string = "24h",
      startTime: string = "07:00"
    ) => {
      try {
        // Call server-side RPC function for secure insert with validation
        // Uses schedule_hold_secure() SECURITY DEFINER function
        await supabase.rpc("schedule_hold_secure", {
          p_firefighter_id: firefighterId,
          p_firefighter_name: firefighterName,
          p_hold_date: holdDate.toISOString().split("T")[0],
          p_fire_station: fireStation,
          p_shift: currentShift,
          p_duration: duration,
          p_start_time: startTime,
        });

        onSuccess?.();
      } catch (err) {
        console.error("Error adding scheduled hold:", err);
        throw err;
      }
    },
    [currentShift, onSuccess]
  );

  const updateScheduledHold = useCallback(
    async (id: string, updates: Partial<ScheduledHold>) => {
      try {
        const { error } = await supabase
          .from("scheduled_holds")
          .update(updates)
          .eq("id", id);

        if (error) throw error;

        onSuccess?.();
      } catch (err) {
        console.error("Error updating scheduled hold:", err);
        throw err;
      }
    },
    [onSuccess]
  );

  const deleteScheduledHold = useCallback(
    async (id: string) => {
      try {
        // Get hold info for logging
        const { data: hold } = await supabase
          .from("scheduled_holds")
          .select("firefighter_name, hold_date")
          .eq("id", id)
          .single();

        const { error } = await supabase
          .from("scheduled_holds")
          .delete()
          .eq("id", id);

        if (error) throw error;

        // Log activity
        if (hold) {
          const holdDateStr = hold.hold_date
            ? new Date(hold.hold_date).toLocaleDateString("en-US", {
                timeZone: "UTC",
              })
            : "unknown date";

          await supabase.from("activity_log").insert({
            firefighter_name: hold.firefighter_name,
            action_type: "hold_deleted",
            description: `Deleted scheduled hold`,
            details: `Deleted scheduled hold for ${holdDateStr}`,
            shift: currentShift,
          });
        }

        onSuccess?.();
      } catch (err) {
        console.error("Error deleting scheduled hold:", err);
        throw err;
      }
    },
    [currentShift, onSuccess]
  );

  const completeScheduledHold = useCallback(
    async (id: string) => {
      try {
        const { error } = await supabase
          .from("scheduled_holds")
          .update({ status: "completed" })
          .eq("id", id);

        if (error) throw error;

        onSuccess?.();
      } catch (err) {
        console.error("Error completing scheduled hold:", err);
        throw err;
      }
    },
    [onSuccess]
  );

  const skipScheduledHold = useCallback(
    async (id: string) => {
      try {
        const { error } = await supabase
          .from("scheduled_holds")
          .update({ status: "skipped" })
          .eq("id", id);

        if (error) throw error;

        onSuccess?.();
      } catch (err) {
        console.error("Error skipping scheduled hold:", err);
        throw err;
      }
    },
    [onSuccess]
  );

  return {
    addScheduledHold,
    updateScheduledHold,
    deleteScheduledHold,
    completeScheduledHold,
    skipScheduledHold,
  };
}
