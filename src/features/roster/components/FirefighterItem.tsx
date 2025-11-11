import {
  ArrowRightLeft,
  CheckCircle,
  GripVertical,
  HandHeart,
  Star,
  Trash2,
  UserX,
} from "lucide-react";
import { Firefighter, Shift } from '@/lib/supabase';
import { ShiftBadge } from "@/features/shifts/components/ShiftBadge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface FirefighterItemProps {
  firefighter: Firefighter;
  onToggleAvailable: (id: string) => void;
  onCompleteHold: (id: string) => void;
  onDelete: (id: string) => void;
  onDeactivate: (id: string) => void;
  onTransferShift: (id: string) => void;
  onVolunteerHold?: (id: string) => void;
  isNextInRotation?: boolean;
  onDragStart?: (e: React.DragEvent, firefighterId: string) => void;
  onDragOver?: (e: React.DragEvent, firefighterId: string) => void;
  onDrop?: (e: React.DragEvent, targetFirefighterId: string) => void;
  onDragEnd?: () => void;
  isDragging?: boolean;
  isDragOver?: boolean;
  isAdminMode?: boolean;
}

export function FirefighterItem({
  firefighter,
  onCompleteHold,
  onDelete,
  onDeactivate,
  onTransferShift,
  onVolunteerHold,
  isNextInRotation = false,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
  isDragging = false,
  isDragOver = false,
  isAdminMode = false,
}: FirefighterItemProps) {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "No holds yet";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      timeZone: "UTC",
    });
  };

  const getCardClasses = () => {
    if (isDragging) return "opacity-50 scale-95";
    if (isDragOver) return "ring-2 ring-primary scale-105";
    if (!firefighter.is_available) return "opacity-60";
    if (isNextInRotation) return "ring-2 ring-amber-500";
    return "";
  };

  return (
    <Card
      draggable={true}
      onDragStart={(e) => onDragStart?.(e, firefighter.id)}
      onDragOver={(e) => {
        e.preventDefault();
        onDragOver?.(e, firefighter.id);
      }}
      onDrop={(e) => {
        e.preventDefault();
        onDrop?.(e, firefighter.id);
      }}
      onDragEnd={onDragEnd}
      className={`relative cursor-move transition-all hover:shadow-xl ${getCardClasses()}`}
    >
      {isNextInRotation && (
        <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-slate-900 font-bold shadow-lg z-10 flex items-center gap-1.5">
          <Star className="h-3 w-3" fill="currentColor" />
          NEXT UP
        </Badge>
      )}

      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-4">
          {isAdminMode && (
            <div className="flex items-center gap-2 mr-2">
              <div className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground">
                <GripVertical className="h-5 w-5" />
              </div>
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h3
                className="text-xl font-bold whitespace-nowrap"
                title={firefighter.name}
              >
                {firefighter.name}
              </h3>
              {!firefighter.is_available && (
                <Badge variant="secondary" className="font-bold">
                  OUT OF ROTATION
                </Badge>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex gap-2 flex-wrap">
                <ShiftBadge shift={firefighter.shift as Shift} />
                {firefighter.fire_station && (
                  <Badge variant="outline" className="gap-1.5">
                    <span className="text-xs font-semibold">
                      Station #{firefighter.fire_station}
                    </span>
                  </Badge>
                )}
                <Badge variant="outline" className="gap-1.5">
                  <span className="text-xs font-medium">Last Hold:</span>
                  <span className="text-xs font-semibold">
                    {formatDate(firefighter.last_hold_date)}
                  </span>
                </Badge>
              </div>

              {(firefighter.is_fto ||
                firefighter.is_bls ||
                firefighter.is_als) && (
                <div>
                  <span className="text-xs font-semibold mb-1.5 block text-muted-foreground">
                    Certifications & Roles:
                  </span>
                  <div className="flex gap-2 flex-wrap">
                    {firefighter.is_fto && (
                      <Badge variant="secondary" className="font-bold">
                        FTO
                      </Badge>
                    )}
                    {firefighter.is_bls && (
                      <Badge variant="secondary" className="font-bold">
                        BLS
                      </Badge>
                    )}
                    {firefighter.is_als && (
                      <Badge variant="secondary" className="font-bold">
                        ALS
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              {firefighter.certification_level && (
                <div>
                  <span className="text-xs font-semibold mb-1.5 block text-muted-foreground">
                    Medical Certification:
                  </span>
                  <Badge variant="outline" className="font-semibold">
                    {firefighter.certification_level}
                  </Badge>
                </div>
              )}

              {(firefighter.apparatus_ambulance ||
                firefighter.apparatus_brush_truck ||
                firefighter.apparatus_engine ||
                firefighter.apparatus_tanker ||
                firefighter.apparatus_truck ||
                firefighter.apparatus_boat ||
                firefighter.apparatus_utv ||
                firefighter.apparatus_rescue_squad) && (
                <div>
                  <span className="text-xs font-semibold mb-1.5 block text-muted-foreground">
                    Apparatus Clearances:
                  </span>
                  <div className="flex gap-2 flex-wrap">
                    {firefighter.apparatus_ambulance && (
                      <Badge variant="outline" className="font-semibold">Ambulance</Badge>
                    )}
                    {firefighter.apparatus_brush_truck && (
                      <Badge variant="outline" className="font-semibold">Brush Truck</Badge>
                    )}
                    {firefighter.apparatus_engine && (
                      <Badge variant="outline" className="font-semibold">Engine</Badge>
                    )}
                    {firefighter.apparatus_tanker && (
                      <Badge variant="outline" className="font-semibold">Tanker</Badge>
                    )}
                    {firefighter.apparatus_truck && (
                      <Badge variant="outline" className="font-semibold">Truck</Badge>
                    )}
                    {firefighter.apparatus_boat && (
                      <Badge variant="outline" className="font-semibold">Boat</Badge>
                    )}
                    {firefighter.apparatus_utv && (
                      <Badge variant="outline" className="font-semibold">UTV</Badge>
                    )}
                    {firefighter.apparatus_rescue_squad && (
                      <Badge variant="outline" className="font-semibold">Rescue Squad</Badge>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {isAdminMode && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(firefighter.id)}
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
              aria-label={`Remove ${firefighter.name} from roster`}
            >
              <Trash2 className="h-5 w-5" />
            </Button>
          )}
        </div>

        {isAdminMode && (
          <>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                onClick={() => onDeactivate(firefighter.id)}
                className="gap-2"
                aria-label={`Deactivate ${firefighter.name}`}
              >
                <UserX className="h-4 w-4" />
                Deactivate
              </Button>

              <Button
                variant="outline"
                onClick={() => onTransferShift(firefighter.id)}
                className="gap-2"
                aria-label={`Transfer ${firefighter.name} to different shift`}
              >
                <ArrowRightLeft className="h-4 w-4" />
                Transfer Shift
              </Button>
            </div>

            {firefighter.is_available && (
              <Button
                variant="default"
                onClick={() => onCompleteHold(firefighter.id)}
                className="w-full mt-3 gap-2 bg-emerald-600 hover:bg-emerald-700"
                aria-label={`Complete hold for ${firefighter.name}`}
              >
                <CheckCircle className="h-4 w-4" />
                Finish Hold & Move to End
              </Button>
            )}
          </>
        )}

        {/* Volunteer Hold Button - Available to ALL users */}
        {firefighter.is_available && onVolunteerHold && (
          <Button
            variant="outline"
            onClick={() => onVolunteerHold(firefighter.id)}
            className="w-full mt-3 gap-2 border-2 border-emerald-600 text-emerald-700 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-950"
            aria-label={`Volunteer to take hold for ${firefighter.name}`}
          >
            <HandHeart className="h-4 w-4" />
            I'll Take This Hold
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
