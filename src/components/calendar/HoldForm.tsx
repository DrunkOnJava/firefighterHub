/**
 * HoldForm Component
 *
 * Form for scheduling a hold with:
 * - Firefighter selection list (if none selected)
 * - Hold details form (station, duration, start time)
 * - "Add another" checkbox
 * - Confirm/cancel buttons
 *
 * Uses design tokens for consistent styling.
 */

import { useState } from "react";
import { Firefighter, HoldDuration } from "../../lib/supabase";
import { colors, tokens } from "../../styles";
import { CalendarDay } from "../../utils/calendarUtils";
import { getTheme } from "../../utils/theme";
import { StationSelector } from "../StationSelector";

interface HoldFormProps {
  selectedDay: CalendarDay;
  firefighters: Firefighter[];
  selectedFirefighter: Firefighter | null;
  onFirefighterSelect: (ff: Firefighter | null) => void;
  onSchedule: (
    holdDate: string,
    ff: Firefighter,
    station?: string,
    duration?: HoldDuration,
    startTime?: string
  ) => void;
  onCancel: () => void;
  selectedStation: string;
  onStationChange: (station: string) => void;
  showAddAnother: boolean;
  onAddAnotherChange: (value: boolean) => void;
  isDarkMode?: boolean;
}

export function HoldForm({
  selectedDay,
  firefighters,
  selectedFirefighter,
  onFirefighterSelect,
  onSchedule,
  onCancel,
  selectedStation,
  onStationChange,
  showAddAnother,
  onAddAnotherChange,
  isDarkMode = true,
}: HoldFormProps) {
  const theme = getTheme(isDarkMode);
  const [duration, setDuration] = useState<HoldDuration>("24h");
  const [startTime, setStartTime] = useState<string>("08:00");

  const availableFirefighters = firefighters.filter((ff) => ff.is_available);

  const handleConfirm = () => {
    if (selectedFirefighter) {
      const holdDate = selectedDay.date.toISOString().split("T")[0];
      onSchedule(
        holdDate,
        selectedFirefighter,
        selectedStation,
        duration,
        startTime
      );
    }
  };

  // Firefighter selection view
  if (!selectedFirefighter) {
    const nextInRotation = availableFirefighters[0];
    
    return (
      <div>
        <h4
          className={`${tokens.typography.heading.h4} ${theme.textPrimary} ${tokens.spacing.margin.md}`}
        >
          Select Firefighter:
        </h4>

        {/* Next in rotation - highlighted */}
        {nextInRotation && (
          <div className={tokens.spacing.margin.md}>
            <p className={`${tokens.typography.body.small} ${theme.textSecondary} mb-2 font-semibold`}>
              NEXT IN ROTATION:
            </p>
            <button
              onClick={() => onFirefighterSelect(nextInRotation)}
              className={`
                w-full text-left
                ${tokens.spacing.section.md}
                ${tokens.borders.radius.lg}
                border-2
                ${isDarkMode ? 'border-blue-500 bg-blue-950/40' : 'border-blue-500 bg-blue-50'}
                hover:opacity-80
                ${tokens.transitions.fast}
              `}
            >
              <div className={`font-bold ${theme.textPrimary} flex items-center gap-2`}>
                <span className="text-xl">⭐</span>
                {nextInRotation.name}
              </div>
              <div
                className={`${tokens.typography.body.small} ${theme.textSecondary}`}
              >
                Position: {nextInRotation.order_position + 1}
                {nextInRotation.fire_station && ` • Station ${nextInRotation.fire_station}`}
              </div>
            </button>
            
            {/* Skip button */}
            {availableFirefighters.length > 1 && (
              <button
                onClick={() => {
                  // Move next person to end and show the new list
                  onFirefighterSelect(null);
                }}
                className={`
                  w-full mt-2
                  ${tokens.spacing.section.sm}
                  ${tokens.borders.radius.lg}
                  ${colors.components.button.secondary}
                  font-semibold
                  text-sm
                `}
              >
                Skip to Next Person
              </button>
            )}
          </div>
        )}

        {/* Rest of the list */}
        {availableFirefighters.length > 1 && (
          <>
            <p className={`${tokens.typography.body.small} ${theme.textSecondary} mt-6 mb-2 font-semibold`}>
              OR SELECT SOMEONE ELSE:
            </p>
            <div
              className={`space-y-2 max-h-64 overflow-y-auto ${tokens.spacing.margin.lg}`}
            >
              {availableFirefighters.slice(1).map((ff) => (
                <button
                  key={ff.id}
                  onClick={() => onFirefighterSelect(ff)}
                  className={`
                    w-full text-left
                    ${tokens.spacing.section.md}
                    ${tokens.borders.radius.lg}
                    border-2
                    ${theme.modal.border}
                    ${theme.modal.background}
                    hover:opacity-80
                    ${tokens.transitions.fast}
                  `}
                >
                  <div className={`font-medium ${theme.textPrimary}`}>
                    {ff.name}
                  </div>
                  <div
                    className={`${tokens.typography.body.small} ${theme.textSecondary}`}
                  >
                    Position: {ff.order_position + 1}
                    {ff.fire_station && ` • Station ${ff.fire_station}`}
                  </div>
                </button>
              ))}
            </div>
          </>
        )}

        {availableFirefighters.length === 0 && (
          <p
            className={`${tokens.typography.body.secondary} ${theme.textSecondary} text-center py-8`}
          >
            No available firefighters
          </p>
        )}

        <button
          onClick={onCancel}
          className={`
            w-full
            mt-4
            ${tokens.spacing.section.md}
            ${tokens.borders.radius.lg}
            ${colors.components.button.secondary}
            font-semibold
          `}
        >
          Cancel
        </button>
      </div>
    );
  }

  // Hold details form
  return (
    <div>
      <h4
        className={`${tokens.typography.heading.h4} ${theme.textPrimary} ${tokens.spacing.margin.md}`}
      >
        Scheduling: {selectedFirefighter.name}
      </h4>

      <div className="space-y-4">
        {/* Station selector */}
        <div>
          <label
            className={`block ${tokens.typography.body.secondary} ${theme.textSecondary} mb-2`}
          >
            Hold Station
          </label>
          <StationSelector
            selectedStation={selectedStation}
            onStationChange={onStationChange}
          />
        </div>

        {/* Duration selector */}
        <div>
          <label
            className={`block ${tokens.typography.body.secondary} ${theme.textSecondary} mb-2`}
          >
            Duration
          </label>
          <select
            value={duration}
            onChange={(e) => setDuration(e.target.value as HoldDuration)}
            className={`
              w-full
              ${tokens.spacing.section.sm}
              ${tokens.borders.radius.lg}
              ${colors.components.input.default}
            `}
          >
            <option value="12h">12 hours</option>
            <option value="24h">24 hours</option>
          </select>
        </div>

        {/* Start time */}
        <div>
          <label
            className={`block ${tokens.typography.body.secondary} ${theme.textSecondary} mb-2`}
          >
            Start Time
          </label>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className={`
              w-full
              ${tokens.spacing.section.sm}
              ${tokens.borders.radius.lg}
              ${colors.components.input.default}
            `}
          />
        </div>

        {/* Add another checkbox */}
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showAddAnother}
            onChange={(e) => onAddAnotherChange(e.target.checked)}
            className="w-4 h-4 rounded border-gray-600"
          />
          <span
            className={`${tokens.typography.body.secondary} ${theme.textSecondary}`}
          >
            Add another hold after this
          </span>
        </label>

        {/* Action buttons */}
        <div className={`flex gap-3 ${tokens.spacing.margin.lg}`}>
          <button
            onClick={onCancel}
            className={`
              flex-1
              ${tokens.spacing.section.md}
              ${tokens.borders.radius.lg}
              ${colors.components.button.secondary}
              font-semibold
            `}
          >
            Back
          </button>
          <button
            onClick={handleConfirm}
            className={`
              flex-1
              ${tokens.spacing.section.md}
              ${tokens.borders.radius.lg}
              ${colors.components.button.primary}
              font-semibold
              ${!selectedStation ? "opacity-50 cursor-not-allowed" : ""}
            `}
            disabled={!selectedStation}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
