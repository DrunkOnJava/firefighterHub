/**
 * FirefighterItemM3 - MaterialM Design Version
 *
 * Material Design 3 implementation of the FirefighterItem component.
 * Uses MaterialM OKLCH color palette and M3 design patterns.
 *
 * Key differences from legacy:
 * - Uses MaterialM colors (bg-materialm-dark, text-materialm-text, etc.)
 * - Uses M3 components (CardM3, ButtonM3, BadgeM3)
 * - Preserves all drag-and-drop functionality
 * - Maintains accessibility (ARIA labels, focus states)
 */

import {
  ArrowRightLeft,
  CheckCircle,
  GripVertical,
  Star,
  Trash2,
  UserX,
} from "lucide-react";
import { Firefighter, Shift } from "../lib/supabase";
import { ShiftBadge } from "./ShiftSelector";
import { ButtonM3 } from "./m3/ButtonM3";
import { BadgeM3 } from "./m3/BadgeM3";
import { tokens } from "../styles/tokens";

interface FirefighterItemM3Props {
  firefighter: Firefighter;
  onToggleAvailable: (id: string) => void;
  onCompleteHold: (id: string) => void;
  onDelete: (id: string) => void;
  onDeactivate: (id: string) => void;
  onTransferShift: (id: string) => void;
  isNextInRotation?: boolean;
  onDragStart?: (e: React.DragEvent, firefighterId: string) => void;
  onDragOver?: (e: React.DragEvent, firefighterId: string) => void;
  onDrop?: (e: React.DragEvent, targetFirefighterId: string) => void;
  onDragEnd?: () => void;
  isDragging?: boolean;
  isDragOver?: boolean;
  isAdminMode?: boolean;
  isDarkMode?: boolean;
}

