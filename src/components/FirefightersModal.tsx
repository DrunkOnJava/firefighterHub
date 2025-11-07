import { Edit2, Save, Users, X, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useFocusReturn } from "../hooks/useFocusReturn";
import { useFocusTrap } from "../hooks/useFocusTrap";
import { Shift, supabase } from "../lib/supabase";
import { colors, tokens, visualHeadings, gridUtilities } from "../styles";
import { ShiftBadge } from "./ShiftSelector";
import type { Tables } from "../lib/database.types";
import { IconButton } from "./ui/IconButton";

type Firefighter = Tables<"firefighters">;

interface FirefightersModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
  isAdminMode?: boolean;
}

interface EditingProfile extends Firefighter {
  isEditing: boolean;
}

export function FirefightersModal({
  isOpen,
  onClose,
  onUpdate,
  isAdminMode = false,
}: FirefightersModalProps) {
  const [allFirefighters, setAllFirefighters] = useState<EditingProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterShift, setFilterShift] = useState<Shift | "ALL">("ALL");
  const trapRef = useFocusTrap(isOpen);
  useFocusReturn(isOpen);

  useEffect(() => {
    if (isOpen) {
      loadAllFirefighters();
    }
  }, [isOpen]);

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

  async function loadAllFirefighters() {
    try {
      const { data, error } = await supabase
        .from("firefighters")
        .select("*")
        .eq("is_active", true)
        .order("name");

      if (error) throw error;
      setAllFirefighters(
        (data || []).map((ff) => ({ ...ff, isEditing: false }))
      );
    } catch (error) {
      console.error("Error loading firefighters:", error);
    } finally {
      setLoading(false);
    }
  }

  function toggleEdit(id: string) {
    setAllFirefighters((prev) =>
      prev.map((ff) =>
        ff.id === id ? { ...ff, isEditing: !ff.isEditing } : ff
      )
    );
  }

  function updateField<K extends keyof Firefighter>(
    id: string,
    field: K,
    value: Firefighter[K]
  ) {
    setAllFirefighters((prev) =>
      prev.map((ff) => (ff.id === id ? { ...ff, [field]: value } : ff))
    );
  }

  async function saveProfile(firefighter: EditingProfile) {
    try {
      const { error } = await supabase
        .from("firefighters")
        .update({
          name: firefighter.name,
          fire_station: firefighter.fire_station,
          shift: firefighter.shift,
          certification_level: firefighter.certification_level,
          apparatus_ambulance: firefighter.apparatus_ambulance,
          apparatus_brush_truck: firefighter.apparatus_brush_truck,
          apparatus_engine: firefighter.apparatus_engine,
          apparatus_tanker: firefighter.apparatus_tanker,
          apparatus_truck: firefighter.apparatus_truck,
          apparatus_boat: firefighter.apparatus_boat,
          apparatus_utv: firefighter.apparatus_utv,
          apparatus_rescue_squad: firefighter.apparatus_rescue_squad,
          is_fto: firefighter.is_fto,
          is_bls: firefighter.is_bls,
          is_als: firefighter.is_als,
          updated_at: new Date().toISOString(),
        })
        .eq("id", firefighter.id);

      if (error) throw error;

      toggleEdit(firefighter.id);
      onUpdate();
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Failed to save profile. Please try again.");
    }
  }

  function parseNameForSorting(name: string): {
    lastName: string;
    firstName: string;
    fullName: string;
  } {
    const parts = name.trim().split(/\s+/);
    if (parts.length === 0) {
      return { lastName: "", firstName: "", fullName: name };
    }
    if (parts.length === 1) {
      return { lastName: parts[0], firstName: "", fullName: name };
    }
    const lastName = parts[parts.length - 1];
    const firstName = parts.slice(0, -1).join(" ");
    return { lastName, firstName, fullName: name };
  }

  function formatNameLastFirst(name: string): string {
    const { lastName, firstName } = parseNameForSorting(name);
    if (!firstName) return lastName;
    return `${lastName}, ${firstName}`;
  }

  const filteredAndSortedFirefighters = (
    filterShift === "ALL"
      ? allFirefighters
      : allFirefighters.filter((ff) => ff.shift === filterShift)
  ).sort((a, b) => {
    const aLastName = parseNameForSorting(a.name).lastName.toLowerCase();
    const bLastName = parseNameForSorting(b.name).lastName.toLowerCase();
    return aLastName.localeCompare(bLastName);
  });

  if (!isOpen) return null;

  const certificationLevels: (string | "")[] = [
    "",
    "EMT",
    "EMT-A",
    "EMT-I",
    "Paramedic",
  ];
  const shifts: Shift[] = ["A", "B", "C"];

  return (
    <div
      className={`fixed inset-0 ${colors.components.modal.overlay} backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in`}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="firefighters-modal-title"
    >
      <div
        ref={trapRef}
        className={`${colors.components.modal.background} ${colors.components.modal.border} ${colors.components.modal.shadow} ${tokens.borders.radius['2xl']} max-w-6xl w-full max-h-[90vh] overflow-hidden animate-scale-in`}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={`${colors.structural.bg.surface} border-b-2 ${colors.structural.border.default} ${tokens.spacing.card.xl} flex items-center justify-between sticky top-0 z-10`}
        >
          <div className={`flex items-center ${tokens.spacing.gap.md}`}>
            <div
              className={`${colors.semantic.warning.gradient} p-3 ${tokens.borders.radius.xl}`}
            >
              <Users className="text-white" size={24} />
            </div>
            <div>
              <h2
                id="firefighters-modal-title"
                className={`${tokens.typography.heading.h1} ${tokens.typography.weight.bold} ${colors.structural.text.primary}`}
              >
                All Firefighters
              </h2>
              <p
                className={`${tokens.typography.body.secondary} ${colors.structural.text.secondary}`}
              >
                Manage profiles and certifications
              </p>
            </div>
          </div>
          <IconButton
            icon={X}
            label="Close firefighters dialog"
            onClick={onClose}
            variant="default"
            size="md"
            isDarkMode={true}
          />
        </div>

        <div
          className={`${tokens.spacing.card.xl} border-b ${colors.structural.border.default}`}
        >
          <div className={`flex ${tokens.spacing.gap.sm}`}>
            <button
              onClick={() => setFilterShift("ALL")}
              className={`px-4 py-2 ${tokens.borders.radius.lg} ${
                tokens.typography.weight.semibold
              } ${tokens.transitions.fast} ${
                filterShift === "ALL"
                  ? colors.semantic.primary.solid + " text-white"
                  : `${colors.structural.bg.card} ${colors.structural.text.secondary} hover:bg-gray-600`
              }`}
            >
              All Shifts
            </button>
            {shifts.map((shift) => (
              <button
                key={shift}
                onClick={() => setFilterShift(shift)}
                className={`px-4 py-2 ${tokens.borders.radius.lg} ${
                  tokens.typography.weight.semibold
                } ${tokens.transitions.fast} ${
                  filterShift === shift
                    ? colors.semantic.primary.solid + " text-white"
                    : `${colors.structural.bg.card} ${colors.structural.text.secondary} hover:bg-gray-600`
                }`}
              >
                Shift {shift}
              </button>
            ))}
          </div>
        </div>

        <div
          className={`overflow-y-auto max-h-[calc(90vh-180px)] ${tokens.spacing.card.xl}`}
        >
          {loading ? (
            <div className="text-center py-12">
              <div
                className={`w-12 h-12 border-4 ${colors.semantic.primary.solid.replace(
                  "bg-",
                  "border-"
                )} border-t-transparent ${
                  tokens.borders.radius.full
                } animate-spin mx-auto mb-4`}
              ></div>
              <p className={colors.structural.text.tertiary}>
                Loading firefighters...
              </p>
            </div>
          ) : filteredAndSortedFirefighters.length === 0 ? (
            <div className="text-center py-12">
              <Users
                size={48}
                className={`${colors.structural.text.tertiary.replace(
                  "text-",
                  ""
                )} mx-auto mb-4`}
              />
              <p
                className={`${colors.structural.text.tertiary} ${visualHeadings.titleMedium}`}
              >
                No firefighters found
              </p>
            </div>
          ) : (
            <div className={`space-y-4`}>
              {filteredAndSortedFirefighters.map((firefighter) => (
                <div
                  key={firefighter.id}
                  className={`${colors.structural.bg.card} ${colors.structural.border.default} ${tokens.borders.radius.lg} ${tokens.spacing.card.xl} hover:bg-gray-900/70 ${tokens.transitions.fast}`}
                >
                  {firefighter.isEditing ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between mb-4">
                        <input
                          type="text"
                          value={firefighter.name}
                          onChange={(e) =>
                            updateField(firefighter.id, "name", e.target.value)
                          }
                          className={`${visualHeadings.titleLarge} ${colors.components.input.default} w-full max-w-md`}
                        />
                        <div className={`flex ${tokens.spacing.gap.sm}`}>
                          <button
                            onClick={() => saveProfile(firefighter)}
                            className={`px-4 py-2 ${colors.components.button.success} ${tokens.borders.radius.lg} flex items-center ${tokens.spacing.gap.sm} ${tokens.typography.weight.semibold} ${tokens.transitions.fast}`}
                          >
                            <Save size={18} />
                            Save
                          </button>
                          <button
                            onClick={() => toggleEdit(firefighter.id)}
                            className={`px-4 py-2 ${colors.components.button.secondary} ${tokens.borders.radius.lg} flex items-center ${tokens.spacing.gap.sm} ${tokens.typography.weight.semibold} ${tokens.transitions.fast}`}
                          >
                            <XCircle size={18} />
                            Cancel
                          </button>
                        </div>
                      </div>

                      <div
                        className={gridUtilities.form.responsiveGrid3}
                      >
                        <div>
                          <label
                            className={`${tokens.typography.body.secondary} ${tokens.typography.weight.semibold} ${colors.structural.text.tertiary} mb-2 block`}
                          >
                            Shift
                          </label>
                          <select
                            value={firefighter.shift}
                            onChange={(e) =>
                              updateField(
                                firefighter.id,
                                "shift",
                                e.target.value as Shift
                              )
                            }
                            className={`w-full ${colors.components.input.default}`}
                          >
                            {shifts.map((shift) => (
                              <option key={shift} value={shift}>
                                Shift {shift}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label
                            className={`${tokens.typography.body.secondary} ${tokens.typography.weight.semibold} ${colors.structural.text.tertiary} mb-2 block`}
                          >
                            Station Number
                          </label>
                          <input
                            type="text"
                            value={firefighter.fire_station || ""}
                            onChange={(e) =>
                              updateField(
                                firefighter.id,
                                "fire_station",
                                e.target.value || null
                              )
                            }
                            className={`w-full ${colors.components.input.default}`}
                            placeholder="e.g., 1"
                          />
                        </div>

                        <div>
                          <label
                            className={`${tokens.typography.body.secondary} ${tokens.typography.weight.semibold} ${colors.structural.text.tertiary} mb-2 block`}
                          >
                            Certification Level
                          </label>
                          <select
                            value={firefighter.certification_level || ""}
                            onChange={(e) =>
                              updateField(
                                firefighter.id,
                                "certification_level",
                                e.target.value || null
                              )
                            }
                            className={`w-full ${colors.components.input.default}`}
                          >
                            <option value="">Not specified</option>
                            {certificationLevels.slice(1).map((level) => (
                              <option key={level} value={level}>
                                {level}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label
                          className={`${tokens.typography.body.secondary} ${tokens.typography.weight.semibold} ${colors.structural.text.tertiary} mb-3 block`}
                        >
                          Apparatus Clearances
                        </label>
                        <div
                          className={gridUtilities.form.responsiveGrid4}
                        >
                          {[
                            { key: "apparatus_ambulance", label: "Ambulance" },
                            {
                              key: "apparatus_brush_truck",
                              label: "Brush Truck",
                            },
                            { key: "apparatus_engine", label: "Engine" },
                            { key: "apparatus_tanker", label: "Tanker" },
                            { key: "apparatus_truck", label: "Truck" },
                            { key: "apparatus_boat", label: "Boat" },
                            { key: "apparatus_utv", label: "UTV" },
                            {
                              key: "apparatus_rescue_squad",
                              label: "Rescue Squad",
                            },
                          ].map((apparatus) => (
                            <label
                              key={apparatus.key}
                              className={`flex items-center ${tokens.spacing.gap.sm} cursor-pointer`}
                            >
                              <input
                                type="checkbox"
                                checked={
                                  (firefighter[
                                    apparatus.key as keyof Firefighter
                                  ] as boolean) || false
                                }
                                onChange={(e) =>
                                  updateField(
                                    firefighter.id,
                                    apparatus.key as keyof Firefighter,
                                    e.target.checked
                                  )
                                }
                                className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-blue-600 focus:ring-2 focus:ring-blue-500"
                              />
                              <span
                                className={`${tokens.typography.body.secondary} ${colors.structural.text.secondary}`}
                              >
                                {apparatus.label}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label
                          className={`${tokens.typography.body.secondary} ${tokens.typography.weight.semibold} ${colors.structural.text.tertiary} mb-3 block`}
                        >
                          Certifications & Roles
                        </label>
                        <div
                          className={gridUtilities.form.grid3Col}
                        >
                          <label
                            className={`flex items-center ${tokens.spacing.gap.sm} cursor-pointer bg-amber-900/20 px-3 py-2 ${tokens.borders.radius.lg} hover:bg-amber-900/30 border border-amber-700/50 ${tokens.transitions.fast}`}
                          >
                            <input
                              type="checkbox"
                              checked={firefighter.is_fto || false}
                              onChange={(e) =>
                                updateField(
                                  firefighter.id,
                                  "is_fto",
                                  e.target.checked
                                )
                              }
                              className="w-4 h-4 rounded border-amber-600 bg-gray-800 text-amber-600 focus:ring-2 focus:ring-amber-500"
                            />
                            <span
                              className={`${tokens.typography.body.secondary} ${tokens.typography.weight.semibold} text-amber-300`}
                            >
                              FTO
                            </span>
                          </label>
                          <label
                            className={`flex items-center ${tokens.spacing.gap.sm} cursor-pointer bg-emerald-900/20 px-3 py-2 ${tokens.borders.radius.lg} hover:bg-emerald-900/30 border border-emerald-700/50 ${tokens.transitions.fast}`}
                          >
                            <input
                              type="checkbox"
                              checked={firefighter.is_bls || false}
                              onChange={(e) =>
                                updateField(
                                  firefighter.id,
                                  "is_bls",
                                  e.target.checked
                                )
                              }
                              className="w-4 h-4 rounded border-emerald-600 bg-gray-800 text-emerald-600 focus:ring-2 focus:ring-emerald-500"
                            />
                            <span
                              className={`${tokens.typography.body.secondary} ${tokens.typography.weight.semibold} text-emerald-300`}
                            >
                              BLS
                            </span>
                          </label>
                          <label
                            className={`flex items-center ${tokens.spacing.gap.sm} cursor-pointer bg-cyan-900/20 px-3 py-2 ${tokens.borders.radius.lg} hover:bg-cyan-900/30 border border-cyan-700/50 ${tokens.transitions.fast}`}
                          >
                            <input
                              type="checkbox"
                              checked={firefighter.is_als || false}
                              onChange={(e) =>
                                updateField(
                                  firefighter.id,
                                  "is_als",
                                  e.target.checked
                                )
                              }
                              className="w-4 h-4 rounded border-cyan-600 bg-gray-800 text-cyan-600 focus:ring-2 focus:ring-cyan-500"
                            />
                            <span
                              className={`${tokens.typography.body.secondary} ${tokens.typography.weight.semibold} text-cyan-300`}
                            >
                              ALS
                            </span>
                          </label>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div
                          className={`flex items-center ${tokens.spacing.gap.md}`}
                        >
                          <h3
                            className={`${tokens.typography.heading.h2} ${tokens.typography.weight.bold} ${colors.structural.text.primary}`}
                          >
                            {formatNameLastFirst(firefighter.name)}
                          </h3>
                          <ShiftBadge shift={firefighter.shift as Shift} />
                          {firefighter.fire_station && (
                            <span
                              className={`px-2 py-1 ${colors.structural.bg.card} ${colors.structural.text.secondary} ${tokens.borders.radius.md} ${tokens.typography.body.secondary} ${tokens.typography.weight.semibold}`}
                            >
                              Station #{firefighter.fire_station}
                            </span>
                          )}
                        </div>
                        {isAdminMode && (
                          <button
                            onClick={() => toggleEdit(firefighter.id)}
                            className={`px-4 py-2 ${colors.semantic.info.solid} hover:${colors.semantic.info.hover} text-white ${tokens.borders.radius.lg} flex items-center ${tokens.spacing.gap.sm} ${tokens.typography.weight.semibold} ${tokens.transitions.fast}`}
                          >
                            <Edit2 size={18} />
                            Edit
                          </button>
                        )}
                      </div>

                      <div
                        className={`${gridUtilities.form.responsiveGrid2} mb-4`}
                      >
                        <div>
                          <span
                            className={`${tokens.typography.body.secondary} ${tokens.typography.weight.semibold} ${colors.structural.text.tertiary}`}
                          >
                            Certification:
                          </span>
                          <span
                            className={`ml-2 ${colors.structural.text.secondary}`}
                          >
                            {firefighter.certification_level || "Not specified"}
                          </span>
                        </div>
                      </div>

                      {(firefighter.is_fto ||
                        firefighter.is_bls ||
                        firefighter.is_als) && (
                        <div className="mb-4">
                          <span
                            className={`${tokens.typography.body.secondary} ${tokens.typography.weight.semibold} ${colors.structural.text.tertiary} block mb-2`}
                          >
                            Certifications & Roles:
                          </span>
                          <div
                            className={`flex flex-wrap ${tokens.spacing.gap.sm}`}
                          >
                            {firefighter.is_fto && (
                              <span
                                className={`px-3 py-1 bg-amber-900/30 text-amber-300 border border-amber-700/50 ${tokens.borders.radius.md} ${tokens.typography.body.small} ${tokens.typography.weight.bold}`}
                              >
                                FTO
                              </span>
                            )}
                            {firefighter.is_bls && (
                              <span
                                className={`px-3 py-1 bg-emerald-900/30 text-emerald-300 border border-emerald-700/50 ${tokens.borders.radius.md} ${tokens.typography.body.small} ${tokens.typography.weight.bold}`}
                              >
                                BLS
                              </span>
                            )}
                            {firefighter.is_als && (
                              <span
                                className={`px-3 py-1 bg-cyan-900/30 text-cyan-300 border border-cyan-700/50 ${tokens.borders.radius.md} ${tokens.typography.body.small} ${tokens.typography.weight.bold}`}
                              >
                                ALS
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      <div>
                        <span
                          className={`${tokens.typography.body.secondary} ${tokens.typography.weight.semibold} ${colors.structural.text.tertiary} block mb-2`}
                        >
                          Apparatus Clearances:
                        </span>
                        <div
                          className={`flex flex-wrap ${tokens.spacing.gap.sm}`}
                        >
                          {[
                            { key: "apparatus_ambulance", label: "Ambulance" },
                            {
                              key: "apparatus_brush_truck",
                              label: "Brush Truck",
                            },
                            { key: "apparatus_engine", label: "Engine" },
                            { key: "apparatus_tanker", label: "Tanker" },
                            { key: "apparatus_truck", label: "Truck" },
                            { key: "apparatus_boat", label: "Boat" },
                            { key: "apparatus_utv", label: "UTV" },
                            {
                              key: "apparatus_rescue_squad",
                              label: "Rescue Squad",
                            },
                          ]
                            .filter(
                              (apparatus) =>
                                firefighter[apparatus.key as keyof Firefighter]
                            )
                            .map((apparatus) => (
                              <span
                                key={apparatus.key}
                                className={`px-3 py-1 bg-amber-950/70 text-amber-300 border border-amber-800 ${tokens.borders.radius.full} ${tokens.typography.body.small} ${tokens.typography.weight.semibold}`}
                              >
                                {apparatus.label}
                              </span>
                            ))}
                          {![
                            "apparatus_ambulance",
                            "apparatus_brush_truck",
                            "apparatus_engine",
                            "apparatus_tanker",
                            "apparatus_truck",
                            "apparatus_boat",
                            "apparatus_utv",
                            "apparatus_rescue_squad",
                          ].some(
                            (key) => firefighter[key as keyof Firefighter]
                          ) && (
                            <span
                              className={`${tokens.typography.body.secondary} ${colors.structural.text.tertiary}`}
                            >
                              None specified
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
