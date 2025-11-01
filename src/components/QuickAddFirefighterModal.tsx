import { useState, useEffect } from 'react';
import { X, UserPlus, ChevronDown, ChevronUp } from 'lucide-react';
import { Shift } from '../lib/supabase';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { useFocusReturn } from '../hooks/useFocusReturn';

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
  onAdd
}: QuickAddFirefighterModalProps) {
  const [name, setName] = useState('');
  const [station, setStation] = useState('');
  const [certificationLevel, setCertificationLevel] = useState<string>('');
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
  const [errors, setErrors] = useState({ name: '' });
  const trapRef = useFocusTrap(isOpen);
  useFocusReturn(isOpen);

  const resetForm = () => {
    setName('');
    setStation('');
    setCertificationLevel('');
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
    setErrors({ name: '' });
  };

  useEffect(() => {
    if (isOpen) {
      resetForm();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const validateName = (value: string): boolean => {
    if (!value.trim()) {
      setErrors(prev => ({ ...prev, name: 'Name is required' }));
      return false;
    }
    if (value.trim().length < 2) {
      setErrors(prev => ({ ...prev, name: 'Name must be at least 2 characters' }));
      return false;
    }
    setErrors(prev => ({ ...prev, name: '' }));
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
          rescueSquad: apparatusRescueSquad
        },
        {
          isFTO,
          isBLS,
          isALS
        }
      );
      onClose();
    }
  }

  if (!isOpen) return null;

  const certificationLevels: string[] = ['', 'EMT', 'EMT-A', 'EMT-I', 'Paramedic'];
  const hasAnyAdvancedData = apparatusAmbulance || apparatusBrushTruck || apparatusEngine ||
    apparatusTanker || apparatusTruck || apparatusBoat || apparatusUtv || apparatusRescueSquad ||
    isFTO || isBLS || isALS;

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
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
        className="bg-gradient-to-br from-gray-800 to-gray-850 border-2 border-gray-700 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gradient-to-r from-green-900/90 to-green-800/90 border-b-2 border-green-700 px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <UserPlus className="text-green-400" size={28} />
            <div>
              <h2 id="quick-add-title" className="text-2xl font-bold text-white">
                Add Team Member
              </h2>
              <p className="text-sm text-green-200 mt-1">
                Shift {currentShift}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors focus-ring"
            aria-label="Close dialog"
          >
            <X size={24} className="text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="quick-firefighter-name" className="block text-sm font-semibold text-gray-300 mb-2">
                Name <span className="text-red-400">*</span>
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
                aria-describedby={errors.name ? 'quick-name-error' : undefined}
                className={`w-full px-4 py-3 bg-gray-900 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-all ${
                  errors.name
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-600 focus:ring-green-500 focus:border-transparent'
                }`}
              />
              {errors.name && (
                <p id="quick-name-error" className="text-red-400 text-xs mt-1" role="alert">
                  {errors.name}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="quick-firefighter-station" className="block text-sm font-semibold text-gray-300 mb-2">
                Station Number
              </label>
              <input
                id="quick-firefighter-station"
                type="text"
                value={station}
                onChange={(e) => setStation(e.target.value)}
                placeholder="e.g., 1"
                className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div>
            <label htmlFor="quick-firefighter-certification" className="block text-sm font-semibold text-gray-300 mb-2">
              Certification Level
            </label>
            <select
              id="quick-firefighter-certification"
              value={certificationLevel}
              onChange={(e) => setCertificationLevel(e.target.value)}
              className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            >
              <option value="">Not specified</option>
              {certificationLevels.slice(1).map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="w-full flex items-center justify-between px-4 py-3 bg-gray-900/50 hover:bg-gray-900 rounded-lg border border-gray-700 transition-all focus-ring"
            aria-expanded={showAdvanced}
            aria-controls="advanced-options"
          >
            <span className="text-sm font-semibold text-gray-300">
              Advanced Options {hasAnyAdvancedData && !showAdvanced && (
                <span className="ml-2 text-xs text-green-400">(configured)</span>
              )}
            </span>
            {showAdvanced ? (
              <ChevronUp className="text-gray-400" size={20} />
            ) : (
              <ChevronDown className="text-gray-400" size={20} />
            )}
          </button>

          {showAdvanced && (
            <div id="advanced-options" className="space-y-5 pl-2 border-l-2 border-green-600">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-3">
                  Apparatus Clearances
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <label className="flex items-center gap-2 cursor-pointer bg-gray-900/50 px-3 py-2 rounded-lg hover:bg-gray-900 transition-colors">
                    <input
                      type="checkbox"
                      checked={apparatusAmbulance}
                      onChange={(e) => setApparatusAmbulance(e.target.checked)}
                      className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-green-600 focus:ring-2 focus:ring-green-500"
                    />
                    <span className="text-sm text-gray-300">Ambulance</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer bg-gray-900/50 px-3 py-2 rounded-lg hover:bg-gray-900 transition-colors">
                    <input
                      type="checkbox"
                      checked={apparatusBrushTruck}
                      onChange={(e) => setApparatusBrushTruck(e.target.checked)}
                      className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-green-600 focus:ring-2 focus:ring-green-500"
                    />
                    <span className="text-sm text-gray-300">Brush Truck</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer bg-gray-900/50 px-3 py-2 rounded-lg hover:bg-gray-900 transition-colors">
                    <input
                      type="checkbox"
                      checked={apparatusEngine}
                      onChange={(e) => setApparatusEngine(e.target.checked)}
                      className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-green-600 focus:ring-2 focus:ring-green-500"
                    />
                    <span className="text-sm text-gray-300">Engine</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer bg-gray-900/50 px-3 py-2 rounded-lg hover:bg-gray-900 transition-colors">
                    <input
                      type="checkbox"
                      checked={apparatusTanker}
                      onChange={(e) => setApparatusTanker(e.target.checked)}
                      className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-green-600 focus:ring-2 focus:ring-green-500"
                    />
                    <span className="text-sm text-gray-300">Tanker</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer bg-gray-900/50 px-3 py-2 rounded-lg hover:bg-gray-900 transition-colors">
                    <input
                      type="checkbox"
                      checked={apparatusTruck}
                      onChange={(e) => setApparatusTruck(e.target.checked)}
                      className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-green-600 focus:ring-2 focus:ring-green-500"
                    />
                    <span className="text-sm text-gray-300">Truck</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer bg-gray-900/50 px-3 py-2 rounded-lg hover:bg-gray-900 transition-colors">
                    <input
                      type="checkbox"
                      checked={apparatusBoat}
                      onChange={(e) => setApparatusBoat(e.target.checked)}
                      className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-green-600 focus:ring-2 focus:ring-green-500"
                    />
                    <span className="text-sm text-gray-300">Boat</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer bg-gray-900/50 px-3 py-2 rounded-lg hover:bg-gray-900 transition-colors">
                    <input
                      type="checkbox"
                      checked={apparatusUtv}
                      onChange={(e) => setApparatusUtv(e.target.checked)}
                      className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-green-600 focus:ring-2 focus:ring-green-500"
                    />
                    <span className="text-sm text-gray-300">UTV</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer bg-gray-900/50 px-3 py-2 rounded-lg hover:bg-gray-900 transition-colors">
                    <input
                      type="checkbox"
                      checked={apparatusRescueSquad}
                      onChange={(e) => setApparatusRescueSquad(e.target.checked)}
                      className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-green-600 focus:ring-2 focus:ring-green-500"
                    />
                    <span className="text-sm text-gray-300">Rescue Squad</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-3">
                  Certifications & Roles
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <label className="flex items-center gap-2 cursor-pointer bg-amber-900/20 px-3 py-2 rounded-lg hover:bg-amber-900/30 border border-amber-700/50 transition-colors">
                    <input
                      type="checkbox"
                      checked={isFTO}
                      onChange={(e) => setIsFTO(e.target.checked)}
                      className="w-4 h-4 rounded border-amber-600 bg-gray-800 text-amber-600 focus:ring-2 focus:ring-amber-500"
                    />
                    <span className="text-sm font-semibold text-amber-300">FTO</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer bg-emerald-900/20 px-3 py-2 rounded-lg hover:bg-emerald-900/30 border border-emerald-700/50 transition-colors">
                    <input
                      type="checkbox"
                      checked={isBLS}
                      onChange={(e) => setIsBLS(e.target.checked)}
                      className="w-4 h-4 rounded border-emerald-600 bg-gray-800 text-emerald-600 focus:ring-2 focus:ring-emerald-500"
                    />
                    <span className="text-sm font-semibold text-emerald-300">BLS</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer bg-cyan-900/20 px-3 py-2 rounded-lg hover:bg-cyan-900/30 border border-cyan-700/50 transition-colors">
                    <input
                      type="checkbox"
                      checked={isALS}
                      onChange={(e) => setIsALS(e.target.checked)}
                      className="w-4 h-4 rounded border-cyan-600 bg-gray-800 text-cyan-600 focus:ring-2 focus:ring-cyan-500"
                    />
                    <span className="text-sm font-semibold text-cyan-300">ALS</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-2 border-t border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 rounded-lg transition-colors focus-ring"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white font-bold py-3 rounded-lg transition-colors shadow-lg focus-ring flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
