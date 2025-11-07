/**
 * Bottom Sheet Component
 * 
 * iOS-style bottom sheet that slides up from the bottom on mobile.
 * Supports drag-to-dismiss, snap points, and safe-area-inset.
 */

import { X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { useSwipeGesture } from '../../hooks/useTouchGestures';
import { tokens } from '../../styles';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  isDarkMode?: boolean;
  /** Height of sheet: 'auto' | 'half' | 'full' */
  height?: 'auto' | 'half' | 'full';
}

export function BottomSheet({
  isOpen,
  onClose,
  title,
  children,
  isDarkMode = true,
  height = 'auto',
}: BottomSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const trapRef = useFocusTrap(isOpen);
  const [isDragging, setIsDragging] = useState(false);
  const [translateY, setTranslateY] = useState(0);

  useSwipeGesture(sheetRef, {
    onSwiping: (_, deltaY) => {
      if (deltaY > 0) {
        setIsDragging(true);
        setTranslateY(deltaY);
      }
    },
  });

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const handleDragEnd = () => {
      if (isDragging) {
        setIsDragging(false);
        // If dragged more than 100px, close the sheet
        if (translateY > 100) {
          onClose();
        }
        setTranslateY(0);
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.addEventListener('touchend', handleDragEnd);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('touchend', handleDragEnd);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose, isDragging, translateY]);

  if (!isOpen) return null;

  const heightClasses = {
    auto: 'max-h-[85vh]',
    half: 'h-[50vh]',
    full: 'h-[90vh]',
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-50 ${tokens.animations.entrance.fadeIn}`}
        onClick={onClose}
        role="presentation"
      />

      {/* Bottom Sheet */}
      <div
        ref={(el) => {
          sheetRef.current = el;
          if (el && typeof trapRef === 'object' && trapRef !== null) {
            (trapRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
          }
        }}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'bottom-sheet-title' : undefined}
        className={`
          fixed bottom-0 left-0 right-0 z-50
          ${heightClasses[height]}
          ${isDarkMode ? 'bg-slate-800' : 'bg-white'}
          ${tokens.borders.radius['2xl']} rounded-b-none
          ${tokens.shadows['2xl']}
          overflow-hidden
          ${isDragging ? '' : tokens.transitions.fast}
          ${tokens.animations.entrance.slideUp}
        `}
        style={{
          transform: isDragging ? `translateY(${translateY}px)` : 'translateY(0)',
          paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        }}
      >
        {/* Drag Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div
            className={`w-12 h-1 rounded-full ${
              isDarkMode ? 'bg-slate-600' : 'bg-slate-300'
            }`}
          />
        </div>

        {/* Header */}
        {title && (
          <div
            className={`
              flex items-center justify-between px-6 py-4
              border-b ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}
            `}
          >
            <h2
              id="bottom-sheet-title"
              className={`${tokens.typography.heading.h3} ${
                isDarkMode ? 'text-white' : 'text-slate-900'
              }`}
            >
              {title}
            </h2>
            <button
              onClick={onClose}
              className={`
                ${tokens.touchTarget.min} p-2 rounded-lg
                ${tokens.focus.default}
                ${tokens.transitions.fast}
                ${
                  isDarkMode
                    ? 'hover:bg-slate-700 text-slate-400'
                    : 'hover:bg-slate-100 text-slate-600'
                }
              `}
              aria-label="Close"
            >
              <X size={24} />
            </button>
          </div>
        )}

        {/* Content */}
        <div className="overflow-y-auto" style={{ maxHeight: height === 'auto' ? '70vh' : '100%' }}>
          {children}
        </div>
      </div>
    </>
  );
}
