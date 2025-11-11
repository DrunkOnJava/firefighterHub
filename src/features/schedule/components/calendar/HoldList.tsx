/**
 * HoldList Component - Calendr Design
 */

import {
  Calendar,
  CheckCircle2,
  Clock,
  Lock,
  Plus,
  Trash2,
  Building2,
} from "lucide-react";
import { Firefighter } from '@/lib/supabase';
import { ScheduledHold } from '@/utils/calendarUtils';
import { isHoldLocked } from '@/utils/validation';
import { EmptyState } from "@/components/ui/EmptyState";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { InfoCard } from "@/components/ui/InfoCard";

interface HoldListProps {
  holds: ScheduledHold[];
  firefighters: Firefighter[];
  onRemove: (holdId: string) => void;
  onMarkCompleted: (hold: ScheduledHold) => void;
  onEdit: (holdId: string, station: string) => void;
  onAddNew: () => void;
  isAdminMode?: boolean;
}

export function HoldList({
  holds,
  onRemove,
  onMarkCompleted,
  onAddNew,
  isAdminMode = false,
}: HoldListProps) {
  if (holds.length === 0) {
    return (
      <div>
        <EmptyState
          icon={<Calendar className="w-16 h-16 text-muted-foreground" />}
          title="No holds scheduled"
          description="Click 'Add Hold' below to schedule someone"
        />
        {isAdminMode && (
          <Button onClick={onAddNew} className="w-full mt-6">
            <Plus className="w-5 h-5 mr-2" />
            Add Hold
          </Button>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="space-y-4 mb-6">
        {holds.map((hold) => {
          const locked = isHoldLocked(hold);
          return (
            <div key={hold.id} className="border border-border rounded-lg overflow-hidden bg-card">
              <div className="bg-muted/50 p-4 border-b border-border">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-foreground">{hold.firefighter_name}</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {new Date(hold.hold_date).toLocaleDateString("en-US", {weekday: "long", month: "long", day: "numeric"})}
                    </p>
                  </div>
                  <Badge className={hold.status === 'completed' ? 'bg-success text-success-foreground' : 'bg-warning text-warning-foreground'}>
                    {hold.status === "scheduled" ? "SCHEDULED" : "COMPLETED"}
                  </Badge>
                </div>
              </div>
              <div className="p-4 grid grid-cols-2 gap-3">
                <InfoCard label="Duration" value={hold.duration === "12h" ? "12 Hours" : "24 Hours"} icon={Clock} />
                <InfoCard label="Station" value={hold.fire_station ? `Station ${hold.fire_station}` : '—'} icon={Building2} />
                {hold.start_time && (
                  <div className="col-span-2"><InfoCard label="Start Time" value={hold.start_time} icon={Clock} /></div>
                )}
              </div>
              {(hold.is_voluntary || locked) && (
                <div className="px-4 pb-4 flex gap-2 flex-wrap">
                  {hold.is_voluntary && <Badge variant="outline" className="bg-success/10 text-success border-success/30">🙋 Voluntary</Badge>}
                  {locked && <Badge variant="outline" className="bg-warning/10 text-warning border-warning/30"><Lock className="w-3 h-3 mr-1" />Locked</Badge>}
                </div>
              )}
              {isAdminMode && (
                <div className="p-4 pt-0 flex gap-2">
                  {hold.status === "scheduled" && (
                    <Button onClick={() => onMarkCompleted(hold)} className="flex-1 bg-success hover:bg-success/90 text-success-foreground">
                      <CheckCircle2 className="w-4 h-4 mr-2" />Complete
                    </Button>
                  )}
                  {!locked && (
                    <Button onClick={() => onRemove(hold.id)} variant="destructive" className="flex-1">
                      <Trash2 className="w-4 h-4 mr-2" />Delete
                    </Button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
      {isAdminMode && (
        <Button onClick={onAddNew} variant="outline" className="w-full">
          <Plus className="w-4 h-4 mr-2" />Add Another Hold
        </Button>
      )}
    </div>
  );
}
