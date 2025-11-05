import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';
import { Toast as ToastType } from '../hooks/useToast';
import { tokens } from '../styles';

export type { ToastType } from '../hooks/useToast';

interface SingleToastProps {
  toast: ToastType;
  onClose: (id: string) => void;
  index: number;
}

function SingleToast({ toast, onClose, index }: SingleToastProps) {
  const icons = {
    success: <CheckCircle className={`${tokens.icons.md} text-emerald-400`} />,
    error: <XCircle className={`${tokens.icons.md} text-red-400`} />,
    info: <AlertCircle className={`${tokens.icons.md} text-sky-400`} />
  };

  const colors = {
    success: 'bg-emerald-900/95 border-emerald-700',
    error: 'bg-red-900/95 border-red-700',
    info: 'bg-sky-900/95 border-sky-700'
  };

  return (
    <div
      className={`
        ${colors[toast.type]}
        border-2
        ${tokens.borders.radius.lg}
        ${tokens.shadows['2xl']}
        ${tokens.spacing.card.md}
        min-w-[320px] max-w-[500px]
        backdrop-blur-sm
        animate-slide-up
        transition-all duration-300
      `}
      style={{
        transform: `translateY(-${index * 80}px)`,
        opacity: 1 - (index * 0.2)
      }}
    >
      <div className="flex items-center gap-3">
        {icons[toast.type]}
        <p className="text-white font-medium flex-1">{toast.message}</p>
        <button
          onClick={() => onClose(toast.id)}
          className="p-1.5 hover:bg-white/10 rounded transition-colors focus-ring"
          aria-label="Close notification"
        >
          <X className={`${tokens.icons.sm} text-white`} />
        </button>
      </div>
    </div>
  );
}

interface ToastContainerProps {
  toasts: ToastType[];
  onClose: (id: string) => void;
}

export function ToastContainer({ toasts, onClose }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col-reverse gap-3">
      {toasts.map((toast, index) => (
        <SingleToast
          key={toast.id}
          toast={toast}
          onClose={onClose}
          index={toasts.length - 1 - index}
        />
      ))}
    </div>
  );
}

// Legacy single toast component for backward compatibility
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
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <SingleToast toast={tempToast} onClose={onClose} index={0} />
    </div>
  );
}
