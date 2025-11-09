/**
 * Base Modal Component (shadcn/ui Dialog wrapper)
 * 
 * Responsive modal with:
 * - Full-screen on mobile (< 768px)
 * - Centered card on desktop
 * - Focus management (built-in via Radix Dialog)
 * - Keyboard navigation (Esc to close)
 * - WCAG 2.1 AA compliant
 * - Uses semantic colors (no isDarkMode prop needed)
 */

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
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
  
  /** @deprecated No longer needed - uses dark: variants automatically */
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
}: ModalProps) {
  return (
    <DialogPrimitive.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogPrimitive.Portal>
        {/* Overlay */}
        <DialogPrimitive.Overlay 
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
        />
        
        {/* Content Container */}
        <DialogPrimitive.Content
          className={cn(
            // Mobile: Full screen
            "fixed z-50 w-full h-full",
            // Desktop: Centered modal
            "sm:h-auto sm:left-[50%] sm:top-[50%] sm:translate-x-[-50%] sm:translate-y-[-50%]",
            "sm:mx-4 sm:rounded-lg sm:shadow-2xl",
            "flex flex-col max-h-screen sm:max-h-[90vh]",
            // Semantic colors (dark mode via dark: variants)
            "bg-background border border-border",
            // Animations
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            // Mobile: slide up from bottom
            "data-[state=open]:slide-in-from-bottom sm:data-[state=open]:slide-in-from-bottom-0",
            "data-[state=closed]:slide-out-to-bottom sm:data-[state=closed]:slide-out-to-bottom-0",
            // Desktop: zoom + slide from center
            "sm:data-[state=open]:zoom-in-95 sm:data-[state=closed]:zoom-out-95",
            "sm:data-[state=open]:slide-in-from-left-1/2 sm:data-[state=open]:slide-in-from-top-[48%]",
            "sm:data-[state=closed]:slide-out-to-left-1/2 sm:data-[state=closed]:slide-out-to-top-[48%]",
            // Focus ring
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            maxWidthClasses[maxWidth]
          )}
          onPointerDownOutside={(e) => {
            if (!closeOnOverlayClick) e.preventDefault();
          }}
          onEscapeKeyDown={(e) => {
            if (!closeOnEscape) e.preventDefault();
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-border flex-shrink-0">
            <DialogPrimitive.Title className="text-lg sm:text-xl font-bold text-foreground">
              {title}
            </DialogPrimitive.Title>
            
            <div className="flex items-center gap-2">
              {headerActions}
              
              {showCloseButton && (
                <DialogPrimitive.Close asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    aria-label="Close modal"
                    className="min-h-[44px] min-w-[44px]"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </DialogPrimitive.Close>
              )}
            </div>
          </div>
          
          {/* Content - scrollable */}
          <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
            {children}
          </div>
          
          {/* Footer */}
          {footer && (
            <div className="px-4 sm:px-6 py-4 border-t border-border flex-shrink-0">
              {footer}
            </div>
          )}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
