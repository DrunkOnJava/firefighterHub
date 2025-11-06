/**
 * CalendarSubscribeModal - Routing Wrapper
 *
 * Routes between MaterialM (M3) and Legacy calendar subscription modal implementations
 * based on the MATERIALM feature flag.
 */

import { useFeatureFlag } from "../hooks/useFeatureFlag";
import { Shift } from "../lib/supabase";
import { CalendarSubscribeModalLegacy } from "./CalendarSubscribeModalLegacy";
import { CalendarSubscribeModalM3 } from "./CalendarSubscribeModalM3";

interface CalendarSubscribeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentShift?: Shift;
}

export function CalendarSubscribeModal(props: CalendarSubscribeModalProps) {
  const useMaterialM = useFeatureFlag('MATERIALM');
  return useMaterialM ? <CalendarSubscribeModalM3 {...props} /> : <CalendarSubscribeModalLegacy {...props} />;
}
