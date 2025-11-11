import { ChevronDown, ChevronUp, UserPlus, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useFocusReturn } from "../hooks/useFocusReturn";
import { useFocusTrap } from "../hooks/useFocusTrap";
import { Shift } from "../lib/supabase";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface QuickAddFirefighterModalProps {
  isOpen: boolean;
  currentShift: Shift;
  onClose: () => void;
  onAdd: (
    name: string,
    station: string,
    certificationLevel?: string | null,
    apparatusClearances?: {
      ambulance?: boolean;
      brushTruck?: boolean;
      engine?: boolean;
      tanker?: boolean;
      truck?: boolean;
      boat?: boolean;
      utv?: boolean;
      rescueSquad?: boolean;
    },
    certifications?: {
      isFTO?: boolean;
      isBLS?: boolean;
      isALS?: boolean;
    }
  ) => void;
}

export function QuickAddFirefighterModal({
  isOpen,
  currentShift,
  onClose,
  onAdd,
}: QuickAddFirefighterModalProps) {
  const [name, setName] = useState("");
  const [station, setStation] = useState("");
  const [certificationLevel, setCertificationLevel] = useState<string>("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [apparatusAmbulance, setApparatusAmbulance] = useState(false);
  const [apparatusBrushTruck, setApparatusBrushTruck] = useState(false);
  const [apparatusEngine, setApparatusEngine] = useState(false);
  const [apparatusTanker, setApparatusTanker] = useState(false);
  const [apparatusTruck, setApparatusTruck] = useState(false);
  const [apparatusBoat, setApparatusBoat] = useState(false);
  const [apparatusUtv, setApparatusUtv] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apparatusRescueSquad, setApparatusRescueSquad] = useState(false);
  const [isFTO, setIsFTO] = useState(false);
  const [isBLS, setIsBLS] = useState(false);
  const [isALS, setIsALS] = useState(false);
  const [errors, setErrors] = useState({ name: "" });
  const trapRef = useFocusTrap(isOpen);
  useFocusReturn(isOpen);

  const resetForm = () => {
    setName("");
    setStation("");
    setCertificationLevel("");
    setShowAdvanced(false);
    setApparatusAmbulance(false);
    setApparatusBrushTruck(false);
    setApparatusEngine(false);
    setApparatusTanker(false);
    setApparatusTruck(false);
    setApparatusBoat(false);
    setApparatusUtv(false);
    setApparatusRescueSquad(false);
    setIsFTO(false);
    setIsBLS(false);
    setIsALS(false);
    setErrors({ name: "" });
  };

  useEffect(() => {
    if (isOpen) {
      resetForm();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  const validateName = (value: string): boolean => {
    if (!value.trim()) {
      setErrors((prev) => ({ ...prev, name: "Name is required" }));
      return false;
    }
    if (value.trim().length < 2) {
      setErrors((prev) => ({
        ...prev,
        name: "Name must be at least 2 characters",
      }));
      return false;
    }
    setErrors((prev) => ({ ...prev, name: "" }));
    return true;
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validateName(name) || isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      onAdd(
        name.trim(),
        station.trim(),
        certificationLevel || null,
        {
          ambulance: apparatusAmbulance,
          brushTruck: apparatusBrushTruck,
          engine: apparatusEngine,
          tanker: apparatusTanker,
          truck: apparatusTruck,
          boat: apparatusBoat,
          utv: apparatusUtv,
          rescueSquad: apparatusRescueSquad,
        },
        {
          isFTO,
          isBLS,
          isALS,
        }
      );
      onClose();
    } catch (error) {
      console.error('Error adding firefighter:', error);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!isOpen) return null;

  const certificationLevels: string[] = [
    "",
    "EMT",
    "EMT-A",
    "EMT-I",
    "Paramedic",
  ];
  const hasAnyAdvancedData =
    apparatusAmbulance ||
    apparatusBrushTruck ||
    apparatusEngine ||
    apparatusTanker ||
    apparatusTruck ||
    apparatusBoat ||
    apparatusUtv ||
    apparatusRescueSquad ||
    isFTO ||
    isBLS ||
    isALS;

  return (
    <div
      className="fixed inset-0 bg-black/80 z-50 flex items-end sm:items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="quick-add-title"
    >
      <div
        ref={trapRef}
        className="bg-card border-2 border-border sm:rounded-2xl shadow-xl w-full h-full sm:h-auto sm:max-w-2xl max-h-screen sm:max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom-8 sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-green-900/20 border-b-2 border-green-700/50 px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <UserPlus className="text-green-400" size={28} />
            <div>
              <h2
                id="quick-add-title"
                className="text-xl font-semibold text-foreground"
              >
                Add Team Member
              </h2>
              <p className="text-sm text-green-400 mt-1">
                Shift {currentShift}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-5 overflow-y-auto max-h-[calc(90vh-120px)]"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quick-firefighter-name">
                Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="quick-firefighter-name"
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) validateName(e.target.value);
                }}
                onBlur={(e) => validateName(e.target.value)}
                placeholder="Enter firefighter name"
                required
                autoFocus
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? "quick-name-error" : undefined}
                className={errors.name ? "border-destructive" : ""}
              />
              {errors.name && (
                <p
                  id="quick-name-error"
                  className="text-destructive text-sm mt-1"
                  role="alert"
                >
                  {errors.name}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="quick-firefighter-station">
                Station Number
              </Label>
              <Input
                id="quick-firefighter-station"
                type="text"
                value={station}
                onChange={(e) => setStation(e.target.value)}
                placeholder="e.g., 1"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="quick-firefighter-certification">
              Certification Level
            </Label>
            <select
              id="quick-firefighter-certification"
              value={certificationLevel}
              onChange={(e) => setCertificationLevel(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="">Not specified</option>
              {certificationLevels.slice(1).map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="w-full flex items-center justify-between px-4 py-3 bg-muted hover:bg-accent rounded-md border border-border transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            aria-expanded={showAdvanced}
            aria-controls="advanced-options"
          >
            <span className="text-sm font-semibold text-muted-foreground">
              Advanced Options{" "}
              {hasAnyAdvancedData && !showAdvanced && (
                <span className="ml-2 text-xs text-green-400">
                  (configured)
                </span>
              )}
            </span>
            {showAdvanced ? (
              <ChevronUp className="text-muted-foreground" size={20} />
            ) : (
              <ChevronDown className="text-muted-foreground" size={20} />
            )}
          </button>

          {showAdvanced && (
            <div
              id="advanced-options"
              className="space-y-5 pl-2 border-l-2 border-green-700/50"
            >
              <div>
                <Label className="block mb-3">
                  Apparatus Clearances
                </Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {[
                    { state: apparatusAmbulance, setState: setApparatusAmbulance, label: "Ambulance" },
                    { state: apparatusBrushTruck, setState: setApparatusBrushTruck, label: "Brush Truck" },
                    { state: apparatusEngine, setState: setApparatusEngine, label: "Engine" },
                    { state: apparatusTanker, setState: setApparatusTanker, label: "Tanker" },
                    { state: apparatusTruck, setState: setApparatusTruck, label: "Truck" },
                    { state: apparatusBoat, setState: setApparatusBoat, label: "Boat" },
                    { state: apparatusUtv, setState: setApparatusUtv, label: "UTV" },
                    { state: apparatusRescueSquad, setState: setApparatusRescueSquad, label: "Rescue Squad" },
                  ].map(({ state, setState, label }) => (
                    <label key={label} className="flex items-center gap-2 cursor-pointer bg-muted px-3 py-2 rounded-md hover:bg-accent transition-colors">
                      <input
                        type="checkbox"
                        checked={state}
                        onChange={(e) => setState(e.target.checked)}
                        className="w-4 h-4 rounded border-input bg-background text-primary focus:ring-2 focus:ring-ring"
                      />
                      <span className="text-sm text-muted-foreground">{label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <Label className="block mb-3">
                  Certifications & Roles
                </Label>
                <div className="grid grid-cols-3 gap-2">
                  <label className="flex items-center gap-2 cursor-pointer bg-amber-900/20 px-3 py-2 rounded-md hover:bg-amber-900/30 border border-amber-700/50 transition-colors">
                    <input
                      type="checkbox"
                      checked={isFTO}
                      onChange={(e) => setIsFTO(e.target.checked)}
                      className="w-4 h-4 rounded border-amber-600 bg-slate-800 text-amber-600 focus:ring-2 focus:ring-amber-500"
                    />
                    <span className="text-sm font-semibold text-amber-300">
                      FTO
                    </span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer bg-emerald-900/20 px-3 py-2 rounded-md hover:bg-emerald-900/30 border border-emerald-700/50 transition-colors">
                    <input
                      type="checkbox"
                      checked={isBLS}
                      onChange={(e) => setIsBLS(e.target.checked)}
                      className="w-4 h-4 rounded border-emerald-600 bg-slate-800 text-emerald-600 focus:ring-2 focus:ring-emerald-500"
                    />
                    <span className="text-sm font-semibold text-emerald-300">
                      BLS
                    </span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer bg-cyan-900/20 px-3 py-2 rounded-md hover:bg-cyan-900/30 border border-cyan-700/50 transition-colors">
                    <input
                      type="checkbox"
                      checked={isALS}
                      onChange={(e) => setIsALS(e.target.checked)}
                      className="w-4 h-4 rounded border-cyan-600 bg-slate-800 text-cyan-600 focus:ring-2 focus:ring-cyan-500"
                    />
                    <span className="text-sm font-semibold text-cyan-300">
                      ALS
                    </span>
                  </label>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-4 pt-2 border-t border-border">
            <Button
              type="button"
              onClick={onClose}
              variant="secondary"
              size="lg"
              className="flex-1"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!name.trim() || isSubmitting}
              variant="default"
              size="lg"
              className="flex-1"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin">⏳</span>
                  Adding...
                </span>
              ) : (
                <>
                  <UserPlus className="mr-2 h-5 w-5" />
                  Add Member
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
