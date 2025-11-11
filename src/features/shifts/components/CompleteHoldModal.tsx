import {
  ArrowRight,
  Calendar as CalendarIcon,
  CheckCircle,
  Clock,
  X,
} from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { Firefighter, HoldDuration, Shift } from '@/lib/supabase';
import { StationSelector } from "./StationSelector";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
  const [duration, setDuration] = useState<HoldDuration>("24h"); // Default to 24 hours
  const [startTime, setStartTime] = useState("07:00"); // Default to 07:00
  const [isSubmitting, setIsSubmitting] = useState(false);
  const trapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && firefighter) {
      const today = new Date().toISOString().split("T")[0];
      setSelectedDate(today);
      setSelectedStation(firefighter.fire_station || "");
      setNewPosition(totalFirefighters); // Reset to bottom when modal opens
      setLentToShift(null); // Reset lent-to shift
      setDuration("24h"); // Reset to default 24 hours
      setStartTime("07:00"); // Reset to default 07:00
    }
  }, [isOpen, firefighter, totalFirefighters]);

  if (!isOpen || !firefighter) return null;

  const handleConfirm = async () => {
    if (!selectedDate || isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      const stationToUse = selectedStation || undefined;
      onConfirm(
        firefighter.id,
        selectedDate,
        newPosition,
        stationToUse,
        lentToShift,
        duration,
        duration === "12h" ? startTime : undefined
      );
      onClose();
    } catch (error) {
      console.error('Error completing hold:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const today = new Date().toISOString().split("T")[0];
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 365);
  const maxDateStr = maxDate.toISOString().split("T")[0];

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/80 animate-in fade-in duration-200"
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
        className="w-full h-full sm:h-auto sm:max-w-lg max-h-screen sm:max-h-[90vh] overflow-y-auto bg-card border-2 border-border sm:rounded-2xl shadow-xl animate-in slide-in-from-bottom-8 sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="sticky top-0 z-10 p-6 flex items-center justify-between border-b-2 bg-green-600 border-green-700/50 backdrop-blur-sm"
        >
          <div className="flex items-center gap-4">
            <CheckCircle className="text-white" size={28} />
            <div>
              <h2
                id="complete-hold-title"
                className="text-xl font-bold text-white"
              >
                Complete Hold
              </h2>
              <p
                className="text-sm text-green-200 mt-1"
              >
                {firefighter.name}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label="Close dialog"
            className="text-white hover:bg-green-700"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          <div
            className="border rounded-lg p-4 bg-blue-900/20 border-blue-700/50"
          >
            <p className="text-sm text-blue-200">
              This will mark the hold as completed and update{" "}
              <strong>{firefighter.name}</strong>'s position in the rotation.
            </p>
          </div>

          <div className="space-y-3">
            <Label
              className="flex items-center gap-2 text-sm font-semibold text-muted-foreground"
            >
              <CalendarIcon size={18} className="text-orange-400" />
              <span>Hold Date</span>
            </Label>
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={today}
              max={maxDateStr}
            />
          </div>

          <StationSelector
            selectedStation={selectedStation}
            onStationChange={setSelectedStation}
            defaultStation={firefighter.fire_station}
          />

          <div className="space-y-3">
            <Label
              htmlFor="lent-to-shift"
              className="flex items-center gap-2 text-sm font-semibold text-muted-foreground"
            >
              <ArrowRight
                size={18}
                className="text-blue-400"
              />
              <span>Lent to Shift (Optional)</span>
            </Label>
            <div className="space-y-2">
              <select
                id="lent-to-shift"
                value={lentToShift || ""}
                onChange={(e) =>
                  setLentToShift((e.target.value as Shift | null) || null)
                }
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="">None (not being lent out)</option>
                <option value="A">A-Shift</option>
                <option value="B">B-Shift</option>
                <option value="C">C-Shift</option>
              </select>
              <p
                className="text-sm text-muted-foreground"
              >
                Select which shift this firefighter is being lent to, if
                applicable.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <Label
              htmlFor="hold-duration"
              className="flex items-center gap-2 text-sm font-semibold text-muted-foreground"
            >
              <Clock size={18} className="text-purple-400" />
              <span>Hold Duration</span>
            </Label>
            <div className="space-y-2">
              <select
                id="hold-duration"
                value={duration}
                onChange={(e) => setDuration(e.target.value as HoldDuration)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="12h">12 Hours</option>
                <option value="24h">24 Hours (Default)</option>
              </select>
              <p
                className="text-sm text-muted-foreground"
              >
                Length of the hold shift. Most holds are 24 hours.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <Label
              htmlFor="start-time"
              className="flex items-center gap-2 text-sm font-semibold text-muted-foreground"
            >
              <Clock size={18} className="text-purple-400" />
              <span>Start Time</span>
            </Label>
            <div className="space-y-2">
              <Input
                id="start-time"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
              <p
                className="text-sm text-muted-foreground"
              >
                Hold start time (default: 07:00). Member may be called back
                mid-shift if needed.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <Label
              htmlFor="new-position"
              className="flex items-center gap-2 text-sm font-semibold text-muted-foreground"
            >
              <span>New Position in Rotation</span>
            </Label>
            <div className="space-y-2">
              <select
                id="new-position"
                value={newPosition}
                onChange={(e) => setNewPosition(Number(e.target.value))}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
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
              <p
                className="text-sm text-muted-foreground"
              >
                Default is bottom of the list. Select a different position if
                needed.
              </p>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              onClick={onClose}
              variant="secondary"
              size="lg"
              className="flex-1"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={!selectedDate || isSubmitting}
              variant="default"
              size="lg"
              className="flex-1"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin">⏳</span>
                  Completing...
                </span>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-5 w-5" />
                  Complete Hold
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
