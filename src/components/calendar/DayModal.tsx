/**
 * DayModal Component
 * 
 * Modal for viewing and managing holds for a selected day.
 * Contains:
 * - Modal overlay and container
 * - Day header with date
 * - Conditional rendering: HoldList OR HoldForm
 * - Focus trap and keyboard handling (Escape key)
 * 
 * Uses design tokens for consistent styling.
 */

import { useState } from 'react';
import { X } from 'lucide-react';
import { Firefighter, HoldDuration, Shift } from '../../lib/supabase';
import { CalendarDay, ScheduledHold } from '../../utils/calendarUtils';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { useFocusReturn } from '../../hooks/useFocusReturn';
import { HoldList } from './HoldList';
import { HoldForm } from './HoldForm';
import { colors, tokens } from '../../styles';

interface DayModalProps {
  isOpen: boolean;
  selectedDay: CalendarDay | null;
  onClose: () => void;
  firefighters: Firefighter[];
  selectedFirefighter: Firefighter | null;
  onFirefighterSelect: (ff: Firefighter) => void;
  onScheduleHold: (holdDate: string, ff: Firefighter, station?: string, duration?: HoldDuration, startTime?: string) => void;
  onRemoveHold: (holdId: string) => void;
  onMarkCompleted: (hold: ScheduledHold) => void;
  isAdminMode?: boolean;
  isDarkMode?: boolean;
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
  const isPastDate = selectedDay.date < new Date(new Date().setHours(0, 0, 0, 0));

  const handleSchedule = (holdDate: string, ff: Firefighter, station?: string, duration?: HoldDuration, startTime?: string) => {
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

  return (
    <div
      className={`
        fixed inset-0
        ${tokens.zIndex.modal}
        flex items-center justify-center
        ${tokens.spacing.card.md}
      `}
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="day-modal-title"
    >
      {/* Backdrop */}
      <div
        className={`absolute inset-0 ${colors.components.modal.overlay}`}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        ref={modalTrapRef}
        className={`
          relative
          ${colors.components.modal.background}
          ${colors.components.modal.border}
          ${colors.components.modal.shadow}
          ${tokens.borders.radius.xl}
          max-w-md w-full
          max-h-[90vh]
          overflow-hidden
          flex flex-col
        `}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`
          ${isDarkMode ? 'bg-gradient-to-r from-gray-900 to-gray-800' : 'bg-gradient-to-r from-gray-100 to-gray-200'}
          border-b-2
          ${isDarkMode ? 'border-gray-700' : 'border-gray-300'}
          ${tokens.spacing.card.lg}
          flex items-center justify-between
          sticky top-0 z-10
        `}>
          <div>
            <h3
              id="day-modal-title"
              className={`${tokens.typography.heading.h3} ${isDarkMode ? colors.structural.text.primary : 'text-gray-900'}`}
            >
              {selectedDay.date.toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
              {isPastDate && (
                <span className={`ml-2 px-2 py-1 ${tokens.typography.body.small} bg-amber-900/70 text-amber-200 ${tokens.borders.radius.sm} font-semibold`}>
                  PAST DATE
                </span>
              )}
            </h3>
            {hasHolds && !showAddAnother && (
              <p className={`${tokens.typography.body.secondary} ${isDarkMode ? colors.structural.text.secondary : 'text-gray-600'} mt-1`}>
                {selectedDay.scheduledHolds.length} hold
                {selectedDay.scheduledHolds.length !== 1 ? "s" : ""} scheduled
              </p>
            )}
          </div>
          <button
            onClick={handleClose}
            className={`
              ${tokens.spacing.section.sm}
              ${tokens.borders.radius.lg}
              ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-300'}
              ${tokens.transitions.fast}
            `}
            aria-label="Close date dialog"
          >
            <X size={24} className={isDarkMode ? colors.structural.text.tertiary : 'text-gray-600'} />
          </button>
        </div>

        {/* Content */}
        <div className={`${tokens.spacing.card.lg} overflow-y-auto`}>
          {hasHolds && !showAddAnother && !selectedFirefighter ? (
            <HoldList
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
            <HoldForm
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
        </div>
      </div>
    </div>
  );
}

