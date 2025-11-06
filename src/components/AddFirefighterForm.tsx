import { useFeatureFlag } from "../hooks/useFeatureFlag";
import { AddFirefighterForm as AddFirefighterFormLegacy } from "./AddFirefighterFormLegacy";
import { AddFirefighterFormM3 } from "./AddFirefighterFormM3";

interface AddFirefighterFormProps {
  onAdd: (name: string, fireStation: string) => void;
}

export function AddFirefighterForm(props: AddFirefighterFormProps) {
  const useMaterialM = useFeatureFlag('MATERIALM');

  if (!useMaterialM) {
    return <AddFirefighterFormLegacy {...props} />;
  }

  return <AddFirefighterFormM3 {...props} />;
}
