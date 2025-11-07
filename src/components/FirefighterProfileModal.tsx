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
import { colors, tokens, visualHeadings, gridUtilities } from "../styles";
import { formatHoldDate } from "../utils/dateUtils";
import { ShiftBadge } from "./ShiftSelector";

interface HoldRecord {
  id: string;
  hold_date: string | null;
  fire_station: string | null;
  status: string | null;
  completed_at: string | null;
  created_at: string;
}

interface FirefighterProfileModalProps {
  isOpen: boolean;
  firefighter: Firefighter | null;
  onClose: () => void;
  isAdminMode?: boolean;
}

export function FirefighterProfileModal({
  isOpen,
  firefighter,
  onClose,
  isAdminMode = false,
}: FirefighterProfileModalProps) {
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
    editedFirefighter?.is_fto && { label: "FTO", color: "amber" },
    editedFirefighter?.is_bls && { label: "BLS", color: "emerald" },
    editedFirefighter?.is_als && { label: "ALS", color: "cyan" },
  ].filter(Boolean) as { label: string; color: string }[];

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
          ${colors.components.modal.background}
          ${colors.components.modal.border}
          ${tokens.borders.radius['2xl']}
          ${colors.components.modal.shadow}
          animate-scale-in
        `}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={`
            border-b-2 ${tokens.spacing.card.xl}
            flex items-center justify-between
            ${colors.structural.bg.surface}
            ${colors.structural.border.default}
          `}
        >
          <div className={`flex items-center ${tokens.spacing.gap.md}`}>
            <div
              className={`${colors.semantic.scheduled.gradient} ${tokens.spacing.section.lg} ${tokens.borders.radius.xl}`}
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
                    ${visualHeadings.displayLarge}
                    px-3 py-1
                    ${tokens.borders.radius.lg}
                    border-2
                    ${colors.components.input.default}
                    focus:outline-none focus:ring-2 focus:ring-blue-500
                  `}
                  placeholder="Firefighter name"
                />
              ) : (
                <h2
                  id="profile-modal-title"
                  className={`${tokens.typography.heading.h1} ${colors.structural.text.primary}`}
                >
                  {firefighter.name}
                </h2>
              )}
              <p
                className={`${tokens.typography.body.secondary} ${colors.structural.text.secondary}`}
              >
                Firefighter Profile
              </p>
            </div>
          </div>
          <div className={`flex items-center ${tokens.spacing.gap.sm}`}>
            {isAdminMode && (
              <button
                onClick={() => {
                  if (isEditMode) {
                    handleSave();
                  } else {
                    setIsEditMode(true);
                  }
                }}
                className={`
                  flex items-center ${tokens.spacing.gap.sm}
                  px-4 py-2 ${tokens.borders.radius.lg}
                  ${tokens.typography.weight.medium}
                  ${tokens.transitions.fast}
                  ${
                    isEditMode
                      ? colors.components.button.success
                      : `${colors.semantic.warning.solid} hover:${colors.semantic.warning.hover} text-white`
                  }
                `}
                aria-label={isEditMode ? "Save changes" : "Edit profile"}
              >
                {isEditMode ? (
                  <>
                    <Save size={18} />
                    Save
                  </>
                ) : (
                  <>
                    <Edit size={18} />
                    Edit
                  </>
                )}
              </button>
            )}
            <button
              onClick={onClose}
              className={`
                p-2 ${tokens.touchTarget.min} ${tokens.borders.radius.lg}
                ${tokens.transitions.fast}
                ${colors.structural.text.tertiary}
                hover:bg-gray-700
                focus-ring
                flex items-center justify-center
              `}
              aria-label="Close profile dialog"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <div className={`p-6 overflow-y-auto max-h-[calc(90vh-120px)]`}>
          <div className={`${gridUtilities.form.responsiveGrid2} mb-6`}>
            <div
              className={`${colors.structural.bg.card} ${colors.structural.border.default} ${tokens.borders.radius.xl} p-4`}
            >
              <div
                className={`flex items-center ${tokens.spacing.gap.sm} mb-2`}
              >
                <Calendar
                  size={16}
                  className={`${colors.semantic.primary.solid.replace(
                    "bg-",
                    "text-"
                  )}`}
                />
                <span
                  className={`${tokens.typography.body.small} ${tokens.typography.weight.semibold} ${colors.structural.text.tertiary} uppercase`}
                >
                  Shift
                </span>
              </div>
              {isEditMode ? (
                <select
                  value={editedFirefighter.shift}
                  onChange={(e) =>
                    setEditedFirefighter({
                      ...editedFirefighter,
                      shift: e.target.value as Shift,
                    })
                  }
                  className={`w-full ${colors.components.input.default} ${tokens.typography.weight.semibold}`}
                >
                  <option value="A">Shift A</option>
                  <option value="B">Shift B</option>
                  <option value="C">Shift C</option>
                </select>
              ) : (
                <ShiftBadge shift={firefighter.shift as Shift} />
              )}
            </div>

            <div
              className={`${colors.structural.bg.card} ${colors.structural.border.default} ${tokens.borders.radius.xl} p-4`}
            >
              <div
                className={`flex items-center ${tokens.spacing.gap.sm} mb-2`}
              >
                <Building2
                  size={16}
                  className={`${colors.semantic.warning.solid.replace(
                    "bg-",
                    "text-"
                  )}`}
                />
                <span
                  className={`${tokens.typography.body.small} ${tokens.typography.weight.semibold} ${colors.structural.text.tertiary} uppercase`}
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
                  className={`w-full ${colors.components.input.default} ${visualHeadings.titleLarge}`}
                  placeholder="Station #"
                />
              ) : (
                <p
                  className={`${visualHeadings.titleMedium} ${colors.structural.text.primary}`}
                >
                  {firefighter.fire_station
                    ? `#${firefighter.fire_station}`
                    : "Not assigned"}
                </p>
              )}
            </div>

            <div
              className={`${colors.structural.bg.card} ${colors.structural.border.default} ${tokens.borders.radius.xl} p-4`}
            >
              <div
                className={`flex items-center ${tokens.spacing.gap.sm} mb-2`}
              >
                <Clock
                  size={16}
                  className={`${colors.semantic.success.solid.replace(
                    "bg-",
                    "text-"
                  )}`}
                />
                <span
                  className={`${tokens.typography.body.small} ${tokens.typography.weight.semibold} ${colors.structural.text.tertiary} uppercase`}
                >
                  Last Hold
                </span>
              </div>
              <p
                className={`${tokens.typography.body.secondary} ${tokens.typography.weight.semibold} ${colors.structural.text.primary}`}
              >
                {firefighter.last_hold_date
                  ? formatHoldDate(firefighter.last_hold_date)
                  : "Never"}
              </p>
            </div>

            <div
              className={`${colors.structural.bg.card} ${colors.structural.border.default} ${tokens.borders.radius.xl} p-4`}
            >
              <div
                className={`flex items-center ${tokens.spacing.gap.sm} mb-2`}
              >
                <Award
                  size={16}
                  className={`${colors.semantic.warning.solid.replace(
                    "bg-",
                    "text-"
                  )}`}
                />
                <span
                  className={`${tokens.typography.body.small} ${tokens.typography.weight.semibold} ${colors.structural.text.tertiary} uppercase`}
                >
                  Cert Level
                </span>
              </div>
              {isEditMode ? (
                <select
                  value={editedFirefighter.certification_level || ""}
                  onChange={(e) =>
                    setEditedFirefighter({
                      ...editedFirefighter,
                      certification_level: e.target.value || null,
                    })
                  }
                  className={`w-full ${colors.components.input.default} ${tokens.typography.weight.bold} ${tokens.typography.body.secondary}`}
                >
                  <option value="">None</option>
                  <option value="EMT">EMT</option>
                  <option value="EMT-A">EMT-A</option>
                  <option value="EMT-I">EMT-I</option>
                  <option value="Paramedic">Paramedic</option>
                </select>
              ) : (
                <p
                  className={`${tokens.typography.body.secondary} ${tokens.typography.weight.bold} text-amber-100`}
                >
                  {firefighter.certification_level || "None"}
                </p>
              )}
            </div>
          </div>

          <div className="mb-6">
            <div className={`flex items-center ${tokens.spacing.gap.sm} mb-3`}>
              <Shield
                size={16}
                className={`${colors.semantic.info.solid.replace(
                  "bg-",
                  "text-"
                )}`}
              />
              <h3
                className={`${tokens.typography.body.secondary} ${tokens.typography.weight.bold} ${colors.structural.text.secondary} uppercase`}
              >
                Qualifications
              </h3>
            </div>
            {isEditMode ? (
              <div className="space-y-2">
                <label
                  className={`flex items-center ${tokens.spacing.gap.md} ${colors.structural.bg.card} ${colors.structural.border.default} ${tokens.borders.radius.lg} px-3 py-2 cursor-pointer hover:bg-gray-800/50 ${tokens.transitions.fast}`}
                >
                  <input
                    type="checkbox"
                    checked={editedFirefighter.is_fto || false}
                    onChange={(e) =>
                      setEditedFirefighter({
                        ...editedFirefighter,
                        is_fto: e.target.checked,
                      })
                    }
                    className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-amber-500 focus:ring-2 focus:ring-amber-500"
                  />
                  <span
                    className={`${tokens.typography.body.secondary} ${tokens.typography.weight.semibold} ${colors.structural.text.secondary}`}
                  >
                    FTO (Field Training Officer)
                  </span>
                </label>
                <label
                  className={`flex items-center ${tokens.spacing.gap.md} ${colors.structural.bg.card} ${colors.structural.border.default} ${tokens.borders.radius.lg} px-3 py-2 cursor-pointer hover:bg-gray-800/50 ${tokens.transitions.fast}`}
                >
                  <input
                    type="checkbox"
                    checked={editedFirefighter.is_bls || false}
                    onChange={(e) =>
                      setEditedFirefighter({
                        ...editedFirefighter,
                        is_bls: e.target.checked,
                      })
                    }
                    className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-emerald-500 focus:ring-2 focus:ring-emerald-500"
                  />
                  <span
                    className={`${tokens.typography.body.secondary} ${tokens.typography.weight.semibold} ${colors.structural.text.secondary}`}
                  >
                    BLS (Basic Life Support)
                  </span>
                </label>
                <label
                  className={`flex items-center ${tokens.spacing.gap.md} ${colors.structural.bg.card} ${colors.structural.border.default} ${tokens.borders.radius.lg} px-3 py-2 cursor-pointer hover:bg-gray-800/50 ${tokens.transitions.fast}`}
                >
                  <input
                    type="checkbox"
                    checked={editedFirefighter.is_als || false}
                    onChange={(e) =>
                      setEditedFirefighter({
                        ...editedFirefighter,
                        is_als: e.target.checked,
                      })
                    }
                    className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-cyan-500 focus:ring-2 focus:ring-cyan-500"
                  />
                  <span
                    className={`${tokens.typography.body.secondary} ${tokens.typography.weight.semibold} ${colors.structural.text.secondary}`}
                  >
                    ALS (Advanced Life Support)
                  </span>
                </label>
              </div>
            ) : qualifications.length > 0 ? (
              <div className={`flex ${tokens.spacing.gap.sm} flex-wrap`}>
                {qualifications.map((qual) => (
                  <span
                    key={qual.label}
                    className={`px-3 py-1.5 ${tokens.borders.radius.lg} ${
                      tokens.typography.body.secondary
                    } ${tokens.typography.weight.bold} border ${
                      qual.color === "amber"
                        ? "bg-amber-900/30 text-amber-300 border-amber-700/50"
                        : qual.color === "emerald"
                        ? "bg-emerald-900/30 text-emerald-300 border-emerald-700/50"
                        : "bg-cyan-900/30 text-cyan-300 border-cyan-700/50"
                    }`}
                  >
                    {qual.label}
                  </span>
                ))}
              </div>
            ) : (
              <p
                className={`${tokens.typography.body.secondary} ${colors.structural.text.tertiary}`}
              >
                No qualifications
              </p>
            )}
          </div>

          <div className="mb-6">
            <div className={`flex items-center ${tokens.spacing.gap.sm} mb-3`}>
              <Truck
                size={16}
                className={`${colors.semantic.warning.solid.replace(
                  "bg-",
                  "text-"
                )}`}
              />
              <h3
                className={`${tokens.typography.body.secondary} ${tokens.typography.weight.bold} ${colors.structural.text.secondary} uppercase`}
              >
                Apparatus Clearances
              </h3>
            </div>
            <div className={gridUtilities.form.grid2Col}>
              {isEditMode ? (
                apparatusTypes.map((apparatus) => {
                  const IconComponent = apparatus.Icon;
                  return (
                    <label
                      key={apparatus.key}
                      className={`${colors.structural.bg.card} ${colors.structural.border.default} ${tokens.borders.radius.lg} px-3 py-2 flex items-center ${tokens.spacing.gap.sm} cursor-pointer hover:bg-gray-800/50 ${tokens.transitions.fast}`}
                    >
                      <input
                        type="checkbox"
                        checked={editedFirefighter[apparatus.key] || false}
                        onChange={(e) =>
                          setEditedFirefighter({
                            ...editedFirefighter,
                            [apparatus.key]: e.target.checked,
                          })
                        }
                        className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-orange-500 focus:ring-2 focus:ring-orange-500"
                      />
                      <IconComponent
                        className={`w-4 h-4 ${colors.structural.text.tertiary}`}
                      />
                      <span
                        className={`${tokens.typography.body.secondary} ${tokens.typography.weight.semibold} ${colors.structural.text.secondary}`}
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
                      className={`${colors.structural.bg.card} ${colors.structural.border.default} ${tokens.borders.radius.lg} px-3 py-2 flex items-center ${tokens.spacing.gap.sm}`}
                    >
                      <IconComponent
                        className={`w-4 h-4 ${colors.structural.text.tertiary}`}
                      />
                      <span
                        className={`${tokens.typography.body.secondary} ${tokens.typography.weight.semibold} ${colors.structural.text.secondary}`}
                      >
                        {apparatus.name}
                      </span>
                    </div>
                  );
                })
              ) : (
                <p
                  className={`${tokens.typography.body.secondary} ${colors.structural.text.tertiary} col-span-2`}
                >
                  No apparatus clearances
                </p>
              )}
            </div>
          </div>

          <div>
            <div className={`flex items-center ${tokens.spacing.gap.sm} mb-3`}>
              <Calendar
                size={16}
                className={`${colors.semantic.primary.solid.replace(
                  "bg-",
                  "text-"
                )}`}
              />
              <h3
                className={`${tokens.typography.body.secondary} ${tokens.typography.weight.bold} ${colors.structural.text.secondary} uppercase`}
              >
                Hold History
              </h3>
            </div>

            {loading ? (
              <div
                className={`${colors.structural.bg.card} ${colors.structural.border.default} ${tokens.borders.radius.xl} p-6 text-center`}
              >
                <div
                  className={`w-8 h-8 border-4 ${colors.semantic.primary.solid.replace(
                    "bg-",
                    "border-"
                  )} border-t-transparent ${
                    tokens.borders.radius.full
                  } animate-spin mx-auto mb-2`}
                ></div>
                <p
                  className={`${tokens.typography.body.secondary} ${colors.structural.text.tertiary}`}
                >
                  Loading history...
                </p>
              </div>
            ) : holdRecords.length === 0 ? (
              <div
                className={`${colors.structural.bg.card} ${colors.structural.border.default} ${tokens.borders.radius.xl} p-6 text-center`}
              >
                <Calendar
                  size={32}
                  className={`${colors.structural.text.tertiary.replace(
                    "text-",
                    ""
                  )} mx-auto mb-3`}
                />
                <p
                  className={`${tokens.typography.body.primary} ${colors.structural.text.secondary} ${tokens.typography.weight.semibold} mb-1`}
                >
                  No previous holds
                </p>
                <p
                  className={`${tokens.typography.body.small} ${colors.structural.text.tertiary}`}
                >
                  This firefighter has not completed any holds yet
                </p>
              </div>
            ) : (
              <>
                <div
                  className={`${gridUtilities.form.responsiveGrid2} mb-4`}
                >
                  <div
                    className={`${colors.semantic.success.light} border ${colors.semantic.success.border} ${tokens.borders.radius.lg} p-3`}
                  >
                    <p
                      className={`${visualHeadings.metricLarge} text-emerald-300`}
                    >
                      {completedHolds}
                    </p>
                    <p
                      className={`${tokens.typography.body.small} ${colors.structural.text.tertiary}`}
                    >
                      Completed
                    </p>
                  </div>
                  <div
                    className={`${colors.semantic.scheduled.light} border ${colors.semantic.scheduled.border} ${tokens.borders.radius.lg} p-3`}
                  >
                    <p
                      className={`${visualHeadings.metricLarge} text-blue-300`}
                    >
                      {scheduledHolds}
                    </p>
                    <p
                      className={`${tokens.typography.body.small} ${colors.structural.text.tertiary}`}
                    >
                      Scheduled
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  {(showAllHolds ? holdRecords : holdRecords.slice(0, 3)).map(
                    (record) => (
                      <button
                        key={record.id}
                        onClick={() => setSelectedHoldForDetail(record)}
                        className={`w-full ${colors.structural.bg.card} ${colors.structural.border.default} hover:${colors.structural.border.hover} ${tokens.borders.radius.lg} p-3 flex items-center justify-between ${tokens.transitions.fast} cursor-pointer`}
                      >
                        <div className="flex-1 text-left">
                          <p
                            className={`${tokens.typography.body.secondary} ${tokens.typography.weight.semibold} ${colors.structural.text.primary}`}
                          >
                            {formatHoldDate(record.hold_date)}
                          </p>
                          {record.fire_station && (
                            <p
                              className={`${tokens.typography.body.small} ${colors.structural.text.tertiary}`}
                            >
                              Station #{record.fire_station}
                            </p>
                          )}
                        </div>
                        <span
                          className={`px-2 py-1 ${tokens.borders.radius.md} ${
                            tokens.typography.body.small
                          } ${tokens.typography.weight.bold} ${
                            record.status === "completed"
                              ? `${colors.semantic.success.light} text-emerald-300 border ${colors.semantic.success.border}`
                              : record.status === "scheduled"
                              ? `${colors.semantic.scheduled.light} text-blue-300 border ${colors.semantic.scheduled.border}`
                              : `${colors.structural.bg.card} ${colors.structural.text.secondary}`
                          }`}
                        >
                          {record.status
                            ? record.status.charAt(0).toUpperCase() +
                              record.status.slice(1)
                            : "Unknown"}
                        </span>
                      </button>
                    )
                  )}
                </div>

                {/* Expand/Collapse Button */}
                {holdRecords.length > 3 && (
                  <button
                    onClick={() => setShowAllHolds(!showAllHolds)}
                    className={`w-full mt-3 ${colors.components.button.secondary} ${tokens.typography.weight.semibold} py-2 px-4 ${tokens.borders.radius.lg} ${tokens.transitions.fast}`}
                  >
                    {showAllHolds
                      ? `Show Less`
                      : `Show All ${holdRecords.length} Holds`}
                  </button>
                )}

                {/* No Additional History Message */}
                {showAllHolds && holdRecords.length <= 3 && (
                  <div className="mt-3 bg-gray-900/30 border border-gray-700 rounded-lg p-4 text-center">
                    <p className="text-sm text-gray-400">
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
            className={`absolute inset-0 ${colors.components.modal.overlay} backdrop-blur-sm`}
            onClick={() => setSelectedHoldForDetail(null)}
          />
          <div
            className={`relative ${colors.components.modal.background} ${tokens.borders.radius.xl} ${colors.components.modal.shadow} w-full max-w-md ${colors.components.modal.border}`}
          >
            <div
              className={`border-b-2 ${colors.structural.border.default} ${colors.structural.bg.surface} p-4`}
            >
              <div className="flex items-center justify-between">
                <h3
                  className={`${visualHeadings.titleMedium} ${colors.structural.text.primary}`}
                >
                  Hold Details
                </h3>
                <button
                  onClick={() => setSelectedHoldForDetail(null)}
                  className={`p-2 hover:bg-gray-700 ${tokens.borders.radius.lg} ${tokens.transitions.fast}`}
                >
                  <X size={24} className={colors.structural.text.tertiary} />
                </button>
              </div>
            </div>

            <div className="p-5">
              <div className="space-y-4">
                {/* Hold Date */}
                <div>
                  <p
                    className={`${tokens.typography.body.small} ${colors.structural.text.tertiary} uppercase tracking-wide mb-1`}
                  >
                    Hold Date
                  </p>
                  <p
                    className={`${visualHeadings.displayLarge} ${colors.structural.text.primary}`}
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
                    className={`${tokens.typography.body.small} ${colors.structural.text.tertiary} uppercase tracking-wide mb-1`}
                  >
                    Firefighter
                  </p>
                  <p
                    className={`${visualHeadings.subtitleLarge} ${colors.structural.text.primary}`}
                  >
                    {firefighter?.name}
                  </p>
                </div>

                {/* Station */}
                {selectedHoldForDetail.fire_station && (
                  <div>
                    <p
                      className={`${tokens.typography.body.small} ${colors.structural.text.tertiary} uppercase tracking-wide mb-1`}
                    >
                      Station
                    </p>
                    <p
                      className={`${visualHeadings.subtitleLarge} ${colors.structural.text.primary}`}
                    >
                      Station #{selectedHoldForDetail.fire_station}
                    </p>
                  </div>
                )}

                {/* Status */}
                <div>
                  <p
                    className={`${tokens.typography.body.small} ${colors.structural.text.tertiary} uppercase tracking-wide mb-1`}
                  >
                    Status
                  </p>
                  <span
                    className={`inline-block px-3 py-1.5 ${
                      tokens.borders.radius.md
                    } ${tokens.typography.body.secondary} ${
                      tokens.typography.weight.bold
                    } ${
                      selectedHoldForDetail.status === "completed"
                        ? `${colors.semantic.success.light} text-emerald-300 border-2 ${colors.semantic.success.border}`
                        : `${colors.semantic.scheduled.light} text-blue-300 border-2 ${colors.semantic.scheduled.border}`
                    }`}
                  >
                    {selectedHoldForDetail.status
                      ? selectedHoldForDetail.status.charAt(0).toUpperCase() +
                        selectedHoldForDetail.status.slice(1)
                      : "Unknown"}
                  </span>
                </div>

                {/* Completed Date */}
                {selectedHoldForDetail.completed_at && (
                  <div>
                    <p
                      className={`${tokens.typography.body.small} ${colors.structural.text.tertiary} uppercase tracking-wide mb-1`}
                    >
                      Completed On
                    </p>
                    <p
                      className={`${tokens.typography.body.secondary} ${colors.structural.text.secondary}`}
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
                    className={`${tokens.typography.body.small} ${colors.structural.text.tertiary} uppercase tracking-wide mb-1`}
                  >
                    Scheduled On
                  </p>
                  <p
                    className={`${tokens.typography.body.secondary} ${colors.structural.text.secondary}`}
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

              <button
                onClick={() => setSelectedHoldForDetail(null)}
                className={`w-full mt-6 ${colors.components.button.secondary} ${tokens.typography.weight.semibold} py-3 ${tokens.borders.radius.lg} ${tokens.transitions.fast}`}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
