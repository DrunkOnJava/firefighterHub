import { useEffect, useState } from 'react';
import { X, UserPlus } from 'lucide-react';
import { Firefighter } from '../lib/supabase';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { useFocusReturn } from '../hooks/useFocusReturn';
import { Button } from './ui/button';

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
      className="fixed inset-0 bg-black/80 z-50 flex items-end sm:items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="reactivate-modal-title"
    >
      <div
        ref={trapRef}
        className="bg-card border-2 border-border rounded-2xl max-w-lg w-full shadow-xl animate-in slide-in-from-bottom-8 sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-muted border-b-2 border-border p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-green-600 p-2 rounded-lg">
              <UserPlus className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 id="reactivate-modal-title" className="text-xl font-semibold text-foreground">
                Reactivate {firefighter.name}
              </h2>
              <p className="text-sm text-muted-foreground">Choose position in rotation</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label="Close reactivate dialog"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label htmlFor="position-select" className="block text-sm font-semibold text-muted-foreground mb-3">
              Select Position in Rotation
            </label>
            <select
              id="position-select"
              value={selectedPosition}
              onChange={(e) => setSelectedPosition(Number(e.target.value))}
              className="flex h-10 w-full rounded-md border-2 border-input bg-background px-3 py-2 text-sm font-semibold text-foreground ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
            >
              {positions.map((pos) => (
                <option key={pos} value={pos}>
                  Position {pos + 1} {pos === 0 ? '(First - Next Up)' : pos === currentRosterSize ? '(Last)' : ''}
                </option>
              ))}
            </select>
            <p className="mt-2 text-sm text-muted-foreground">
              Current roster has {currentRosterSize} active {currentRosterSize === 1 ? 'member' : 'members'}
            </p>
          </div>

          <div className="bg-muted border border-border rounded-lg p-4">
            <h3 className="text-sm font-semibold text-muted-foreground mb-2">Firefighter Details</h3>
            <div className="space-y-1 text-sm">
              <p className="text-muted-foreground">
                <span className="font-semibold">Name:</span> <span className="text-foreground">{firefighter.name}</span>
              </p>
              {firefighter.fire_station && (
                <p className="text-muted-foreground">
                  <span className="font-semibold">Station:</span> <span className="text-foreground">#{firefighter.fire_station}</span>
                </p>
              )}
              <p className="text-muted-foreground">
                <span className="font-semibold">Last Hold:</span>{' '}
                <span className="text-foreground">
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

          <div className="flex gap-4">
            <Button
              onClick={onClose}
              variant="secondary"
              size="lg"
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              variant="default"
              size="lg"
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Reactivate
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
