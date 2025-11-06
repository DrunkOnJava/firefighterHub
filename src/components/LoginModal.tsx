/**
 * LoginModal - Routing Wrapper
 *
 * Routes between MaterialM (M3) and Legacy login modal implementations
 * based on the MATERIALM feature flag.
 */

import { useFeatureFlag } from "../hooks/useFeatureFlag";
import { LoginModalLegacy } from "./LoginModalLegacy";
import { LoginModalM3 } from "./LoginModalM3";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function LoginModal(props: LoginModalProps) {
  const useMaterialM = useFeatureFlag('MATERIALM');
  return useMaterialM ? <LoginModalM3 {...props} /> : <LoginModalLegacy {...props} />;
}
