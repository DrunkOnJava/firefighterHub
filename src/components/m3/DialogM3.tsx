/**
 * DialogM3 - MaterialM Modal/Dialog Wrapper
 *
 * Wraps Flowbite Modal with MaterialM design system patterns.
 * Provides consistent dialog styling and behavior.
 *
 * @example
 * ```tsx
 * <DialogM3
 *   show={isOpen}
 *   onClose={handleClose}
 *   title="Confirm Action"
 *   size="md"
 * >
 *   <DialogM3.Body>
 *     <p>Are you sure you want to proceed?</p>
 *   </DialogM3.Body>
 *   <DialogM3.Footer>
 *     <ButtonM3 onClick={handleConfirm}>Confirm</ButtonM3>
 *     <ButtonM3 variant="outlined" onClick={handleClose}>
 *       Cancel
 *     </ButtonM3>
 *   </DialogM3.Footer>
 * </DialogM3>
 * ```
 */

import { Modal, ModalHeader, ModalBody, ModalFooter } from 'flowbite-react';
import type { ComponentProps } from 'react';

/**
 * Material Design 3 Dialog Sizes
 */
export type DialogM3Size = 'sm' | 'md' | 'lg' | 'xl' | 'full';

export interface DialogM3Props extends Omit<ComponentProps<typeof Modal>, 'size'> {
  /**
   * Whether the dialog is visible
   */
  show: boolean;

  /**
   * Callback when dialog should close
   */
  onClose: () => void;

  /**
   * Dialog title (optional, can use DialogM3.Header instead)
   */
  title?: string;

  /**
   * Dialog size
   * @default 'md'
   */
  size?: DialogM3Size;

  /**
   * Prevent closing on backdrop click
   * @default false
   */
  dismissible?: boolean;

  /**
   * Children elements
   */
  children: React.ReactNode;

  /**
   * Custom className
   */
  className?: string;
}

/**
 * Material Design 3 Dialog Component
 *
 * A modal dialog for important interactions requiring user attention.
 * Follows M3 dialog patterns with proper elevation and styling.
 */
export function DialogM3({
  show,
  onClose,
  title,
  size = 'md',
  dismissible = true,
  children,
  className = '',
  ...props
}: DialogM3Props) {
  return (
    <Modal
      show={show}
      onClose={onClose}
      size={size}
      dismissible={dismissible}
      className={`materialm-dialog ${className}`}
      {...props}
    >
      {title && <ModalHeader>{title}</ModalHeader>}
      {children}
    </Modal>
  );
}

/**
 * Dialog Body Component
 *
 * Main content area of the dialog.
 */
export interface DialogM3BodyProps {
  children: React.ReactNode;
  className?: string;
}

function DialogM3Body({ children, className = '' }: DialogM3BodyProps) {
  return <ModalBody className={className}>{children}</ModalBody>;
}

/**
 * Dialog Footer Component
 *
 * Action area of the dialog, typically contains buttons.
 */
export interface DialogM3FooterProps {
  children: React.ReactNode;
  className?: string;
  /**
   * Align footer buttons
   * @default 'right'
   */
  align?: 'left' | 'center' | 'right' | 'space-between';
}

function DialogM3Footer({ children, className = '', align = 'right' }: DialogM3FooterProps) {
  const alignClasses: Record<string, string> = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
    'space-between': 'justify-between',
  };

  return (
    <ModalFooter className={`${alignClasses[align]} ${className}`}>{children}</ModalFooter>
  );
}

// Attach sub-components
DialogM3.Body = DialogM3Body;
DialogM3.Footer = DialogM3Footer;

/**
 * Confirm Dialog Component
 *
 * Specialized dialog for confirmation actions.
 *
 * @example
 * ```tsx
 * <ConfirmDialogM3
 *   show={isOpen}
 *   onClose={handleClose}
 *   onConfirm={handleConfirm}
 *   title="Delete Item"
 *   message="Are you sure you want to delete this item? This action cannot be undone."
 *   confirmText="Delete"
 *   confirmColor="error"
 * />
 * ```
 */
export interface ConfirmDialogM3Props {
  /**
   * Whether the dialog is visible
   */
  show: boolean;

  /**
   * Callback when dialog should close
   */
  onClose: () => void;

  /**
   * Callback when user confirms
   */
  onConfirm: () => void;

  /**
   * Dialog title
   */
  title: string;

  /**
   * Confirmation message
   */
  message: string;

