import {
  ArrowRight,
  Calendar as CalendarIcon,
  CheckCircle,
  Clock,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useFocusReturn } from "../hooks/useFocusReturn";
import { useFocusTrap } from "../hooks/useFocusTrap";
import { Firefighter, HoldDuration, Shift } from "../lib/supabase";
import { colors, tokens } from "../styles";
import { StationSelector } from "./StationSelector";
import { AnimatedButton } from "./ui/AnimatedButton";
import { IconButton } from "./ui/IconButton";

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
  const trapRef = useFocusTrap(isOpen);
  useFocusReturn(isOpen);

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
      className={`
        fixed inset-0 z-50 flex items-center justify-center
        ${tokens.spacing.card.md}
        ${colors.components.modal.overlay}
        animate-fade-in
      `}
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
        className={`
          max-w-lg w-full max-h-[90vh] overflow-y-auto
          ${colors.components.modal.background}
          ${colors.components.modal.border}
          ${tokens.borders.radius['2xl']}
          ${colors.components.modal.shadow}
        `}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={`
            sticky top-0 z-10
            ${tokens.spacing.card.xl}
            flex items-center justify-between
            border-b-2
            ${colors.semantic.success.gradient}
            ${colors.semantic.success.border}
            backdrop-blur-sm
          `}
        >
          <div className={`flex items-center ${tokens.spacing.gap.md}`}>
            <CheckCircle className={colors.semantic.success.text} size={28} />
            <div>
              <h2
                id="complete-hold-title"
                className={`
                  ${tokens.typography.heading.h1}
                  text-white
                `}
              >
                Complete Hold
              </h2>
              <p
                className={`${tokens.typography.body.secondary} text-green-200 mt-1`}
              >
                {firefighter.name}
              </p>
            </div>
          </div>
          <IconButton
            icon={X}
            label="Close dialog"
            onClick={onClose}
            variant="default"
            size="md"
            isDarkMode={true}
          />
        </div>

        <div className={`${tokens.spacing.card.xl} space-y-6`}>
          <div
            className={`
              border ${tokens.borders.radius.lg}
              ${tokens.spacing.card.md}
              ${colors.semantic.scheduled.light}
              ${colors.semantic.scheduled.border}
            `}
          >
            <p className={`${tokens.typography.body.secondary} text-blue-200`}>
              This will mark the hold as completed and update{" "}
              <strong>{firefighter.name}</strong>'s position in the rotation.
            </p>
          </div>

          <div className="space-y-3">
            <label
              className={`
                flex items-center ${tokens.spacing.gap.sm}
                ${tokens.typography.body.secondary}
                ${tokens.typography.weight.semibold}
                ${colors.structural.text.secondary}
              `}
            >
              <CalendarIcon size={18} className="text-orange-400" />
              <span>Hold Date</span>
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={today}
              max={maxDateStr}
              className={`
                w-full px-4 py-3
                ${tokens.borders.radius.lg}
                ${colors.components.input.default}
                ${tokens.transitions.fast}
              `}
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
              className={`
                flex items-center ${tokens.spacing.gap.sm}
                ${tokens.typography.body.secondary}
                ${tokens.typography.weight.semibold}
                ${colors.structural.text.secondary}
              `}
            >
              <ArrowRight
                size={18}
                className={colors.semantic.scheduled.text}
              />
              <span>Lent to Shift (Optional)</span>
            </label>
            <div className="space-y-2">
              <select
                id="lent-to-shift"
                value={lentToShift || ""}
                onChange={(e) =>
                  setLentToShift((e.target.value as Shift | null) || null)
                }
                className={`
                  w-full px-4 py-3
                  ${tokens.borders.radius.lg}
                  ${colors.components.input.default}
                  ${tokens.transitions.fast}
                `}
              >
                <option value="">None (not being lent out)</option>
                <option value="A">A-Shift</option>
                <option value="B">B-Shift</option>
                <option value="C">C-Shift</option>
              </select>
              <p
                className={`${tokens.typography.body.small} ${colors.structural.text.tertiary}`}
              >
                Select which shift this firefighter is being lent to, if
                applicable.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <label
              htmlFor="hold-duration"
              className={`
                flex items-center ${tokens.spacing.gap.sm}
                ${tokens.typography.body.secondary}
                ${tokens.typography.weight.semibold}
                ${colors.structural.text.secondary}
              `}
            >
              <Clock size={18} className="text-purple-400" />
              <span>Hold Duration</span>
            </label>
            <div className="space-y-2">
              <select
                id="hold-duration"
                value={duration}
                onChange={(e) => setDuration(e.target.value as HoldDuration)}
                className={`
                  w-full px-4 py-3
                  ${tokens.borders.radius.lg}
                  ${colors.components.input.default}
                  ${tokens.transitions.fast}
                `}
              >
                <option value="12h">12 Hours</option>
                <option value="24h">24 Hours (Default)</option>
              </select>
              <p
                className={`${tokens.typography.body.small} ${colors.structural.text.tertiary}`}
              >
                Length of the hold shift. Most holds are 24 hours.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <label
              htmlFor="start-time"
              className={`
                flex items-center ${tokens.spacing.gap.sm}
                ${tokens.typography.body.secondary}
                ${tokens.typography.weight.semibold}
                ${colors.structural.text.secondary}
              `}
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
                className={`
                  w-full px-4 py-3
                  ${tokens.borders.radius.lg}
                  ${colors.components.input.default}
                  ${tokens.transitions.fast}
                `}
              />
              <p
                className={`${tokens.typography.body.small} ${colors.structural.text.tertiary}`}
              >
                Hold start time (default: 07:00). Member may be called back
                mid-shift if needed.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <label
              htmlFor="new-position"
              className={`
                flex items-center ${tokens.spacing.gap.sm}
                ${tokens.typography.body.secondary}
                ${tokens.typography.weight.semibold}
                ${colors.structural.text.secondary}
              `}
            >
              <span>New Position in Rotation</span>
            </label>
            <div className="space-y-2">
              <select
                id="new-position"
                value={newPosition}
                onChange={(e) => setNewPosition(Number(e.target.value))}
                className={`
                  w-full px-4 py-3
                  ${tokens.borders.radius.lg}
                  ${colors.components.input.default}
                  ${tokens.transitions.fast}
                `}
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
                className={`${tokens.typography.body.small} ${colors.structural.text.tertiary}`}
              >
                Default is bottom of the list. Select a different position if
                needed.
              </p>
            </div>
          </div>

          <div className={`flex ${tokens.spacing.gap.md} pt-4`}>
            <AnimatedButton
              onClick={onClose}
              variant="secondary"
              size="lg"
              fullWidth
              disabled={isSubmitting}
            >
              Cancel
            </AnimatedButton>
            <AnimatedButton
              onClick={handleConfirm}
              disabled={!selectedDate}
              state={isSubmitting ? 'loading' : 'idle'}
              variant="primary"
              size="lg"
              fullWidth
              icon={<CheckCircle size={20} />}
            >
              Complete Hold
            </AnimatedButton>
          </div>
        </div>
      </div>
    </div>
  );
}
