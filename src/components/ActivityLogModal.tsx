/**
 * ActivityLogModal - Activity History Modal
 *
 * Modal for viewing activity history and audit trail.
 * Automatically switches between MaterialM and legacy styling based on feature flag.
 *
 * @example
 * ```tsx
 * <ActivityLogModal
 *   isOpen={isOpen}
 *   onClose={handleClose}
 * />
 * ```
 */

import { Clock } from 'lucide-react';
import { useEffect } from 'react';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { useFocusReturn } from '../hooks/useFocusReturn';
import { DialogM3 } from './m3/DialogM3';
import { ActivityLog } from './ActivityLog';

interface ActivityLogModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Activity Log Modal - MaterialM Design
 */
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
    <DialogM3 show={isOpen} onClose={onClose} size="xl">
      {/* Custom Header */}
      <div
        ref={trapRef}
        className="p-6 border-b border-materialm-border dark:border-materialm-border-dark bg-materialm-primary-light dark:bg-materialm-primary-light"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-materialm-primary">
            <Clock className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-materialm-text-primary dark:text-materialm-text-primary">
            Activity Log
          </h2>
        </div>
      </div>

      {/* Activity Log Content */}
      <DialogM3.Body>
        <div className="max-h-[60vh] overflow-y-auto">
          <ActivityLog />
        </div>
      </DialogM3.Body>
    </DialogM3>
  );
}
