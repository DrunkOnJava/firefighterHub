import { useFeatureFlag } from "../hooks/useFeatureFlag";
import { FirefighterProfileModal as FirefighterProfileModalLegacy } from "./FirefighterProfileModalLegacy";
import { FirefighterProfileModalM3 } from "./FirefighterProfileModalM3";
import { Firefighter } from "../lib/supabase";

interface FirefighterProfileModalProps {
  isOpen: boolean;
  firefighter: Firefighter | null;
  onClose: () => void;
  isAdminMode?: boolean;
}

export function FirefighterProfileModal(props: FirefighterProfileModalProps) {
  const useMaterialM = useFeatureFlag('MATERIALM');

  if (!useMaterialM) {
    return <FirefighterProfileModalLegacy {...props} />;
  }

  return <FirefighterProfileModalM3 {...props} />;
}
