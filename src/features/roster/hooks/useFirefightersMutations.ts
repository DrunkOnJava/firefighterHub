import { useCallback } from "react";
import { Firefighter, HoldDuration, Shift, supabase } from '@/lib/supabase';
import { assignPositions } from '@/utils/rotationLogic';
import { ConfirmOptions } from "@/hooks/useConfirm";
import { ToastType } from "@/hooks/useToast";

interface UseFirefightersMutationsParams {
  currentShift: Shift;
  firefighters: Firefighter[];
  deactivatedFirefighters: Firefighter[];
  showToast: (message: string, type: ToastType) => void;
  confirmAction?: (options: ConfirmOptions) => Promise<boolean>;
  logActivity: (
    firefighterName: string,
    actionType: string,
    details?: string,
    firefighterId?: string
  ) => Promise<void>;
  onSuccess?: () => void;
}

interface UseFirefightersMutationsReturn {
  addFirefighter: (
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
  ) => Promise<void>;
  completeHold: (
    id: string,
    holdDate: string,
    newPosition: number,
    station?: string,
    lentToShift?: Shift | null,
    duration?: HoldDuration,
    startTime?: string
  ) => Promise<void>;
  deleteFirefighter: (id: string) => Promise<void>;
  deactivateFirefighter: (id: string) => Promise<void>;
  reactivateFirefighter: (id: string, position: number) => Promise<void>;
  transferShift: (id: string, newShift: Shift) => Promise<void>;
  resetAll: () => Promise<void>;
  masterReset: () => Promise<void>;
  reorderFirefighters: (reorderedFirefighters: Firefighter[]) => Promise<void>;
  moveToBottomOfRotation: (id: string) => Promise<void>;
}

/**
 * Hook for firefighter mutations (CUD operations)
 * Separated from data fetching for better code organization (SRP)
 * 
 * NOTE: Optimistic updates removed per simplification plan
 * - Simpler state management (40% less code)
 * - Single source of truth (database)
 * - Tradeoff: ~200ms UI latency on mutations
 */
