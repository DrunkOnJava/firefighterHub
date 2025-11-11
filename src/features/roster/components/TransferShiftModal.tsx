import { ArrowRightLeft, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useFocusReturn } from '@/hooks/useFocusReturn';
import { useFocusTrap } from '@/hooks/useFocusTrap';
import { Firefighter, Shift } from '@/lib/supabase';
import { Button } from '@/components/ui/button';

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
  onConfirm,
}: TransferShiftModalProps) {
  const [selectedShift, setSelectedShift] = useState<Shift>("A");
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const handleConfirm = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      onConfirm(firefighter.id, selectedShift);
      onClose();
    } catch (error) {
      console.error('Error transferring:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const shifts: Shift[] = ["A", "B", "C"];
  const availableShifts = shifts.filter((s) => s !== firefighter.shift);

  return (
    <div
      className="fixed inset-0 bg-black/80 z-50 flex items-end sm:items-center justify-center p-4 animate-in fade-in duration-200"
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
        className="bg-card border-2 border-border rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom-8 sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="sticky top-0 bg-primary/10 backdrop-blur-sm border-b-2 border-primary/50 p-6 flex items-center justify-between z-10"
        >
          <div className="flex items-center gap-4">
            <ArrowRightLeft
              className="text-primary"
              size={28}
            />
            <div>
              <h2
                id="transfer-shift-title"
                className="text-xl font-semibold text-foreground"
              >
                Transfer Shift
              </h2>
              <p
                className="text-sm text-muted-foreground mt-1"
              >
                {firefighter.name}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          <div
            className="bg-cyan-900/20 border border-cyan-700/50 rounded-lg p-4"
          >
            <p
              className="text-sm text-cyan-300"
            >
              Transfer <strong>{firefighter.name}</strong> from{" "}
              <strong>Shift {firefighter.shift}</strong> to a different shift.
              All history and records will be preserved.
            </p>
          </div>

          <div className="space-y-3">
            <label
              className="text-sm font-semibold text-muted-foreground"
            >
              Select New Shift
            </label>
            <div className="grid grid-cols-2 gap-3">
              {availableShifts.map((shift) => (
                <button
                  key={shift}
                  onClick={() => setSelectedShift(shift)}
                  className={`py-4 px-6 rounded-lg font-bold text-lg transition-all border-2 ${
                    selectedShift === shift
                      ? "bg-primary border-primary text-primary-foreground shadow-lg"
                      : "bg-muted border-border text-muted-foreground hover:border-accent-foreground"
                  }`}
                >
                  Shift {shift}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              onClick={onClose}
              variant="secondary"
              size="lg"
              className="flex-1"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              variant="default"
              size="lg"
              className="flex-1"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin">⏳</span>
                  Transferring...
                </span>
              ) : (
                <>
                  <ArrowRightLeft className="mr-2 h-5 w-5" />
                  Transfer
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
