import { X, Clock } from 'lucide-react';
import { ActivityLog } from './ActivityLog';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { useFocusReturn } from '../hooks/useFocusReturn';
import { colors, tokens } from '../styles';
import { useEffect } from 'react';

interface ActivityLogModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ActivityLogModal({ isOpen, onClose }: ActivityLogModalProps) {
  const trapRef = useFocusTrap(isOpen);
  useFocusReturn(isOpen);

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

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 ${colors.components.modal.overlay} z-50 flex items-center justify-center ${tokens.spacing.card.md} animate-fade-in`}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="activity-modal-title"
    >
      <div
        ref={trapRef}
        className={`${colors.components.modal.background} ${colors.components.modal.border} ${tokens.borders.radius['2xl']} max-w-4xl w-full max-h-[90vh] overflow-hidden ${colors.components.modal.shadow} animate-scale-in`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`${colors.structural.bg.surface} border-b-2 ${colors.structural.border.default} ${tokens.spacing.card.lg} flex items-center justify-between`}>
          <div className={`flex items-center ${tokens.spacing.gap.md}`}>
            <div className={`${colors.semantic.scheduled.gradient} ${tokens.spacing.card.sm} ${tokens.borders.radius.lg}`}>
              <Clock className="text-white" size={24} />
            </div>
            <h2 id="activity-modal-title" className={`${tokens.typography.heading.h2} ${colors.structural.text.primary}`}>Activity Log</h2>
          </div>
          <button
            onClick={onClose}
            className={`p-2 ${tokens.touchTarget.min} ${colors.interactive.hover.bg} ${tokens.borders.radius.md} transition-colors focus-ring flex items-center justify-center`}
            aria-label="Close activity log dialog"
          >
            <X size={24} className={colors.structural.text.secondary} />
          </button>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-100px)]">
          <ActivityLog />
        </div>
      </div>
    </div>
  );
}
