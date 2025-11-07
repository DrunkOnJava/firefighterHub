import {
  ArrowRightLeft,
  CheckCircle,
  GripVertical,
  Star,
  Trash2,
  UserX,
} from "lucide-react";
import { Firefighter, Shift } from "../lib/supabase";
import { getTheme } from "../utils/theme";
import { ShiftBadge } from "./ShiftSelector";

interface FirefighterItemProps {
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

export function FirefighterItem({
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
  isDarkMode = true,
}: FirefighterItemProps) {
  const theme = getTheme(isDarkMode);

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

  return (
    <div
      draggable={true}
      onDragStart={(e) => onDragStart?.(e, firefighter.id)}
      onDragOver={(e) => {
        e.preventDefault();
        onDragOver?.(e, firefighter.id);
      }}
      onDrop={(e) => {
        e.preventDefault();
        onDrop?.(e, firefighter.id);
      }}
      onDragEnd={onDragEnd}
      className={`relative rounded-xl shadow-lg transition-all hover:shadow-xl cursor-move ${
        isDragging
          ? theme.firefighterItem.dragging
          : isDragOver
          ? theme.firefighterItem.dragOver
          : !firefighter.is_available
          ? theme.firefighterItem.unavailable
          : isNextInRotation
          ? theme.firefighterItem.nextInRotation
          : theme.firefighterItem.available
      }`}
    >
      {isNextInRotation && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-lg z-10 bg-amber-500 text-gray-900 border-2 border-black shadow-black/50">
          <Star size={14} fill="currentColor" />
          NEXT UP
        </div>
      )}

      <div className="p-5">
        <div className="flex items-start justify-between mb-4">
          {isAdminMode && (
            <div className="flex items-center gap-2 mr-2">
              <div
                className={`cursor-grab active:cursor-grabbing ${theme.firefighterItem.dragHandle}`}
              >
                <GripVertical size={20} />
              </div>
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h3
                className={`text-xl font-bold truncate ${theme.firefighterItem.title}`}
                title={firefighter.name}
              >
                {firefighter.name}
              </h3>
              {!firefighter.is_available && (
                <span
                  className={`px-2 py-1 rounded-md text-xs font-bold uppercase ${theme.firefighterItem.outOfRotationBadge}`}
                >
                  Out of Rotation
                </span>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex gap-2 flex-wrap">
                <ShiftBadge shift={firefighter.shift as Shift} />
                {firefighter.fire_station && (
                  <div
                    className={`flex items-center gap-1.5 px-3 py-1.5 border rounded-md ${theme.firefighterItem.stationBadge}`}
                  >
                    <span className="text-xs font-semibold">
                      Station #{firefighter.fire_station}
                    </span>
                  </div>
                )}
                <div
                  className={`flex items-center gap-1.5 px-3 py-1.5 border rounded-md ${theme.firefighterItem.lastHoldBadge}`}
                >
                  <span className="text-xs font-medium">Last Hold:</span>
                  <span className="text-xs font-semibold">
                    {formatDate(firefighter.last_hold_date)}
                  </span>
                </div>
              </div>

              {(firefighter.is_fto ||
                firefighter.is_bls ||
                firefighter.is_als) && (
                <div>
                  <span
                    className={`text-xs font-semibold mb-1.5 block ${theme.firefighterItem.certificationLabel}`}
                  >
                    Certifications & Roles:
                  </span>
                  <div className="flex gap-2 flex-wrap">
                    {firefighter.is_fto && (
                      <div
                        className={`flex items-center gap-1.5 px-2.5 py-1 border rounded-md ${theme.firefighterItem.ftoBadge}`}
                      >
                        <span className="text-xs font-bold">FTO</span>
                      </div>
                    )}
                    {firefighter.is_bls && (
                      <div
                        className={`flex items-center gap-1.5 px-2.5 py-1 border rounded-md ${theme.firefighterItem.blsBadge}`}
                      >
                        <span className="text-xs font-bold">BLS</span>
                      </div>
                    )}
                    {firefighter.is_als && (
                      <div
                        className={`flex items-center gap-1.5 px-2.5 py-1 border rounded-md ${theme.firefighterItem.alsBadge}`}
                      >
                        <span className="text-xs font-bold">ALS</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {firefighter.certification_level && (
                <div>
                  <span
                    className={`text-xs font-semibold mb-1.5 block ${theme.firefighterItem.certificationLabel}`}
                  >
                    Medical Certification:
                  </span>
                  <div
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 border rounded-md ${theme.firefighterItem.medicalCertBadge}`}
                  >
                    <span className="text-xs font-semibold">
                      {firefighter.certification_level}
                    </span>
                  </div>
                </div>
              )}

              {(firefighter.apparatus_ambulance ||
                firefighter.apparatus_brush_truck ||
                firefighter.apparatus_engine ||
                firefighter.apparatus_tanker ||
                firefighter.apparatus_truck ||
                firefighter.apparatus_boat ||
                firefighter.apparatus_utv ||
                firefighter.apparatus_rescue_squad) && (
                <div>
                  <span
                    className={`text-xs font-semibold mb-1.5 block ${theme.firefighterItem.certificationLabel}`}
                  >
                    Apparatus Clearances:
                  </span>
                  <div className="flex gap-2 flex-wrap">
                    {firefighter.apparatus_ambulance && (
                      <span
                        className={`px-2.5 py-1 border rounded-md text-xs font-semibold ${theme.firefighterItem.apparatusBadge}`}
                      >
                        Ambulance
                      </span>
                    )}
                    {firefighter.apparatus_brush_truck && (
                      <span
                        className={`px-2.5 py-1 border rounded-md text-xs font-semibold ${theme.firefighterItem.apparatusBadge}`}
                      >
                        Brush Truck
                      </span>
                    )}
                    {firefighter.apparatus_engine && (
                      <span
                        className={`px-2.5 py-1 border rounded-md text-xs font-semibold ${theme.firefighterItem.apparatusBadge}`}
                      >
                        Engine
                      </span>
                    )}
                    {firefighter.apparatus_tanker && (
                      <span
                        className={`px-2.5 py-1 border rounded-md text-xs font-semibold ${theme.firefighterItem.apparatusBadge}`}
                      >
                        Tanker
                      </span>
                    )}
                    {firefighter.apparatus_truck && (
                      <span
                        className={`px-2.5 py-1 border rounded-md text-xs font-semibold ${theme.firefighterItem.apparatusBadge}`}
                      >
                        Truck
                      </span>
                    )}
                    {firefighter.apparatus_boat && (
                      <span
                        className={`px-2.5 py-1 border rounded-md text-xs font-semibold ${theme.firefighterItem.apparatusBadge}`}
                      >
                        Boat
                      </span>
                    )}
                    {firefighter.apparatus_utv && (
                      <span
                        className={`px-2.5 py-1 border rounded-md text-xs font-semibold ${theme.firefighterItem.apparatusBadge}`}
                      >
                        UTV
                      </span>
                    )}
                    {firefighter.apparatus_rescue_squad && (
                      <span
                        className={`px-2.5 py-1 border rounded-md text-xs font-semibold ${theme.firefighterItem.rescueSquadBadge}`}
                      >
                        Rescue Squad
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {isAdminMode && (
            <button
              onClick={() => onDelete(firefighter.id)}
              className={`p-2 rounded-lg transition-colors group focus-ring ${theme.firefighterItem.deleteButton}`}
              aria-label={`Remove ${firefighter.name} from roster`}
            >
              <Trash2 className={theme.firefighterItem.deleteIcon} size={20} />
            </button>
          )}
        </div>

        {isAdminMode && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => onDeactivate(firefighter.id)}
                className={`py-3 px-4 rounded-lg font-semibold transition-all border flex items-center justify-center gap-2 focus-ring ${theme.firefighterItem.actionButton}`}
                aria-label={`Deactivate ${firefighter.name}`}
              >
                <UserX size={18} />
                Deactivate
              </button>

              <button
                onClick={() => onTransferShift(firefighter.id)}
                className={`py-3 px-4 rounded-lg font-semibold transition-all border flex items-center justify-center gap-2 focus-ring ${theme.firefighterItem.actionButton}`}
                aria-label={`Transfer ${firefighter.name} to different shift`}
              >
                <ArrowRightLeft size={18} />
                Transfer Shift
              </button>
            </div>

            {firefighter.is_available && (
              <button
                onClick={() => onCompleteHold(firefighter.id)}
                className={`w-full mt-3 py-3 px-4 rounded-lg font-semibold transition-all text-white shadow-lg flex items-center justify-center gap-2 focus-ring ${theme.firefighterItem.completeHoldButton}`}
                aria-label={`Complete hold for ${firefighter.name}`}
              >
                <CheckCircle size={18} />
                Finish Hold & Move to End
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
