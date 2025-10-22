import { useEffect, useState } from 'react';
import { X, UserPlus } from 'lucide-react';
import { Firefighter } from '../lib/supabase';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { useFocusReturn } from '../hooks/useFocusReturn';

interface ReactivateModalProps {
  isOpen: boolean;
  firefighter: Firefighter | null;
  currentRosterSize: number;
  onClose: () => void;
  onConfirm: (firefighterId: string, position: number) => void;
}

export function ReactivateModal({
  isOpen,
  firefighter,
  currentRosterSize,
  onClose,
  onConfirm
}: ReactivateModalProps) {
  const [selectedPosition, setSelectedPosition] = useState<number>(currentRosterSize);
  const trapRef = useFocusTrap(isOpen);
  useFocusReturn(isOpen);

  useEffect(() => {
    if (isOpen) {
      setSelectedPosition(currentRosterSize);
    }
  }, [isOpen, currentRosterSize]);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  function handleConfirm() {
    if (firefighter) {
      onConfirm(firefighter.id, selectedPosition);
      onClose();
    }
  }

  if (!isOpen || !firefighter) return null;

  const positions = Array.from({ length: currentRosterSize + 1 }, (_, i) => i);

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="reactivate-modal-title"
    >
      <div
        ref={trapRef}
        className="bg-gradient-to-br from-gray-800 to-gray-850 border-2 border-gray-700 rounded-2xl max-w-lg w-full shadow-2xl animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 border-b-2 border-gray-700 p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-3 rounded-xl">
              <UserPlus className="text-white" size={24} />
            </div>
            <div>
              <h2 id="reactivate-modal-title" className="text-2xl font-bold text-white">
                Reactivate {firefighter.name}
              </h2>
              <p className="text-sm text-gray-400">Choose position in rotation</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors focus-ring"
            aria-label="Close reactivate dialog"
          >
            <X size={24} className="text-gray-400" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label htmlFor="position-select" className="block text-sm font-semibold text-gray-300 mb-3">
              Select Position in Rotation
            </label>
            <select
              id="position-select"
              value={selectedPosition}
              onChange={(e) => setSelectedPosition(Number(e.target.value))}
              className="w-full bg-gray-900 border-2 border-gray-700 rounded-xl px-4 py-3 text-white font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              {positions.map((pos) => (
                <option key={pos} value={pos}>
                  Position {pos + 1} {pos === 0 ? '(First - Next Up)' : pos === currentRosterSize ? '(Last)' : ''}
                </option>
              ))}
            </select>
            <p className="mt-2 text-xs text-gray-400">
              Current roster has {currentRosterSize} active {currentRosterSize === 1 ? 'member' : 'members'}
            </p>
          </div>

          <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-gray-300 mb-2">Firefighter Details</h3>
            <div className="space-y-1 text-sm">
              <p className="text-gray-400">
                <span className="font-semibold">Name:</span> <span className="text-white">{firefighter.name}</span>
              </p>
              {firefighter.fire_station && (
                <p className="text-gray-400">
                  <span className="font-semibold">Station:</span> <span className="text-white">#{firefighter.fire_station}</span>
                </p>
              )}
              <p className="text-gray-400">
                <span className="font-semibold">Last Hold:</span>{' '}
                <span className="text-white">
                  {firefighter.last_hold_date
                    ? new Date(firefighter.last_hold_date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })
                    : 'Never'}
                </span>
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-semibold transition-colors focus-ring"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white rounded-xl font-semibold transition-all shadow-lg focus-ring flex items-center justify-center gap-2"
            >
              <UserPlus size={18} />
              Reactivate
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
