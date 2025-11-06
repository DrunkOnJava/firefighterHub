/**
 * FirefighterProfileModalM3 - MaterialM Design Version
 *
 * Material Design 3 implementation of the FirefighterProfileModal component.
 * Uses MaterialM OKLCH color palette and M3 design patterns.
 *
 * Key differences from legacy:
 * - Uses MaterialM colors (bg-materialm-dark, text-materialm-text, etc.)
 * - Uses M3 components (DialogM3, ButtonM3, BadgeM3, InputM3, SelectM3, CheckboxM3)
 * - Preserves all profile viewing and editing functionality
 * - Maintains accessibility (ARIA labels, focus states, keyboard navigation)
 * - Legacy colors replaced: 30+ instances
 */

import {
  Award,
  Building2,
  Calendar,
  Clock,
  Edit,
  Flame,
  Mountain,
  Save,
  Shield,
  Ship,
  Truck,
  User,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useFocusReturn } from "../hooks/useFocusReturn";
import { useFocusTrap } from "../hooks/useFocusTrap";
import { Firefighter, Shift, supabase } from "../lib/supabase";
import { tokens } from "../styles";
import { formatHoldDate } from "../utils/dateUtils";
import { ShiftBadge } from "./ShiftSelector";
import { ButtonM3 } from "./m3/ButtonM3";
import { BadgeM3 } from "./m3/BadgeM3";
import { SelectM3, CheckboxM3 } from "./m3/InputM3";

interface HoldRecord {
  id: string;
  hold_date: string | null;
  fire_station: string | null;
  status: string | null;
  completed_at: string | null;
  created_at: string;
}

interface FirefighterProfileModalM3Props {
  isOpen: boolean;
  firefighter: Firefighter | null;
  onClose: () => void;
  isAdminMode?: boolean;
}

