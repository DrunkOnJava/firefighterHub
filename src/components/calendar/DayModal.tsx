/**
 * DayModal Component
 *
 * Modal for viewing and managing holds for a selected day.
 * Contains:
 * - Modal overlay and container
 * - Day header with date
 * - Conditional rendering: HoldList OR HoldForm
 * - Focus trap and keyboard handling (Escape key)
 */

import { X } from "lucide-react";
import { useState } from "react";
import { useFocusReturn } from "../../hooks/useFocusReturn";
import { useFocusTrap } from "../../hooks/useFocusTrap";
import { Firefighter, HoldDuration, Shift } from "../../lib/supabase";
import { CalendarDay, ScheduledHold } from "../../utils/calendarUtils";
import { HoldForm } from "./HoldForm";
import { HoldList } from "./HoldList";

interface DayModalProps {
  isOpen: boolean;
  selectedDay: CalendarDay | null;
  onClose: () => void;
  firefighters: Firefighter[];
  selectedFirefighter: Firefighter | null;
  onFirefighterSelect: (ff: Firefighter | null) => void;
  onScheduleHold: (
    holdDate: string,
    ff: Firefighter,
    station?: string,
    duration?: HoldDuration,
    startTime?: string,
    isVoluntary?: boolean
  ) => void;
  onRemoveHold: (holdId: string) => void;
  onMarkCompleted: (hold: ScheduledHold) => void;
  onSkipFirefighter?: (firefighterId: string) => void;
  isAdminMode?: boolean;
  currentShift: Shift;
}

export function DayModal({
  isOpen,
  selectedDay,
  onClose,
  firefighters,
  selectedFirefighter,
  onFirefighterSelect,
  onScheduleHold,
  onRemoveHold,
  onMarkCompleted,
  onSkipFirefighter,
  isAdminMode = false,
}: DayModalProps) {
  const [selectedStation, setSelectedStation] = useState<string>("");
  const [showAddAnother, setShowAddAnother] = useState(false);

  const modalTrapRef = useFocusTrap(isOpen);
  useFocusReturn(isOpen);

  if (!isOpen || !selectedDay) {
    return null;
  }

  const hasHolds = selectedDay.scheduledHolds.length > 0;
  const isPastDate =
    selectedDay.date < new Date(new Date().setHours(0, 0, 0, 0));

  const handleSchedule = (
    holdDate: string,
    ff: Firefighter,
    station?: string,
    duration?: HoldDuration,
    startTime?: string,
    isVoluntary?: boolean
  ) => {
    onScheduleHold(holdDate, ff, station, duration, startTime, isVoluntary);

    if (!showAddAnother) {
      onClose();
      setSelectedStation("");
      setShowAddAnother(false);
    } else {
      // Reset for next hold
      setSelectedStation("");
    }
  };

  const handleAddNewClick = () => {
    setShowAddAnother(true);
  };

  const handleCancel = () => {
    setShowAddAnother(false);
    setSelectedStation("");
  };

  const handleClose = () => {
    onClose();
    setShowAddAnother(false);
    setSelectedStation("");
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="day-modal-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        ref={modalTrapRef}
        className="
          relative bg-card border-2 border-border
          shadow-2xl rounded-xl max-w-md w-full
          max-h-[90vh] overflow-hidden flex flex-col
        "
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="
          bg-muted border-b-2 border-border p-6
          flex items-center justify-between sticky top-0 z-10
        ">
          <div>
            <h3
              id="day-modal-title"
              className="text-xl font-bold text-foreground"
            >
              {selectedDay.date.toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
              {isPastDate && (
                <span className="ml-2 px-2 py-1 text-xs bg-amber-900/70 text-amber-200 rounded font-semibold">
                  PAST DATE
                </span>
              )}
            </h3>
            {hasHolds && !showAddAnother && (
              <p className="text-sm text-muted-foreground mt-1">
                {selectedDay.scheduledHolds.length} hold
                {selectedDay.scheduledHolds.length !== 1 ? "s" : ""} scheduled
              </p>
            )}
          </div>
          <button
            onClick={handleClose}
            className="
              p-2 min-h-[44px] min-w-[44px] rounded-lg
              bg-card hover:opacity-80 transition-all duration-200
              flex items-center justify-center
            "
            aria-label="Close date dialog"
          >
            <X className="w-6 h-6 text-muted-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto">
          {hasHolds && !showAddAnother && !selectedFirefighter ? (
            <HoldList
              holds={selectedDay.scheduledHolds}
              firefighters={firefighters}
              onRemove={onRemoveHold}
              onMarkCompleted={onMarkCompleted}
              onEdit={() => {}} // TODO: Implement hold editing
              onAddNew={handleAddNewClick}
              isAdminMode={isAdminMode}
            />
          ) : (
            <HoldForm
              selectedDay={selectedDay}
              firefighters={firefighters}
              selectedFirefighter={selectedFirefighter}
              onFirefighterSelect={onFirefighterSelect}
              onSchedule={handleSchedule}
              onCancel={handleCancel}
              onSkipFirefighter={onSkipFirefighter}
              selectedStation={selectedStation}
              onStationChange={setSelectedStation}
              showAddAnother={showAddAnother}
              onAddAnotherChange={setShowAddAnother}
            />
          )}
        </div>
      </div>
    </div>
  );
}