export function FirefighterItemM3({
  firefighter,
  onCompleteHold,
  onDelete,
  onDeactivate,
  onTransferShift,
  isNextInRotation = false,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
  isDragging = false,
  isDragOver = false,
  isAdminMode = false,
}: FirefighterItemM3Props) {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "No holds yet";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      timeZone: "UTC",
    });
  };

  // Determine card state styling
  const getCardStateClasses = () => {
    if (isDragging) {
      return "opacity-50 scale-95";
    }
    if (isDragOver) {
      return "ring-2 ring-materialm-primary scale-105";
    }
    if (!firefighter.is_available) {
      return "bg-materialm-darkgray/50 border-materialm-border-dark/50";
    }
    if (isNextInRotation) {
      return "bg-gradient-to-br from-materialm-warning/10 to-materialm-dark border-materialm-warning";
    }
    return "bg-materialm-dark border-materialm-border-dark";
  };

  return (
    <div
      draggable={isAdminMode}
      onDragStart={(e) => isAdminMode && onDragStart?.(e, firefighter.id)}
      onDragOver={(e) => {
        if (!isAdminMode) return;
        e.preventDefault();
        onDragOver?.(e, firefighter.id);
      }}
      onDrop={(e) => {
        if (!isAdminMode) return;
        e.preventDefault();
        onDrop?.(e, firefighter.id);
      }}
      onDragEnd={onDragEnd}
      className={`relative ${tokens.borders.radius.xl} border transition-all duration-200 ${
        isAdminMode ? "cursor-move" : ""
      } ${getCardStateClasses()} shadow-materialm-2 hover:shadow-materialm-3`}
    >
      {/* NEXT UP badge */}
      {isNextInRotation && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-materialm-3 z-10 bg-materialm-warning text-black border-2 border-black">
          <Star size={14} fill="currentColor" />
          NEXT UP
        </div>
      )}

      <div className={tokens.spacing.card.lg}>
        {/* Header Section */}
        <div className="flex items-start justify-between mb-4">
          {/* Drag Handle */}
          {isAdminMode && (
            <div className="flex items-center gap-2 mr-2">
              <div className="cursor-grab active:cursor-grabbing text-materialm-text-secondary hover:text-materialm-text-primary transition-colors">
                <GripVertical size={20} />
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Name & Status */}
            <div className="flex items-center gap-2 mb-2">
              <h3
                className="text-xl font-bold truncate text-materialm-text-primary"
                title={firefighter.name}
              >
                {firefighter.name}
              </h3>
              {!firefighter.is_available && (
                <BadgeM3 color="warning" size="xs" variant="filled">
                  OUT OF ROTATION
                </BadgeM3>
              )}
            </div>

            {/* Badges Section */}
            <div className="space-y-3">
              {/* Primary Info Badges */}
              <div className="flex gap-2 flex-wrap">
                <ShiftBadge shift={firefighter.shift as Shift} />

                {firefighter.fire_station && (
                  <BadgeM3 color="neutral" size="sm" variant="outlined">
                    Station #{firefighter.fire_station}
                  </BadgeM3>
                )}

                <BadgeM3 color="neutral" size="sm" variant="tonal">
                  <span className="text-xs font-medium">Last Hold: </span>
                  <span className="text-xs font-semibold ml-1">
                    {formatDate(firefighter.last_hold_date)}
                  </span>
                </BadgeM3>
              </div>

              {/* Certifications & Roles */}
              {(firefighter.is_fto ||
                firefighter.is_bls ||
                firefighter.is_als) && (
                <div>
                  <span className="text-xs font-semibold mb-1.5 block text-materialm-text-secondary">
                    Certifications & Roles:
                  </span>
                  <div className="flex gap-2 flex-wrap">
                    {firefighter.is_fto && (
                      <BadgeM3 color="primary" size="sm" variant="filled">
                        FTO
                      </BadgeM3>
                    )}
                    {firefighter.is_bls && (
                      <BadgeM3 color="info" size="sm" variant="filled">
                        BLS
                      </BadgeM3>
                    )}
                    {firefighter.is_als && (
                      <BadgeM3 color="success" size="sm" variant="filled">
                        ALS
                      </BadgeM3>
                    )}
                  </div>
                </div>
              )}

              {/* Medical Certification */}
              {firefighter.certification_level && (
                <div>
                  <span className="text-xs font-semibold mb-1.5 block text-materialm-text-secondary">
                    Medical Certification:
                  </span>
                  <BadgeM3 color="secondary" size="sm" variant="tonal">
                    {firefighter.certification_level}
                  </BadgeM3>
                </div>
              )}

              {/* Apparatus Clearances */}
              {(firefighter.apparatus_ambulance ||
                firefighter.apparatus_brush_truck ||
                firefighter.apparatus_engine ||
                firefighter.apparatus_tanker ||
                firefighter.apparatus_truck ||
                firefighter.apparatus_boat ||
                firefighter.apparatus_utv ||
                firefighter.apparatus_rescue_squad) && (
                <div>
                  <span className="text-xs font-semibold mb-1.5 block text-materialm-text-secondary">
                    Apparatus Clearances:
                  </span>
                  <div className="flex gap-2 flex-wrap">
                    {firefighter.apparatus_ambulance && (
                      <BadgeM3 color="neutral" size="sm" variant="outlined">
                        Ambulance
                      </BadgeM3>
                    )}
                    {firefighter.apparatus_brush_truck && (
                      <BadgeM3 color="neutral" size="sm" variant="outlined">
                        Brush Truck
                      </BadgeM3>
                    )}
                    {firefighter.apparatus_engine && (
                      <BadgeM3 color="neutral" size="sm" variant="outlined">
                        Engine
                      </BadgeM3>
                    )}
                    {firefighter.apparatus_tanker && (
                      <BadgeM3 color="neutral" size="sm" variant="outlined">
                        Tanker
                      </BadgeM3>
                    )}
                    {firefighter.apparatus_truck && (
                      <BadgeM3 color="neutral" size="sm" variant="outlined">
                        Truck
                      </BadgeM3>
                    )}
                    {firefighter.apparatus_boat && (
                      <BadgeM3 color="neutral" size="sm" variant="outlined">
                        Boat
                      </BadgeM3>
                    )}
                    {firefighter.apparatus_utv && (
                      <BadgeM3 color="neutral" size="sm" variant="outlined">
                        UTV
                      </BadgeM3>
                    )}
                    {firefighter.apparatus_rescue_squad && (
                      <BadgeM3 color="error" size="sm" variant="outlined">
                        Rescue Squad
                      </BadgeM3>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Delete Button (Admin Only) */}
          {isAdminMode && (
            <ButtonM3
              variant="text"
              color="error"
              size="sm"
              onClick={() => onDelete(firefighter.id)}
              aria-label={`Remove ${firefighter.name} from roster`}
              className="p-2"
            >
              <Trash2 size={20} />
            </ButtonM3>
          )}
        </div>

        {/* Action Buttons (Admin Only) */}
        {isAdminMode && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <ButtonM3
                variant="outlined"
                color="neutral"
                size="md"
                onClick={() => onDeactivate(firefighter.id)}
                aria-label={`Deactivate ${firefighter.name}`}
                startIcon={<UserX size={18} />}
                fullWidth
              >
                Deactivate
              </ButtonM3>

              <ButtonM3
                variant="outlined"
                color="neutral"
                size="md"
                onClick={() => onTransferShift(firefighter.id)}
                aria-label={`Transfer ${firefighter.name} to different shift`}
                startIcon={<ArrowRightLeft size={18} />}
                fullWidth
              >
                Transfer Shift
              </ButtonM3>
            </div>

            {/* Complete Hold Button */}
            {firefighter.is_available && (
              <ButtonM3
                variant="filled"
                color="success"
                size="md"
                onClick={() => onCompleteHold(firefighter.id)}
                aria-label={`Complete hold for ${firefighter.name}`}
                startIcon={<CheckCircle size={18} />}
                fullWidth
                className="mt-3"
              >
                Finish Hold & Move to End
              </ButtonM3>
            )}
          </>
        )}
      </div>
    </div>
  );
}
