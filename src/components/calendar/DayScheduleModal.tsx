import { useState, useEffect } from 'react';
import { X, Calendar, Clock, MapPin, SkipForward, Check } from 'lucide-react';
import { Firefighter, Shift, HoldDuration } from '../../lib/supabase';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { useFocusReturn } from '../../hooks/useFocusReturn';
import { format } from 'date-fns';
import { AnimatedButton, ButtonState } from '../ui/AnimatedButton';
import { AnimatedToggle } from '../ui/AnimatedToggle';
import { StationSelector } from '../StationSelector';

interface DayScheduleModalProps {
  isOpen: boolean;
  selectedDate: Date | null;
  nextFirefighter: Firefighter | null;
  allFirefighters: Firefighter[];
  onClose: () => void;
  onSchedule: (
    firefighter: Firefighter,
    station: string,
    duration: HoldDuration,
    startTime: string,
    isVoluntary: boolean
  ) => void;
  onSkip: (firefighterId: string) => void;
  isDarkMode: boolean;
  currentShift: Shift;
}

export function DayScheduleModal({
  isOpen,
  selectedDate,
  nextFirefighter,
  onClose,
  onSchedule,
  onSkip,
  isDarkMode: _isDarkMode,
}: DayScheduleModalProps) {
  const [selectedStation, setSelectedStation] = useState('');
  const [duration, setDuration] = useState<HoldDuration>('24h');
  const [startTime, setStartTime] = useState('07:00');
  const [isVoluntary, setIsVoluntary] = useState(false);
  const [isSkipping, setIsSkipping] = useState(false);
  const [isScheduling, setIsScheduling] = useState(false);

  const trapRef = useFocusTrap(isOpen);
  useFocusReturn(isOpen);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen && nextFirefighter) {
      setSelectedStation(nextFirefighter.fire_station || '');
      setDuration('24h');
      setStartTime('07:00');
      setIsVoluntary(false);
    }
  }, [isOpen, nextFirefighter]);

  if (!isOpen || !selectedDate || !nextFirefighter) return null;

  const formattedDate = format(selectedDate, 'EEEE, MMMM d, yyyy');

  const handleSchedule = async () => {
    setIsScheduling(true);
    try {
      await onSchedule(
        nextFirefighter,
        selectedStation,
        duration,
        startTime,
        isVoluntary
      );
      onClose();
    } finally {
      setIsScheduling(false);
    }
  };

  const handleSkip = async () => {
    setIsSkipping(true);
    try {
      await onSkip(nextFirefighter.id);
      onClose();
    } finally {
      setIsSkipping(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(4px)',
      }}
      onClick={onClose}
    >
      <div
        ref={trapRef}
        className="relative w-full max-w-lg rounded-lg shadow-xl bg-card text-foreground"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="day-schedule-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <Calendar className="text-blue-500" size={24} />
            <h2
              id="day-schedule-title"
              className="text-xl font-semibold"
            >
              Schedule Hold
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg transition-colors hover:bg-muted text-muted-foreground hover:text-foreground"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Date Display */}
          <div className="p-4 rounded-lg bg-muted">
            <p className="text-sm font-medium text-muted-foreground">
              Date
            </p>
            <p className="text-lg font-semibold mt-1">{formattedDate}</p>
          </div>

          {/* Next Firefighter */}
          <div className="p-4 rounded-lg bg-blue-900/20 dark:bg-blue-900/20 border border-blue-500/30">
            <p className="text-sm font-medium mb-2 text-blue-500">
              Next in Rotation
            </p>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-semibold">{nextFirefighter.name}</p>
                <p className="text-sm text-muted-foreground">
                  Station {nextFirefighter.fire_station || 'N/A'} • Position{' '}
                  {nextFirefighter.order_position + 1}
                </p>
              </div>
              <div className="px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400">
                Shift {nextFirefighter.shift}
              </div>
            </div>
          </div>

          {/* Station Selection */}
          <div>
            <label className="block text-sm font-medium mb-2 text-foreground">
              <MapPin size={16} className="inline mr-2" />
              Hold Station
            </label>
            <StationSelector
              selectedStation={selectedStation}
              onStationChange={setSelectedStation}
              defaultStation={nextFirefighter.fire_station}
            />
            <p className="text-xs mt-1 text-muted-foreground">
              Which station is this firefighter being held at?
            </p>
          </div>

          {/* Duration & Start Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">
                Duration
              </label>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value as HoldDuration)}
                className="w-full px-3 py-2 rounded-lg border bg-input border-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="12h">12 hours</option>
                <option value="24h">24 hours</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">
                <Clock size={16} className="inline mr-2" />
                Start Time
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border bg-input border-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          {/* Voluntary Pickup Toggle */}
          <div className="p-4 rounded-lg border bg-muted border-border">
            <AnimatedToggle
              checked={isVoluntary}
              onChange={setIsVoluntary}
              label="Voluntary Pickup - Firefighter voluntarily picked up this hold (will move to bottom of rotation)"
              variant="success"
              size="md"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <AnimatedButton
              variant="ghost"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </AnimatedButton>

            <AnimatedButton
              variant="secondary"
              onClick={handleSkip}
              state={isSkipping ? 'loading' : ('idle' as ButtonState)}
              disabled={isSkipping || isScheduling}
              className="flex-1"
              icon={<SkipForward size={18} />}
            >
              Skip to Next
            </AnimatedButton>

            <AnimatedButton
              variant="primary"
              onClick={handleSchedule}
              state={isScheduling ? 'loading' : ('idle' as ButtonState)}
              disabled={isSkipping || isScheduling || !selectedStation}
              className="flex-1"
              icon={<Check size={18} />}
            >
              Schedule Hold
            </AnimatedButton>
          </div>

          {/* Info Message */}
          {isVoluntary && (
            <div className="p-3 rounded-lg text-sm bg-green-900/20 dark:bg-green-900/20 text-green-400 border border-green-500/30">
              <strong>Voluntary pickup:</strong> {nextFirefighter.name} will be
              moved to the bottom of the rotation after completing this hold.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
