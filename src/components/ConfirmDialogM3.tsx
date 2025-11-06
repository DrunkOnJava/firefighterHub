import { AlertTriangle, Info, Trash2, X } from "lucide-react";
import { useEffect, useRef } from "react";
import { DialogM3 } from "./m3/DialogM3";
import { ButtonM3 } from "./m3/ButtonM3";
import { m3Classes } from "../styles/colorSystemM3";

type ConfirmVariant = "danger" | "warning" | "info";

interface ConfirmDialogM3Props {
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

export function ConfirmDialogM3({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "warning",
  consequences = [],
}: ConfirmDialogM3Props) {
  const confirmButtonRef = useRef<HTMLButtonElement>(null);

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
      iconBg: "bg-[#fee2e2]",
      iconColor: "text-[#ef4444]",
      buttonColor: "error" as const,
    },
    warning: {
      icon: AlertTriangle,
      iconBg: "bg-[#fef3c7]",
      iconColor: "text-[#f59e0b]",
      buttonColor: "warning" as const,
    },
    info: {
      icon: Info,
      iconBg: "bg-[#e0e7ff]",
      iconColor: "text-[#6366f1]",
      buttonColor: "info" as const,
    },
  };

  const config = variantConfig[variant];
  const Icon = config.icon;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <DialogM3
      show={isOpen}
      onClose={onClose}
      size="lg"
      dismissible={true}
    >
      <div>
        {/* Header with icon and title */}
        <div className={`${m3Classes.surface.containerHigh} border-b border-[#4b5563] p-6 flex items-start gap-4`}>
          <div className={`p-3 rounded-lg flex-shrink-0 ${config.iconBg}`}>
            <Icon className={`w-6 h-6 ${config.iconColor}`} />
          </div>
          <div className="flex-1 min-w-0 pr-4">
            <h2 className={`text-xl font-semibold ${m3Classes.onSurface.high} mb-2`}>
              {title}
            </h2>
            <p className={`${m3Classes.onSurface.medium}`}>
              {message}
            </p>
          </div>
          <button
            onClick={onClose}
            className={`flex-shrink-0 p-2 rounded-lg transition-colors hover:${m3Classes.surface.containerHigh} ${m3Classes.onSurface.medium}`}
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body with consequences */}
        <DialogM3.Body>
          {consequences.length > 0 && (
            <div className={`${m3Classes.surface.containerLow} border border-[#4b5563] border-opacity-30 rounded-lg p-4`}>
              <p className={`text-sm font-medium ${m3Classes.onSurface.medium} mb-2`}>
                This action will:
              </p>
              <ul className="space-y-1">
                {consequences.map((consequence, index) => (
                  <li
                    key={index}
                    className={`text-sm flex items-start gap-2 ${m3Classes.onSurface.medium}`}
                  >
                    <span className="mt-1">•</span>
                    <span>{consequence}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </DialogM3.Body>

        {/* Footer with action buttons */}
        <DialogM3.Footer align="right">
          <div className="flex gap-3">
            <ButtonM3
              onClick={onClose}
              variant="outlined"
              color="neutral"
              size="lg"
            >
              {cancelText}
            </ButtonM3>
            <ButtonM3
              ref={confirmButtonRef}
              onClick={handleConfirm}
              variant="filled"
              color={config.buttonColor}
              size="lg"
            >
              {confirmText}
            </ButtonM3>
          </div>
        </DialogM3.Footer>
      </div>
    </DialogM3>
  );
}
