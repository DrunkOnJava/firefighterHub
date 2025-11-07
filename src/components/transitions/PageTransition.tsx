/**
 * PageTransition Component
 * 
 * Smooth page/view transitions with multiple animation variants.
 * Wraps content to provide entrance/exit animations.
 * 
 * Features:
 * - Fade, slide, scale transitions
 * - Modal enter/exit animations
 * - Mobile sheet slide-up
 * - Route change animations
 * - Respects prefers-reduced-motion
 * 
 * Usage:
 * ```tsx
 * <PageTransition variant="fade">
 *   <YourPage />
 * </PageTransition>
 * 
 * <PageTransition variant="slideUp" duration={300}>
 *   <Modal />
 * </PageTransition>
 * ```
 */

import { ReactNode, useEffect, useRef, useState } from 'react';
import { useAnimation } from '../../hooks/useAnimation';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { fadeIn, fadeOut, slideIn, slideOut, scale } from '../../utils/animations';
import '../../styles/animations.css';

type TransitionVariant = 
  | 'fade' 
  | 'slideUp' 
  | 'slideDown' 
  | 'slideLeft' 
  | 'slideRight'
  | 'scale'
  | 'modalEnter'
  | 'sheetUp';

interface PageTransitionProps {
  children: ReactNode;
  variant?: TransitionVariant;
  duration?: number;
  isVisible?: boolean;
  onEntered?: () => void;
  onExited?: () => void;
  className?: string;
  unmountOnExit?: boolean;
}

export function PageTransition({
  children,
  variant = 'fade',
  duration = 200,
  isVisible = true,
  onEntered,
  onExited,
  className = '',
  unmountOnExit = false,
}: PageTransitionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { animate } = useAnimation();
  const isReducedMotion = useReducedMotion();
  const [shouldRender, setShouldRender] = useState(isVisible);
  const [hasEntered, setHasEntered] = useState(false);

  // Get animation config based on variant
  const getAnimationConfig = (isEntering: boolean) => {
    const distance = 20;

    switch (variant) {
      case 'fade':
        return isEntering ? fadeIn(duration) : fadeOut(duration);

      case 'slideUp':
        return isEntering
          ? slideIn('bottom', distance, duration)
          : slideOut('bottom', distance, duration);

      case 'slideDown':
        return isEntering
          ? slideIn('top', distance, duration)
          : slideOut('top', distance, duration);

      case 'slideLeft':
        return isEntering
          ? slideIn('right', distance, duration)
          : slideOut('right', distance, duration);

      case 'slideRight':
        return isEntering
          ? slideIn('left', distance, duration)
          : slideOut('left', distance, duration);

      case 'scale':
        return isEntering ? scale(0.95, 1, duration) : scale(1, 0.95, duration);

      case 'modalEnter':
        return {
          keyframes: isEntering
            ? [
                { transform: 'scale(0.95)', opacity: 0 },
                { transform: 'scale(1)', opacity: 1 },
              ]
            : [
                { transform: 'scale(1)', opacity: 1 },
                { transform: 'scale(0.95)', opacity: 0 },
              ],
          duration,
          easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
          fill: 'forwards' as FillMode,
        };

      case 'sheetUp':
        return {
          keyframes: isEntering
            ? [
                { transform: 'translateY(100%)', opacity: 0 },
                { transform: 'translateY(0)', opacity: 1 },
              ]
            : [
                { transform: 'translateY(0)', opacity: 1 },
                { transform: 'translateY(100%)', opacity: 0 },
              ],
          duration,
          easing: 'cubic-bezier(0, 0, 0.2, 1)',
          fill: 'forwards' as FillMode,
        };

      default:
        return fadeIn(duration);
    }
  };

  useEffect(() => {
    if (isVisible) {
      setShouldRender(true);
    }
  }, [isVisible]);

  useEffect(() => {
    if (isVisible && containerRef.current && shouldRender && !hasEntered) {
      if (!isReducedMotion) {
        animate({
          element: containerRef.current,
          ...getAnimationConfig(true),
          name: `page-transition-enter-${variant}`,
          onComplete: () => {
            setHasEntered(true);
            onEntered?.();
          },
        });
      } else {
        setHasEntered(true);
        onEntered?.();
      }
    }
  }, [isVisible, shouldRender, hasEntered, animate, isReducedMotion, variant, onEntered]);

  useEffect(() => {
    if (!isVisible && containerRef.current && hasEntered) {
      if (!isReducedMotion) {
        animate({
          element: containerRef.current,
          ...getAnimationConfig(false),
          name: `page-transition-exit-${variant}`,
          onComplete: () => {
            if (unmountOnExit) {
              setShouldRender(false);
            }
            setHasEntered(false);
            onExited?.();
          },
        });
      } else {
        if (unmountOnExit) {
          setShouldRender(false);
        }
        setHasEntered(false);
        onExited?.();
      }
    }
  }, [isVisible, hasEntered, animate, isReducedMotion, variant, unmountOnExit, onExited]);

  if (unmountOnExit && !shouldRender) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        opacity: isReducedMotion ? (isVisible ? 1 : 0) : undefined,
      }}
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
  backdropClassName = '',
}: {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  closeOnBackdrop?: boolean;
  className?: string;
  backdropClassName?: string;
}) {
  const isReducedMotion = useReducedMotion();

  return (
    <>
      <PageTransition variant="fade" isVisible={isOpen} unmountOnExit duration={200}>
        <div
          className={`fixed inset-0 bg-black/50 z-40 ${closeOnBackdrop ? 'cursor-pointer' : ''} ${backdropClassName}`}
          onClick={closeOnBackdrop ? onClose : undefined}
          aria-hidden="true"
        />
      </PageTransition>

      <PageTransition variant="modalEnter" isVisible={isOpen} unmountOnExit duration={300}>
        <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${!isReducedMotion ? 'pointer-events-none' : ''}`}>
          <div className={`pointer-events-auto ${className}`} role="dialog" aria-modal="true">
            {children}
          </div>
        </div>
      </PageTransition>
    </>
  );
}

export function SlideSheet({
  isOpen,
  onClose,
  children,
  snapPoints = [0.9],
  className = '',
}: {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  snapPoints?: number[];
  className?: string;
}) {
  const maxHeight = `${snapPoints[snapPoints.length - 1] * 100}vh`;

  return (
    <>
      <PageTransition variant="fade" isVisible={isOpen} unmountOnExit>
        <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} aria-hidden="true" />
      </PageTransition>

      <PageTransition variant="sheetUp" isVisible={isOpen} unmountOnExit>
        <div
          className={`fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 rounded-t-2xl shadow-2xl ${className}`}
          style={{ maxHeight }}
          role="dialog"
          aria-modal="true"
        >
          <div className="flex justify-center py-2">
            <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full" />
          </div>
          <div className="overflow-y-auto max-h-[calc(90vh-2rem)]">
            {children}
          </div>
        </div>
      </PageTransition>
    </>
  );
}