  /**
   * Confirm button text
   * @default 'Confirm'
   */
  confirmText?: string;

  /**
   * Cancel button text
   * @default 'Cancel'
   */
  cancelText?: string;

  /**
   * Confirm button color
   * @default 'primary'
   */
  confirmColor?: 'primary' | 'error' | 'warning' | 'success';

  /**
   * Loading state (disables buttons)
   * @default false
   */
  loading?: boolean;
}

export function ConfirmDialogM3({
  show,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmColor = 'primary',
  loading = false,
}: ConfirmDialogM3Props) {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const confirmColorClasses: Record<string, string> = {
    primary: 'bg-blue-600 hover:bg-blue-700',
    error: 'bg-red-600 hover:bg-red-700',
    warning: 'bg-amber-600 hover:bg-amber-700',
    success: 'bg-emerald-600 hover:bg-emerald-700',
  };

  return (
    <DialogM3 show={show} onClose={onClose} title={title} size="md">
      <DialogM3.Body>
        <p className="text-base leading-relaxed text-gray-700 dark:text-gray-400">
          {message}
        </p>
      </DialogM3.Body>
      <DialogM3.Footer>
        <button
          onClick={onClose}
          disabled={loading}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700"
        >
          {cancelText}
        </button>
        <button
          onClick={handleConfirm}
          disabled={loading}
          className={`px-4 py-2 text-white rounded-lg ${confirmColorClasses[confirmColor]}`}
        >
          {confirmText}
        </button>
      </DialogM3.Footer>
    </DialogM3>
  );
}

/**
 * Alert Dialog Component
 *
 * Dialog for displaying important information (no cancel action).
 *
 * @example
 * ```tsx
 * <AlertDialogM3
 *   show={isOpen}
 *   onClose={handleClose}
 *   title="Error"
 *   message="An error occurred while processing your request."
 *   severity="error"
 * />
 * ```
 */
export interface AlertDialogM3Props {
  /**
   * Whether the dialog is visible
   */
  show: boolean;

  /**
   * Callback when dialog should close
   */
  onClose: () => void;

  /**
   * Dialog title
   */
  title: string;

  /**
   * Alert message
   */
  message: string;

  /**
   * Alert severity
   * @default 'info'
   */
  severity?: 'info' | 'success' | 'warning' | 'error';

  /**
   * Button text
   * @default 'OK'
   */
  buttonText?: string;
}

export function AlertDialogM3({
  show,
  onClose,
  title,
  message,
  severity = 'info',
  buttonText = 'OK',
}: AlertDialogM3Props) {
  const severityColors: Record<string, string> = {
    info: 'bg-blue-600 hover:bg-blue-700',
    success: 'bg-emerald-600 hover:bg-emerald-700',
    warning: 'bg-amber-600 hover:bg-amber-700',
    error: 'bg-red-600 hover:bg-red-700',
  };

  return (
    <DialogM3 show={show} onClose={onClose} title={title} size="sm">
      <DialogM3.Body>
        <p className="text-base leading-relaxed text-gray-700 dark:text-gray-400">
          {message}
        </p>
      </DialogM3.Body>
      <DialogM3.Footer align="center">
        <button
          onClick={onClose}
          className={`w-full px-4 py-2 text-white rounded-lg ${severityColors[severity]}`}
        >
          {buttonText}
        </button>
      </DialogM3.Footer>
    </DialogM3>
  );
}

/**
 * Full-Screen Dialog Component
 *
 * Dialog that takes up the entire viewport.
 *
 * @example
 * ```tsx
 * <FullScreenDialogM3
 *   show={isOpen}
 *   onClose={handleClose}
 *   title="Edit Details"
 * >
 *   <div>Full screen content...</div>
 * </FullScreenDialogM3>
 * ```
 */
export interface FullScreenDialogM3Props {
  /**
   * Whether the dialog is visible
   */
  show: boolean;

  /**
   * Callback when dialog should close
   */
  onClose: () => void;

  /**
   * Dialog title
   */
  title: string;

  /**
   * Children elements
   */
  children: React.ReactNode;
}

export function FullScreenDialogM3({
  show,
  onClose,
  title,
  children,
}: FullScreenDialogM3Props) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 bg-white dark:bg-slate-900">
      <div className="h-full flex flex-col">
        {/* Header with close button */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            aria-label="Close dialog"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content area */}
        <div className="flex-1 overflow-auto p-4">{children}</div>
      </div>
    </div>
  );
}
