/**
 * Bottom Sheet Component
 * 
 * Slide-up sheet for mobile using shadcn/ui styling.
 */

import { X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useFocusTrap } from '@/hooks/useFocusTrap';
import { useSwipeGesture } from '@/hooks/useTouchGestures';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  height?: 'auto' | 'half' | 'full';
}

export function BottomSheet({
  isOpen,
  onClose,
  title,
  children,
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
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-in fade-in-0 duration-200"
        onClick={onClose}
        role="presentation"
      />

      <div
        ref={(el) => {
          if (el) {
            // @ts-ignore - Workaround for read-only ref assignment
            sheetRef.current = el;
            if (trapRef && 'current' in trapRef) {
              Object.assign(trapRef, { current: el });
            }
          }
        }}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'bottom-sheet-title' : undefined}
        className={cn(
          "fixed bottom-0 left-0 right-0 z-50",
          heightClasses[height],
          "bg-background rounded-t-2xl shadow-2xl overflow-hidden",
          isDragging ? "" : "transition-transform duration-200",
          "animate-in slide-in-from-bottom"
        )}
        style={{
          transform: isDragging ? `translateY(${translateY}px)` : 'translateY(0)',
          paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        }}
      >
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-12 h-1 rounded-full bg-muted" />
        </div>

        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b">
            <h2 id="bottom-sheet-title" className="text-lg font-semibold">
              {title}
            </h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        )}

        <div className="overflow-y-auto" style={{ maxHeight: height === 'auto' ? '70vh' : '100%' }}>
          {children}
        </div>
      </div>
    </>
  );
}
