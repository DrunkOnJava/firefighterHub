import { LucideIcon } from "lucide-react";
import { tokens } from "../styles";
import { getTheme } from "../utils/theme";

interface MetricCardProps {
  title: string;
  value: number | string;
  subtitle: string;
  icon?: LucideIcon;
  isDarkMode: boolean;
  colorClass?: string;
}

export function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  isDarkMode,
  colorClass = "blue",
}: MetricCardProps) {
  const theme = getTheme(isDarkMode);

  // Color classes for the icon
  const iconColorMap: Record<string, string> = {
    blue: theme.metricCard.icon,
    green: isDarkMode ? "text-green-400" : "text-green-600",
    amber: isDarkMode ? "text-amber-400" : "text-amber-600",
    red: isDarkMode ? "text-red-400" : "text-red-600",
    purple: isDarkMode ? "text-purple-400" : "text-purple-600",
  };

  const iconClass = iconColorMap[colorClass] || iconColorMap.blue;

  return (
    <div
      className={`
        ${theme.metricCard.background} ${theme.metricCard.border}
        ${tokens.borders.radius.lg}
        ${tokens.spacing.card.lg}
        ${tokens.shadows.sm}
        ${tokens.transitions.fast}
        border
        hover:shadow-md
      `}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h4
            className={`text-sm font-medium ${theme.metricCard.titleText} mb-1`}
          >
            {title}
          </h4>
          <p
            className={`text-3xl font-bold ${theme.metricCard.valueText} my-2`}
          >
            {value}
          </p>
          <p className={`text-xs ${theme.textTertiary}`}>{subtitle}</p>
        </div>
        {Icon && (
          <div className={`${iconClass} opacity-80`}>
            <Icon size={24} />
          </div>
        )}
      </div>
    </div>
  );
}
