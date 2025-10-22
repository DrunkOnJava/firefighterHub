import { useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
  duration?: number;
}

export function Toast({ message, type, onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const icons = {
    success: <CheckCircle className="text-emerald-400" size={20} />,
    error: <XCircle className="text-red-400" size={20} />,
    info: <AlertCircle className="text-sky-400" size={20} />
  };

  const colors = {
    success: 'bg-emerald-900/95 border-emerald-700',
    error: 'bg-red-900/95 border-red-700',
    info: 'bg-sky-900/95 border-sky-700'
  };

  return (
    <div
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 ${colors[type]} border-2 rounded-lg shadow-2xl p-4 min-w-[320px] max-w-[500px] animate-slide-up backdrop-blur-sm`}
    >
      <div className="flex items-center gap-3">
        {icons[type]}
        <p className="text-white font-medium flex-1">{message}</p>
        <button
          onClick={onClose}
          className="p-1.5 hover:bg-white/10 rounded transition-colors focus-ring"
          aria-label="Close notification"
        >
          <X size={18} className="text-white" />
        </button>
      </div>
    </div>
  );
}
