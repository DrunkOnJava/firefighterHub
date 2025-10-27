import { useEffect, useState, useCallback } from 'react';
import { X, User, Calendar, Building2, Award, Truck, Shield, Clock, Flame, Ship, Mountain, Edit, Save } from 'lucide-react';
import { Firefighter, supabase, Shift } from '../lib/supabase';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { useFocusReturn } from '../hooks/useFocusReturn';
import { ShiftBadge } from './ShiftSelector';

interface HoldRecord {
  id: string;
  hold_date: string;
  fire_station: string | null;
  status: string;
  completed_at: string | null;
  created_at: string;
}

interface FirefighterProfileModalProps {
  isOpen: boolean;
  firefighter: Firefighter | null;
  onClose: () => void;
  isAdminMode?: boolean;
}

export function FirefighterProfileModal({
  isOpen,
  firefighter,
  onClose,
  isAdminMode = false
}: FirefighterProfileModalProps) {
  const [holdRecords, setHoldRecords] = useState<HoldRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedFirefighter, setEditedFirefighter] = useState<Firefighter | null>(null);
  const [showAllHolds, setShowAllHolds] = useState(false);
  const [selectedHoldForDetail, setSelectedHoldForDetail] = useState<HoldRecord | null>(null);
  const trapRef = useFocusTrap(isOpen);
  useFocusReturn(isOpen);

  useEffect(() => {
    if (isOpen && firefighter) {
      loadHoldHistory();
      setEditedFirefighter({...firefighter});
      setIsEditMode(false);
      setShowAllHolds(false);
      setSelectedHoldForDetail(null);
    }
  }, [isOpen, firefighter, loadHoldHistory]);

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

  const loadHoldHistory = useCallback(async () => {
    if (!firefighter) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('scheduled_holds')
        .select('id, hold_date, fire_station, status, completed_at, created_at')
        .eq('firefighter_id', firefighter.id)
        .order('hold_date', { ascending: false });

      if (error) throw error;
      setHoldRecords(data || []);
    } catch (error) {
      console.error('Error loading hold history:', error);
      setHoldRecords([]);
    } finally {
      setLoading(false);
    }
  }, [firefighter]);

  async function handleSave() {
    if (!editedFirefighter || !firefighter) return;

    try {
      const { error } = await supabase
        .from('firefighters')
        .update({
          name: editedFirefighter.name,
          fire_station: editedFirefighter.fire_station,
          shift: editedFirefighter.shift,
          certification_level: editedFirefighter.certification_level,
          apparatus_ambulance: editedFirefighter.apparatus_ambulance,
          apparatus_engine: editedFirefighter.apparatus_engine,
          apparatus_truck: editedFirefighter.apparatus_truck,
          apparatus_tanker: editedFirefighter.apparatus_tanker,
          apparatus_brush_truck: editedFirefighter.apparatus_brush_truck,
          apparatus_boat: editedFirefighter.apparatus_boat,
          apparatus_utv: editedFirefighter.apparatus_utv,
          apparatus_rescue_squad: editedFirefighter.apparatus_rescue_squad,
          is_fto: editedFirefighter.is_fto,
          is_bls: editedFirefighter.is_bls,
          is_als: editedFirefighter.is_als,
        })
        .eq('id', firefighter.id);

      if (error) throw error;

      setIsEditMode(false);
      onClose();
      // Real-time subscription will update the data automatically
    } catch (error) {
      console.error('Error saving firefighter:', error);
      alert('Failed to save changes. Please try again.');
    }
  }

  if (!isOpen || !firefighter || !editedFirefighter) return null;

  const completedHolds = holdRecords.filter(h => h.status === 'completed').length;
  const scheduledHolds = holdRecords.filter(h => h.status === 'scheduled').length;

  const apparatusTypes = [
    { name: 'Ambulance', key: 'apparatus_ambulance' as const, Icon: Shield },
    { name: 'Engine', key: 'apparatus_engine' as const, Icon: Flame },
    { name: 'Truck', key: 'apparatus_truck' as const, Icon: Truck },
    { name: 'Tanker', key: 'apparatus_tanker' as const, Icon: Truck },
    { name: 'Brush Truck', key: 'apparatus_brush_truck' as const, Icon: Mountain },
    { name: 'Boat', key: 'apparatus_boat' as const, Icon: Ship },
    { name: 'UTV', key: 'apparatus_utv' as const, Icon: Mountain },
    { name: 'Rescue Squad', key: 'apparatus_rescue_squad' as const, Icon: Shield }
  ];

  const apparatusList = apparatusTypes.filter(item => firefighter[item.key]);

  const qualifications = [
    firefighter.is_fto && { label: 'FTO', color: 'amber' },
    firefighter.is_bls && { label: 'BLS', color: 'emerald' },
    firefighter.is_als && { label: 'ALS', color: 'cyan' }
  ].filter(Boolean) as { label: string; color: string }[];

  return (
    <div
      className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="profile-modal-title"
    >
      <div
        ref={trapRef}
        className="bg-gradient-to-br from-gray-800 to-gray-850 border-2 border-gray-700 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 border-b-2 border-gray-700 p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-xl">
              <User className="text-white" size={24} />
            </div>
            <div>
              {isEditMode ? (
                <input
                  type="text"
                  value={editedFirefighter.name}
                  onChange={(e) => setEditedFirefighter({...editedFirefighter, name: e.target.value})}
                  className="text-2xl font-bold bg-gray-700 text-white px-3 py-1 rounded-lg border-2 border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Firefighter name"
                />
              ) : (
                <h2 id="profile-modal-title" className="text-2xl font-bold text-white">
                  {firefighter.name}
                </h2>
              )}
              <p className="text-sm text-gray-400">Firefighter Profile</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isAdminMode && (
              <button
                onClick={() => {
                  if (isEditMode) {
                    handleSave();
                  } else {
                    setIsEditMode(true);
                  }
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  isEditMode
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-orange-600 hover:bg-orange-700 text-white'
                }`}
                aria-label={isEditMode ? 'Save changes' : 'Edit profile'}
              >
                {isEditMode ? (
                  <>
                    <Save size={18} />
                    Save
                  </>
                ) : (
                  <>
                    <Edit size={18} />
                    Edit
                  </>
                )}
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors focus-ring"
              aria-label="Close profile dialog"
            >
              <X size={24} className="text-gray-400" />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Calendar size={16} className="text-blue-400" />
                <span className="text-xs font-semibold text-gray-400 uppercase">Shift</span>
              </div>
              {isEditMode ? (
                <select
                  value={editedFirefighter.shift}
                  onChange={(e) => setEditedFirefighter({...editedFirefighter, shift: e.target.value as Shift})}
                  className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border-2 border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
                >
                  <option value="A">Shift A</option>
                  <option value="B">Shift B</option>
                  <option value="C">Shift C</option>
                </select>
              ) : (
                <ShiftBadge shift={firefighter.shift} />
              )}
            </div>

            <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Building2 size={16} className="text-orange-400" />
                <span className="text-xs font-semibold text-gray-400 uppercase">Station</span>
              </div>
              {isEditMode ? (
                <input
                  type="text"
                  value={editedFirefighter.fire_station || ''}
                  onChange={(e) => setEditedFirefighter({...editedFirefighter, fire_station: e.target.value})}
                  className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border-2 border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500 text-lg font-bold"
                  placeholder="Station #"
                />
              ) : (
                <p className="text-lg font-bold text-white">
                  {firefighter.fire_station ? `#${firefighter.fire_station}` : 'Not assigned'}
                </p>
              )}
            </div>

            <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock size={16} className="text-emerald-400" />
                <span className="text-xs font-semibold text-gray-400 uppercase">Last Hold</span>
              </div>
              <p className="text-sm font-semibold text-white">
                {firefighter.last_hold_date
                  ? new Date(firefighter.last_hold_date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      timeZone: 'UTC'
                    })
                  : 'Never'}
              </p>
            </div>

            <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Award size={16} className="text-amber-400" />
                <span className="text-xs font-semibold text-gray-400 uppercase">Cert Level</span>
              </div>
              {isEditMode ? (
                <select
                  value={editedFirefighter.certification_level || ''}
                  onChange={(e) => setEditedFirefighter({...editedFirefighter, certification_level: e.target.value || null})}
                  className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border-2 border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500 font-bold text-sm"
                >
                  <option value="">None</option>
                  <option value="EMT">EMT</option>
                  <option value="EMT-A">EMT-A</option>
                  <option value="EMT-I">EMT-I</option>
                  <option value="Paramedic">Paramedic</option>
                </select>
              ) : (
                <p className="text-sm font-bold text-amber-100">
                  {firefighter.certification_level || 'None'}
                </p>
              )}
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Shield size={16} className="text-sky-400" />
              <h3 className="text-sm font-bold text-gray-300 uppercase">Qualifications</h3>
            </div>
            {isEditMode ? (
              <div className="space-y-2">
                <label className="flex items-center gap-3 bg-gray-900/50 border border-gray-700 rounded-lg px-3 py-2 cursor-pointer hover:bg-gray-800/50 transition-colors">
                  <input
                    type="checkbox"
                    checked={editedFirefighter.is_fto || false}
                    onChange={(e) => setEditedFirefighter({...editedFirefighter, is_fto: e.target.checked})}
                    className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-amber-500 focus:ring-2 focus:ring-amber-500"
                  />
                  <span className="text-sm font-semibold text-gray-300">FTO (Field Training Officer)</span>
                </label>
                <label className="flex items-center gap-3 bg-gray-900/50 border border-gray-700 rounded-lg px-3 py-2 cursor-pointer hover:bg-gray-800/50 transition-colors">
                  <input
                    type="checkbox"
                    checked={editedFirefighter.is_bls || false}
                    onChange={(e) => setEditedFirefighter({...editedFirefighter, is_bls: e.target.checked})}
                    className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-emerald-500 focus:ring-2 focus:ring-emerald-500"
                  />
                  <span className="text-sm font-semibold text-gray-300">BLS (Basic Life Support)</span>
                </label>
                <label className="flex items-center gap-3 bg-gray-900/50 border border-gray-700 rounded-lg px-3 py-2 cursor-pointer hover:bg-gray-800/50 transition-colors">
                  <input
                    type="checkbox"
                    checked={editedFirefighter.is_als || false}
                    onChange={(e) => setEditedFirefighter({...editedFirefighter, is_als: e.target.checked})}
                    className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-cyan-500 focus:ring-2 focus:ring-cyan-500"
                  />
                  <span className="text-sm font-semibold text-gray-300">ALS (Advanced Life Support)</span>
                </label>
              </div>
            ) : qualifications.length > 0 ? (
              <div className="flex gap-2 flex-wrap">
                {qualifications.map((qual) => (
                  <span
                    key={qual.label}
                    className={`px-3 py-1.5 rounded-lg text-sm font-bold border ${
                      qual.color === 'amber'
                        ? 'bg-amber-900/30 text-amber-300 border-amber-700/50'
                        : qual.color === 'emerald'
                        ? 'bg-emerald-900/30 text-emerald-300 border-emerald-700/50'
                        : 'bg-cyan-900/30 text-cyan-300 border-cyan-700/50'
                    }`}
                  >
                    {qual.label}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No qualifications</p>
            )}
          </div>

          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Truck size={16} className="text-orange-400" />
              <h3 className="text-sm font-bold text-gray-300 uppercase">Apparatus Clearances</h3>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {isEditMode ? (
                apparatusTypes.map((apparatus) => {
                  const IconComponent = apparatus.Icon;
                  return (
                    <label
                      key={apparatus.key}
                      className="bg-gray-900/50 border border-gray-700 rounded-lg px-3 py-2 flex items-center gap-2 cursor-pointer hover:bg-gray-800/50 transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={editedFirefighter[apparatus.key] || false}
                        onChange={(e) => setEditedFirefighter({
                          ...editedFirefighter,
                          [apparatus.key]: e.target.checked
                        })}
                        className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-orange-500 focus:ring-2 focus:ring-orange-500"
                      />
                      <IconComponent className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-semibold text-gray-300">{apparatus.name}</span>
                    </label>
                  );
                })
              ) : apparatusList.length > 0 ? (
                apparatusList.map((apparatus) => {
                  const IconComponent = apparatus.Icon;
                  return (
                    <div
                      key={apparatus.name}
                      className="bg-gray-900/50 border border-gray-700 rounded-lg px-3 py-2 flex items-center gap-2"
                    >
                      <IconComponent className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-semibold text-gray-300">{apparatus.name}</span>
                    </div>
                  );
                })
              ) : (
                <p className="text-sm text-gray-500 col-span-2">No apparatus clearances</p>
              )}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <Calendar size={16} className="text-blue-400" />
              <h3 className="text-sm font-bold text-gray-300 uppercase">Hold History</h3>
            </div>

            {loading ? (
              <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6 text-center">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                <p className="text-sm text-gray-400">Loading history...</p>
              </div>
            ) : holdRecords.length === 0 ? (
              <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6 text-center">
                <Calendar size={32} className="text-gray-600 mx-auto mb-3" />
                <p className="text-base text-gray-300 font-semibold mb-1">No previous holds</p>
                <p className="text-xs text-gray-500">This firefighter has not completed any holds yet</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-emerald-900/20 border border-emerald-700/50 rounded-lg p-3">
                    <p className="text-2xl font-bold text-emerald-300">{completedHolds}</p>
                    <p className="text-xs text-gray-400">Completed</p>
                  </div>
                  <div className="bg-blue-900/20 border border-blue-700/50 rounded-lg p-3">
                    <p className="text-2xl font-bold text-blue-300">{scheduledHolds}</p>
                    <p className="text-xs text-gray-400">Scheduled</p>
                  </div>
                </div>

                <div className="space-y-2">
                  {(showAllHolds ? holdRecords : holdRecords.slice(0, 3)).map((record) => (
                    <button
                      key={record.id}
                      onClick={() => setSelectedHoldForDetail(record)}
                      className="w-full bg-gray-900/50 border border-gray-700 hover:border-gray-600 rounded-lg p-3 flex items-center justify-between transition-colors cursor-pointer"
                    >
                      <div className="flex-1 text-left">
                        <p className="text-sm font-semibold text-white">
                          {new Date(record.hold_date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            timeZone: 'UTC'
                          })}
                        </p>
                        {record.fire_station && (
                          <p className="text-xs text-gray-400">Station #{record.fire_station}</p>
                        )}
                      </div>
                      <span
                        className={`px-2 py-1 rounded text-xs font-bold ${
                          record.status === 'completed'
                            ? 'bg-emerald-900/30 text-emerald-300 border border-emerald-700/50'
                            : record.status === 'scheduled'
                            ? 'bg-blue-900/30 text-blue-300 border border-blue-700/50'
                            : 'bg-gray-700 text-gray-300'
                        }`}
                      >
                        {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Expand/Collapse Button */}
                {holdRecords.length > 3 && (
                  <button
                    onClick={() => setShowAllHolds(!showAllHolds)}
                    className="w-full mt-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                  >
                    {showAllHolds ? `Show Less` : `Show All ${holdRecords.length} Holds`}
                  </button>
                )}

                {/* No Additional History Message */}
                {showAllHolds && holdRecords.length <= 3 && (
                  <div className="mt-3 bg-gray-900/30 border border-gray-700 rounded-lg p-4 text-center">
                    <p className="text-sm text-gray-400">No additional hold history</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Hold Detail Modal */}
      {selectedHoldForDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setSelectedHoldForDetail(null)}
          />
          <div className="relative bg-gray-800 rounded-xl shadow-2xl w-full max-w-md border-2 border-gray-700">
            <div className="border-b-2 border-gray-700 bg-gradient-to-r from-gray-800 to-gray-900 p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-white">Hold Details</h3>
                <button
                  onClick={() => setSelectedHoldForDetail(null)}
                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X size={24} className="text-gray-400" />
                </button>
              </div>
            </div>

            <div className="p-5">
              <div className="space-y-4">
                {/* Hold Date */}
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Hold Date</p>
                  <p className="text-2xl font-bold text-white">
                    {new Date(selectedHoldForDetail.hold_date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                      timeZone: 'UTC'
                    })}
                  </p>
                </div>

                {/* Firefighter Name */}
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Firefighter</p>
                  <p className="text-lg font-semibold text-white">{firefighter?.name}</p>
                </div>

                {/* Station */}
                {selectedHoldForDetail.fire_station && (
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Station</p>
                    <p className="text-lg font-semibold text-white">Station #{selectedHoldForDetail.fire_station}</p>
                  </div>
                )}

                {/* Status */}
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Status</p>
                  <span
                    className={`inline-block px-3 py-1.5 rounded text-sm font-bold ${
                      selectedHoldForDetail.status === 'completed'
                        ? 'bg-emerald-900/30 text-emerald-300 border-2 border-emerald-700/50'
                        : 'bg-blue-900/30 text-blue-300 border-2 border-blue-700/50'
                    }`}
                  >
                    {selectedHoldForDetail.status.charAt(0).toUpperCase() + selectedHoldForDetail.status.slice(1)}
                  </span>
                </div>

                {/* Completed Date */}
                {selectedHoldForDetail.completed_at && (
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Completed On</p>
                    <p className="text-sm text-gray-300">
                      {new Date(selectedHoldForDetail.completed_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit',
                        timeZone: 'UTC'
                      })}
                    </p>
                  </div>
                )}

                {/* Created Date */}
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Scheduled On</p>
                  <p className="text-sm text-gray-300">
                    {new Date(selectedHoldForDetail.created_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      timeZone: 'UTC'
                    })}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedHoldForDetail(null)}
                className="w-full mt-6 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
