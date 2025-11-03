import { ChevronDown, ChevronUp, UserPlus, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useFocusReturn } from "../hooks/useFocusReturn";
import { useFocusTrap } from "../hooks/useFocusTrap";
import { Shift } from "../lib/supabase";
import { colors, tokens } from "../styles";

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

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (validateName(name)) {
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
      className={`fixed inset-0 ${colors.components.modal.overlay} z-50 flex items-center justify-center ${tokens.spacing.card.md} animate-fade-in`}
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
        className={`${colors.components.modal.background} ${colors.components.modal.border} ${tokens.borders.radius.xl} ${colors.components.modal.shadow} max-w-2xl w-full max-h-[90vh] overflow-hidden`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`${colors.semantic.success.light} border-b-2 ${colors.semantic.success.border} px-6 py-5 flex items-center justify-between`}>
          <div className={`flex items-center ${tokens.spacing.gap.md}`}>
            <UserPlus className={colors.semantic.success.text} size={28} />
            <div>
              <h2
                id="quick-add-title"
                className={`${tokens.typography.heading.h2} ${colors.structural.text.primary}`}
              >
                Add Team Member
              </h2>
              <p className={`${tokens.typography.body.secondary} ${colors.semantic.success.text} mt-1`}>
                Shift {currentShift}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-2 ${colors.interactive.hover.bg} ${tokens.borders.radius.md} transition-colors focus-ring`}
            aria-label="Close dialog"
          >
            <X size={24} className={colors.structural.text.secondary} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className={`${tokens.spacing.card.lg} space-y-5 overflow-y-auto max-h-[calc(90vh-120px)]`}
        >
          <div className={`grid grid-cols-1 md:grid-cols-2 ${tokens.spacing.gap.md}`}>
            <div>
              <label
                htmlFor="quick-firefighter-name"
                className={`block ${tokens.typography.body.secondary} font-semibold ${colors.structural.text.secondary} mb-2`}
              >
                Name <span className={colors.semantic.error.text}>*</span>
              </label>
              <input
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
                className={`w-full px-4 py-3 ${errors.name ? colors.components.input.error : colors.components.input.default} ${tokens.borders.radius.md} ${colors.structural.text.primary} placeholder-gray-500 focus:outline-none focus:ring-2 transition-all ${
                  errors.name
                    ? "focus:ring-red-500"
                    : "focus:ring-green-500 focus:border-transparent"
                }`}
              />
              {errors.name && (
                <p
                  id="quick-name-error"
                  className={`${colors.semantic.error.text} ${tokens.typography.body.small} mt-1`}
                  role="alert"
                >
                  {errors.name}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="quick-firefighter-station"
                className={`block ${tokens.typography.body.secondary} font-semibold ${colors.structural.text.secondary} mb-2`}
              >
                Station Number
              </label>
              <input
                id="quick-firefighter-station"
                type="text"
                value={station}
                onChange={(e) => setStation(e.target.value)}
                placeholder="e.g., 1"
                className={`w-full px-4 py-3 ${colors.components.input.default} ${tokens.borders.radius.md} ${colors.structural.text.primary} placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all`}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="quick-firefighter-certification"
              className={`block ${tokens.typography.body.secondary} font-semibold ${colors.structural.text.secondary} mb-2`}
            >
              Certification Level
            </label>
            <select
              id="quick-firefighter-certification"
              value={certificationLevel}
              onChange={(e) => setCertificationLevel(e.target.value)}
              className={`w-full px-4 py-3 ${colors.components.input.default} ${tokens.borders.radius.md} ${colors.structural.text.primary} focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all`}
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
            className={`w-full flex items-center justify-between px-4 py-3 ${colors.structural.bg.surface} ${colors.interactive.hover.bg} ${tokens.borders.radius.md} border ${colors.structural.border.default} transition-all focus-ring`}
            aria-expanded={showAdvanced}
            aria-controls="advanced-options"
          >
            <span className={`${tokens.typography.body.secondary} font-semibold ${colors.structural.text.secondary}`}>
              Advanced Options{" "}
              {hasAnyAdvancedData && !showAdvanced && (
                <span className={`ml-2 ${tokens.typography.body.small} ${colors.semantic.success.text}`}>
                  (configured)
                </span>
              )}
            </span>
            {showAdvanced ? (
              <ChevronUp className={colors.structural.text.tertiary} size={20} />
            ) : (
              <ChevronDown className={colors.structural.text.tertiary} size={20} />
            )}
          </button>

          {showAdvanced && (
            <div
              id="advanced-options"
              className={`space-y-5 pl-2 border-l-2 ${colors.semantic.success.border}`}
            >
              <div>
                <label className={`block ${tokens.typography.body.secondary} font-semibold ${colors.structural.text.secondary} mb-3`}>
                  Apparatus Clearances
                </label>
                <div className={`grid grid-cols-2 md:grid-cols-4 ${tokens.spacing.gap.md}`}>
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
                    <label key={label} className={`flex items-center ${tokens.spacing.gap.sm} cursor-pointer ${colors.structural.bg.surface} px-3 py-2 ${tokens.borders.radius.md} ${colors.interactive.hover.bg} transition-colors`}>
                      <input
                        type="checkbox"
                        checked={state}
                        onChange={(e) => setState(e.target.checked)}
                        className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-green-600 focus:ring-2 focus:ring-green-500"
                      />
                      <span className={`${tokens.typography.body.secondary} ${colors.structural.text.secondary}`}>{label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className={`block ${tokens.typography.body.secondary} font-semibold ${colors.structural.text.secondary} mb-3`}>
                  Certifications & Roles
                </label>
                <div className={`grid grid-cols-3 ${tokens.spacing.gap.md}`}>
                  <label className={`flex items-center ${tokens.spacing.gap.sm} cursor-pointer ${colors.semantic.warning.light} px-3 py-2 ${tokens.borders.radius.md} hover:bg-amber-900/30 border ${colors.semantic.warning.border} transition-colors`}>
                    <input
                      type="checkbox"
                      checked={isFTO}
                      onChange={(e) => setIsFTO(e.target.checked)}
                      className="w-4 h-4 rounded border-amber-600 bg-gray-800 text-amber-600 focus:ring-2 focus:ring-amber-500"
                    />
                    <span className={`${tokens.typography.body.secondary} font-semibold ${colors.semantic.warning.text}`}>
                      FTO
                    </span>
                  </label>
                  <label className={`flex items-center ${tokens.spacing.gap.sm} cursor-pointer ${colors.semantic.success.light} px-3 py-2 ${tokens.borders.radius.md} hover:bg-emerald-900/30 border ${colors.semantic.success.border} transition-colors`}>
                    <input
                      type="checkbox"
                      checked={isBLS}
                      onChange={(e) => setIsBLS(e.target.checked)}
                      className="w-4 h-4 rounded border-emerald-600 bg-gray-800 text-emerald-600 focus:ring-2 focus:ring-emerald-500"
                    />
                    <span className={`${tokens.typography.body.secondary} font-semibold ${colors.semantic.success.text}`}>
                      BLS
                    </span>
                  </label>
                  <label className={`flex items-center ${tokens.spacing.gap.sm} cursor-pointer ${colors.semantic.info.light} px-3 py-2 ${tokens.borders.radius.md} hover:bg-cyan-900/30 border ${colors.semantic.info.border} transition-colors`}>
                    <input
                      type="checkbox"
                      checked={isALS}
                      onChange={(e) => setIsALS(e.target.checked)}
                      className="w-4 h-4 rounded border-cyan-600 bg-gray-800 text-cyan-600 focus:ring-2 focus:ring-cyan-500"
                    />
                    <span className={`${tokens.typography.body.secondary} font-semibold ${colors.semantic.info.text}`}>
                      ALS
                    </span>
                  </label>
                </div>
              </div>
            </div>
          )}

          <div className={`flex ${tokens.spacing.gap.md} pt-2 border-t ${colors.structural.border.default}`}>
            <button
              type="button"
              onClick={onClose}
              className={`flex-1 ${colors.components.button.secondary} font-bold py-3 ${tokens.borders.radius.md} focus-ring`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className={`flex-1 ${colors.semantic.success.gradient} ${colors.semantic.success.hover} text-white font-bold py-3 ${tokens.borders.radius.md} transition-colors ${colors.semantic.success.shadow} focus-ring flex items-center justify-center ${tokens.spacing.gap.sm} disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <UserPlus size={20} />
              Add Member
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
