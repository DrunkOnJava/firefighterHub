// ✅ Migrated to shadcn/ui - uses AlertDialog component
import { AlertTriangle, Info, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type ConfirmVariant = "danger" | "warning" | "info";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: ConfirmVariant;
  consequences?: string[];
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "warning",
  consequences = [],
  isDarkMode = true,
}: ConfirmDialogProps) {
  const confirmButtonRef = useRef<HTMLButtonElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Focus confirm button when dialog opens (for keyboard users)
      confirmButtonRef.current?.focus();

      // Prevent body scroll when dialog is open
      document.body.style.overflow = "hidden";

      // Handle escape key
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          onClose();
        }
      };

      document.addEventListener("keydown", handleEscape);

      return () => {
        document.body.style.overflow = "";
        document.removeEventListener("keydown", handleEscape);
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const variantConfig = {
    danger: {
      icon: Trash2,
      iconBg: "bg-red-100 dark:bg-red-900/30",
      iconColor: "text-red-600 dark:text-red-400",
      buttonBg: "bg-red-600 hover:bg-red-700",
      borderColor: "border-red-200 dark:border-red-800",
    },
    warning: {
      icon: AlertTriangle,
      iconBg: "bg-amber-100 dark:bg-amber-900/30",
      iconColor: "text-amber-600 dark:text-amber-400",
      buttonBg: "bg-amber-600 hover:bg-amber-700",
      borderColor: "border-amber-200 dark:border-amber-800",
    },
    info: {
      icon: Info,
      iconBg: "bg-blue-100 dark:bg-blue-900/30",
      iconColor: "text-blue-600 dark:text-blue-400",
      buttonBg: "bg-blue-600 hover:bg-blue-700",
      borderColor: "border-blue-200 dark:border-blue-800",
    },
  };

  const config = variantConfig[variant];
  const Icon = config.icon;

  const handleConfirm = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      await onConfirm();
      onClose();
    } catch (error) {
      console.error('Confirm action failed:', error);
      setIsSubmitting(false);
    }
  };

  // Map variant to Button variant
  const buttonVariant = variant === 'danger' ? 'danger' : variant === 'info' ? 'primary' : 'primary';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 backdrop-blur-sm bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Dialog */}
      <div
        className={cn(
          "relative w-full max-w-md rounded-2xl shadow-2xl border",
          config.borderColor,
          isDarkMode ? "bg-slate-900" : "bg-white"
        )}
        role="alertdialog"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-description"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className={cn(
            "absolute top-4 right-4 p-1 min-h-[44px] min-w-[44px] rounded-lg transition-colors flex items-center justify-center",
            isDarkMode
              ? "hover:bg-slate-700 text-slate-400 hover:text-white"
              : "hover:bg-slate-100 text-slate-400 hover:text-slate-900"
          )}
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className="p-6">
          {/* Icon and title */}
          <div className="flex items-start gap-4 mb-4">
            <div className={`p-3 rounded-md ${config.iconBg}`}>
              <Icon className={`w-6 h-6 ${config.iconColor}`} />
            </div>
            <div className="flex-1">
              <h2
                id="confirm-dialog-title"
                className={cn(
                  "text-lg font-semibold mb-2",
                  isDarkMode ? "text-white" : "text-slate-900"
                )}
              >
                {title}
              </h2>
              <p
                id="confirm-dialog-description"
                className={isDarkMode ? "text-slate-300" : "text-slate-700"}
              >
                {message}
              </p>
            </div>
          </div>

          {/* Consequences list */}
          {consequences.length > 0 && (
            <div
              className={`mt-4 p-4 rounded-lg ${
                isDarkMode ? "bg-slate-900/50" : "bg-slate-50"
              }`}
            >
              <p
                className={cn(
                  "text-sm font-medium mb-2",
                  isDarkMode ? "text-slate-300" : "text-slate-700"
                )}
              >
                This action will:
              </p>
              <ul className="space-y-1">
                {consequences.map((consequence, index) => (
                  <li
                    key={index}
                    className={cn(
                      "text-sm flex items-start gap-2",
                      isDarkMode ? "text-slate-400" : "text-slate-600"
                    )}
                  >
                    <span className="mt-1">•</span>
                    <span>{consequence}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 mt-6">
            <Button
              onClick={onClose}
              variant="secondary"
              size="lg"
              className="flex-1"
              disabled={isSubmitting}
            >
              {cancelText}
            </Button>
            <Button
              ref={confirmButtonRef}
              onClick={handleConfirm}
              variant={variant === 'danger' ? 'destructive' : 'default'}
              size="lg"
              className="flex-1"
              disabled={isSubmitting}
            >
              {confirmText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
