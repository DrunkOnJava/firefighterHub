import { useFeatureFlag } from "../hooks/useFeatureFlag";
import { ConnectionStatusIndicator as ConnectionStatusIndicatorLegacy, ConnectionStatusDot as ConnectionStatusDotLegacy } from "./ConnectionStatusIndicatorLegacy";
import { ConnectionStatusIndicatorM3, ConnectionStatusDotM3 } from "./ConnectionStatusIndicatorM3";

interface ConnectionStatusIndicatorProps {
  showLabel?: boolean;
}

export function ConnectionStatusIndicator(props: ConnectionStatusIndicatorProps) {
  const useMaterialM = useFeatureFlag('MATERIALM');

  if (!useMaterialM) {
    return <ConnectionStatusIndicatorLegacy {...props} />;
  }

  return <ConnectionStatusIndicatorM3 {...props} />;
}

// Compact version for mobile/small spaces
export function ConnectionStatusDot() {
  const useMaterialM = useFeatureFlag('MATERIALM');

  if (!useMaterialM) {
    return <ConnectionStatusDotLegacy />;
  }

  return <ConnectionStatusDotM3 />;
}
