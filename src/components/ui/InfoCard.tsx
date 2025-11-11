import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface InfoCardProps {
  label: string;
  value: string | number | null | undefined;
  icon?: LucideIcon;
}

/**
 * InfoCard - Display key-value information in modals
 * 
 * Used in detail modals to show structured information
 * (e.g., Duration, Station, Shift, Type)
 * 
 * Design: Based on Calendr Screen 21 (View Detail)
 */
export function InfoCard({ label, value, icon: Icon }: InfoCardProps) {
  return (
    <Card className="border-border">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          {Icon && (
            <div className="rounded-lg bg-muted p-2">
              <Icon className="w-5 h-5 text-muted-foreground" />
            </div>
          )}
          <div className="flex-1">
            <p className="text-sm text-muted-foreground mb-1">{label}</p>
            <p className="text-base font-semibold text-foreground">
              {value || '—'}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
