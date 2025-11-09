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
import { formatHoldDate } from "../utils/dateUtils";
import { ShiftBadge } from "./ShiftSelector";
import { IconButton } from "./ui/IconButton";

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
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/90 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="profile-modal-title"
    >
      <div
        ref={trapRef}
        className="max-w-2xl w-full max-h-[90vh] overflow-hidden bg-card border border-border rounded-2xl shadow-2xl animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="border-b-2 p-6 flex items-center justify-between bg-muted/50 border-border">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-3 rounded-xl">
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
                  className="text-3xl font-bold px-3 py-1 rounded-lg border-2 bg-background border-input text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Firefighter name"
                />
              ) : (
                <h2
                  id="profile-modal-title"
                  className="text-2xl font-bold text-foreground"
                >
                  {firefighter.name}
                </h2>
              )}
              <p className="text-sm text-muted-foreground">
                Firefighter Profile
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isAdminMode && (
              <button
                onClick={() => {
                  if (isEditMode) {
                    handleSave();
                  } else {
                    setIsEditMode(true);
                  }
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  isEditMode
                    ? "bg-green-600 hover:bg-green-700 text-white"
                    : "bg-orange-600 hover:bg-orange-700 text-white"
                }`}
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
            <IconButton
              icon={X}
              label="Close profile dialog"
              onClick={onClose}
              variant="default"
              size="md"
              isDarkMode={true}
            />
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Calendar size={16} className="text-blue-500" />
                <span className="text-xs font-semibold text-muted-foreground uppercase">
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
                  className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="A">Shift A</option>
                  <option value="B">Shift B</option>
                  <option value="C">Shift C</option>
                </select>
              ) : (
                <ShiftBadge shift={firefighter.shift as Shift} />
              )}
            </div>

            <div className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Building2 size={16} className="text-orange-500" />
                <span className="text-xs font-semibold text-muted-foreground uppercase">
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
                  className="w-full bg-background border border-input rounded-md px-3 py-2 text-lg font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Station #"
                />
              ) : (
                <p className="text-lg font-semibold text-foreground">
                  {firefighter.fire_station
                    ? `#${firefighter.fire_station}`
                    : "Not assigned"}
                </p>
              )}
            </div>

            <div className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock size={16} className="text-green-500" />
                <span className="text-xs font-semibold text-muted-foreground uppercase">
                  Last Hold
                </span>
              </div>
              <p className="text-sm font-semibold text-foreground">
                {firefighter.last_hold_date
                  ? formatHoldDate(firefighter.last_hold_date)
                  : "Never"}
              </p>
            </div>

            <div className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Award size={16} className="text-amber-500" />
                <span className="text-xs font-semibold text-muted-foreground uppercase">
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
                  className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">None</option>
                  <option value="EMT">EMT</option>
                  <option value="EMT-A">EMT-A</option>
                  <option value="EMT-I">EMT-I</option>
                  <option value="Paramedic">Paramedic</option>
                </select>
              ) : (
                <p className="text-sm font-bold text-amber-100">
                  {firefighter.certification_level || "None"}
                </p>
              )}
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Shield size={16} className="text-blue-400" />
              <h3 className="text-sm font-bold text-muted-foreground uppercase">
                Qualifications
              </h3>
            </div>
            {isEditMode ? (
              <div className="space-y-2">
                <label
                  className={`flex items-center gap-4 bg-card border border-border rounded-lg px-3 py-2 cursor-pointer hover:bg-slate-800/50 transition-colors`}
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
                    className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-amber-500 focus:ring-2 focus:ring-amber-500"
                  />
                  <span
                    className={`text-sm font-semibold text-muted-foreground`}
                  >
                    FTO (Field Training Officer)
                  </span>
                </label>
                <label
                  className={`flex items-center gap-4 bg-card border border-border rounded-lg px-3 py-2 cursor-pointer hover:bg-slate-800/50 transition-colors`}
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
                    className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-emerald-500 focus:ring-2 focus:ring-emerald-500"
                  />
                  <span
                    className={`text-sm font-semibold text-muted-foreground`}
                  >
                    BLS (Basic Life Support)
                  </span>
                </label>
                <label
                  className={`flex items-center gap-4 bg-card border border-border rounded-lg px-3 py-2 cursor-pointer hover:bg-slate-800/50 transition-colors`}
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
                    className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-cyan-500 focus:ring-2 focus:ring-cyan-500"
                  />
                  <span
                    className={`text-sm font-semibold text-muted-foreground`}
                  >
                    ALS (Advanced Life Support)
                  </span>
                </label>
              </div>
            ) : qualifications.length > 0 ? (
              <div className={`flex gap-2 flex-wrap`}>
                {qualifications.map((qual) => (
                  <span
                    key={qual.label}
                    className={`px-3 py-1.5 rounded-lg text-sm font-bold border ${
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
                className={`text-sm text-muted-foreground`}
              >
                No qualifications
              </p>
            )}
          </div>

          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Truck size={16} className="text-orange-500" />
              <h3 className="text-sm font-bold text-muted-foreground uppercase">
                Apparatus Clearances
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {isEditMode ? (
                apparatusTypes.map((apparatus) => {
                  const IconComponent = apparatus.Icon;
                  return (
                    <label
                      key={apparatus.key}
                      className="bg-card border border-border rounded-lg px-3 py-2 flex items-center gap-2 cursor-pointer hover:bg-muted/50 transition-colors"
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
                        className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-orange-500 focus:ring-2 focus:ring-orange-500"
                      />
                      <IconComponent className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-semibold text-muted-foreground">
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
                      className="bg-card border border-border rounded-lg px-3 py-2 flex items-center gap-2"
                    >
                      <IconComponent className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-semibold text-muted-foreground">
                        {apparatus.name}
                      </span>
                    </div>
                  );
                })
              ) : (
                <p className="text-sm text-muted-foreground col-span-2">
                  No apparatus clearances
                </p>
              )}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <Calendar size={16} className="text-blue-500" />
              <h3 className="text-sm font-bold text-muted-foreground uppercase">
                Hold History
              </h3>
            </div>

            {loading ? (
              <div className="bg-card border border-border rounded-xl p-6 text-center">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                <p className="text-sm text-muted-foreground">
                  Loading history...
                </p>
              </div>
            ) : holdRecords.length === 0 ? (
              <div className="bg-card border border-border rounded-xl p-6 text-center">
                <Calendar size={32} className="text-muted-foreground mx-auto mb-3" />
                <p className="text-base text-muted-foreground font-semibold mb-1">
                  No previous holds
                </p>
                <p className="text-xs text-muted-foreground">
                  This firefighter has not completed any holds yet
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div className="bg-emerald-900/20 border border-emerald-700/50 rounded-lg p-3">
                    <p className="text-4xl font-bold text-emerald-300">
                      {completedHolds}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Completed
                    </p>
                  </div>
                  <div className="bg-blue-900/20 border border-blue-700/50 rounded-lg p-3">
                    <p className="text-4xl font-bold text-blue-300">
                      {scheduledHolds}
                    </p>
                    <p className="text-xs text-muted-foreground">
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
                        className="w-full bg-card border border-border hover:border-muted-foreground rounded-lg p-3 flex items-center justify-between transition-colors cursor-pointer"
                      >
                        <div className="flex-1 text-left">
                          <p className="text-sm font-semibold text-foreground">
                            {formatHoldDate(record.hold_date)}
                          </p>
                          {record.fire_station && (
                            <p className="text-xs text-muted-foreground">
                              Station #{record.fire_station}
                            </p>
                          )}
                        </div>
                        <span
                          className={`px-2 py-1 rounded-md text-xs font-bold ${
                            record.status === "completed"
                              ? "bg-emerald-900/20 text-emerald-300 border border-emerald-700/50"
                              : record.status === "scheduled"
                              ? "bg-blue-900/20 text-blue-300 border border-blue-700/50"
                              : "bg-card text-muted-foreground"
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
                    className="w-full mt-3 bg-secondary hover:bg-secondary/80 text-secondary-foreground font-semibold py-2 px-4 rounded-lg transition-colors"
                  >
                    {showAllHolds
                      ? `Show Less`
                      : `Show All ${holdRecords.length} Holds`}
                  </button>
                )}

                {/* No Additional History Message */}
                {showAllHolds && holdRecords.length <= 3 && (
                  <div className="mt-3 bg-slate-900/30 border border-slate-700 rounded-lg p-4 text-center">
                    <p className="text-sm text-slate-400">
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
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
          <div
            className={`absolute inset-0 bg-black/50 backdrop-blur-sm`}
            onClick={() => setSelectedHoldForDetail(null)}
          />
          <div
            className={`relative bg-card rounded-xl shadow-2xl w-full max-w-md border-2 border-border`}
          >
            <div
              className={`border-b-2 border border-border bg-muted/50 p-4`}
            >
              <div className="flex items-center justify-between">
                <h3
                  className={`text-lg font-medium text-foreground`}
                >
                  Hold Details
                </h3>
                <IconButton
                  icon={X}
                  label="Close hold details"
                  onClick={() => setSelectedHoldForDetail(null)}
                  variant="default"
                  size="md"
                  isDarkMode={true}
                />
              </div>
            </div>

            <div className="p-5">
              <div className="space-y-4">
                {/* Hold Date */}
                <div>
                  <p
                    className={`text-xs text-muted-foreground uppercase tracking-wide mb-1`}
                  >
                    Hold Date
                  </p>
                  <p
                    className={`text-4xl font-bold text-foreground`}
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
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                    Firefighter
                  </p>
                  <p className="text-xl font-semibold text-foreground">
                    {firefighter?.name}
                  </p>
                </div>

                {/* Station */}
                {selectedHoldForDetail.fire_station && (
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                      Station
                    </p>
                    <p className="text-xl font-semibold text-foreground">
                      Station #{selectedHoldForDetail.fire_station}
                    </p>
                  </div>
                )}

                {/* Status */}
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                    Status
                  </p>
                  <span
                    className={`inline-block px-3 py-1.5 rounded-md text-sm font-bold ${
                      selectedHoldForDetail.status === "completed"
                        ? "bg-emerald-900/20 text-emerald-300 border-2 border-emerald-700/50"
                        : "bg-blue-900/20 text-blue-300 border-2 border-blue-700/50"
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
                      className={`text-xs text-muted-foreground uppercase tracking-wide mb-1`}
                    >
                      Completed On
                    </p>
                    <p
                      className={`text-sm text-muted-foreground`}
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
                    className={`text-xs text-muted-foreground uppercase tracking-wide mb-1`}
                  >
                    Scheduled On
                  </p>
                  <p
                    className={`text-sm text-muted-foreground`}
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
                className={`w-full mt-6 bg-secondary hover:bg-secondary/80 text-secondary-foreground font-semibold py-3 rounded-lg transition-colors`}
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
