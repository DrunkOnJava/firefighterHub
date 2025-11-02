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

import { useState } from 'react';
import { Firefighter, HoldDuration } from '../../lib/supabase';
import { CalendarDay } from '../../utils/calendarUtils';
import { StationSelector } from '../StationSelector';
import { colors, tokens } from '../../styles';

interface HoldFormProps {
  selectedDay: CalendarDay;
  firefighters: Firefighter[];
  selectedFirefighter: Firefighter | null;
  onFirefighterSelect: (ff: Firefighter) => void;
  onSchedule: (holdDate: string, ff: Firefighter, station?: string, duration?: HoldDuration, startTime?: string) => void;
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
  const [duration, setDuration] = useState<HoldDuration>("24h");
  const [startTime, setStartTime] = useState<string>("08:00");

  const availableFirefighters = firefighters.filter((ff) => ff.is_available);

  const handleConfirm = () => {
    if (selectedFirefighter) {
      const holdDate = selectedDay.date.toISOString().split('T')[0];
      onSchedule(holdDate, selectedFirefighter, selectedStation, duration, startTime);
    }
  };

  // Firefighter selection view
  if (!selectedFirefighter) {
    return (
      <div>
        <h4 className={`${tokens.typography.heading.h4} ${isDarkMode ? colors.structural.text.primary : 'text-gray-900'} ${tokens.spacing.margin.md}`}>
          Select Firefighter:
        </h4>
        
        <div className={`space-y-2 max-h-96 overflow-y-auto ${tokens.spacing.margin.lg}`}>
          {availableFirefighters.length === 0 ? (
            <p className={`${tokens.typography.body.secondary} ${isDarkMode ? colors.structural.text.secondary : 'text-gray-600'} text-center py-8`}>
              No available firefighters
            </p>
          ) : (
            availableFirefighters.map((ff) => (
              <button
                key={ff.id}
                onClick={() => onFirefighterSelect(ff)}
                className={`
                  w-full text-left
                  ${tokens.spacing.section.md}
                  ${tokens.borders.radius.lg}
                  ${isDarkMode ? 'border border-gray-700 hover:bg-gray-700' : 'border border-gray-300 hover:bg-gray-100'}
                  ${tokens.transitions.fast}
                `}
              >
                <div className={`font-medium ${isDarkMode ? colors.structural.text.primary : 'text-gray-900'}`}>
                  {ff.name}
                </div>
                <div className={`${tokens.typography.body.small} ${isDarkMode ? colors.structural.text.secondary : 'text-gray-600'}`}>
                  Position: {ff.order_position + 1}
                  {ff.fire_station && ` • Station ${ff.fire_station}`}
                </div>
              </button>
            ))
          )}
        </div>
        
        <button
          onClick={onCancel}
          className={`
            w-full
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
      <h4 className={`${tokens.typography.heading.h4} ${isDarkMode ? colors.structural.text.primary : 'text-gray-900'} ${tokens.spacing.margin.md}`}>
        Scheduling: {selectedFirefighter.name}
      </h4>

      <div className="space-y-4">
        {/* Station selector */}
        <div>
          <label className={`block ${tokens.typography.body.secondary} ${isDarkMode ? colors.structural.text.secondary : 'text-gray-700'} mb-2`}>
            Hold Station
          </label>
          <StationSelector
            selectedStation={selectedStation}
            onStationChange={onStationChange}
          />
        </div>

        {/* Duration selector */}
        <div>
          <label className={`block ${tokens.typography.body.secondary} ${isDarkMode ? colors.structural.text.secondary : 'text-gray-700'} mb-2`}>
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
          <label className={`block ${tokens.typography.body.secondary} ${isDarkMode ? colors.structural.text.secondary : 'text-gray-700'} mb-2`}>
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
          <span className={`${tokens.typography.body.secondary} ${isDarkMode ? colors.structural.text.secondary : 'text-gray-700'}`}>
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
              ${!selectedStation ? 'opacity-50 cursor-not-allowed' : ''}
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

