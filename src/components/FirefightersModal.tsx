import { useEffect, useState } from 'react';
import { X, Users, Edit2, Save, XCircle } from 'lucide-react';
import { Firefighter, CertificationLevel, Shift, supabase } from '../lib/supabase';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { useFocusReturn } from '../hooks/useFocusReturn';
import { ShiftBadge } from './ShiftSelector';

interface FirefightersModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
  isAdminMode?: boolean;
}

interface EditingProfile extends Firefighter {
  isEditing: boolean;
}

export function FirefightersModal({ isOpen, onClose, onUpdate, isAdminMode = false }: FirefightersModalProps) {
  const [allFirefighters, setAllFirefighters] = useState<EditingProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterShift, setFilterShift] = useState<Shift | 'ALL'>('ALL');
  const trapRef = useFocusTrap(isOpen);
  useFocusReturn(isOpen);

  useEffect(() => {
    if (isOpen) {
      loadAllFirefighters();
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

  async function loadAllFirefighters() {
    try {
      const { data, error } = await supabase
        .from('firefighters')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      setAllFirefighters((data || []).map(ff => ({ ...ff, isEditing: false })));
    } catch (error) {
      console.error('Error loading firefighters:', error);
    } finally {
      setLoading(false);
    }
  }

  function toggleEdit(id: string) {
    setAllFirefighters(prev =>
      prev.map(ff => (ff.id === id ? { ...ff, isEditing: !ff.isEditing } : ff))
    );
  }

  function updateField<K extends keyof Firefighter>(id: string, field: K, value: Firefighter[K]) {
    setAllFirefighters(prev =>
      prev.map(ff => (ff.id === id ? { ...ff, [field]: value } : ff))
    );
  }

  async function saveProfile(firefighter: EditingProfile) {
    try {
      const { error } = await supabase
        .from('firefighters')
        .update({
          name: firefighter.name,
          fire_station: firefighter.fire_station,
          shift: firefighter.shift,
          certification_level: firefighter.certification_level,
          apparatus_ambulance: firefighter.apparatus_ambulance,
          apparatus_brush_truck: firefighter.apparatus_brush_truck,
          apparatus_engine: firefighter.apparatus_engine,
          apparatus_tanker: firefighter.apparatus_tanker,
          apparatus_truck: firefighter.apparatus_truck,
          apparatus_boat: firefighter.apparatus_boat,
          apparatus_utv: firefighter.apparatus_utv,
          apparatus_rescue_squad: firefighter.apparatus_rescue_squad,
          is_fto: firefighter.is_fto,
          is_bls: firefighter.is_bls,
          is_als: firefighter.is_als,
          updated_at: new Date().toISOString()
        })
        .eq('id', firefighter.id);

      if (error) throw error;

      toggleEdit(firefighter.id);
      onUpdate();
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to save profile. Please try again.');
    }
  }

  function parseNameForSorting(name: string): { lastName: string; firstName: string; fullName: string } {
    const parts = name.trim().split(/\s+/);
    if (parts.length === 0) {
      return { lastName: '', firstName: '', fullName: name };
    }
    if (parts.length === 1) {
      return { lastName: parts[0], firstName: '', fullName: name };
    }
    const lastName = parts[parts.length - 1];
    const firstName = parts.slice(0, -1).join(' ');
    return { lastName, firstName, fullName: name };
  }

  function formatNameLastFirst(name: string): string {
    const { lastName, firstName } = parseNameForSorting(name);
    if (!firstName) return lastName;
    return `${lastName}, ${firstName}`;
  }

  const filteredAndSortedFirefighters = (filterShift === 'ALL'
    ? allFirefighters
    : allFirefighters.filter(ff => ff.shift === filterShift)
  ).sort((a, b) => {
    const aLastName = parseNameForSorting(a.name).lastName.toLowerCase();
    const bLastName = parseNameForSorting(b.name).lastName.toLowerCase();
    return aLastName.localeCompare(bLastName);
  });

  if (!isOpen) return null;

  const certificationLevels: (CertificationLevel | '')[] = ['', 'EMT', 'EMT-A', 'EMT-I', 'Paramedic'];
  const shifts: Shift[] = ['A', 'B', 'C'];

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="firefighters-modal-title"
    >
      <div
        ref={trapRef}
        className="bg-gradient-to-br from-gray-800 to-gray-850 border-2 border-gray-700 rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden shadow-2xl animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 border-b-2 border-gray-700 p-6 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-3 rounded-xl">
              <Users className="text-white" size={24} />
            </div>
            <div>
              <h2 id="firefighters-modal-title" className="text-2xl font-bold text-white">All Firefighters</h2>
              <p className="text-sm text-gray-400">Manage profiles and certifications</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors focus-ring"
            aria-label="Close firefighters dialog"
          >
            <X size={24} className="text-gray-400" />
          </button>
        </div>

        <div className="p-6 border-b border-gray-700">
          <div className="flex gap-2">
            <button
              onClick={() => setFilterShift('ALL')}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                filterShift === 'ALL'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              All Shifts
            </button>
            {shifts.map(shift => (
              <button
                key={shift}
                onClick={() => setFilterShift(shift)}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  filterShift === shift
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                Shift {shift}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-180px)] p-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-400">Loading firefighters...</p>
            </div>
          ) : filteredAndSortedFirefighters.length === 0 ? (
            <div className="text-center py-12">
              <Users size={48} className="text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">No firefighters found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAndSortedFirefighters.map(firefighter => (
                <div
                  key={firefighter.id}
                  className="bg-gray-900/50 border border-gray-700 rounded-lg p-6 hover:bg-gray-900/70 transition-colors"
                >
                  {firefighter.isEditing ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between mb-4">
                        <input
                          type="text"
                          value={firefighter.name}
                          onChange={(e) => updateField(firefighter.id, 'name', e.target.value)}
                          className="text-xl font-bold bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white w-full max-w-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => saveProfile(firefighter)}
                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg flex items-center gap-2 font-semibold transition-colors"
                          >
                            <Save size={18} />
                            Save
                          </button>
                          <button
                            onClick={() => toggleEdit(firefighter.id)}
                            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg flex items-center gap-2 font-semibold transition-colors"
                          >
                            <XCircle size={18} />
                            Cancel
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="text-sm font-semibold text-gray-400 mb-2 block">Shift</label>
                          <select
                            value={firefighter.shift}
                            onChange={(e) => updateField(firefighter.id, 'shift', e.target.value as Shift)}
                            className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            {shifts.map(shift => (
                              <option key={shift} value={shift}>Shift {shift}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="text-sm font-semibold text-gray-400 mb-2 block">Station Number</label>
                          <input
                            type="text"
                            value={firefighter.fire_station || ''}
                            onChange={(e) => updateField(firefighter.id, 'fire_station', e.target.value || null)}
                            className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g., 1"
                          />
                        </div>

                        <div>
                          <label className="text-sm font-semibold text-gray-400 mb-2 block">Certification Level</label>
                          <select
                            value={firefighter.certification_level || ''}
                            onChange={(e) => updateField(firefighter.id, 'certification_level', e.target.value || null)}
                            className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="">Not specified</option>
                            {certificationLevels.slice(1).map(level => (
                              <option key={level} value={level}>{level}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-semibold text-gray-400 mb-3 block">Apparatus Clearances</label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {[
                            { key: 'apparatus_ambulance', label: 'Ambulance' },
                            { key: 'apparatus_brush_truck', label: 'Brush Truck' },
                            { key: 'apparatus_engine', label: 'Engine' },
                            { key: 'apparatus_tanker', label: 'Tanker' },
                            { key: 'apparatus_truck', label: 'Truck' },
                            { key: 'apparatus_boat', label: 'Boat' },
                            { key: 'apparatus_utv', label: 'UTV' },
                            { key: 'apparatus_rescue_squad', label: 'Rescue Squad' }
                          ].map(apparatus => (
                            <label key={apparatus.key} className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={firefighter[apparatus.key as keyof Firefighter] as boolean || false}
                                onChange={(e) => updateField(firefighter.id, apparatus.key as keyof Firefighter, e.target.checked)}
                                className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-blue-600 focus:ring-2 focus:ring-blue-500"
                              />
                              <span className="text-sm text-gray-300">{apparatus.label}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-semibold text-gray-400 mb-3 block">Certifications & Roles</label>
                        <div className="grid grid-cols-3 gap-3">
                          <label className="flex items-center gap-2 cursor-pointer bg-amber-900/20 px-3 py-2 rounded-lg hover:bg-amber-900/30 border border-amber-700/50 transition-colors">
                            <input
                              type="checkbox"
                              checked={firefighter.is_fto || false}
                              onChange={(e) => updateField(firefighter.id, 'is_fto', e.target.checked)}
                              className="w-4 h-4 rounded border-amber-600 bg-gray-800 text-amber-600 focus:ring-2 focus:ring-amber-500"
                            />
                            <span className="text-sm font-semibold text-amber-300">FTO</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer bg-emerald-900/20 px-3 py-2 rounded-lg hover:bg-emerald-900/30 border border-emerald-700/50 transition-colors">
                            <input
                              type="checkbox"
                              checked={firefighter.is_bls || false}
                              onChange={(e) => updateField(firefighter.id, 'is_bls', e.target.checked)}
                              className="w-4 h-4 rounded border-emerald-600 bg-gray-800 text-emerald-600 focus:ring-2 focus:ring-emerald-500"
                            />
                            <span className="text-sm font-semibold text-emerald-300">BLS</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer bg-cyan-900/20 px-3 py-2 rounded-lg hover:bg-cyan-900/30 border border-cyan-700/50 transition-colors">
                            <input
                              type="checkbox"
                              checked={firefighter.is_als || false}
                              onChange={(e) => updateField(firefighter.id, 'is_als', e.target.checked)}
                              className="w-4 h-4 rounded border-cyan-600 bg-gray-800 text-cyan-600 focus:ring-2 focus:ring-cyan-500"
                            />
                            <span className="text-sm font-semibold text-cyan-300">ALS</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <h3 className="text-xl font-bold text-white">{formatNameLastFirst(firefighter.name)}</h3>
                          <ShiftBadge shift={firefighter.shift} />
                          {firefighter.fire_station && (
                            <span className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-sm font-semibold">
                              Station #{firefighter.fire_station}
                            </span>
                          )}
                        </div>
                        {isAdminMode && (
                          <button
                            onClick={() => toggleEdit(firefighter.id)}
                            className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-lg flex items-center gap-2 font-semibold transition-colors"
                          >
                            <Edit2 size={18} />
                            Edit
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <span className="text-sm font-semibold text-gray-400">Certification:</span>
                          <span className="ml-2 text-gray-200">
                            {firefighter.certification_level || 'Not specified'}
                          </span>
                        </div>
                      </div>

                      {(firefighter.is_fto || firefighter.is_bls || firefighter.is_als) && (
                        <div className="mb-4">
                          <span className="text-sm font-semibold text-gray-400 block mb-2">Certifications & Roles:</span>
                          <div className="flex flex-wrap gap-2">
                            {firefighter.is_fto && (
                              <span className="px-3 py-1 bg-amber-900/30 text-amber-300 border border-amber-700/50 rounded-md text-xs font-bold">
                                FTO
                              </span>
                            )}
                            {firefighter.is_bls && (
                              <span className="px-3 py-1 bg-emerald-900/30 text-emerald-300 border border-emerald-700/50 rounded-md text-xs font-bold">
                                BLS
                              </span>
                            )}
                            {firefighter.is_als && (
                              <span className="px-3 py-1 bg-cyan-900/30 text-cyan-300 border border-cyan-700/50 rounded-md text-xs font-bold">
                                ALS
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      <div>
                        <span className="text-sm font-semibold text-gray-400 block mb-2">Apparatus Clearances:</span>
                        <div className="flex flex-wrap gap-2">
                          {[
                            { key: 'apparatus_ambulance', label: 'Ambulance' },
                            { key: 'apparatus_brush_truck', label: 'Brush Truck' },
                            { key: 'apparatus_engine', label: 'Engine' },
                            { key: 'apparatus_tanker', label: 'Tanker' },
                            { key: 'apparatus_truck', label: 'Truck' },
                            { key: 'apparatus_boat', label: 'Boat' },
                            { key: 'apparatus_utv', label: 'UTV' },
                            { key: 'apparatus_rescue_squad', label: 'Rescue Squad' }
                          ].filter(apparatus => firefighter[apparatus.key as keyof Firefighter])
                            .map(apparatus => (
                              <span
                                key={apparatus.key}
                                className="px-3 py-1 bg-amber-950/70 text-amber-300 border border-amber-800 rounded-full text-xs font-semibold"
                              >
                                {apparatus.label}
                              </span>
                            ))}
                          {![
                            'apparatus_ambulance',
                            'apparatus_brush_truck',
                            'apparatus_engine',
                            'apparatus_tanker',
                            'apparatus_truck',
                            'apparatus_boat',
                            'apparatus_utv',
                            'apparatus_rescue_squad'
                          ].some(key => firefighter[key as keyof Firefighter]) && (
                            <span className="text-sm text-gray-500">None specified</span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
