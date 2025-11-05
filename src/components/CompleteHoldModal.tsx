/**
 * CompleteHoldModal - Hold Completion Modal
 *
 * Modal for marking a hold as completed with position selection.
 * Automatically switches between MaterialM and legacy styling based on feature flag.
 *
 * @example
 * ```tsx
 * <CompleteHoldModal
 *   isOpen={isOpen}
 *   firefighter={selectedFirefighter}
 *   totalFirefighters={firefighters.length}
 *   onClose={handleClose}
 *   onConfirm={handleCompleteHold}
 * />
 * ```
 */

import {
  ArrowRight,
  Calendar as CalendarIcon,
  CheckCircle,
  Clock,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useFeatureFlag } from "../hooks/useFeatureFlag";
import { useFocusReturn } from "../hooks/useFocusReturn";
import { useFocusTrap } from "../hooks/useFocusTrap";
import { Firefighter, HoldDuration, Shift } from "../lib/supabase";
import { DialogM3 } from "./m3/DialogM3";
import { ButtonM3 } from "./m3/ButtonM3";
import { SelectM3 } from "./m3/InputM3";
import { CardM3 } from "./m3/CardM3";
import { StationSelector } from "./StationSelector";
import { CompleteHoldModalLegacy } from "./CompleteHoldModalLegacy";

interface CompleteHoldModalProps {
  isOpen: boolean;
  firefighter: Firefighter | null;
  totalFirefighters: number;
  onClose: () => void;
  onConfirm: (
    firefighterId: string,
    holdDate: string,
    newPosition: number,
    station?: string,
    lentToShift?: Shift | null,
    duration?: HoldDuration,
    startTime?: string
  ) => void;
}

/**
 * MaterialM Complete Hold Modal
 */
function CompleteHoldModalM3({
  isOpen,
  firefighter,
  totalFirefighters,
  onClose,
  onConfirm,
}: CompleteHoldModalProps) {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedStation, setSelectedStation] = useState("");
  const [newPosition, setNewPosition] = useState(totalFirefighters);
  const [lentToShift, setLentToShift] = useState<Shift | null>(null);
  const [duration, setDuration] = useState<HoldDuration>("24h");
  const [startTime, setStartTime] = useState("07:00");
  const trapRef = useFocusTrap(isOpen);
  useFocusReturn(isOpen);

  useEffect(() => {
    if (isOpen && firefighter) {
      const today = new Date().toISOString().split("T")[0];
      setSelectedDate(today);
      setSelectedStation(firefighter.fire_station || "");
      setNewPosition(totalFirefighters);
      setLentToShift(null);
      setDuration("24h");
      setStartTime("07:00");
    }
  }, [isOpen, firefighter, totalFirefighters]);

  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    }

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen || !firefighter) return null;

  const handleConfirm = () => {
    if (!selectedDate) return;
    const stationToUse = selectedStation || undefined;
    onConfirm(
      firefighter.id,
      selectedDate,
      newPosition,
      stationToUse,
      lentToShift,
      duration,
      startTime
    );
    onClose();
  };

  const today = new Date().toISOString().split("T")[0];
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 365);
  const maxDateStr = maxDate.toISOString().split("T")[0];

  const positionOptions = Array.from({ length: totalFirefighters }, (_, i) => ({
    value: String(i + 1),
    label: `Position ${i + 1}${i + 1 === totalFirefighters ? " (Bottom - Recommended)" : ""}`,
  }));

  return (
    <DialogM3 show={isOpen} onClose={onClose} size="lg">
      {/* Custom Header */}
      <div
        ref={trapRef}
        className="p-6 border-b border-gray-200 dark:border-gray-700 bg-emerald-600 dark:bg-emerald-700"
      >
        <div className="flex items-center gap-3">
          <CheckCircle className="w-7 h-7 text-white" />
          <div>
            <h2 className="text-2xl font-bold text-white">
              Complete Hold
            </h2>
            <p className="text-sm text-emerald-100 mt-1">
              {firefighter.name}
            </p>
          </div>
        </div>
      </div>

      <DialogM3.Body>
        <div className="space-y-6">
          {/* Info Card */}
          <CardM3 className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700">
            <p className="text-sm text-blue-900 dark:text-blue-100">
              This will mark the hold as completed and update{" "}
              <strong>{firefighter.name}</strong>'s position in the rotation.
            </p>
          </CardM3>

          {/* Date Input */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              <CalendarIcon size={18} className="text-orange-500" />
              <span>Hold Date</span>
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={today}
              max={maxDateStr}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>

          {/* Station Selector */}
          <StationSelector
            selectedStation={selectedStation}
            onStationChange={setSelectedStation}
            defaultStation={firefighter.fire_station}
          />

          {/* Lent To Shift */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              <ArrowRight size={18} className="text-blue-600 dark:text-blue-400" />
              <span>Lent to Shift (Optional)</span>
            </label>
            <select
              value={lentToShift || ""}
              onChange={(e) => setLentToShift((e.target.value as Shift | null) || null)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 transition-all"
            >
              <option value="">None (not being lent out)</option>
              <option value="A">A-Shift</option>
              <option value="B">B-Shift</option>
              <option value="C">C-Shift</option>
            </select>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Select which shift this firefighter is being lent to, if applicable.
            </p>
          </div>

          {/* Duration */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              <Clock size={18} className="text-purple-500 dark:text-purple-400" />
              <span>Hold Duration</span>
            </label>
            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value as HoldDuration)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 transition-all"
            >
              <option value="12h">12 Hours</option>
              <option value="24h">24 Hours (Default)</option>
            </select>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Length of the hold shift. Most holds are 24 hours.
            </p>
          </div>

          {/* Start Time */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              <Clock size={18} className="text-purple-500 dark:text-purple-400" />
              <span>Start Time</span>
            </label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 transition-all"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Hold start time (default: 07:00). Member may be called back mid-shift if needed.
            </p>
          </div>

          {/* Position Selector */}
          <SelectM3
            label="New Position in Rotation"
            value={String(newPosition)}
            onChange={(e) => setNewPosition(Number(e.target.value))}
            options={positionOptions}
            helperText="Default is bottom of the list. Select a different position if needed."
          />
        </div>
      </DialogM3.Body>

      <DialogM3.Footer>
        <ButtonM3 variant="outlined" color="neutral" onClick={onClose}>
          Cancel
        </ButtonM3>
        <ButtonM3
          color="success"
          startIcon={<CheckCircle size={20} />}
          onClick={handleConfirm}
          disabled={!selectedDate}
          className="shadow-materialm-2"
        >
          Complete Hold
        </ButtonM3>
      </DialogM3.Footer>
    </DialogM3>
  );
}

/**
 * Complete Hold Modal Component with Feature Flag
 *
 * Switches between MaterialM and legacy versions.
 */
export function CompleteHoldModal(props: CompleteHoldModalProps) {
  const useMaterialM = useFeatureFlag('MATERIALM');

  if (!useMaterialM) {
    return <CompleteHoldModalLegacy {...props} />;
  }

  return <CompleteHoldModalM3 {...props} />;
}