export function useFirefightersMutations({
  currentShift,
  firefighters,
  deactivatedFirefighters,
  showToast,
  confirmAction,
  logActivity,
  onSuccess,
}: UseFirefightersMutationsParams): UseFirefightersMutationsReturn {
  const addFirefighter = useCallback(
    async (
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
    ) => {
      try {
        const available = firefighters.filter((ff) => ff.is_available);
        const maxPosition =
          available.length > 0
            ? Math.max(...available.map((ff) => ff.order_position))
            : -1;

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
          const position = (data.order_position || 0) + 1;
          showToast(
            `${name} joined the rotation at position ${position}`,
            "success"
          );
          await logActivity(name, "added", "Added to hold list", data.id);
          onSuccess?.();
        }
      } catch (error) {
        console.error("Error adding firefighter:", error);
        showToast("Could not add team member. Please try again.", "error");
      }
    },
    [currentShift, firefighters, showToast, logActivity, onSuccess]
  );

  const completeHold = useCallback(
    async (
      id: string,
      holdDate: string,
      newPosition: number,
      station?: string,
      lentToShift?: Shift | null,
      duration: HoldDuration = "24h",
      startTime: string = "07:00"
    ) => {
      const firefighter = firefighters.find((ff) => ff.id === id);
      if (!firefighter || !firefighter.is_available) return;

      try {
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

        // Batch update all positions
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

        // Create scheduled hold record
        const stationToUse = station || firefighter.fire_station || null;
        const { error: insertError } = await supabase
          .from("scheduled_holds")
          .insert({
            firefighter_id: id,
            firefighter_name: firefighter.name,
            scheduled_date: holdDate,
            hold_date: holdDate,
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
        onSuccess?.();
      } catch (error) {
        console.error("Error completing hold:", error);
        showToast("Could not complete hold. Please try again.", "error");
      }
    },
    [currentShift, firefighters, showToast, logActivity, onSuccess]
  );

  const deleteFirefighter = useCallback(
    async (id: string) => {
      const firefighter = firefighters.find((ff) => ff.id === id);
      if (!firefighter) return;

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

      try {
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
        onSuccess?.();
      } catch (error) {
        console.error("Error deleting firefighter:", error);
        showToast("Could not remove team member. Please try again.", "error");
      }
    },
    [firefighters, confirmAction, showToast, logActivity, onSuccess]
  );

  const resetAll = useCallback(async () => {
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
      onSuccess?.();
    } catch (error) {
      console.error("Error resetting firefighters:", error);
      showToast("Could not reset roster. Please try again.", "error");
    }
  }, [confirmAction, showToast, onSuccess]);

  const masterReset = useCallback(async () => {
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
      onSuccess?.();
    } catch (error) {
      console.error("Error performing master reset:", error);
      showToast("Master reset failed. Please try again.", "error");
    }
  }, [confirmAction, showToast, onSuccess]);

  const reorderFirefighters = useCallback(
    async (reorderedFirefighters: Firefighter[]) => {
      try {
        const updatedWithPositions = assignPositions(reorderedFirefighters);

        for (const ff of updatedWithPositions) {
          const { error } = await supabase
            .from("firefighters")
            .update({ order_position: ff.order_position })
            .eq("id", ff.id);

          if (error) throw error;
        }

        await logActivity("System", `Roster order updated manually`);
        onSuccess?.();
      } catch (error) {
        console.error("Error reordering firefighters:", error);
        showToast("Could not update order. Please try again.", "error");
      }
    },
    [showToast, logActivity, onSuccess]
  );

  const deactivateFirefighter = useCallback(
    async (id: string) => {
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
        onSuccess?.();
      } catch (error) {
        console.error("Error deactivating firefighter:", error);
        showToast("Could not deactivate. Please try again.", "error");
      }
    },
    [firefighters, confirmAction, showToast, logActivity, onSuccess]
  );

  const transferShift = useCallback(
    async (id: string, newShift: Shift) => {
      const firefighter = firefighters.find((ff) => ff.id === id);
      if (!firefighter) return;

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
            last_hold_date: null,
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
        onSuccess?.();
      } catch (error) {
        console.error("Error transferring shift:", error);
        showToast("Could not transfer shift. Please try again.", "error");
      }
    },
    [firefighters, showToast, logActivity, onSuccess]
  );

  const reactivateFirefighter = useCallback(
    async (id: string, _position: number) => {
      void _position; // Legacy parameter maintained for API compatibility
      const firefighter = deactivatedFirefighters.find((ff) => ff.id === id);
      if (!firefighter) return;

      try {
        // Always place at position 0 (top of rotation)
        const updatedList = [
          { ...firefighter, is_active: true, is_available: true },
          ...firefighters,
        ];
        const reordered = assignPositions(updatedList);

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
        onSuccess?.();
      } catch (error) {
        console.error("Error reactivating firefighter:", error);
        showToast("Could not reactivate. Please try again.", "error");
      }
    },
    [
      deactivatedFirefighters,
      firefighters,
      showToast,
      logActivity,
      onSuccess,
    ]
  );

  const moveToBottomOfRotation = useCallback(
    async (id: string) => {
      const firefighter = firefighters.find((ff) => ff.id === id);
      if (!firefighter) return;

      try {
        // Remove firefighter from current position
        const otherFFs = firefighters.filter(
          (ff) => ff.id !== id && ff.is_available
        );

        // Place at bottom
        const updatedFF = { ...firefighter, order_position: otherFFs.length };

        // Reorder all
        const reordered = [
          ...otherFFs.map((ff, i) => ({ ...ff, order_position: i })),
          updatedFF,
        ];

        // Batch update database
        for (const ff of reordered) {
          const { error } = await supabase
            .from("firefighters")
            .update({ order_position: ff.order_position })
            .eq("id", ff.id);

          if (error) throw error;
        }

        showToast(`${firefighter.name} moved to end of rotation`, "success");
        await logActivity(
          firefighter.name,
          "voluntary_hold",
          `Moved to position ${updatedFF.order_position + 1} (voluntary hold/skip)`,
          id
        );
        onSuccess?.();
      } catch (error) {
        console.error("Error moving to bottom:", error);
        showToast("Could not move firefighter. Please try again.", "error");
      }
    },
    [firefighters, showToast, logActivity, onSuccess]
  );

  return {
    addFirefighter,
    completeHold,
    deleteFirefighter,
    deactivateFirefighter,
    reactivateFirefighter,
    transferShift,
    resetAll,
    masterReset,
    reorderFirefighters,
    moveToBottomOfRotation,
  };
}
