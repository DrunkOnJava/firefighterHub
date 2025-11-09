/**
 * Mobile Swipeable Card Component
 * 
 * iOS-style swipeable card with reveal actions (complete, transfer, delete).
 * Supports swipe-to-reveal gestures with haptic feedback.
 */

import { ArrowRightLeft, CheckCircle, Trash2 } from 'lucide-react';
import { useRef, useState } from 'react';
import { useHapticFeedback, useSwipeGesture } from '../../hooks/useTouchGestures';
import { Firefighter } from '../../lib/supabase';
import { tokens } from '../../styles';

interface SwipeableCardProps {
  firefighter: Firefighter;
  onCompleteHold: (id: string) => void;
  onTransferShift: (id: string) => void;
  onDeactivate: (id: string) => void;
  isAdminMode: boolean;
  isDarkMode: boolean;
  children: React.ReactNode;
}

export function SwipeableCard({
  firefighter,
  onCompleteHold,
  onTransferShift,
  onDeactivate,
  isAdminMode,
  isDarkMode: _isDarkMode,
  children,
}: SwipeableCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const haptic = useHapticFeedback();
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);

  useSwipeGesture(cardRef, {
    minDistance: 10,
    onSwiping: (deltaX) => {
      // Only allow left swipe (reveal actions)
      if (deltaX < 0 && isAdminMode) {
        setSwipeOffset(Math.max(deltaX, -120));
      }
    },
  });

  const handleTouchEnd = () => {
    // Snap to revealed or closed state
    if (swipeOffset < -60) {
      setSwipeOffset(-120);
      setIsRevealed(true);
      haptic.light();
    } else {
      setSwipeOffset(0);
      setIsRevealed(false);
    }
  };

  const handleAction = (action: () => void) => {
    haptic.medium();
    setSwipeOffset(0);
    setIsRevealed(false);
    action();
  };

  return (
    <div className="relative overflow-hidden">
      {/* Action Buttons (Behind card) */}
      {isAdminMode && (
        <div className="absolute right-0 top-0 bottom-0 flex items-stretch">
          {/* Complete Hold */}
          {firefighter.is_available && (
            <button
              onClick={() => handleAction(() => onCompleteHold(firefighter.id))}
              className={`
                w-[60px] flex flex-col items-center justify-center gap-1
                bg-green-600 text-white
                ${tokens.transitions.fast}
              `}
              aria-label="Complete hold"
            >
              <CheckCircle size={20} />
              <span className="text-xs font-semibold">Hold</span>
            </button>
          )}

          {/* Transfer Shift */}
          <button
            onClick={() => handleAction(() => onTransferShift(firefighter.id))}
            className={`
              w-[60px] flex flex-col items-center justify-center gap-1
              bg-blue-600 text-white
              ${tokens.transitions.fast}
            `}
            aria-label="Transfer shift"
          >
            <ArrowRightLeft size={20} />
            <span className="text-xs font-semibold">Transfer</span>
          </button>

          {/* Delete */}
          <button
            onClick={() => handleAction(() => onDeactivate(firefighter.id))}
            className={`
              w-[60px] flex flex-col items-center justify-center gap-1
              bg-red-600 text-white
              ${tokens.transitions.fast}
            `}
            aria-label="Delete"
          >
            <Trash2 size={20} />
            <span className="text-xs font-semibold">Remove</span>
          </button>
        </div>
      )}

      {/* Main Card */}
      <div
        ref={cardRef}
        className={`
          relative z-10
          ${tokens.transitions.fast}
          ${isRevealed ? '' : 'active:scale-[0.98]'}
        `}
        style={{
          transform: `translateX(${swipeOffset}px)`,
        }}
        onTouchEnd={handleTouchEnd}
        onMouseUp={handleTouchEnd}
      >
        {children}
      </div>
    </div>
  );
}
