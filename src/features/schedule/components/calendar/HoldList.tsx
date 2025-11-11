/**
 * HoldList Component
 *
 * Displays a list of scheduled holds for a selected day with:
 * - Hold cards showing firefighter name, station, status
 * - Action buttons (Edit, Delete, Mark Complete) - admin only
 * - Lock indicator for holds >1 week old
 * - Empty state when no holds exist
 */

import {
  Calendar,
  CheckCircle2,
  Clock,
  Lock,
  Plus,
  Trash2,
} from "lucide-react";
import { Firefighter } from "../../lib/supabase";
import { ScheduledHold } from "../../utils/calendarUtils";
import { isHoldLocked } from "../../utils/validation";
import { EmptyState } from "../EmptyState";

interface HoldListProps {
  holds: ScheduledHold[];
  firefighters: Firefighter[];
  onRemove: (holdId: string) => void;
  onMarkCompleted: (hold: ScheduledHold) => void;
  onEdit: (holdId: string, station: string) => void;
  onAddNew: () => void;
  isAdminMode?: boolean;
}

export function HoldList({
  holds,
  onRemove,
  onMarkCompleted,
  onAddNew,
  isAdminMode = false,
}: HoldListProps) {
  if (holds.length === 0) {
    return (
      <div>
        <EmptyState
          icon={<Calendar className="w-16 h-16 text-muted-foreground" />}
          title="No holds scheduled"
          description="Click 'Add Hold' below to schedule someone"
        />

        {isAdminMode && (
          <button
            onClick={onAddNew}
            className="
              w-full mt-6 px-3 py-2 rounded-lg
              bg-primary hover:bg-primary/90 text-primary-foreground
              font-semibold transition-colors
              flex items-center justify-center gap-2
            "
          >
            <Plus className="w-5 h-5" />
            Add Hold
          </button>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="space-y-3 mb-6">
        {holds.map((hold) => {
          const locked = isHoldLocked(hold);

          return (
            <div
              key={hold.id}
              className={`
                border-2 rounded-lg p-4
                ${
                  hold.status === "scheduled"
                    ? "bg-blue-950/20 dark:bg-blue-950/20 border-blue-500/30 border-l-blue-500"
                    : "bg-green-950/20 dark:bg-green-950/20 border-green-500/30 border-l-emerald-500"
                }
              `}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-lg font-semibold text-foreground">
                    {hold.firefighter_name}
                  </p>

                  {hold.fire_station && (
                    <p className="text-sm text-muted-foreground mt-1 font-semibold">
                      Station #{hold.fire_station}
                    </p>
                  )}

                  {hold.duration && (
                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {hold.duration === "12h" ? "12 Hour" : "24 Hour"} Hold
                      {hold.start_time && ` • Starts ${hold.start_time}`}
                    </p>
                  )}

                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <span
                      className={`
                        inline-block px-2 py-1 rounded text-xs font-bold
                        ${
                          hold.status === "scheduled"
                            ? "bg-sky-900/70 text-sky-300"
                            : "bg-emerald-900/70 text-emerald-300"
                        }
                      `}
                    >
                      {hold.status === "scheduled" ? "SCHEDULED" : "COMPLETED"}
                    </span>

                    {hold.is_voluntary && (
                      <span
                        className="inline-flex items-center gap-1 px-2 py-1 bg-green-900/70 text-green-200 text-xs font-bold rounded"
                        title="Member volunteered for this hold"
                      >
                        <span>🙋</span>
                        VOLUNTARY
                      </span>
                    )}

                    {locked && (
                      <span className="inline-flex items-center px-2 py-1 bg-amber-900/70 text-amber-200 text-xs font-bold rounded">
                        <Lock className="w-3 h-3" />
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              {isAdminMode && (
                <div className="flex gap-2 pt-3 border-t border-border">
                  {/* Complete Button: For 'scheduled' holds */}
                  {hold.status === "scheduled" && (
                    <button
                      onClick={() => onMarkCompleted(hold)}
                      className="
                        flex-1 px-3 py-2 rounded-lg
                        bg-green-600 hover:bg-green-700 text-white
                        font-semibold transition-colors
                        flex items-center justify-center gap-2
                      "
                      title="Mark as completed and move to end of rotation"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span className="text-xs">Complete</span>
                    </button>
                  )}

                  {/* Cancel Button: Disabled for locked holds */}
                  {!hold.id.startsWith("past-") && (
                    <button
                      disabled={locked}
                      onClick={() => !locked && onRemove(hold.id)}
                      className={`
                        flex-1 px-3 py-2 rounded-lg font-semibold transition-colors
                        flex items-center justify-center gap-2
                        ${
                          locked
                            ? "opacity-50 cursor-not-allowed bg-destructive/50 text-destructive-foreground"
                            : "bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                        }
                      `}
                      title={
                        locked
                          ? "Hold is locked (>1 week old)"
                          : hold.status === "completed"
                          ? "Cancel completed hold and reset firefighter position"
                          : "Cancel scheduled hold"
                      }
                    >
                      {locked ? (
                        <Lock className="w-4 h-4" />
                      ) : (
                        <>
                          <Trash2 className="w-4 h-4" />
                          <span className="text-xs">Cancel</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add button */}
      {isAdminMode && (
        <button
          onClick={onAddNew}
          className="
            w-full mt-6 px-3 py-2 rounded-lg
            bg-primary hover:bg-primary/90 text-primary-foreground
            font-semibold transition-colors
            flex items-center justify-center gap-2
          "
        >
          <Plus className="w-5 h-5" />
          Add Another Hold
        </button>
      )}
    </div>
  );
}
