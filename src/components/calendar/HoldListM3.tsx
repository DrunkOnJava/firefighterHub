/**
 * HoldListM3 Component - MaterialM Version
 *
 * Displays a list of scheduled holds for a selected day with:
 * - Hold cards showing firefighter name, station, status
 * - Action buttons (Edit, Delete, Mark Complete) - admin only
 * - Lock indicator for holds >1 week old
 * - Empty state when no holds exist
 *
 * Uses MaterialM design system with M3 components.
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
import { colors, tokens } from "../../styles";
import { ScheduledHold } from "../../utils/calendarUtils";
import { isHoldLocked } from "../../utils/validation";
import { EmptyState } from "../EmptyState";
import { ButtonM3 } from "../m3/ButtonM3";
import { BadgeM3, StatusBadgeM3 } from "../m3/BadgeM3";

interface HoldListM3Props {
  holds: ScheduledHold[];
  firefighters: Firefighter[];
  onRemove: (holdId: string) => void;
  onMarkCompleted: (hold: ScheduledHold) => void;
  onEdit: (holdId: string, station: string) => void;
  onAddNew: () => void;
  isAdminMode?: boolean;
  isDarkMode?: boolean;
}

export function HoldListM3({
  holds,
  onRemove,
  onMarkCompleted,
  onAddNew,
  isAdminMode = false,
}: HoldListM3Props) {
  if (holds.length === 0) {
    return (
      <div>
        <EmptyState
          icon={<Calendar className={`${tokens.icons.xl} ${colors.structural.text.tertiary}`} />}
          title="No holds scheduled"
          description="Click 'Add Hold' below to schedule someone"
        />

        {isAdminMode && (
          <ButtonM3
            variant="filled"
            color="primary"
            fullWidth
            startIcon={<Plus className={tokens.icons.md} />}
            onClick={onAddNew}
            className={tokens.spacing.margin.lg}
          >
            Add Hold
          </ButtonM3>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className={`space-y-3 ${tokens.spacing.margin.lg}`}>
        {holds.map((hold) => {
          const locked = isHoldLocked(hold);

          return (
            <div
              key={hold.id}
              className={`
                ${colors.components.hold.border}
                ${
                  colors.components.hold[
                    hold.status as "scheduled" | "completed"
                  ]
                }
                ${tokens.borders.radius.lg}
                ${tokens.spacing.card.md}
              `}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p
                    className={`${tokens.typography.heading.h4} ${colors.structural.text.primary}`}
                  >
                    {hold.firefighter_name}
                  </p>

                  {hold.fire_station && (
                    <p
                      className={`${tokens.typography.body.secondary} ${colors.structural.text.secondary} mt-1 font-semibold`}
                    >
                      Station #{hold.fire_station}
                    </p>
                  )}

                  {hold.duration && (
                    <p
                      className={`${tokens.typography.body.small} ${colors.structural.text.tertiary} mt-1 flex items-center gap-1`}
                    >
                      <Clock className={tokens.icons.xs} />
                      {hold.duration === "12h" ? "12 Hour" : "24 Hour"} Hold
                      {hold.start_time && ` • Starts ${hold.start_time}`}
                    </p>
                  )}

                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <StatusBadgeM3
                      status={hold.status === "scheduled" ? "pending" : "success"}
                    >
                      {hold.status === "scheduled" ? "SCHEDULED" : "COMPLETED"}
                    </StatusBadgeM3>

                    {locked && (
                      <BadgeM3
                        color="warning"
                        icon={<Lock className={tokens.icons.xs} />}
                        size="sm"
                      >
                        Locked
                      </BadgeM3>
                    )}
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              {isAdminMode && (
                <div
                  className={`flex gap-2 pt-3 border-t ${colors.structural.border.default}`}
                >
                  {/* Complete Button: For 'scheduled' holds */}
                  {hold.status === "scheduled" && (
                    <ButtonM3
                      variant="filled"
                      color="success"
                      size="sm"
                      startIcon={<CheckCircle2 className={tokens.icons.sm} />}
                      onClick={() => onMarkCompleted(hold)}
                      className="flex-1"
                      title="Mark as completed and move to end of rotation"
                    >
                      Complete
                    </ButtonM3>
                  )}

                  {/* Cancel Button: Disabled for locked holds */}
                  {!hold.id.startsWith("past-") && (
                    <ButtonM3
                      variant="filled"
                      color="error"
                      size="sm"
                      startIcon={
                        locked ? (
                          <Lock className={tokens.icons.sm} />
                        ) : (
                          <Trash2 className={tokens.icons.sm} />
                        )
                      }
                      onClick={() => !locked && onRemove(hold.id)}
                      disabled={locked}
                      className="flex-1"
                      title={
                        locked
                          ? "Hold is locked (>1 week old)"
                          : hold.status === "completed"
                          ? "Cancel completed hold and reset firefighter position"
                          : "Cancel scheduled hold"
                      }
                    >
                      {locked ? "Locked" : "Cancel"}
                    </ButtonM3>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add button */}
      {isAdminMode && (
        <ButtonM3
          variant="filled"
          color="primary"
          fullWidth
          startIcon={<Plus className={tokens.icons.md} />}
          onClick={onAddNew}
          className={tokens.spacing.margin.lg}
        >
          Add Another Hold
        </ButtonM3>
      )}
    </div>
  );
}
