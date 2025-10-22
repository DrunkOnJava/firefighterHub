import { useState, useEffect } from 'react';
import { X, ArrowRightLeft } from 'lucide-react';
import { Firefighter, Shift } from '../lib/supabase';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { useFocusReturn } from '../hooks/useFocusReturn';

interface TransferShiftModalProps {
  isOpen: boolean;
  firefighter: Firefighter | null;
  onClose: () => void;
  onConfirm: (firefighterId: string, newShift: Shift) => void;
}

export function TransferShiftModal({
  isOpen,
  firefighter,
  onClose,
  onConfirm
}: TransferShiftModalProps) {
  const [selectedShift, setSelectedShift] = useState<Shift>('A');
  const trapRef = useFocusTrap(isOpen);
  useFocusReturn(isOpen);

  useEffect(() => {
    if (isOpen && firefighter) {
      const shifts: Shift[] = ['A', 'B', 'C'];
      const otherShifts = shifts.filter(s => s !== firefighter.shift);
      setSelectedShift(otherShifts[0]);
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
    onConfirm(firefighter.id, selectedShift);
    onClose();
  };

  const shifts: Shift[] = ['A', 'B', 'C'];
  const availableShifts = shifts.filter(s => s !== firefighter.shift);

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
      aria-labelledby="transfer-shift-title"
    >
      <div
        ref={trapRef}
        className="bg-gradient-to-br from-gray-800 to-gray-850 border-2 border-gray-700 rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-gradient-to-r from-blue-900/90 to-blue-800/90 backdrop-blur-sm border-b-2 border-blue-700 px-6 py-5 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <ArrowRightLeft className="text-blue-400" size={28} />
            <div>
              <h2 id="transfer-shift-title" className="text-2xl font-bold text-white">
                Transfer Shift
              </h2>
              <p className="text-sm text-blue-200 mt-1">
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
              Transfer <strong>{firefighter.name}</strong> from <strong>Shift {firefighter.shift}</strong> to a different shift. All history and records will be preserved.
            </p>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-300">
              Select New Shift
            </label>
            <div className="grid grid-cols-2 gap-3">
              {availableShifts.map((shift) => (
                <button
                  key={shift}
                  onClick={() => setSelectedShift(shift)}
                  className={`py-4 px-6 rounded-lg font-bold text-lg transition-all border-2 ${
                    selectedShift === shift
                      ? 'bg-blue-600 border-blue-500 text-white shadow-lg'
                      : 'bg-gray-700 border-gray-600 text-gray-300 hover:border-gray-500'
                  }`}
                >
                  Shift {shift}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 rounded-lg transition-colors focus-ring"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-bold py-3 rounded-lg transition-colors shadow-lg focus-ring flex items-center justify-center gap-2"
            >
              <ArrowRightLeft size={20} />
              Transfer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
