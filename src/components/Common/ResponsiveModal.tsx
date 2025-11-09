/**
 * Responsive Modal Base Component
 * 
 * Automatically adapts between:
 * - Mobile: Full-screen with slide-up animation
 * - Desktop: Centered card with backdrop
 * 
 * Usage:
 * ```tsx
 * <ResponsiveModal isOpen={isOpen} onClose={onClose} title="Edit">
 *   <form>...</form>
 * </ResponsiveModal>
 * ```
 */

import { X } from 'lucide-react';
import { useEffect } from 'react';
import { useDevice } from '../../hooks/useDevice';

interface ResponsiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
  isDarkMode?: boolean;
}

const maxWidthClasses = {
  sm: 'md:max-w-sm',
  md: 'md:max-w-md',
  lg: 'md:max-w-lg',
  xl: 'md:max-w-xl',
};

export function ResponsiveModal({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'md',
  isDarkMode = true,
}: ResponsiveModalProps) {
  const device = useDevice();

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Prevent iOS bounce scrolling
      document.body.style.position = device.isMobile ? 'fixed' : 'relative';
      document.body.style.width = '100%';
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    };
  }, [isOpen, device.isMobile]);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center ${device.isMobile ? '' : 'p-4'}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 dark:bg-black/70 animate-in fade-in duration-200"
        onClick={onClose}
        aria-label="Close modal"
      />

      {/* Modal Content */}
      <div
        className={`
          relative w-full
          ${
            device.isMobile
              ? 'h-full rounded-t-2xl animate-in slide-in-from-bottom duration-300'
              : `${maxWidthClasses[maxWidth]} rounded-lg animate-in fade-in zoom-in-95 duration-200 shadow-xl`
          }
          bg-card border border-border
          overflow-hidden
          flex flex-col
        `}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between p-6 border-border ${device.isMobile ? 'border-b' : ''}`}
          style={{
            paddingTop: device.isMobile
              ? 'max(20px, env(safe-area-inset-top, 0px))'
              : undefined,
          }}
        >
          {title && (
            <h2 id="modal-title" className="text-lg font-semibold text-foreground">
              {title}
            </h2>
          )}
          
          <button
            onClick={onClose}
            className={`
              min-h-[44px] min-w-[44px]
              rounded-lg
              transition-colors
              focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background
              text-muted-foreground hover:text-foreground hover:bg-accent
              ${!title ? 'absolute right-4 top-4' : ''}
            `}
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div
          className="flex-1 overflow-auto p-6"
          style={{
            paddingBottom: device.isMobile
              ? 'max(24px, env(safe-area-inset-bottom, 0px))'
              : undefined,
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
