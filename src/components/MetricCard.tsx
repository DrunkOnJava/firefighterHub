/**
 * MetricCard - Metric Display Component
 *
 * Displays metrics and statistics in a card format.
 * Uses MaterialM design system.
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
import { MetricCardM3 } from "./m3/CardM3";

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
  trend,
  onClick,
}: MetricCardProps) {
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
