/**
 * TransferShiftModal - Shift Transfer Modal Component
 *
 * Modal for transferring a firefighter to a different shift.
 * Automatically switches between MaterialM and legacy styling based on feature flag.
 *
 * @example
 * ```tsx
 * <TransferShiftModal
 *   isOpen={isOpen}
 *   firefighter={selectedFirefighter}
 *   onClose={handleClose}
 *   onConfirm={handleTransfer}
 * />
 * ```
 */

import { ArrowRightLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useFocusReturn } from "../hooks/useFocusReturn";
import { useFocusTrap } from "../hooks/useFocusTrap";
import { Firefighter, Shift } from "../lib/supabase";
import { DialogM3 } from "./m3/DialogM3";
import { ButtonM3 } from "./m3/ButtonM3";
import { CardM3 } from "./m3/CardM3";
import { ShiftBadge } from "./ShiftBadge";

interface TransferShiftModalProps {
  isOpen: boolean;
  firefighter: Firefighter | null;
  onClose: () => void;
  onConfirm: (firefighterId: string, newShift: Shift) => void;
}

/**
 * Transfer Shift Modal - MaterialM Design
 */
export function TransferShiftModal({
  isOpen,
  firefighter,
  onClose,
  onConfirm,
}: TransferShiftModalProps) {
  const [selectedShift, setSelectedShift] = useState<Shift>("A");
  const trapRef = useFocusTrap(isOpen);
  useFocusReturn(isOpen);

  useEffect(() => {
    if (isOpen && firefighter) {
      const shifts: Shift[] = ["A", "B", "C"];
      const otherShifts = shifts.filter((s) => s !== firefighter.shift);
      setSelectedShift(otherShifts[0]);
    }
  }, [isOpen, firefighter]);

  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    }

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen || !firefighter) return null;

  const handleConfirm = () => {
    onConfirm(firefighter.id, selectedShift);
    onClose();
  };

  const shifts: Shift[] = ["A", "B", "C"];
  const availableShifts = shifts.filter((s) => s !== firefighter.shift);

  return (
    <DialogM3 show={isOpen} onClose={onClose} size="md">
      {/* Custom Header */}
      <div
        ref={trapRef}
        className="p-6 border-b border-materialm-border dark:border-materialm-border-dark bg-materialm-primary dark:bg-materialm-primary-emphasis"
      >
        <div className="flex items-center gap-3">
          <ArrowRightLeft className="w-7 h-7 text-white" />
          <div>
            <h2 className="text-2xl font-bold text-white">
              Transfer Shift
            </h2>
            <p className="text-sm text-white/90 mt-1">
              {firefighter.name}
            </p>
          </div>
        </div>
      </div>

      <DialogM3.Body>
        <div className="space-y-6">
          {/* Info Card */}
          <CardM3 className="bg-materialm-primary-light dark:bg-materialm-primary-light border-materialm-primary dark:border-materialm-primary">
            <p className="text-sm text-materialm-text-primary dark:text-materialm-text-primary">
              Transfer <strong>{firefighter.name}</strong> from{" "}
              <strong>Shift {firefighter.shift}</strong> to a different shift.
              All history and records will be preserved.
            </p>
          </CardM3>

          {/* Shift Selector */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-materialm-text-primary dark:text-materialm-text-primary">
              Select New Shift
            </label>
            <div className="grid grid-cols-2 gap-3">
              {availableShifts.map((shift) => (
                <button
                  key={shift}
                  onClick={() => setSelectedShift(shift)}
                  className={`
                    py-4 px-6 rounded-lg font-bold text-lg transition-all border-2 flex items-center justify-center gap-2
                    ${
                      selectedShift === shift
                        ? "bg-materialm-primary dark:bg-materialm-primary-emphasis border-materialm-primary dark:border-materialm-primary text-white shadow-materialm-2"
                        : "bg-white dark:bg-materialm-dark border-materialm-border dark:border-materialm-border-dark text-materialm-text-primary dark:text-materialm-text-primary hover:border-materialm-primary dark:hover:border-materialm-primary"
                    }
                  `}
                >
                  <ShiftBadge shift={shift} size="sm" />
                  <span>Shift {shift}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </DialogM3.Body>

      <DialogM3.Footer>
        <ButtonM3 variant="outlined" color="neutral" onClick={onClose}>
          Cancel
        </ButtonM3>
        <ButtonM3
          color="primary"
          startIcon={<ArrowRightLeft size={20} />}
          onClick={handleConfirm}
          className="shadow-materialm-2"
        >
          Transfer
        </ButtonM3>
      </DialogM3.Footer>
    </DialogM3>
  );
}
