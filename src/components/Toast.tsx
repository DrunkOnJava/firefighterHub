/**
 * Toast - Notification Component
 *
 * Displays temporary notification messages.
 * Uses MaterialM design system.
 *
 * @example
 * ```tsx
 * const { showToast } = useToast();
 * showToast('Changes saved successfully', 'success');
 * ```
 */

import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';
import { Toast as FlowbiteToast, ToastToggle } from 'flowbite-react';
import { Toast as ToastType } from '../hooks/useToast';

export type { ToastType } from '../hooks/useToast';

/**
 * MaterialM Single Toast Component
 */
interface SingleToastM3Props {
  toast: ToastType;
  onClose: (id: string) => void;
  index: number;
}

function SingleToastM3({ toast, onClose, index }: SingleToastM3Props) {
  const icons = {
    success: <CheckCircle className="w-5 h-5" />,
    error: <XCircle className="w-5 h-5" />,
    info: <AlertCircle className="w-5 h-5" />
  };

  const colors = {
    success: 'bg-materialm-success-light text-materialm-success border-materialm-success',
    error: 'bg-materialm-error-light text-materialm-error border-materialm-error',
    info: 'bg-materialm-info-light text-materialm-info border-materialm-info'
  };

  return (
    <div
      className={`
        ${colors[toast.type]}
        border-2
        rounded-materialm-md
        shadow-materialm-3
        p-4
        min-w-[320px] max-w-[500px]
        backdrop-blur-sm
        animate-slide-up
        transition-all duration-300
      `}
      style={{
        transform: `translateY(-${index * 80}px)`,
        opacity: 1 - (index * 0.2)
      }}
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0">{icons[toast.type]}</div>
        <p className="font-medium flex-1 text-gray-900 dark:text-white">{toast.message}</p>
        <button
          onClick={() => onClose(toast.id)}
          className="flex-shrink-0 p-1.5 hover:bg-black/10 dark:hover:bg-white/10 rounded transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-current"
          aria-label="Close notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

/**
 * Toast Container Component
 *
 * Manages multiple toast notifications with stacking.
 */
interface ToastContainerProps {
  toasts: ToastType[];
  onClose: (id: string) => void;
}

export function ToastContainer({ toasts, onClose }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col-reverse gap-3"
      role="region"
      aria-label="Notifications"
    >
      {toasts.map((toast, index) => (
        <SingleToastM3
          key={toast.id}
          toast={toast}
          onClose={onClose}
          index={toasts.length - 1 - index}
        />
      ))}
    </div>
  );
}

/**
 * Legacy Single Toast Component
 *
 * For backward compatibility with components that use the single Toast API.
 */
interface LegacyToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
}

export function Toast({ message, type, onClose }: LegacyToastProps) {
  const tempToast: ToastType = {
    id: 'legacy',
    message,
    type,
    timestamp: Date.now()
  };

  return (
    <div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
      role="region"
      aria-label="Notification"
    >
      <SingleToastM3 toast={tempToast} onClose={() => onClose()} index={0} />
    </div>
  );
}

/**
 * Alternative: Flowbite Toast Wrapper
 *
 * For cases where you want to use Flowbite's Toast component directly.
 * This is more aligned with Flowbite patterns but less customized.
 *
 * @example
 * ```tsx
 * <FlowbiteToastWrapper type="success" onClose={handleClose}>
 *   Changes saved successfully
 * </FlowbiteToastWrapper>
 * ```
 */
interface FlowbiteToastWrapperProps {
  type: 'success' | 'error' | 'info';
  onClose: () => void;
  children: React.ReactNode;
}

export function FlowbiteToastWrapper({
  type,
  onClose,
  children,
}: FlowbiteToastWrapperProps) {
  const icons = {
    success: <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
    error: <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />,
    info: <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
  };

  return (
    <FlowbiteToast className="shadow-materialm-3">
      <div className="flex items-center gap-3">
        {icons[type]}
        <div className="text-sm font-medium text-gray-900 dark:text-white">{children}</div>
      </div>
      <ToastToggle onDismiss={onClose} />
    </FlowbiteToast>
  );
}
