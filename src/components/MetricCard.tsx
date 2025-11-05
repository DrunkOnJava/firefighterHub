/**
 * MetricCard - Metric Display Component
 *
 * Displays metrics and statistics in a card format.
 * Automatically switches between MaterialM and legacy styling based on feature flag.
 *
 * @example
 * ```tsx
 * import { Users } from 'lucide-react';
 *
 * <MetricCard
 *   title="Active Firefighters"
 *   value={24}
 *   subtitle="Currently available"
 *   icon={Users}
 *   isDarkMode={isDarkMode}
 * />
 * ```
 */

import { LucideIcon } from "lucide-react";
import { useFeatureFlag } from "../hooks/useFeatureFlag";
import { MetricCardM3 } from "./m3/CardM3";
import { MetricCardLegacy } from "./MetricCardLegacy";

interface MetricCardProps {
  title: string;
  value: number | string;
  subtitle: string;
  icon?: LucideIcon;
  isDarkMode: boolean;
  colorClass?: string;
  /**
   * Optional trend indicator (only shown in MaterialM)
   */
  trend?: {
    value: number;
    direction: 'up' | 'down' | 'neutral';
  };
  /**
   * Click handler (makes card interactive)
   */
  onClick?: () => void;
}

export function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  isDarkMode,
  colorClass = "blue",
  trend,
  onClick,
}: MetricCardProps) {
  const useMaterialM = useFeatureFlag('MATERIALM');

  // Use legacy card if MaterialM is disabled
  if (!useMaterialM) {
    return (
      <MetricCardLegacy
        title={title}
        value={value}
        subtitle={subtitle}
        icon={Icon}
        isDarkMode={isDarkMode}
        colorClass={colorClass}
      />
    );
  }

  // MaterialM Metric Card
  return (
    <MetricCardM3
      title={title}
      value={value}
      subtitle={subtitle}
      icon={Icon ? <Icon className="w-8 h-8" /> : undefined}
      trend={trend}
      onClick={onClick}
    />
  );
}
