import { ReactNode } from "react";
import { useFeatureFlag } from "../hooks/useFeatureFlag";
import { TooltipLegacy } from "./TooltipLegacy";
import { TooltipM3 } from "./TooltipM3";

interface TooltipProps {
  content: string;
  children: ReactNode;
  delay?: number;
  position?: "top" | "bottom" | "left" | "right";
}

export function Tooltip(props: TooltipProps) {
  const useMaterialM = useFeatureFlag("MATERIALM");
  return useMaterialM ? <TooltipM3 {...props} /> : <TooltipLegacy {...props} />;
}
