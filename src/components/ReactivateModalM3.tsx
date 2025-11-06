import { useEffect, useState } from 'react';
import { UserPlus } from 'lucide-react';
import { Firefighter } from '../lib/supabase';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { useFocusReturn } from '../hooks/useFocusReturn';
import { DialogM3 } from './m3/DialogM3';
import { ButtonM3 } from './m3/ButtonM3';
import { SelectM3 } from './m3/InputM3';
import { BadgeM3 } from './m3/BadgeM3';
import { m3Classes } from '../styles/colorSystemM3';

interface ReactivateModalM3Props {
  isOpen: boolean;
  firefighter: Firefighter | null;
  currentRosterSize: number;
  onClose: () => void;
  onConfirm: (firefighterId: string, position: number) => void;
}

export function ReactivateModalM3({
  isOpen,
  firefighter,
  currentRosterSize,
  onClose,
  onConfirm
}: ReactivateModalM3Props) {
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

  const positions = Array.from({ length: currentRosterSize + 1 }, (_, i) => ({
    value: i.toString(),
    label: `Position ${i + 1} ${i === 0 ? '(First - Next Up)' : i === currentRosterSize ? '(Last)' : ''}`
  }));

  return (
    <DialogM3
      show={isOpen}
      onClose={onClose}
      size="lg"
      dismissible={true}
    >
      <div ref={trapRef}>
        {/* Header with icon and title */}
        <div className={`${m3Classes.surface.containerHigh} border-b border-materialm-border-dark p-6 flex items-center justify-between`}>
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-materialm-success to-materialm-success-emphasis p-3 rounded-lg shadow-materialm-2">
              <UserPlus className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 id="reactivate-modal-title" className={`text-xl font-semibold ${m3Classes.onSurface.high}`}>
                Reactivate {firefighter.name}
              </h2>
              <p className={`text-sm ${m3Classes.onSurface.medium}`}>Choose position in rotation</p>
            </div>
          </div>
        </div>

        {/* Body */}
        <DialogM3.Body>
          <div className="space-y-6">
            {/* Position Selection */}
            <SelectM3
              label="Select Position in Rotation"
              value={selectedPosition.toString()}
              onChange={(e) => setSelectedPosition(Number(e.target.value))}
              options={positions}
              required
              helperText={`Current roster has ${currentRosterSize} active ${currentRosterSize === 1 ? 'member' : 'members'}`}
              size="lg"
            />

            {/* Firefighter Details Card */}
            <div className={`${m3Classes.surface.containerLow} border ${m3Classes.onSurface.medium} border-opacity-20 rounded-lg p-4`}>
              <h3 className={`text-sm font-semibold ${m3Classes.onSurface.medium} mb-3`}>Firefighter Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className={m3Classes.onSurface.medium}>Name:</span>
                  <span className={`font-semibold ${m3Classes.onSurface.high}`}>{firefighter.name}</span>
                </div>
                {firefighter.fire_station && (
                  <div className="flex items-center justify-between">
                    <span className={m3Classes.onSurface.medium}>Station:</span>
                    <BadgeM3 color="info" size="sm">
                      #{firefighter.fire_station}
                    </BadgeM3>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className={m3Classes.onSurface.medium}>Last Hold:</span>
                  <span className={`font-medium ${m3Classes.onSurface.high}`}>
                    {firefighter.last_hold_date
                      ? new Date(firefighter.last_hold_date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })
                      : 'Never'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </DialogM3.Body>

        {/* Footer */}
        <DialogM3.Footer align="right">
          <div className="flex gap-3">
            <ButtonM3
              onClick={onClose}
              variant="outlined"
              color="neutral"
              size="lg"
            >
              Cancel
            </ButtonM3>
            <ButtonM3
              onClick={handleConfirm}
              variant="filled"
              color="success"
              size="lg"
              startIcon={<UserPlus className="w-5 h-5" />}
            >
              Reactivate
            </ButtonM3>
          </div>
        </DialogM3.Footer>
      </div>
    </DialogM3>
  );
}
