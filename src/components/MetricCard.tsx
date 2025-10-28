import { LucideIcon } from 'lucide-react';

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
  colorClass = 'blue',
}: MetricCardProps) {
  const bgClass = isDarkMode ? 'bg-gray-800' : 'bg-white';
  const borderClass = isDarkMode ? 'border-gray-700' : 'border-gray-200';
  const titleClass = isDarkMode ? 'text-gray-400' : 'text-gray-600';
  const valueClass = isDarkMode ? 'text-white' : 'text-gray-900';
  const subtitleClass = isDarkMode ? 'text-gray-500' : 'text-gray-500';

  // Color classes for the icon
  const iconColorMap: Record<string, string> = {
    blue: isDarkMode ? 'text-blue-400' : 'text-blue-600',
    green: isDarkMode ? 'text-green-400' : 'text-green-600',
    amber: isDarkMode ? 'text-amber-400' : 'text-amber-600',
    red: isDarkMode ? 'text-red-400' : 'text-red-600',
    purple: isDarkMode ? 'text-purple-400' : 'text-purple-600',
  };

  const iconClass = iconColorMap[colorClass] || iconColorMap.blue;

  return (
    <div
      className={`${bgClass} ${borderClass} rounded-lg p-6 border shadow-sm hover:shadow-md transition-shadow`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h4 className={`text-sm font-medium ${titleClass} mb-1`}>{title}</h4>
          <p className={`text-3xl font-bold ${valueClass} my-2`}>{value}</p>
          <p className={`text-xs ${subtitleClass}`}>{subtitle}</p>
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
