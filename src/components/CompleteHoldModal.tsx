import { useState, useEffect } from "react";
import {
  X,
  Calendar as CalendarIcon,
  CheckCircle,
  ArrowRight,
  Clock,
} from "lucide-react";
import { Firefighter, Shift, HoldDuration } from "../lib/supabase";
import { StationSelector } from "./StationSelector";
import { useFocusTrap } from "../hooks/useFocusTrap";
import { useFocusReturn } from "../hooks/useFocusReturn";

interface CompleteHoldModalProps {
  isOpen: boolean;
  firefighter: Firefighter | null;
  totalFirefighters: number; // Total number of firefighters in rotation
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

export function CompleteHoldModal({
  isOpen,
  firefighter,
  totalFirefighters,
  onClose,
  onConfirm,
}: CompleteHoldModalProps) {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedStation, setSelectedStation] = useState("");
  const [newPosition, setNewPosition] = useState(totalFirefighters); // Default to bottom (last position)
  const [lentToShift, setLentToShift] = useState<Shift | null>(null); // Which shift is this firefighter being lent to
  const [duration, setDuration] = useState<HoldDuration>('24h'); // Default to 24 hours
  const [startTime, setStartTime] = useState('07:00'); // Default to 07:00
  const trapRef = useFocusTrap(isOpen);
  useFocusReturn(isOpen);

  useEffect(() => {
    if (isOpen && firefighter) {
      const today = new Date().toISOString().split("T")[0];
      setSelectedDate(today);
      setSelectedStation(firefighter.fire_station || "");
      setNewPosition(totalFirefighters); // Reset to bottom when modal opens
      setLentToShift(null); // Reset lent-to shift
      setDuration('24h'); // Reset to default 24 hours
      setStartTime('07:00'); // Reset to default 07:00
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

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="complete-hold-title"
    >
      <div
        ref={trapRef}
        className="bg-gradient-to-br from-gray-800 to-gray-850 border-2 border-gray-700 rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-gradient-to-r from-green-900/90 to-green-800/90 backdrop-blur-sm border-b-2 border-green-700 px-6 py-5 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <CheckCircle className="text-green-400" size={28} />
            <div>
              <h2
                id="complete-hold-title"
                className="text-2xl font-bold text-white"
              >
                Complete Hold
              </h2>
              <p className="text-sm text-green-200 mt-1">{firefighter.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors focus-ring"
            aria-label="Close dialog"
          >
            <X size={24} className="text-gray-400" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-blue-900/20 border border-blue-700/50 rounded-lg p-4">
            <p className="text-sm text-blue-200">
              This will mark the hold as completed and update{" "}
              <strong>{firefighter.name}</strong>'s position in the rotation.
            </p>
          </div>

          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-300">
              <CalendarIcon size={18} className="text-orange-400" />
              <span>Hold Date</span>
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={today}
              max={maxDateStr}
              className="w-full px-4 py-3 bg-gray-900 border-2 border-gray-700 rounded-lg text-white focus:outline-none focus:border-orange-500 transition-colors"
            />
          </div>

          <StationSelector
            selectedStation={selectedStation}
            onStationChange={setSelectedStation}
            defaultStation={firefighter.fire_station}
          />

          <div className="space-y-3">
            <label
              htmlFor="lent-to-shift"
              className="flex items-center gap-2 text-sm font-semibold text-gray-300"
            >
              <ArrowRight size={18} className="text-blue-400" />
              <span>Lent to Shift (Optional)</span>
            </label>
            <div className="space-y-2">
              <select
                id="lent-to-shift"
                value={lentToShift || ""}
                onChange={(e) =>
                  setLentToShift((e.target.value as Shift | null) || null)
                }
                className="w-full px-4 py-3 bg-gray-900 border-2 border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors"
              >
                <option value="">None (not being lent out)</option>
                <option value="A">A-Shift</option>
                <option value="B">B-Shift</option>
                <option value="C">C-Shift</option>
              </select>
              <p className="text-xs text-gray-400">
                Select which shift this firefighter is being lent to, if
                applicable.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <label
              htmlFor="hold-duration"
              className="flex items-center gap-2 text-sm font-semibold text-gray-300"
            >
              <Clock size={18} className="text-purple-400" />
              <span>Hold Duration</span>
            </label>
            <div className="space-y-2">
              <select
                id="hold-duration"
                value={duration}
                onChange={(e) => setDuration(e.target.value as HoldDuration)}
                className="w-full px-4 py-3 bg-gray-900 border-2 border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors"
              >
                <option value="12h">12 Hours</option>
                <option value="24h">24 Hours (Default)</option>
              </select>
              <p className="text-xs text-gray-400">
                Length of the hold shift. Most holds are 24 hours.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <label
              htmlFor="start-time"
              className="flex items-center gap-2 text-sm font-semibold text-gray-300"
            >
              <Clock size={18} className="text-purple-400" />
              <span>Start Time</span>
            </label>
            <div className="space-y-2">
              <input
                id="start-time"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-4 py-3 bg-gray-900 border-2 border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors"
              />
              <p className="text-xs text-gray-400">
                Hold start time (default: 07:00). Member may be called back mid-shift if needed.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <label
              htmlFor="new-position"
              className="flex items-center gap-2 text-sm font-semibold text-gray-300"
            >
              <span>New Position in Rotation</span>
            </label>
            <div className="space-y-2">
              <select
                id="new-position"
                value={newPosition}
                onChange={(e) => setNewPosition(Number(e.target.value))}
                className="w-full px-4 py-3 bg-gray-900 border-2 border-gray-700 rounded-lg text-white focus:outline-none focus:border-orange-500 transition-colors"
              >
                {Array.from({ length: totalFirefighters }, (_, i) => i + 1).map(
                  (pos) => (
                    <option key={pos} value={pos}>
                      Position {pos}
                      {pos === totalFirefighters
                        ? " (Bottom - Recommended)"
                        : ""}
                    </option>
                  )
                )}
              </select>
              <p className="text-xs text-gray-400">
                Default is bottom of the list. Select a different position if
                needed.
              </p>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 rounded-lg transition-colors focus-ring"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={!selectedDate}
              className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white font-bold py-3 rounded-lg transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed focus-ring flex items-center justify-center gap-2"
            >
              <CheckCircle size={20} />
              Complete Hold
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
