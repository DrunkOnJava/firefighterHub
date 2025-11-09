/**
 * Base Modal Component
 * 
 * Responsive modal with:
 * - Full-screen on mobile (< 768px)
 * - Centered card on desktop
 * - Slide-up animation
 * - Focus management
 * - Keyboard navigation (Esc to close)
 * - WCAG 2.1 AA compliant
 */

import { X } from "lucide-react";
import { useEffect, useRef } from "react";
import { useFocusTrap } from "../../hooks/useFocusTrap";
import { useFocusReturn } from "../../hooks/useFocusReturn";
import { useDevice } from "../../hooks/useDevice";
import { Button } from "./button";
import { cn } from "@/lib/utils";

export interface ModalProps {
  /** Controls modal visibility */
  isOpen: boolean;
  
  /** Callback when modal should close */
  onClose: () => void;
  
  /** Modal title (for aria-label) */
  title: string;
  
  /** Modal content */
  children: React.ReactNode;
  
  /** Optional header actions (e.g., delete button) */
  headerActions?: React.ReactNode;
  
  /** Optional footer content (e.g., action buttons) */
  footer?: React.ReactNode;
  
  /** Maximum width on desktop (default: 'lg') */
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  
  /** Whether to show close button (default: true) */
  showCloseButton?: boolean;
  
  /** Whether to close on overlay click (default: true) */
  closeOnOverlayClick?: boolean;
  
  /** Whether to close on Esc key (default: true) */
  closeOnEscape?: boolean;
  
  /** Dark mode (default: true) */
  isDarkMode?: boolean;
}

const maxWidthClasses = {
  sm: 'sm:max-w-sm',
  md: 'sm:max-w-md',
  lg: 'sm:max-w-lg',
  xl: 'sm:max-w-xl',
  '2xl': 'sm:max-w-2xl',
};

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  headerActions,
  footer,
  maxWidth = 'lg',
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  isDarkMode = true,
}: ModalProps) {
  const _device = useDevice();
  const trapRef = useFocusTrap(isOpen);
  const triggerElementRef = useRef<HTMLElement | null>(null);
  
  useFocusReturn(isOpen);
  
  // Save trigger element on open
  useEffect(() => {
    if (isOpen) {
      triggerElementRef.current = document.activeElement as HTMLElement;
    }
  }, [isOpen]);
  
  // Handle Esc key
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeOnEscape, onClose]);
  
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);
  
  if (!isOpen) return null;
  
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };
  
  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Modal container */}
      <div
        ref={trapRef}
        className={cn(
          "w-full h-full sm:h-auto sm:mx-4 sm:rounded-lg shadow-2xl flex flex-col max-h-screen sm:max-h-[90vh] animate-slide-up sm:animate-fade-in",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
          maxWidthClasses[maxWidth],
          isDarkMode ? "bg-slate-900 ring-offset-slate-900" : "bg-white ring-offset-white"
        )}
      >
        {/* Header */}
        <div
          className={cn(
            "flex items-center justify-between px-4 sm:px-6 py-4 border-b flex-shrink-0",
            isDarkMode ? "border-slate-700" : "border-slate-200"
          )}
        >
          <h2
            id="modal-title"
            className={cn(
              "text-lg sm:text-xl font-bold",
              isDarkMode ? "text-white" : "text-slate-900"
            )}
          >
            {title}
          </h2>
          
          <div className="flex items-center gap-2">
            {headerActions}
            
            {showCloseButton && (
              <Button
                onClick={onClose}
                variant="ghost"
                size="sm"
                aria-label="Close modal"
                className="min-h-[44px] min-w-[44px] hover:bg-slate-700"
              >
                <X className="w-5 h-5" />
              </Button>
            )}
          </div>
        </div>
        
        {/* Content - scrollable */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
          {children}
        </div>
        
        {/* Footer */}
        {footer && (
          <div
            className={cn(
              "px-4 sm:px-6 py-4 border-t flex-shrink-0",
              isDarkMode ? "border-slate-700" : "border-slate-200"
            )}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
