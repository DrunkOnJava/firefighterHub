/**
 * QuickAddFirefighterModal - Quick Add Modal
 *
 * Modal for quickly adding a firefighter to the current shift.
 * Automatically switches between MaterialM and legacy styling based on feature flag.
 *
 * @example
 * ```tsx
 * <QuickAddFirefighterModal
 *   isOpen={isOpen}
 *   currentShift={currentShift}
 *   onClose={handleClose}
 *   onAdd={handleAddFirefighter}
 * />
 * ```
 */

import { ChevronDown, ChevronUp, UserPlus } from "lucide-react";
import { useEffect, useState } from "react";
import { useFeatureFlag } from "../hooks/useFeatureFlag";
import { useFocusReturn } from "../hooks/useFocusReturn";
import { useFocusTrap } from "../hooks/useFocusTrap";
import { Shift } from "../lib/supabase";
import { DialogM3 } from "./m3/DialogM3";
import { ButtonM3 } from "./m3/ButtonM3";
import { InputM3, SelectM3, CheckboxM3, FormGroupM3 } from "./m3/InputM3";
import { BadgeM3 } from "./m3/BadgeM3";
import { QuickAddFirefighterModalLegacy } from "./QuickAddFirefighterModalLegacy";

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

/**
 * MaterialM Quick Add Modal
 */
function QuickAddFirefighterModalM3({
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

  const certificationOptions = [
    { value: "", label: "Not specified" },
    { value: "EMT", label: "EMT" },
    { value: "EMT-A", label: "EMT-A" },
    { value: "EMT-I", label: "EMT-I" },
    { value: "Paramedic", label: "Paramedic" },
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
    <DialogM3 show={isOpen} onClose={onClose} size="xl">
      {/* Custom Header */}
      <div
        ref={trapRef}
        className="p-6 border-b border-materialm-border dark:border-materialm-border-dark bg-materialm-success-light dark:bg-materialm-success-light"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-materialm-success">
            <UserPlus className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Add Team Member
            </h2>
            <p className="text-sm text-emerald-700 dark:text-emerald-300 mt-1">
              Shift {currentShift}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <DialogM3.Body>
          <div className="space-y-6">
            {/* Basic Information */}
            <FormGroupM3 title="Basic Information">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputM3
                  label="Name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) validateName(e.target.value);
                  }}
                  onBlur={(e) => validateName(e.target.value)}
                  placeholder="Enter firefighter name"
                  required
                  autoFocus
                  error={errors.name}
                />

                <InputM3
                  label="Station Number"
                  value={station}
                  onChange={(e) => setStation(e.target.value)}
                  placeholder="e.g., 1"
                />
              </div>

              <SelectM3
                label="Certification Level"
                value={certificationLevel}
                onChange={(e) => setCertificationLevel(e.target.value)}
                options={certificationOptions}
              />
            </FormGroupM3>

            {/* Advanced Options Toggle */}
            <div>
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center justify-between w-full p-4 rounded-lg border-2 border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 transition-colors bg-gray-50 dark:bg-materialm-dark"
              >
                <div className="flex items-center gap-3">
                  {showAdvanced ? (
                    <ChevronUp className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  )}
                  <div className="text-left">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      Advanced Options
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Apparatus clearances and certifications
                    </p>
                  </div>
                </div>
                {hasAnyAdvancedData && (
                  <BadgeM3 color="info" size="xs">
                    {
                      [
                        apparatusAmbulance,
                        apparatusBrushTruck,
                        apparatusEngine,
                        apparatusTanker,
                        apparatusTruck,
                        apparatusBoat,
                        apparatusUtv,
                        apparatusRescueSquad,
                        isFTO,
                        isBLS,
                        isALS,
                      ].filter(Boolean).length
                    }{" "}
                    selected
                  </BadgeM3>
                )}
              </button>

              {showAdvanced && (
                <div className="mt-4 space-y-6 p-4 border-2 border-materialm-border dark:border-materialm-border-dark rounded-lg bg-white dark:bg-materialm-dark">
                  {/* Apparatus Clearances */}
                  <FormGroupM3 title="Apparatus Clearances">
                    <div className="grid grid-cols-2 gap-3">
                      <CheckboxM3
                        label="Ambulance"
                        checked={apparatusAmbulance}
                        onChange={(e) => setApparatusAmbulance(e.target.checked)}
                      />
                      <CheckboxM3
                        label="Brush Truck"
                        checked={apparatusBrushTruck}
                        onChange={(e) => setApparatusBrushTruck(e.target.checked)}
                      />
                      <CheckboxM3
                        label="Engine"
                        checked={apparatusEngine}
                        onChange={(e) => setApparatusEngine(e.target.checked)}
                      />
                      <CheckboxM3
                        label="Tanker"
                        checked={apparatusTanker}
                        onChange={(e) => setApparatusTanker(e.target.checked)}
                      />
                      <CheckboxM3
                        label="Truck"
                        checked={apparatusTruck}
                        onChange={(e) => setApparatusTruck(e.target.checked)}
                      />
                      <CheckboxM3
                        label="Boat"
                        checked={apparatusBoat}
                        onChange={(e) => setApparatusBoat(e.target.checked)}
                      />
                      <CheckboxM3
                        label="UTV"
                        checked={apparatusUtv}
                        onChange={(e) => setApparatusUtv(e.target.checked)}
                      />
                      <CheckboxM3
                        label="Rescue Squad"
                        checked={apparatusRescueSquad}
                        onChange={(e) => setApparatusRescueSquad(e.target.checked)}
                      />
                    </div>
                  </FormGroupM3>

                  {/* Certifications */}
                  <FormGroupM3 title="Additional Certifications">
                    <div className="space-y-2">
                      <CheckboxM3
                        label="Field Training Officer (FTO)"
                        checked={isFTO}
                        onChange={(e) => setIsFTO(e.target.checked)}
                      />
                      <CheckboxM3
                        label="Basic Life Support (BLS)"
                        checked={isBLS}
                        onChange={(e) => setIsBLS(e.target.checked)}
                      />
                      <CheckboxM3
                        label="Advanced Life Support (ALS)"
                        checked={isALS}
                        onChange={(e) => setIsALS(e.target.checked)}
                      />
                    </div>
                  </FormGroupM3>
                </div>
              )}
            </div>
          </div>
        </DialogM3.Body>

        <DialogM3.Footer>
          <ButtonM3 variant="outlined" color="neutral" onClick={onClose} type="button">
            Cancel
          </ButtonM3>
          <ButtonM3
            color="success"
            startIcon={<UserPlus size={20} />}
            type="submit"
            disabled={!name.trim()}
            className="shadow-materialm-2"
          >
            Add Member
          </ButtonM3>
        </DialogM3.Footer>
      </form>
    </DialogM3>
  );
}

/**
 * Quick Add Firefighter Modal Component with Feature Flag
 *
 * Switches between MaterialM and legacy versions.
 */
export function QuickAddFirefighterModal(props: QuickAddFirefighterModalProps) {
  const useMaterialM = useFeatureFlag('MATERIALM');

  if (!useMaterialM) {
    return <QuickAddFirefighterModalLegacy {...props} />;
  }

  return <QuickAddFirefighterModalM3 {...props} />;
}
