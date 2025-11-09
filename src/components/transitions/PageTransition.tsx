/**
 * PageTransition Component
 * 
 * Smooth page/view transitions using shadcn/ui defaults.
 * Respects prefers-reduced-motion for accessibility.
 */

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface PageTransitionProps {
  children: ReactNode;
  isVisible?: boolean;
  className?: string;
}

export function PageTransition({
  children,
  isVisible = true,
  className = '',
}: PageTransitionProps) {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!isVisible) return null;

  return (
    <div
      className={cn(
        prefersReducedMotion ? 'opacity-100' : 'animate-in fade-in-0 duration-200',
        className
      )}
    >
      {children}
    </div>
  );
}

export function ModalTransition({
  isOpen,
  onClose,
  children,
  closeOnBackdrop = true,
  className = '',
}: {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  closeOnBackdrop?: boolean;
  className?: string;
}) {
  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-40 animate-in fade-in-0 duration-200"
        onClick={closeOnBackdrop ? onClose : undefined}
        aria-hidden="true"
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div 
          className={cn(
            "animate-in fade-in-0 zoom-in-95 duration-200",
            className
          )} 
          role="dialog" 
          aria-modal="true"
        >
          {children}
        </div>
      </div>
    </>
  );
}

export function SlideSheet({
  isOpen,
  onClose,
  children,
  className = '',
}: {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
}) {
  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/50 z-40 animate-in fade-in-0 duration-200" 
        onClick={onClose} 
        aria-hidden="true" 
      />
      <div
        className={cn(
          "fixed bottom-0 left-0 right-0 z-50 bg-background rounded-t-2xl shadow-2xl animate-in slide-in-from-bottom duration-300",
          className
        )}
        style={{ maxHeight: '90vh' }}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex justify-center py-2">
          <div className="w-12 h-1.5 bg-muted rounded-full" />
        </div>
        <div className="overflow-y-auto max-h-[calc(90vh-2rem)]">
          {children}
        </div>
      </div>
    </>
  );
}
