/**
 * FirefightersModal - Roster Management Modal
 *
 * Modal for viewing and managing all firefighters across shifts.
 * Automatically switches between MaterialM and legacy styling based on feature flag.
 *
 * Features:
 * - View all firefighters
 * - Filter by shift
 * - Inline editing
 * - Deactivate firefighters
 *
 * @example
 * ```tsx
 * <FirefightersModal
 *   isOpen={isOpen}
 *   onClose={handleClose}
 *   onUpdate={handleUpdate}
 *   isAdminMode={isAdminMode}
 * />
 * ```
 */

import { Edit2, Save, Users, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useFeatureFlag } from "../hooks/useFeatureFlag";
import { useFocusReturn } from "../hooks/useFocusReturn";
import { useFocusTrap } from "../hooks/useFocusTrap";
import { Shift, supabase } from "../lib/supabase";
import { DialogM3 } from "./m3/DialogM3";
import { ButtonM3, IconButtonM3 } from "./m3/ButtonM3";
import { SelectM3 } from "./m3/InputM3";
import { BadgeM3 } from "./m3/BadgeM3";
import { ShiftBadge } from "./ShiftBadge";
import { FirefightersModalLegacy } from "./FirefightersModalLegacy";
import type { Tables } from "../lib/database.types";

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

/**
 * MaterialM Firefighters Modal
 */
function FirefightersModalM3({
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

  async function handleSave(id: string) {
    const firefighter = allFirefighters.find((ff) => ff.id === id);
    if (!firefighter) return;

    try {
      const { error } = await supabase
        .from("firefighters")
        .update({
          name: firefighter.name,
          fire_station: firefighter.fire_station,
        })
        .eq("id", id);

      if (error) throw error;
      toggleEdit(id);
      onUpdate();
    } catch (error) {
      console.error("Error updating firefighter:", error);
    }
  }

  async function handleDeactivate(id: string) {
    if (!confirm("Are you sure you want to deactivate this firefighter?"))
      return;

    try {
      const { error } = await supabase
        .from("firefighters")
        .update({ is_active: false })
        .eq("id", id);

      if (error) throw error;
      await loadAllFirefighters();
      onUpdate();
    } catch (error) {
      console.error("Error deactivating firefighter:", error);
    }
  }

  function updateField(id: string, field: string, value: string) {
    setAllFirefighters((prev) =>
      prev.map((ff) =>
        ff.id === id ? { ...ff, [field]: value } : ff
      )
    );
  }

  const filteredFirefighters =
    filterShift === "ALL"
      ? allFirefighters
      : allFirefighters.filter((ff) => ff.shift === filterShift);

  const shiftFilterOptions = [
    { value: "ALL", label: "All Shifts" },
    { value: "A", label: "Shift A" },
    { value: "B", label: "Shift B" },
    { value: "C", label: "Shift C" },
  ];

  if (!isOpen) return null;

  return (
    <DialogM3 show={isOpen} onClose={onClose} size="full">
      {/* Custom Header */}
      <div
        ref={trapRef}
        className="p-6 border-b border-gray-200 dark:border-gray-700 bg-blue-50 dark:bg-blue-900/20"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-600">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Manage Team
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {filteredFirefighters.length} firefighter
                {filteredFirefighters.length !== 1 ? "s" : ""}
                {filterShift !== "ALL" && ` in Shift ${filterShift}`}
              </p>
            </div>
          </div>
          <SelectM3
            value={filterShift}
            onChange={(e) => setFilterShift(e.target.value as Shift | "ALL")}
            options={shiftFilterOptions}
            size="sm"
            className="w-40"
          />
        </div>
      </div>

      <DialogM3.Body>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase text-gray-700 dark:text-gray-300">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase text-gray-700 dark:text-gray-300">
                    Shift
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase text-gray-700 dark:text-gray-300">
                    Station
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase text-gray-700 dark:text-gray-300">
                    Status
                  </th>
                  {isAdminMode && (
                    <th className="px-4 py-3 text-right text-xs font-bold uppercase text-gray-700 dark:text-gray-300">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredFirefighters.map((ff) => (
                  <tr
                    key={ff.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <td className="px-4 py-3">
                      {ff.isEditing ? (
                        <input
                          type="text"
                          value={ff.name}
                          onChange={(e) => updateField(ff.id, "name", e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <span className="font-medium text-gray-900 dark:text-white">
                          {ff.name}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <ShiftBadge shift={ff.shift as Shift} />
                    </td>
                    <td className="px-4 py-3">
                      {ff.isEditing ? (
                        <input
                          type="text"
                          value={ff.fire_station || ""}
                          onChange={(e) =>
                            updateField(ff.id, "fire_station", e.target.value)
                          }
                          placeholder="Station #"
                          className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {ff.fire_station ? `#${ff.fire_station}` : "—"}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <BadgeM3
                        color={ff.is_available ? "success" : "neutral"}
                        size="xs"
                      >
                        {ff.is_available ? "Available" : "Unavailable"}
                      </BadgeM3>
                    </td>
                    {isAdminMode && (
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {ff.isEditing ? (
                            <ButtonM3
                              variant="filled"
                              color="success"
                              size="sm"
                              startIcon={<Save size={16} />}
                              onClick={() => handleSave(ff.id)}
                            >
                              Save
                            </ButtonM3>
                          ) : (
                            <IconButtonM3
                              variant="outlined"
                              color="neutral"
                              size="sm"
                              onClick={() => toggleEdit(ff.id)}
                              aria-label="Edit firefighter"
                            >
                              <Edit2 size={16} />
                            </IconButtonM3>
                          )}
                          <IconButtonM3
                            variant="outlined"
                            color="error"
                            size="sm"
                            onClick={() => handleDeactivate(ff.id)}
                            aria-label="Deactivate firefighter"
                          >
                            <XCircle size={16} />
                          </IconButtonM3>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredFirefighters.length === 0 && !loading && (
              <div className="text-center py-12">
                <Users className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600 dark:text-gray-400">
                  No firefighters found
                  {filterShift !== "ALL" && ` in Shift ${filterShift}`}
                </p>
              </div>
            )}
          </div>
        )}
      </DialogM3.Body>

      <DialogM3.Footer align="right">
        <ButtonM3 variant="filled" color="primary" onClick={onClose}>
          Done
        </ButtonM3>
      </DialogM3.Footer>
    </DialogM3>
  );
}

/**
 * Firefighters Modal Component with Feature Flag
 *
 * Switches between MaterialM and legacy versions.
 */
export function FirefightersModal(props: FirefightersModalProps) {
  const useMaterialM = useFeatureFlag('MATERIALM');

  if (!useMaterialM) {
    return <FirefightersModalLegacy {...props} />;
  }

  return <FirefightersModalM3 {...props} />;
}
