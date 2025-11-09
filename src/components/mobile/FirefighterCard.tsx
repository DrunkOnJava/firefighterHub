/**
 * Mobile Firefighter Card Component
 * 
 * Card-based layout optimized for mobile devices (< 768px).
 * Features:
 * - Avatar with initials
 * - Compact info display (name, station, apparatus)
 * - Swipe-to-reveal actions (when admin mode enabled)
 * - 44px minimum touch target (WCAG compliant)
 * - Tap to expand for full details
 */

import { MoreVertical, MapPin, TruckIcon } from 'lucide-react';
import { useState } from 'react';
import { Firefighter } from '../../lib/supabase';
import { formatHoldDate } from '../../utils/dateUtils';
import { useSwipeGesture } from '../../hooks/useSwipeGesture';
import { cn } from '@/lib/utils';

interface FirefighterCardProps {
  firefighter: Firefighter;
  onCompleteHold?: (id: string) => void;
  onTransferShift?: (id: string) => void;
  onDeactivate?: (id: string) => void;
  onSelect?: (firefighter: Firefighter) => void;
  isAdminMode?: boolean;
  isDarkMode?: boolean;
  isNextInRotation?: boolean;
}

export function FirefighterCard({
  firefighter,
  onCompleteHold,
  onTransferShift,
  onDeactivate,
  onSelect,
  isAdminMode = false,
  isNextInRotation = false,
}: FirefighterCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);

  const { handleTouchStart, handleTouchEnd } = useSwipeGesture(
    // onSwipeLeft: Reveal actions (only in admin mode)
    () => {
      if (isAdminMode) {
        setIsRevealed(true);
      }
    },
    // onSwipeRight: Hide actions
    () => setIsRevealed(false),
    60 // minDistance
  );

  // Generate initials from name
  const getInitials = (name: string) => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const handleCardClick = () => {
    if (!isRevealed) {
      setIsExpanded(!isExpanded);
      onSelect?.(firefighter);
    }
  };

  const handleAction = (action: () => void, e: React.MouseEvent) => {
    e.stopPropagation();
    action();
    setIsRevealed(false);
  };

  return (
    <div className="relative">
      {/* Action Buttons (Revealed on swipe left) */}
      {isAdminMode && isRevealed && (
        <div className="absolute right-0 top-0 bottom-0 flex items-stretch z-0">
          {/* Complete Hold (only if available) */}
          {firefighter.is_available && onCompleteHold && (
            <button
              onClick={(e) => handleAction(() => onCompleteHold(firefighter.id), e)}
              className="w-[70px] flex flex-col items-center justify-center gap-1 bg-green-600 text-white font-semibold text-xs transition-all duration-200 min-h-[44px]"
              aria-label="Complete hold"
            >
              ✓ Hold
            </button>
          )}

          {/* Transfer Shift */}
          {onTransferShift && (
            <button
              onClick={(e) => handleAction(() => onTransferShift(firefighter.id), e)}
              className="w-[70px] flex flex-col items-center justify-center gap-1 bg-blue-600 text-white font-semibold text-xs transition-all duration-200 min-h-[44px]"
              aria-label="Transfer shift"
            >
              ⇄ Transfer
            </button>
          )}

          {/* Delete */}
          {onDeactivate && (
            <button
              onClick={(e) => handleAction(() => onDeactivate(firefighter.id), e)}
              className="w-[70px] flex flex-col items-center justify-center gap-1 bg-red-600 text-white font-semibold text-xs transition-all duration-200 min-h-[44px]"
              aria-label="Remove firefighter"
            >
              × Remove
            </button>
          )}
        </div>
      )}

      {/* Main Card */}
      <div
        className={cn(
          "relative z-10 bg-card border border-border rounded-lg p-4 transition-all duration-200 cursor-pointer min-h-[44px]",
          isNextInRotation && "ring-2 ring-blue-500 ring-offset-2 ring-offset-background",
          !isRevealed && "active:scale-[0.98]"
        )}
        style={{
          transform: isRevealed ? 'translateX(-210px)' : 'translateX(0)',
          transition: 'transform 0.2s ease-out',
        }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onClick={handleCardClick}
      >
        {/* Header Row */}
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div
            className={`
              w-10 h-10 rounded-full
              flex items-center justify-center
              font-semibold text-sm
              flex-shrink-0
              ${firefighter.is_available ? 'bg-green-600 text-white' : 'bg-slate-700 text-slate-300'}
            `}
            aria-hidden="true"
          >
            {getInitials(firefighter.name)}
          </div>

          {/* Name & Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold truncate text-foreground">
                {firefighter.name}
              </h3>
              {isNextInRotation && (
                <span className="px-2 py-0.5 bg-blue-600 text-white text-xs font-bold rounded">
                  NEXT
                </span>
              )}
            </div>

            {/* Station + Apparatus */}
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              {firefighter.fire_station && (
                <div className="flex items-center gap-1">
                  <MapPin size={14} className="flex-shrink-0" />
                  <span>Station {firefighter.fire_station}</span>
                </div>
              )}
              {/* Show first apparatus type that is true */}
              {(firefighter.apparatus_engine ||
                firefighter.apparatus_truck ||
                firefighter.apparatus_rescue_squad ||
                firefighter.apparatus_ambulance) && (
                <div className="flex items-center gap-1">
                  <TruckIcon size={14} className="flex-shrink-0" />
                  <span className="whitespace-nowrap">
                    {firefighter.apparatus_engine
                      ? 'Engine'
                      : firefighter.apparatus_truck
                      ? 'Truck'
                      : firefighter.apparatus_rescue_squad
                      ? 'Rescue'
                      : 'Ambulance'}
                  </span>
                </div>
              )}
            </div>

            {/* Last Hold Date */}
            <div className="text-xs text-muted-foreground/70 mt-1">
              Last hold: {formatHoldDate(firefighter.last_hold_date) || 'Never'}
            </div>
          </div>

          {/* More Menu Icon */}
          <button
            className="p-2 rounded-lg hover:bg-accent text-muted-foreground transition-colors duration-200 flex-shrink-0"
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            aria-label="More options"
          >
            <MoreVertical size={18} />
          </button>
        </div>

        {/* Expanded Details (Optional) */}
        {isExpanded && (
          <div className="mt-3 pt-3 border-t border-border">
            {/* Certifications */}
            {(firefighter.is_fto ||
              firefighter.is_bls ||
              firefighter.is_als ||
              firefighter.certification_level) && (
              <div className="flex flex-wrap gap-2 mb-2">
                {firefighter.is_fto && (
                  <span className="px-2 py-1 bg-purple-600 text-white text-xs font-semibold rounded">
                    FTO
                  </span>
                )}
                {firefighter.is_bls && (
                  <span className="px-2 py-1 bg-blue-600 text-white text-xs font-semibold rounded">
                    BLS
                  </span>
                )}
                {firefighter.is_als && (
                  <span className="px-2 py-1 bg-red-600 text-white text-xs font-semibold rounded">
                    ALS
                  </span>
                )}
                {firefighter.certification_level && (
                  <span className="px-2 py-1 bg-green-600 text-white text-xs font-semibold rounded">
                    {firefighter.certification_level}
                  </span>
                )}
              </div>
            )}

            {/* Availability Status */}
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Status:</span>
              <span
                className={cn(
                  "px-2 py-1 rounded text-xs font-semibold",
                  firefighter.is_available ? "bg-green-600 text-white" : "bg-yellow-600 text-white"
                )}
              >
                {firefighter.is_available ? 'Available' : 'On Hold'}
              </span>
            </div>

            {/* Position in rotation */}
            <div className="text-sm text-muted-foreground mt-2">
              Position: #{firefighter.order_position + 1}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
