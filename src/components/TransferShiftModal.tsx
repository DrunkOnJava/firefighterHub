import { ArrowRightLeft, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useFocusReturn } from "../hooks/useFocusReturn";
import { useFocusTrap } from "../hooks/useFocusTrap";
import { Firefighter, Shift } from "../lib/supabase";
import { colors, tokens } from "../styles";

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
    <div
      className={`fixed inset-0 ${colors.components.modal.overlay} z-50 flex items-center justify-center ${tokens.spacing.card.md} animate-fade-in`}
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
        className={`${colors.components.modal.background} ${colors.components.modal.border} ${tokens.borders.radius['2xl']} ${colors.components.modal.shadow} max-w-lg w-full max-h-[90vh] overflow-y-auto`}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={`sticky top-0 ${colors.semantic.primary.gradient} backdrop-blur-sm border-b-2 ${colors.semantic.primary.border} ${tokens.spacing.card.lg} flex items-center justify-between z-10`}
        >
          <div className={`flex items-center ${tokens.spacing.gap.md}`}>
            <ArrowRightLeft
              className={colors.semantic.primary.text}
              size={28}
            />
            <div>
              <h2
                id="transfer-shift-title"
                className={`${tokens.typography.heading.h2} text-white`}
              >
                Transfer Shift
              </h2>
              <p
                className={`${tokens.typography.body.small} text-blue-200 mt-1`}
              >
                {firefighter.name}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-2 ${tokens.touchTarget.min} ${colors.interactive.hover.bg} ${tokens.borders.radius.lg} transition-colors focus-ring flex items-center justify-center`}
            aria-label="Close dialog"
          >
            <X size={24} className={colors.structural.text.secondary} />
          </button>
        </div>

        <div className={`${tokens.spacing.card.lg} space-y-6`}>
          <div
            className={`${colors.semantic.info.light} border ${colors.semantic.info.border} ${tokens.borders.radius.lg} ${tokens.spacing.card.md}`}
          >
            <p
              className={`${tokens.typography.body.secondary} ${colors.semantic.info.text}`}
            >
              Transfer <strong>{firefighter.name}</strong> from{" "}
              <strong>Shift {firefighter.shift}</strong> to a different shift.
              All history and records will be preserved.
            </p>
          </div>

          <div className="space-y-3">
            <label
              className={`${tokens.typography.body.secondary} font-semibold ${colors.structural.text.secondary}`}
            >
              Select New Shift
            </label>
            <div className="grid grid-cols-2 gap-3">
              {availableShifts.map((shift) => (
                <button
                  key={shift}
                  onClick={() => setSelectedShift(shift)}
                  className={`py-4 px-6 ${
                    tokens.borders.radius.lg
                  } font-bold text-lg transition-all border-2 ${
                    selectedShift === shift
                      ? `${colors.semantic.primary.solid} ${colors.semantic.primary.border} text-white ${colors.semantic.primary.shadow}`
                      : `${colors.structural.bg.card} ${colors.structural.border.default} ${colors.structural.text.secondary} hover:${colors.structural.border.hover}`
                  }`}
                >
                  Shift {shift}
                </button>
              ))}
            </div>
          </div>

          <div className={`flex ${tokens.spacing.gap.md} pt-4`}>
            <button
              onClick={onClose}
              className={`flex-1 ${colors.components.button.secondary} font-bold py-3 ${tokens.borders.radius.lg} transition-colors focus-ring`}
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className={`flex-1 ${colors.semantic.primary.gradient} ${colors.semantic.primary.hover} text-white font-bold py-3 ${tokens.borders.radius.lg} transition-colors ${colors.semantic.primary.shadow} focus-ring flex items-center justify-center ${tokens.spacing.gap.sm}`}
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
