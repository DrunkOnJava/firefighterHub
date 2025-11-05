import { useEffect, useState } from 'react';
import { X, UserPlus } from 'lucide-react';
import { Firefighter } from '../lib/supabase';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { useFocusReturn } from '../hooks/useFocusReturn';
import { colors, tokens } from '../styles';

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
      className={`fixed inset-0 ${colors.components.modal.overlay} z-50 flex items-center justify-center ${tokens.spacing.card.md} animate-fade-in`}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="reactivate-modal-title"
    >
      <div
        ref={trapRef}
        className={`${colors.components.modal.background} ${colors.components.modal.border} ${tokens.borders.radius['2xl']} max-w-lg w-full ${colors.components.modal.shadow} animate-scale-in`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`${colors.structural.bg.surface} border-b-2 ${colors.structural.border.default} ${tokens.spacing.card.lg} flex items-center justify-between`}>
          <div className={`flex items-center ${tokens.spacing.gap.md}`}>
            <div className={`${colors.semantic.success.gradient} ${tokens.spacing.card.sm} ${tokens.borders.radius.lg}`}>
              <UserPlus className={`${tokens.icons.lg} text-white`} />
            </div>
            <div>
              <h2 id="reactivate-modal-title" className={`${tokens.typography.heading.h2} ${colors.structural.text.primary}`}>
                Reactivate {firefighter.name}
              </h2>
              <p className={`${tokens.typography.body.secondary} ${colors.structural.text.tertiary}`}>Choose position in rotation</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-2 ${colors.interactive.hover.bg} ${tokens.borders.radius.md} transition-colors focus-ring`}
            aria-label="Close reactivate dialog"
          >
            <X className={`${tokens.icons.lg} ${colors.structural.text.secondary}`} />
          </button>
        </div>

        <div className={`${tokens.spacing.card.lg} space-y-6`}>
          <div>
            <label htmlFor="position-select" className={`block ${tokens.typography.body.secondary} font-semibold ${colors.structural.text.secondary} mb-3`}>
              Select Position in Rotation
            </label>
            <select
              id="position-select"
              value={selectedPosition}
              onChange={(e) => setSelectedPosition(Number(e.target.value))}
              className={`w-full ${colors.components.input.default} border-2 ${tokens.borders.radius.lg} px-4 py-3 ${colors.structural.text.primary} font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent`}
            >
              {positions.map((pos) => (
                <option key={pos} value={pos}>
                  Position {pos + 1} {pos === 0 ? '(First - Next Up)' : pos === currentRosterSize ? '(Last)' : ''}
                </option>
              ))}
            </select>
            <p className={`mt-2 ${tokens.typography.body.small} ${colors.structural.text.tertiary}`}>
              Current roster has {currentRosterSize} active {currentRosterSize === 1 ? 'member' : 'members'}
            </p>
          </div>

          <div className={`${colors.structural.bg.surface} border ${colors.structural.border.default} ${tokens.borders.radius.lg} ${tokens.spacing.card.md}`}>
            <h3 className={`${tokens.typography.body.secondary} font-semibold ${colors.structural.text.secondary} mb-2`}>Firefighter Details</h3>
            <div className={`space-y-1 ${tokens.typography.body.secondary}`}>
              <p className={colors.structural.text.tertiary}>
                <span className="font-semibold">Name:</span> <span className={colors.structural.text.primary}>{firefighter.name}</span>
              </p>
              {firefighter.fire_station && (
                <p className={colors.structural.text.tertiary}>
                  <span className="font-semibold">Station:</span> <span className={colors.structural.text.primary}>#{firefighter.fire_station}</span>
                </p>
              )}
              <p className={colors.structural.text.tertiary}>
                <span className="font-semibold">Last Hold:</span>{' '}
                <span className={colors.structural.text.primary}>
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

          <div className={`flex ${tokens.spacing.gap.md}`}>
            <button
              onClick={onClose}
              className={`flex-1 px-6 py-3 ${colors.components.button.secondary} ${tokens.borders.radius.lg} font-semibold focus-ring`}
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className={`flex-1 px-6 py-3 ${colors.semantic.success.gradient} ${colors.semantic.success.hover} text-white ${tokens.borders.radius.lg} font-semibold transition-all ${colors.semantic.success.shadow} focus-ring flex items-center justify-center ${tokens.spacing.gap.sm}`}
            >
              <UserPlus className={tokens.icons.sm} />
              Reactivate
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
