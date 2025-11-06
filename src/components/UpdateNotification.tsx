import { useFeatureFlag } from "../hooks/useFeatureFlag";
import { UpdateNotificationLegacy } from "./UpdateNotificationLegacy";
import { UpdateNotificationM3 } from "./UpdateNotificationM3";

export function UpdateNotification() {
  const useMaterialM = useFeatureFlag("MATERIALM");
  return useMaterialM ? <UpdateNotificationM3 /> : <UpdateNotificationLegacy />;
}
