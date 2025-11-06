/**
 * DayModal - Day Hold Management Modal
 *
 * Modal for viewing and managing holds for a selected day.
 * Automatically switches between MaterialM and legacy styling based on feature flag.
 *
 * Contains:
 * - Day header with date and hold count
 * - Conditional rendering: HoldList OR HoldForm
 * - Focus trap and keyboard handling
 *
 * @example
 * ```tsx
 * <DayModal
 *   isOpen={isOpen}
 *   selectedDay={day}
 *   onClose={handleClose}
 *   firefighters={firefighters}
 *   onScheduleHold={handleSchedule}
 * />
 * ```
 */

import { X } from "lucide-react";
import { useState } from "react";
import { useFeatureFlag } from "../../hooks/useFeatureFlag";
import { useFocusReturn } from "../../hooks/useFocusReturn";
import { useFocusTrap } from "../../hooks/useFocusTrap";
import { Firefighter, HoldDuration, Shift } from "../../lib/supabase";
import { CalendarDay, ScheduledHold } from "../../utils/calendarUtils";
import { DialogM3 } from "../m3/DialogM3";
import { BadgeM3 } from "../m3/BadgeM3";
import { HoldForm } from "./HoldForm";
import { HoldList } from "./HoldList";
import { HoldFormM3 } from "./HoldFormM3";
import { HoldListM3 } from "./HoldListM3";
import { DayModalLegacy } from "./DayModalLegacy";

interface DayModalProps {
  isOpen: boolean;
  selectedDay: CalendarDay | null;
  onClose: () => void;
  firefighters: Firefighter[];
  selectedFirefighter: Firefighter | null;
  onFirefighterSelect: (ff: Firefighter) => void;
  onScheduleHold: (
    holdDate: string,
    ff: Firefighter,
    station?: string,
    duration?: HoldDuration,
    startTime?: string
  ) => void;
  onRemoveHold: (holdId: string) => void;
  onMarkCompleted: (hold: ScheduledHold) => void;
  isAdminMode?: boolean;
  isDarkMode?: boolean;
  currentShift: Shift;
}

/**
 * MaterialM Day Modal Component
 */
function DayModalM3({
  isOpen,
  selectedDay,
  onClose,
  firefighters,
  selectedFirefighter,
  onFirefighterSelect,
  onScheduleHold,
  onRemoveHold,
  onMarkCompleted,
  isAdminMode = false,
  isDarkMode = true,
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
    startTime?: string
  ) => {
    onScheduleHold(holdDate, ff, station, duration, startTime);

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

  // Format modal title
  const modalTitle = (
    <div className="flex items-center gap-2">
      <span>
        {selectedDay.date.toLocaleDateString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
        })}
      </span>
      {isPastDate && (
        <BadgeM3 color="warning" size="xs">
          PAST DATE
        </BadgeM3>
      )}
    </div>
  );

  return (
    <DialogM3 show={isOpen} onClose={handleClose} size="lg">
      {/* Custom header with hold count */}
      <div
        ref={modalTrapRef}
        className="p-6 border-b border-materialm-border-dark bg-materialm-darkgray"
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-white mb-1">
              {modalTitle}
            </h3>
            {hasHolds && !showAddAnother && (
              <p className="text-sm text-gray-400">
                {selectedDay.scheduledHolds.length} hold
                {selectedDay.scheduledHolds.length !== 1 ? "s" : ""} scheduled
              </p>
            )}
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-lg hover:bg-materialm-dark text-gray-400 transition-colors focus-ring"
            aria-label="Close date dialog"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Modal Body */}
      <DialogM3.Body>
        {hasHolds && !showAddAnother && !selectedFirefighter ? (
          <HoldListM3
            holds={selectedDay.scheduledHolds}
            firefighters={firefighters}
            onRemove={onRemoveHold}
            onMarkCompleted={onMarkCompleted}
            onEdit={() => {}} // TODO: Implement hold editing
            onAddNew={handleAddNewClick}
            isAdminMode={isAdminMode}
            isDarkMode={isDarkMode}
          />
        ) : (
          <HoldFormM3
            selectedDay={selectedDay}
            firefighters={firefighters}
            selectedFirefighter={selectedFirefighter}
            onFirefighterSelect={onFirefighterSelect}
            onSchedule={handleSchedule}
            onCancel={handleCancel}
            selectedStation={selectedStation}
            onStationChange={setSelectedStation}
            showAddAnother={showAddAnother}
            onAddAnotherChange={setShowAddAnother}
            isDarkMode={isDarkMode}
          />
        )}
      </DialogM3.Body>
    </DialogM3>
  );
}

/**
 * Day Modal Component with Feature Flag
 *
 * Switches between MaterialM and legacy versions.
 */
export function DayModal(props: DayModalProps) {
  const useMaterialM = useFeatureFlag('MATERIALM');

  if (!useMaterialM) {
    return <DayModalLegacy {...props} />;
  }

  return <DayModalM3 {...props} />;
}
