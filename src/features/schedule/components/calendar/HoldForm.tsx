/**
 * HoldForm Component
 *
 * Form for scheduling a hold with:
 * - Firefighter selection list (if none selected)
 * - Hold details form (station, duration, start time)
 * - "Add another" checkbox
 * - Confirm/cancel buttons
 */

import { useState } from "react";
import { Firefighter, HoldDuration } from '@/lib/supabase';
import { CalendarDay } from '@/utils/calendarUtils';
import { StationSelector } from "@/features/shifts/components/StationSelector";

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
    startTime?: string,
    isVoluntary?: boolean
  ) => void;
  onCancel: () => void;
  onSkipFirefighter?: (firefighterId: string) => void;
  selectedStation: string;
  onStationChange: (station: string) => void;
  showAddAnother: boolean;
  onAddAnotherChange: (value: boolean) => void;
}

export function HoldForm({
  selectedDay,
  firefighters,
  selectedFirefighter,
  onFirefighterSelect,
  onSchedule,
  onCancel,
  onSkipFirefighter,
  selectedStation,
  onStationChange,
  showAddAnother,
  onAddAnotherChange,
}: HoldFormProps) {
  const [duration, setDuration] = useState<HoldDuration>("24h");
  const [startTime, setStartTime] = useState<string>("08:00");
  const [isVoluntary, setIsVoluntary] = useState(false);

  const availableFirefighters = firefighters.filter((ff) => ff.is_available);

  const handleConfirm = () => {
    if (selectedFirefighter) {
      const holdDate = selectedDay.date.toISOString().split("T")[0];
      onSchedule(
        holdDate,
        selectedFirefighter,
        selectedStation,
        duration,
        startTime,
        isVoluntary
      );
    }
  };

  // Firefighter selection view
  if (!selectedFirefighter) {
    const nextInRotation = availableFirefighters[0];
    
    return (
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Select Firefighter:
        </h3>

        {/* Next in rotation - highlighted */}
        {nextInRotation && (
          <div className="mb-4">
            <p className="text-sm text-muted-foreground mb-2 font-semibold">
              NEXT IN ROTATION:
            </p>
            <button
              onClick={() => onFirefighterSelect(nextInRotation)}
              className="
                w-full text-left p-3 rounded-lg border-2
                border-blue-500 bg-blue-950/40 dark:bg-blue-950/40
                hover:opacity-80 transition-all duration-200
              "
            >
              <div className="font-bold text-foreground flex items-center gap-2">
                <span className="text-xl">⭐</span>
                {nextInRotation.name}
              </div>
              <div className="text-sm text-muted-foreground">
                Position: {nextInRotation.order_position + 1}
                {nextInRotation.fire_station && ` • Station ${nextInRotation.fire_station}`}
              </div>
            </button>
            
            {/* Skip button */}
            {availableFirefighters.length > 1 && (
              <button
                onClick={() => {
                  if (nextInRotation) {
                    onSkipFirefighter?.(nextInRotation.id);
                  }
                }}
                className="
                  w-full mt-2 px-3 py-2 rounded-lg
                  bg-secondary hover:bg-secondary/80 text-secondary-foreground
                  font-semibold text-sm transition-colors
                "
              >
                Skip to Next Person
              </button>
            )}
          </div>
        )}

        {/* Rest of the list */}
        {availableFirefighters.length > 1 && (
          <>
            <p className="text-sm text-muted-foreground mt-6 mb-2 font-semibold">
              OR SELECT SOMEONE ELSE:
            </p>
            <div className="space-y-2 max-h-64 overflow-y-auto mb-6">
              {availableFirefighters.slice(1).map((ff) => (
                <button
                  key={ff.id}
                  onClick={() => onFirefighterSelect(ff)}
                  className="
                    w-full text-left p-3 rounded-lg border-2
                    border-border bg-card hover:opacity-80
                    transition-all duration-200
                  "
                >
                  <div className="font-medium text-foreground">
                    {ff.name}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Position: {ff.order_position + 1}
                    {ff.fire_station && ` • Station ${ff.fire_station}`}
                  </div>
                </button>
              ))}
            </div>
          </>
        )}

        {availableFirefighters.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-8">
            No available firefighters
          </p>
        )}

        <button
          onClick={onCancel}
          className="
            w-full mt-4 px-3 py-2 rounded-lg
            bg-secondary hover:bg-secondary/80 text-secondary-foreground
            font-semibold transition-colors
          "
        >
          Cancel
        </button>
      </div>
    );
  }

  // Hold details form
  return (
    <div>
      <h3 className="text-lg font-semibold text-foreground mb-4">
        Scheduling: {selectedFirefighter.name}
      </h3>

      <div className="space-y-4">
        {/* Station selector */}
        <div className="p-3 rounded-lg border-2 border-blue-500/30 bg-blue-50/50 dark:bg-blue-950/20">
          <label className="block font-semibold text-foreground mb-2 text-base flex items-center gap-2">
            <span className="text-xl">🏢</span>
            Hold Station
            <span className="text-red-500">*</span>
          </label>
          <StationSelector
            selectedStation={selectedStation}
            onStationChange={onStationChange}
          />
        </div>

        {/* Duration selector */}
        <div>
          <label className="block text-sm text-muted-foreground mb-2">
            Duration
          </label>
          <select
            value={duration}
            onChange={(e) => setDuration(e.target.value as HoldDuration)}
            className="
              w-full px-3 py-2 rounded-lg
              bg-input border border-input text-foreground
              focus:outline-none focus:ring-2 focus:ring-ring
            "
          >
            <option value="12h">12 hours</option>
            <option value="24h">24 hours</option>
          </select>
        </div>

        {/* Start time */}
        <div>
          <label className="block text-sm text-muted-foreground mb-2">
            Start Time
          </label>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="
              w-full px-3 py-2 rounded-lg
              bg-input border border-input text-foreground
              focus:outline-none focus:ring-2 focus:ring-ring
            "
          />
        </div>

        {/* Voluntary hold checkbox */}
        <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg border-2 border-green-500/30 bg-green-50/50 dark:bg-green-950/20">
          <input
            type="checkbox"
            checked={isVoluntary}
            onChange={(e) => setIsVoluntary(e.target.checked)}
            className="w-5 h-5 rounded border-border text-green-600 focus:ring-green-500"
          />
          <div className="flex-1">
            <span className="text-sm text-foreground font-semibold flex items-center gap-2">
              <span className="text-xl">🙋</span>
              Mark as Voluntary Hold
            </span>
            <p className="text-xs text-muted-foreground mt-0.5">
              Member volunteered for this hold (will move to end of rotation)
            </p>
          </div>
        </label>

        {/* Add another checkbox */}
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showAddAnother}
            onChange={(e) => onAddAnotherChange(e.target.checked)}
            className="w-4 h-4 rounded border-border"
          />
          <span className="text-sm text-muted-foreground">
            Add another hold after this
          </span>
        </label>

        {/* Action buttons */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={onCancel}
            className="
              flex-1 px-3 py-2 rounded-lg
              bg-secondary hover:bg-secondary/80 text-secondary-foreground
              font-semibold transition-colors
            "
          >
            Back
          </button>
          <button
            onClick={handleConfirm}
            className="
              flex-1 px-3 py-2 rounded-lg
              bg-primary hover:bg-primary/90 text-primary-foreground
              font-semibold transition-colors
              disabled:opacity-50 disabled:cursor-not-allowed
            "
            disabled={!selectedStation}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
