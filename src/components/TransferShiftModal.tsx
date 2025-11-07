import { ArrowRightLeft, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useFocusReturn } from "../hooks/useFocusReturn";
import { useFocusTrap } from "../hooks/useFocusTrap";
import { Firefighter, Shift } from "../lib/supabase";
import { colors, tokens, gridUtilities } from "../styles";
import { Button } from "./ui/Button";
import { IconButton } from "./ui/IconButton";

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
          <IconButton
            icon={X}
            label="Close dialog"
            onClick={onClose}
            variant="default"
            size="md"
            isDarkMode={true}
          />
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
            <div className={gridUtilities.form.grid2Col}>
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
            <Button
              onClick={onClose}
              variant="secondary"
              size="lg"
              fullWidth
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              variant="primary"
              size="lg"
              fullWidth
              state={isSubmitting ? 'loading' : 'idle'}
              withRipple
              leftIcon={<ArrowRightLeft size={20} />}
            >
              Transfer
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
