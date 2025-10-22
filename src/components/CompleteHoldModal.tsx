import { useState, useEffect } from 'react';
import { X, Calendar as CalendarIcon, CheckCircle } from 'lucide-react';
import { Firefighter } from '../lib/supabase';
import { StationSelector } from './StationSelector';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { useFocusReturn } from '../hooks/useFocusReturn';

interface CompleteHoldModalProps {
  isOpen: boolean;
  firefighter: Firefighter | null;
  onClose: () => void;
  onConfirm: (firefighterId: string, holdDate: string, station?: string) => void;
}

export function CompleteHoldModal({
  isOpen,
  firefighter,
  onClose,
  onConfirm
}: CompleteHoldModalProps) {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedStation, setSelectedStation] = useState('');
  const trapRef = useFocusTrap(isOpen);
  useFocusReturn(isOpen);

  useEffect(() => {
    if (isOpen && firefighter) {
      const today = new Date().toISOString().split('T')[0];
      setSelectedDate(today);
      setSelectedStation(firefighter.fire_station || '');
    }
  }, [isOpen, firefighter]);

  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    }

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen || !firefighter) return null;

  const handleConfirm = () => {
    if (!selectedDate) return;
    const stationToUse = selectedStation || undefined;
    onConfirm(firefighter.id, selectedDate, stationToUse);
    onClose();
  };

  const today = new Date().toISOString().split('T')[0];
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 365);
  const maxDateStr = maxDate.toISOString().split('T')[0];

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
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
        className="bg-gradient-to-br from-gray-800 to-gray-850 border-2 border-gray-700 rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-gradient-to-r from-green-900/90 to-green-800/90 backdrop-blur-sm border-b-2 border-green-700 px-6 py-5 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <CheckCircle className="text-green-400" size={28} />
            <div>
              <h2 id="complete-hold-title" className="text-2xl font-bold text-white">
                Complete Hold
              </h2>
              <p className="text-sm text-green-200 mt-1">
                {firefighter.name}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors focus-ring"
            aria-label="Close dialog"
          >
            <X size={24} className="text-gray-400" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-blue-900/20 border border-blue-700/50 rounded-lg p-4">
            <p className="text-sm text-blue-200">
              This will mark the hold as completed, move <strong>{firefighter.name}</strong> to the end of the rotation, and optionally schedule a calendar entry.
            </p>
          </div>

          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-300">
              <CalendarIcon size={18} className="text-orange-400" />
              <span>Hold Date</span>
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={today}
              max={maxDateStr}
              className="w-full px-4 py-3 bg-gray-900 border-2 border-gray-700 rounded-lg text-white focus:outline-none focus:border-orange-500 transition-colors"
            />
          </div>

          <StationSelector
            selectedStation={selectedStation}
            onStationChange={setSelectedStation}
            defaultStation={firefighter.fire_station}
          />

          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 rounded-lg transition-colors focus-ring"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={!selectedDate}
              className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white font-bold py-3 rounded-lg transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed focus-ring flex items-center justify-center gap-2"
            >
              <CheckCircle size={20} />
              Complete Hold
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
