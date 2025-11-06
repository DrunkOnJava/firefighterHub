import { useFeatureFlag } from "../hooks/useFeatureFlag";
import { ActivityLog as ActivityLogLegacy } from "./ActivityLogLegacy";
import { ActivityLogM3 } from "./ActivityLogM3";

export function ActivityLog() {
  const useMaterialM = useFeatureFlag('MATERIALM');

  if (!useMaterialM) {
    return <ActivityLogLegacy />;
  }

  return <ActivityLogM3 />;
}
