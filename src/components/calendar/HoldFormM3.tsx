/**
 * HoldFormM3 Component - MaterialM Version
 *
 * Form for scheduling a hold with M3 design system:
 * - Firefighter selection list (if none selected)
 * - Hold details form (station, duration, start time)
 * - "Add another" checkbox
 * - Confirm/cancel buttons
 *
 * Uses MaterialM components and color system.
 */

import { useState } from "react";
import { Firefighter, HoldDuration } from "../../lib/supabase";
import { CalendarDay } from "../../utils/calendarUtils";
import { StationSelector } from "../StationSelector";
import { InputM3, SelectM3, CheckboxM3 } from "../m3/InputM3";
import { ButtonM3 } from "../m3/ButtonM3";

interface HoldFormM3Props {
  selectedDay: CalendarDay;
  firefighters: Firefighter[];
  selectedFirefighter: Firefighter | null;
  onFirefighterSelect: (ff: Firefighter) => void;
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

export function HoldFormM3({
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
}: HoldFormM3Props) {
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
    return (
      <div>
        <h4 className="text-xl font-semibold text-materialm-text mb-4">
          Select Firefighter:
        </h4>

        <div className="space-y-2 max-h-96 overflow-y-auto mb-6">
          {availableFirefighters.length === 0 ? (
            <p className="text-sm text-materialm-text-disabled text-center py-8">
              No available firefighters
            </p>
          ) : (
            availableFirefighters.map((ff) => (
              <button
                key={ff.id}
                onClick={() => onFirefighterSelect(ff)}
                className="
                  w-full text-left p-4 rounded-xl border-2
                  bg-materialm-dark
                  border-materialm-border-dark
                  hover:bg-materialm-darkgray
                  hover:border-materialm-primary
                  transition-all duration-200
                  materialm-shadow-1 hover:materialm-shadow-2
                "
              >
                <div className="font-medium text-materialm-text">
                  {ff.name}
                </div>
                <div className="text-sm text-materialm-text-secondary">
                  Position: {ff.order_position + 1}
                  {ff.fire_station && ` • Station ${ff.fire_station}`}
                </div>
              </button>
            ))
          )}
        </div>

        <ButtonM3
          variant="outlined"
          color="neutral"
          fullWidth
          onClick={onCancel}
        >
          Cancel
        </ButtonM3>
      </div>
    );
  }

  // Hold details form
  return (
    <div>
      <h4 className="text-xl font-semibold text-materialm-text mb-4">
        Scheduling: {selectedFirefighter.name}
      </h4>

      <div className="space-y-4">
        {/* Station selector */}
        <div>
          <label className="block text-sm font-medium text-materialm-text-secondary mb-2">
            Hold Station
          </label>
          <StationSelector
            selectedStation={selectedStation}
            onStationChange={onStationChange}
          />
        </div>

        {/* Duration selector */}
        <SelectM3
          label="Duration"
          value={duration}
          onChange={(e) => setDuration(e.target.value as HoldDuration)}
          options={[
            { value: "12h", label: "12 hours" },
            { value: "24h", label: "24 hours" },
          ]}
        />

        {/* Start time */}
        <InputM3
          label="Start Time"
          type="time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
        />

        {/* Add another checkbox */}
        <CheckboxM3
          label="Add another hold after this"
          checked={showAddAnother}
          onChange={(e) => onAddAnotherChange(e.target.checked)}
        />

        {/* Action buttons */}
        <div className="flex gap-3 mt-6">
          <ButtonM3
            variant="outlined"
            color="neutral"
            fullWidth
            onClick={onCancel}
          >
            Back
          </ButtonM3>
          <ButtonM3
            variant="filled"
            color="primary"
            fullWidth
            onClick={handleConfirm}
            disabled={!selectedStation}
          >
            Confirm
          </ButtonM3>
        </div>
      </div>
    </div>
  );
}
