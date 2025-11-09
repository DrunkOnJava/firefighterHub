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
}: ConfirmDialogProps) {
  const variantConfig = {
    danger: {
      icon: Trash2,
      iconBg: "bg-destructive/10 dark:bg-destructive/20",
      iconColor: "text-destructive dark:text-destructive",
    },
    warning: {
      icon: AlertTriangle,
      iconBg: "bg-amber-100 dark:bg-amber-900/30",
      iconColor: "text-amber-600 dark:text-amber-400",
    },
    info: {
      icon: Info,
      iconBg: "bg-primary/10 dark:bg-primary/20",
      iconColor: "text-primary dark:text-primary",
    },
  };

  const config = variantConfig[variant];
  const Icon = config.icon;

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-md ${config.iconBg}`}>
              <Icon className={`w-6 h-6 ${config.iconColor}`} />
            </div>
            <div className="flex-1">
              <AlertDialogTitle>{title}</AlertDialogTitle>
              <AlertDialogDescription className="mt-2">
                {message}
              </AlertDialogDescription>
            </div>
          </div>

          {/* Consequences list */}
          {consequences.length > 0 && (
            <div className="mt-4 p-4 rounded-lg bg-muted">
              <p className="text-sm font-medium mb-2 text-foreground">
                This action will:
              </p>
              <ul className="space-y-1">
                {consequences.map((consequence, index) => (
                  <li
                    key={index}
                    className="text-sm flex items-start gap-2 text-muted-foreground"
                  >
                    <span className="mt-1">•</span>
                    <span>{consequence}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>{cancelText}</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className={
              variant === "danger"
                ? "bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                : variant === "warning"
                  ? "bg-amber-600 hover:bg-amber-700 text-white"
                  : undefined
            }
          >
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
