import { AlertTriangle, Info, Trash2, X } from "lucide-react";
import { useEffect, useRef } from "react";
import { getTheme } from "../utils/theme";

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
  isDarkMode?: boolean;
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
  const theme = getTheme(isDarkMode);

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

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className={`absolute inset-0 backdrop-blur-sm ${theme.confirmDialog.overlay}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Dialog */}
      <div
        className={`relative w-full max-w-md rounded-lg shadow-2xl border ${config.borderColor} ${theme.confirmDialog.background}`}
        role="alertdialog"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-description"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 p-1 rounded-lg transition-colors ${
            isDarkMode
              ? "hover:bg-gray-700 text-gray-400 hover:text-white"
              : "hover:bg-slate-100 text-slate-400 hover:text-slate-900"
          }`}
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className="p-6">
          {/* Icon and title */}
          <div className="flex items-start gap-4 mb-4">
            <div className={`p-3 rounded-lg ${config.iconBg}`}>
              <Icon className={`w-6 h-6 ${config.iconColor}`} />
            </div>
            <div className="flex-1">
              <h2
                id="confirm-dialog-title"
                className={`text-xl font-semibold mb-2 ${theme.confirmDialog.title}`}
              >
                {title}
              </h2>
              <p
                id="confirm-dialog-description"
                className={theme.confirmDialog.message}
              >
                {message}
              </p>
            </div>
          </div>

          {/* Consequences list */}
          {consequences.length > 0 && (
            <div
              className={`mt-4 p-4 rounded-lg ${
                isDarkMode ? "bg-gray-900/50" : "bg-slate-50"
              }`}
            >
              <p
                className={`text-sm font-medium mb-2 ${theme.confirmDialog.message}`}
              >
                This action will:
              </p>
              <ul className="space-y-1">
                {consequences.map((consequence, index) => (
                  <li
                    key={index}
                    className={`text-sm flex items-start gap-2 ${theme.textTertiary}`}
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
            <button
              onClick={onClose}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${theme.confirmDialog.cancelButton}`}
            >
              {cancelText}
            </button>
            <button
              ref={confirmButtonRef}
              onClick={handleConfirm}
              className={`flex-1 px-4 py-2 rounded-lg font-medium text-white transition-colors ${config.buttonBg}`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
