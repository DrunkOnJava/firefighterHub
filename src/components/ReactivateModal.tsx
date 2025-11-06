import { useFeatureFlag } from "../hooks/useFeatureFlag";
import { ReactivateModal as ReactivateModalLegacy } from "./ReactivateModalLegacy";
import { ReactivateModalM3 } from "./ReactivateModalM3";
import { Firefighter } from "../lib/supabase";

interface ReactivateModalProps {
  isOpen: boolean;
  firefighter: Firefighter | null;
  currentRosterSize: number;
  onClose: () => void;
  onConfirm: (firefighterId: string, position: number) => void;
}

export function ReactivateModal(props: ReactivateModalProps) {
  const useMaterialM = useFeatureFlag('MATERIALM');

  if (!useMaterialM) {
    return <ReactivateModalLegacy {...props} />;
  }

  return <ReactivateModalM3 {...props} />;
}
