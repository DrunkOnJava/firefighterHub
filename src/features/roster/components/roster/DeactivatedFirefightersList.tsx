import { Eye, RotateCcw } from "lucide-react";
import { Firefighter } from "@/lib/supabase";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/IconButton";

interface DeactivatedFirefightersListProps {
  firefighters: Firefighter[];
  onViewProfile: (ff: Firefighter) => void;
  onReactivate: (ff: Firefighter) => void;
}

export function DeactivatedFirefightersList({
  firefighters,
  onViewProfile,
  onReactivate,
}: DeactivatedFirefightersListProps) {
  if (firefighters.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No deactivated firefighters
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {firefighters.map((firefighter) => (
        <Card key={firefighter.id} className="border-muted">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1">
                <div className="w-2 h-2 rounded-full bg-muted" />
                <div className="flex-1">
                  <Button
                    variant="link"
                    className="p-0 h-auto font-semibold text-foreground hover:text-primary"
                    onClick={() => onViewProfile(firefighter)}
                  >
                    {firefighter.name}
                  </Button>
                  {firefighter.fire_station && (
                    <p className="text-xs text-muted-foreground">
                      Station #{firefighter.fire_station}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <IconButton
                  icon={Eye}
                  label={`View profile for ${firefighter.name}`}
                  onClick={() => onViewProfile(firefighter)}
                  variant="default"
                  size="xs"
                />
                <IconButton
                  icon={RotateCcw}
                  label={`Reactivate ${firefighter.name}`}
                  onClick={() => onReactivate(firefighter)}
                  variant="success"
                  size="xs"
                />
                <span className="text-xs px-2 py-1 rounded bg-muted text-muted-foreground">
                  Inactive
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
