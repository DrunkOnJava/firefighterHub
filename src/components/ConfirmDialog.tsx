/**
 * ConfirmDialog - Routing Wrapper
 *
 * Routes between MaterialM (M3) and Legacy confirm dialog implementations
 * based on the MATERIALM feature flag.
 */

import { useFeatureFlag } from "../hooks/useFeatureFlag";
import { ConfirmDialogLegacy } from "./ConfirmDialogLegacy";
import { ConfirmDialogM3 } from "./ConfirmDialogM3";

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

export function ConfirmDialog(props: ConfirmDialogProps) {
  const useMaterialM = useFeatureFlag('MATERIALM');
  return useMaterialM ? <ConfirmDialogM3 {...props} /> : <ConfirmDialogLegacy {...props} />;
}
