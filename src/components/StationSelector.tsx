import { useFeatureFlag } from "../hooks/useFeatureFlag";
import { StationSelector as StationSelectorLegacy } from "./StationSelectorLegacy";
import { StationSelectorM3 } from "./StationSelectorM3";

interface StationSelectorProps {
  selectedStation: string;
  onStationChange: (station: string) => void;
  defaultStation?: string | null;
  className?: string;
}

export function StationSelector(props: StationSelectorProps) {
  const useMaterialM = useFeatureFlag('MATERIALM');

  if (!useMaterialM) {
    return <StationSelectorLegacy {...props} />;
  }

  return <StationSelectorM3 {...props} />;
}
