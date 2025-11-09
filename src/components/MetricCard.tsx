import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface MetricCardProps {
  title: string;
  value: number | string;
  subtitle: string;
  icon?: LucideIcon;
  colorClass?: string;
}

export function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  colorClass = "blue",
}: MetricCardProps) {
  // Color classes for the icon using shadcn semantic tokens
  const iconColorMap: Record<string, string> = {
    blue: "text-blue-500 dark:text-blue-400",
    green: "text-green-500 dark:text-green-400",
    amber: "text-amber-500 dark:text-amber-400",
    red: "text-red-500 dark:text-red-400",
    purple: "text-purple-500 dark:text-purple-400",
  };

  const iconClass = iconColorMap[colorClass] || iconColorMap.blue;

  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h4 className="text-sm font-medium text-muted-foreground mb-1">
              {title}
            </h4>
            <p className="text-3xl font-bold text-foreground my-2">
              {value}
            </p>
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          </div>
          {Icon && (
            <div className={`${iconClass} opacity-80`}>
              <Icon className="h-8 w-8" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
