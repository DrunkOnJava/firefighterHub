import { useCallback } from "react";
import { Shift, supabase } from '@/lib/supabase';

interface UseActivityLoggerReturn {
  logActivity: (
    firefighterName: string,
    actionType: string,
    details?: string,
    firefighterId?: string
  ) => Promise<void>;
}

/**
 * Hook for logging activity to the activity_log table
 * Separated from mutations for better code organization (SRP)
 */
export function useActivityLogger(
  currentShift: Shift
): UseActivityLoggerReturn {
  const logActivity = useCallback(
    async (
      firefighterName: string,
      actionType: string,
      details?: string,
      firefighterId?: string
    ) => {
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
    },
    [currentShift]
  );

  return { logActivity };
}