export function FirefighterProfileModalM3({
  isOpen,
  firefighter,
  onClose,
  isAdminMode = false,
}: FirefighterProfileModalM3Props) {
  const [holdRecords, setHoldRecords] = useState<HoldRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedFirefighter, setEditedFirefighter] =
    useState<Firefighter | null>(null);
  const [showAllHolds, setShowAllHolds] = useState(false);
  const [selectedHoldForDetail, setSelectedHoldForDetail] =
    useState<HoldRecord | null>(null);
  const trapRef = useFocusTrap(isOpen);
  useFocusReturn(isOpen);

  // Load hold history when modal opens
  useEffect(() => {
    if (!isOpen || !firefighter) {
      setHoldRecords([]);
      setLoading(false);
      setEditedFirefighter(null);
      setIsEditMode(false);
      setShowAllHolds(false);
      setSelectedHoldForDetail(null);
      return;
    }

    async function loadHoldHistory() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("scheduled_holds")
          .select(
            "id, hold_date, fire_station, status, completed_at, created_at"
          )
          .eq("firefighter_id", firefighter!.id)
          .order("hold_date", { ascending: false });

        if (error) throw error;
        setHoldRecords(data || []);
      } catch (error) {
        console.error("Error loading hold history:", error);
        setHoldRecords([]);
      } finally {
        setLoading(false);
      }
    }

    loadHoldHistory();
    setEditedFirefighter({ ...firefighter });
    setIsEditMode(false);
    setShowAllHolds(false);
    setSelectedHoldForDetail(null);
  }, [isOpen, firefighter]);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  async function handleSave() {
    if (!editedFirefighter || !firefighter) return;

    try {
      const { error } = await supabase
        .from("firefighters")
        .update({
          name: editedFirefighter.name,
          fire_station: editedFirefighter.fire_station,
          shift: editedFirefighter.shift,
          certification_level: editedFirefighter.certification_level,
          apparatus_ambulance: editedFirefighter.apparatus_ambulance,
          apparatus_engine: editedFirefighter.apparatus_engine,
          apparatus_truck: editedFirefighter.apparatus_truck,
          apparatus_tanker: editedFirefighter.apparatus_tanker,
          apparatus_brush_truck: editedFirefighter.apparatus_brush_truck,
          apparatus_boat: editedFirefighter.apparatus_boat,
          apparatus_utv: editedFirefighter.apparatus_utv,
          apparatus_rescue_squad: editedFirefighter.apparatus_rescue_squad,
          is_fto: editedFirefighter.is_fto,
          is_bls: editedFirefighter.is_bls,
          is_als: editedFirefighter.is_als,
        })
        .eq("id", firefighter.id);

      if (error) throw error;

      setIsEditMode(false);
      onClose();
      // Real-time subscription will update the data automatically
    } catch (error) {
      console.error("Error saving firefighter:", error);
      alert("Failed to save changes. Please try again.");
    }
  }

  if (!isOpen || !firefighter || !editedFirefighter) return null;

  const completedHolds = holdRecords.filter(
    (h) => h.status === "completed"
  ).length;
  const scheduledHolds = holdRecords.filter(
    (h) => h.status === "scheduled"
  ).length;

  const apparatusTypes = [
    { name: "Ambulance", key: "apparatus_ambulance" as const, Icon: Shield },
    { name: "Engine", key: "apparatus_engine" as const, Icon: Flame },
    { name: "Truck", key: "apparatus_truck" as const, Icon: Truck },
    { name: "Tanker", key: "apparatus_tanker" as const, Icon: Truck },
    {
      name: "Brush Truck",
      key: "apparatus_brush_truck" as const,
      Icon: Mountain,
    },
    { name: "Boat", key: "apparatus_boat" as const, Icon: Ship },
    { name: "UTV", key: "apparatus_utv" as const, Icon: Mountain },
    {
      name: "Rescue Squad",
      key: "apparatus_rescue_squad" as const,
      Icon: Shield,
    },
  ];

  const apparatusList = apparatusTypes.filter(
    (item) => editedFirefighter?.[item.key]
  );

  const qualifications = [
    editedFirefighter?.is_fto && { label: "FTO", color: "warning" as const },
    editedFirefighter?.is_bls && { label: "BLS", color: "success" as const },
    editedFirefighter?.is_als && { label: "ALS", color: "info" as const },
  ].filter(Boolean) as { label: string; color: "warning" | "success" | "info" }[];

  return (
    <div
      className={`
        fixed inset-0 z-50 flex items-center justify-center
        ${tokens.spacing.card.md}
        bg-black/90 animate-fade-in
      `}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="profile-modal-title"
    >
      <div
        ref={trapRef}
        className={`
          max-w-2xl w-full max-h-[90vh] overflow-hidden
          bg-materialm-dark
          border border-materialm-border-dark
          ${tokens.borders.radius['2xl']}
          shadow-materialm-5
          animate-scale-in
        `}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className={`
            border-b-2 border-materialm-border-dark ${tokens.spacing.card.xl}
            flex items-center justify-between
            bg-materialm-darkgray
          `}
        >
          <div className={`flex items-center ${tokens.spacing.gap.md}`}>
            <div
              className={`bg-gradient-to-br from-materialm-primary to-materialm-secondary ${tokens.spacing.section.lg} ${tokens.borders.radius.xl}`}
            >
              <User className="text-white" size={24} />
            </div>
            <div>
              {isEditMode ? (
                <input
                  type="text"
                  value={editedFirefighter.name}
                  onChange={(e) =>
                    setEditedFirefighter({
                      ...editedFirefighter,
                      name: e.target.value,
                    })
                  }
                  className={`
                    ${tokens.typography.heading.h1}
                    px-3 py-1
                    ${tokens.borders.radius.lg}
                    border-2 border-materialm-border-dark
                    bg-materialm-surface-dark
                    text-materialm-text-primary
                    focus:outline-none focus:ring-2 focus:ring-materialm-primary
                  `}
                  placeholder="Firefighter name"
                />
              ) : (
                <h2
                  id="profile-modal-title"
                  className={`${tokens.typography.heading.h1} text-materialm-text-primary`}
                >
                  {firefighter.name}
                </h2>
              )}
              <p
                className={`${tokens.typography.body.secondary} text-materialm-text-tertiary`}
              >
                Firefighter Profile
              </p>
            </div>
          </div>
          <div className={`flex items-center ${tokens.spacing.gap.sm}`}>
            {isAdminMode && (
              <ButtonM3
                onClick={() => {
                  if (isEditMode) {
                    handleSave();
                  } else {
                    setIsEditMode(true);
                  }
                }}
                variant="filled"
                color={isEditMode ? "success" : "warning"}
                size="sm"
                startIcon={isEditMode ? <Save size={18} /> : <Edit size={18} />}
                aria-label={isEditMode ? "Save changes" : "Edit profile"}
              >
                {isEditMode ? "Save" : "Edit"}
              </ButtonM3>
            )}
            <button
              onClick={onClose}
              className={`
                p-2 ${tokens.touchTarget.min} ${tokens.borders.radius.lg}
                ${tokens.transitions.fast}
                text-materialm-text-tertiary
                hover:bg-materialm-surface-dark
                focus-ring
                flex items-center justify-center
              `}
              aria-label="Close profile dialog"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className={`p-6 overflow-y-auto max-h-[calc(90vh-120px)]`}>
          {/* Info Cards Grid */}
          <div className={`grid grid-cols-2 ${tokens.spacing.gap.md} mb-6`}>
            {/* Shift Card */}
            <div
              className={`bg-materialm-surface-dark border border-materialm-border-dark ${tokens.borders.radius.xl} p-4`}
            >
              <div
                className={`flex items-center ${tokens.spacing.gap.sm} mb-2`}
              >
                <Calendar
                  size={16}
                  className="text-materialm-primary"
                />
                <span
                  className={`${tokens.typography.body.small} ${tokens.typography.weight.semibold} text-materialm-text-tertiary uppercase`}
                >
                  Shift
                </span>
              </div>
              {isEditMode ? (
                <SelectM3
                  value={editedFirefighter.shift}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    setEditedFirefighter({
                      ...editedFirefighter,
                      shift: e.target.value as Shift,
                    })
                  }
                  options={[
                    { value: "A", label: "Shift A" },
                    { value: "B", label: "Shift B" },
                    { value: "C", label: "Shift C" },
                  ]}
                  size="md"
                />
              ) : (
                <ShiftBadge shift={firefighter.shift as Shift} />
              )}
            </div>

            {/* Station Card */}
            <div
              className={`bg-materialm-surface-dark border border-materialm-border-dark ${tokens.borders.radius.xl} p-4`}
            >
              <div
                className={`flex items-center ${tokens.spacing.gap.sm} mb-2`}
              >
                <Building2
                  size={16}
                  className="text-materialm-warning"
                />
                <span
                  className={`${tokens.typography.body.small} ${tokens.typography.weight.semibold} text-materialm-text-tertiary uppercase`}
                >
                  Station
                </span>
              </div>
              {isEditMode ? (
                <input
                  type="text"
                  value={editedFirefighter.fire_station || ""}
                  onChange={(e) =>
                    setEditedFirefighter({
                      ...editedFirefighter,
                      fire_station: e.target.value,
                    })
                  }
                  className={`
                    w-full
                    bg-materialm-dark
                    border border-materialm-border-dark
                    ${tokens.borders.radius.lg}
                    px-3 py-2
                    ${tokens.typography.heading.h2}
                    ${tokens.typography.weight.bold}
                    text-materialm-text-primary
                    focus:outline-none focus:ring-2 focus:ring-materialm-primary
                  `}
                  placeholder="Station #"
                />
              ) : (
                <p
                  className={`${tokens.typography.heading.h2} ${tokens.typography.weight.bold} text-materialm-text-primary`}
                >
                  {firefighter.fire_station
                    ? `#${firefighter.fire_station}`
                    : "Not assigned"}
                </p>
              )}
            </div>

            {/* Last Hold Card */}
            <div
              className={`bg-materialm-surface-dark border border-materialm-border-dark ${tokens.borders.radius.xl} p-4`}
            >
              <div
                className={`flex items-center ${tokens.spacing.gap.sm} mb-2`}
              >
                <Clock
                  size={16}
                  className="text-materialm-success"
                />
                <span
                  className={`${tokens.typography.body.small} ${tokens.typography.weight.semibold} text-materialm-text-tertiary uppercase`}
                >
                  Last Hold
                </span>
              </div>
              <p
                className={`${tokens.typography.body.secondary} ${tokens.typography.weight.semibold} text-materialm-text-primary`}
              >
                {firefighter.last_hold_date
                  ? formatHoldDate(firefighter.last_hold_date)
                  : "Never"}
              </p>
            </div>

            {/* Certification Level Card */}
            <div
              className={`bg-materialm-surface-dark border border-materialm-border-dark ${tokens.borders.radius.xl} p-4`}
            >
              <div
                className={`flex items-center ${tokens.spacing.gap.sm} mb-2`}
              >
                <Award
                  size={16}
                  className="text-materialm-warning"
                />
                <span
                  className={`${tokens.typography.body.small} ${tokens.typography.weight.semibold} text-materialm-text-tertiary uppercase`}
                >
                  Cert Level
                </span>
              </div>
              {isEditMode ? (
                <SelectM3
                  value={editedFirefighter.certification_level || ""}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    setEditedFirefighter({
                      ...editedFirefighter,
                      certification_level: e.target.value || null,
                    })
                  }
                  options={[
                    { value: "", label: "None" },
                    { value: "EMT", label: "EMT" },
                    { value: "EMT-A", label: "EMT-A" },
                    { value: "EMT-I", label: "EMT-I" },
                    { value: "Paramedic", label: "Paramedic" },
                  ]}
                  size="md"
                />
              ) : (
                <p
                  className={`${tokens.typography.body.secondary} ${tokens.typography.weight.bold} text-materialm-warning`}
                >
                  {firefighter.certification_level || "None"}
                </p>
              )}
            </div>
          </div>

          {/* Qualifications Section */}
          <div className="mb-6">
            <div className={`flex items-center ${tokens.spacing.gap.sm} mb-3`}>
              <Shield
                size={16}
                className="text-materialm-info"
              />
              <h3
                className={`${tokens.typography.body.secondary} ${tokens.typography.weight.bold} text-materialm-text-secondary uppercase`}
              >
                Qualifications
              </h3>
            </div>
            {isEditMode ? (
              <div className="space-y-2">
                <CheckboxM3
                  label="FTO (Field Training Officer)"
                  checked={editedFirefighter.is_fto || false}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setEditedFirefighter({
                      ...editedFirefighter,
                      is_fto: e.target.checked,
                    })
                  }
                />
                <CheckboxM3
                  label="BLS (Basic Life Support)"
                  checked={editedFirefighter.is_bls || false}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setEditedFirefighter({
                      ...editedFirefighter,
                      is_bls: e.target.checked,
                    })
                  }
                />
                <CheckboxM3
                  label="ALS (Advanced Life Support)"
                  checked={editedFirefighter.is_als || false}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setEditedFirefighter({
                      ...editedFirefighter,
                      is_als: e.target.checked,
                    })
                  }
                />
              </div>
            ) : qualifications.length > 0 ? (
              <div className={`flex ${tokens.spacing.gap.sm} flex-wrap`}>
                {qualifications.map((qual) => (
                  <BadgeM3
                    key={qual.label}
                    color={qual.color}
                    variant="tonal"
                    size="sm"
                  >
                    {qual.label}
                  </BadgeM3>
                ))}
              </div>
            ) : (
              <p
                className={`${tokens.typography.body.secondary} text-materialm-text-tertiary`}
              >
                No qualifications
              </p>
            )}
          </div>

          {/* Apparatus Clearances Section */}
          <div className="mb-6">
            <div className={`flex items-center ${tokens.spacing.gap.sm} mb-3`}>
              <Truck
                size={16}
                className="text-materialm-warning"
              />
              <h3
                className={`${tokens.typography.body.secondary} ${tokens.typography.weight.bold} text-materialm-text-secondary uppercase`}
              >
                Apparatus Clearances
              </h3>
            </div>
            <div className={`grid grid-cols-2 ${tokens.spacing.gap.sm}`}>
              {isEditMode ? (
                apparatusTypes.map((apparatus) => {
                  const IconComponent = apparatus.Icon;
                  return (
                    <label
                      key={apparatus.key}
                      className={`
                        bg-materialm-surface-dark
                        border border-materialm-border-dark
                        ${tokens.borders.radius.lg}
                        px-3 py-2 flex items-center ${tokens.spacing.gap.sm}
                        cursor-pointer hover:bg-materialm-dark
                        ${tokens.transitions.fast}
                      `}
                    >
                      <input
                        type="checkbox"
                        checked={editedFirefighter[apparatus.key] || false}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setEditedFirefighter({
                            ...editedFirefighter,
                            [apparatus.key]: e.target.checked,
                          })
                        }
                        className="w-4 h-4 rounded border-materialm-border-dark bg-materialm-dark text-materialm-warning focus:ring-2 focus:ring-materialm-warning"
                      />
                      <IconComponent
                        className={`w-4 h-4 text-materialm-text-tertiary`}
                      />
                      <span
                        className={`${tokens.typography.body.secondary} ${tokens.typography.weight.semibold} text-materialm-text-secondary`}
                      >
                        {apparatus.name}
                      </span>
                    </label>
                  );
                })
              ) : apparatusList.length > 0 ? (
                apparatusList.map((apparatus) => {
                  const IconComponent = apparatus.Icon;
                  return (
                    <div
                      key={apparatus.name}
                      className={`
                        bg-materialm-surface-dark
                        border border-materialm-border-dark
                        ${tokens.borders.radius.lg}
                        px-3 py-2 flex items-center ${tokens.spacing.gap.sm}
                      `}
                    >
                      <IconComponent
                        className={`w-4 h-4 text-materialm-text-tertiary`}
                      />
                      <span
                        className={`${tokens.typography.body.secondary} ${tokens.typography.weight.semibold} text-materialm-text-secondary`}
                      >
                        {apparatus.name}
                      </span>
                    </div>
                  );
                })
              ) : (
                <p
                  className={`${tokens.typography.body.secondary} text-materialm-text-tertiary col-span-2`}
                >
                  No apparatus clearances
                </p>
              )}
            </div>
          </div>

          {/* Hold History Section */}
          <div>
            <div className={`flex items-center ${tokens.spacing.gap.sm} mb-3`}>
              <Calendar
                size={16}
                className="text-materialm-primary"
              />
              <h3
                className={`${tokens.typography.body.secondary} ${tokens.typography.weight.bold} text-materialm-text-secondary uppercase`}
              >
                Hold History
              </h3>
            </div>

            {loading ? (
              <div
                className={`bg-materialm-surface-dark border border-materialm-border-dark ${tokens.borders.radius.xl} p-6 text-center`}
              >
                <div
                  className={`w-8 h-8 border-4 border-materialm-primary border-t-transparent ${
                    tokens.borders.radius.full
                  } animate-spin mx-auto mb-2`}
                ></div>
                <p
                  className={`${tokens.typography.body.secondary} text-materialm-text-tertiary`}
                >
                  Loading history...
                </p>
              </div>
            ) : holdRecords.length === 0 ? (
              <div
                className={`bg-materialm-surface-dark border border-materialm-border-dark ${tokens.borders.radius.xl} p-6 text-center`}
              >
                <Calendar
                  size={32}
                  className="text-materialm-text-tertiary mx-auto mb-3"
                />
                <p
                  className={`${tokens.typography.body.primary} text-materialm-text-secondary ${tokens.typography.weight.semibold} mb-1`}
                >
                  No previous holds
                </p>
                <p
                  className={`${tokens.typography.body.small} text-materialm-text-tertiary`}
                >
                  This firefighter has not completed any holds yet
                </p>
              </div>
            ) : (
              <>
                {/* Hold Stats */}
                <div
                  className={`grid grid-cols-2 ${tokens.spacing.gap.md} mb-4`}
                >
                  <div
                    className={`bg-materialm-success/10 border border-materialm-success/30 ${tokens.borders.radius.lg} p-3`}
                  >
                    <p
                      className={`${tokens.typography.heading.h1} ${tokens.typography.weight.bold} text-materialm-success`}
                    >
                      {completedHolds}
                    </p>
                    <p
                      className={`${tokens.typography.body.small} text-materialm-text-tertiary`}
                    >
                      Completed
                    </p>
                  </div>
                  <div
                    className={`bg-materialm-primary/10 border border-materialm-primary/30 ${tokens.borders.radius.lg} p-3`}
                  >
                    <p
                      className={`${tokens.typography.heading.h1} ${tokens.typography.weight.bold} text-materialm-primary`}
                    >
                      {scheduledHolds}
                    </p>
                    <p
                      className={`${tokens.typography.body.small} text-materialm-text-tertiary`}
                    >
                      Scheduled
                    </p>
                  </div>
                </div>

                {/* Hold Records List */}
                <div className="space-y-2">
                  {(showAllHolds ? holdRecords : holdRecords.slice(0, 3)).map(
                    (record) => (
                      <button
                        key={record.id}
                        onClick={() => setSelectedHoldForDetail(record)}
                        className={`
                          w-full
                          bg-materialm-surface-dark
                          border border-materialm-border-dark
                          hover:border-materialm-border-light
                          ${tokens.borders.radius.lg}
                          p-3 flex items-center justify-between
                          ${tokens.transitions.fast}
                          cursor-pointer
                        `}
                      >
                        <div className="flex-1 text-left">
                          <p
                            className={`${tokens.typography.body.secondary} ${tokens.typography.weight.semibold} text-materialm-text-primary`}
                          >
                            {formatHoldDate(record.hold_date)}
                          </p>
                          {record.fire_station && (
                            <p
                              className={`${tokens.typography.body.small} text-materialm-text-tertiary`}
                            >
                              Station #{record.fire_station}
                            </p>
                          )}
                        </div>
                        <BadgeM3
                          color={
                            record.status === "completed"
                              ? "success"
                              : record.status === "scheduled"
                              ? "primary"
                              : "neutral"
                          }
                          size="xs"
                        >
                          {record.status
                            ? record.status.charAt(0).toUpperCase() +
                              record.status.slice(1)
                            : "Unknown"}
                        </BadgeM3>
                      </button>
                    )
                  )}
                </div>

                {/* Expand/Collapse Button */}
                {holdRecords.length > 3 && (
                  <ButtonM3
                    onClick={() => setShowAllHolds(!showAllHolds)}
                    variant="outlined"
                    color="neutral"
                    fullWidth
                    className="mt-3"
                  >
                    {showAllHolds
                      ? `Show Less`
                      : `Show All ${holdRecords.length} Holds`}
                  </ButtonM3>
                )}

                {/* No Additional History Message */}
                {showAllHolds && holdRecords.length <= 3 && (
                  <div className="mt-3 bg-materialm-surface-dark border border-materialm-border-dark rounded-lg p-4 text-center">
                    <p className="text-sm text-materialm-text-tertiary">
                      No additional hold history
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Hold Detail Modal */}
      {selectedHoldForDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedHoldForDetail(null)}
          />
          <div
            className={`
              relative
              bg-materialm-dark
              border border-materialm-border-dark
              ${tokens.borders.radius.xl}
              shadow-materialm-5
              w-full max-w-md
            `}
          >
            <div
              className={`
                border-b-2 border-materialm-border-dark
                bg-materialm-darkgray
                p-4
              `}
            >
              <div className="flex items-center justify-between">
                <h3
                  className={`${tokens.typography.heading.h2} ${tokens.typography.weight.bold} text-materialm-text-primary`}
                >
                  Hold Details
                </h3>
                <button
                  onClick={() => setSelectedHoldForDetail(null)}
                  className={`p-2 hover:bg-materialm-surface-dark ${tokens.borders.radius.lg} ${tokens.transitions.fast}`}
                >
                  <X size={24} className="text-materialm-text-tertiary" />
                </button>
              </div>
            </div>

            <div className="p-5">
              <div className="space-y-4">
                {/* Hold Date */}
                <div>
                  <p
                    className={`${tokens.typography.body.small} text-materialm-text-tertiary uppercase tracking-wide mb-1`}
                  >
                    Hold Date
                  </p>
                  <p
                    className={`${tokens.typography.heading.h1} ${tokens.typography.weight.bold} text-materialm-text-primary`}
                  >
                    {selectedHoldForDetail.hold_date
                      ? new Date(
                          selectedHoldForDetail.hold_date
                        ).toLocaleDateString("en-US", {
                          weekday: "long",
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                          timeZone: "UTC",
                        })
                      : "N/A"}
                  </p>
                </div>

                {/* Firefighter Name */}
                <div>
                  <p
                    className={`${tokens.typography.body.small} text-materialm-text-tertiary uppercase tracking-wide mb-1`}
                  >
                    Firefighter
                  </p>
                  <p
                    className={`${tokens.typography.heading.h3} ${tokens.typography.weight.semibold} text-materialm-text-primary`}
                  >
                    {firefighter?.name}
                  </p>
                </div>

                {/* Station */}
                {selectedHoldForDetail.fire_station && (
                  <div>
                    <p
                      className={`${tokens.typography.body.small} text-materialm-text-tertiary uppercase tracking-wide mb-1`}
                    >
                      Station
                    </p>
                    <p
                      className={`${tokens.typography.heading.h3} ${tokens.typography.weight.semibold} text-materialm-text-primary`}
                    >
                      Station #{selectedHoldForDetail.fire_station}
                    </p>
                  </div>
                )}

                {/* Status */}
                <div>
                  <p
                    className={`${tokens.typography.body.small} text-materialm-text-tertiary uppercase tracking-wide mb-1`}
                  >
                    Status
                  </p>
                  <BadgeM3
                    color={
                      selectedHoldForDetail.status === "completed"
                        ? "success"
                        : "primary"
                    }
                    size="sm"
                  >
                    {selectedHoldForDetail.status
                      ? selectedHoldForDetail.status.charAt(0).toUpperCase() +
                        selectedHoldForDetail.status.slice(1)
                      : "Unknown"}
                  </BadgeM3>
                </div>

                {/* Completed Date */}
                {selectedHoldForDetail.completed_at && (
                  <div>
                    <p
                      className={`${tokens.typography.body.small} text-materialm-text-tertiary uppercase tracking-wide mb-1`}
                    >
                      Completed On
                    </p>
                    <p
                      className={`${tokens.typography.body.secondary} text-materialm-text-secondary`}
                    >
                      {new Date(
                        selectedHoldForDetail.completed_at
                      ).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                        timeZone: "UTC",
                      })}
                    </p>
                  </div>
                )}

                {/* Created Date */}
                <div>
                  <p
                    className={`${tokens.typography.body.small} text-materialm-text-tertiary uppercase tracking-wide mb-1`}
                  >
                    Scheduled On
                  </p>
                  <p
                    className={`${tokens.typography.body.secondary} text-materialm-text-secondary`}
                  >
                    {new Date(
                      selectedHoldForDetail.created_at
                    ).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      timeZone: "UTC",
                    })}
                  </p>
                </div>
              </div>

              <ButtonM3
                onClick={() => setSelectedHoldForDetail(null)}
                variant="outlined"
                color="neutral"
                fullWidth
                className="mt-6"
              >
                Close
              </ButtonM3>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
