import { Firefighter } from '../lib/supabase';
import { Trash2, Star, CheckCircle, UserX, ArrowRightLeft, GripVertical } from 'lucide-react';
import { ShiftBadge } from './ShiftSelector';

interface FirefighterItemProps {
  firefighter: Firefighter;
  onToggleAvailable: (id: string) => void;
  onCompleteHold: (id: string) => void;
  onDelete: (id: string) => void;
  onDeactivate: (id: string) => void;
  onTransferShift: (id: string) => void;
  isNextInRotation?: boolean;
  onDragStart?: (e: React.DragEvent, firefighterId: string) => void;
  onDragOver?: (e: React.DragEvent, firefighterId: string) => void;
  onDrop?: (e: React.DragEvent, targetFirefighterId: string) => void;
  onDragEnd?: () => void;
  isDragging?: boolean;
  isDragOver?: boolean;
  isAdminMode?: boolean;
  isDarkMode?: boolean;
}

export function FirefighterItem({
  firefighter,
  onToggleAvailable: _onToggleAvailable,
  onCompleteHold,
  onDelete,
  onDeactivate,
  onTransferShift,
  isNextInRotation = false,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
  isDragging = false,
  isDragOver = false,
  isAdminMode = false,
  isDarkMode = true
}: FirefighterItemProps) {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'No holds yet';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div
      draggable={isAdminMode}
      onDragStart={(e) => isAdminMode && onDragStart?.(e, firefighter.id)}
      onDragOver={(e) => {
        if (!isAdminMode) return;
        e.preventDefault();
        onDragOver?.(e, firefighter.id);
      }}
      onDrop={(e) => {
        if (!isAdminMode) return;
        e.preventDefault();
        onDrop?.(e, firefighter.id);
      }}
      onDragEnd={onDragEnd}
      className={`relative rounded-xl shadow-lg transition-all hover:shadow-xl ${isAdminMode ? 'cursor-move' : ''} ${
        isDragging ? 'opacity-50 scale-95' :
        isDragOver ? 'border-4 border-blue-400 scale-105' :
        !firefighter.is_available
          ? isDarkMode
            ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-gray-700 opacity-75'
            : 'bg-gradient-to-br from-slate-200 to-slate-300 border-2 border-slate-400 opacity-75'
          :
        isNextInRotation
          ? isDarkMode
            ? 'bg-gradient-to-br from-blue-900/40 to-blue-800/40 border-2 border-blue-500 shadow-blue-500/20'
            : 'bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-400 shadow-blue-400/20'
          :
        isDarkMode
          ? 'bg-gradient-to-br from-gray-800 to-gray-850 border-2 border-gray-700 hover:border-gray-600'
          : 'bg-white border-2 border-slate-300 hover:border-slate-400'
      }`}
    >
      {isNextInRotation && (
        <div className={`absolute -top-3 left-1/2 -translate-x-1/2 text-white px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-lg z-10 ${
          isDarkMode ? 'bg-gradient-to-r from-blue-600 to-blue-500' : 'bg-gradient-to-r from-red-600 to-red-500'
        }`}>
          <Star size={14} fill="currentColor" />
          NEXT UP
        </div>
      )}

      <div className="p-5">
        <div className="flex items-start justify-between mb-4">
          {isAdminMode && (
            <div className="flex items-center gap-2 mr-2">
              <div className={`cursor-grab active:cursor-grabbing ${
                isDarkMode ? 'text-gray-500 hover:text-gray-400' : 'text-slate-400 hover:text-slate-500'
              }`}>
                <GripVertical size={20} />
              </div>
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h3 className={`text-xl font-bold truncate ${
                isDarkMode ? 'text-white' : 'text-slate-900'
              }`} title={firefighter.name}>{firefighter.name}</h3>
              {!firefighter.is_available && (
                <span className={`px-2 py-1 rounded-md text-xs font-bold uppercase ${
                  isDarkMode
                    ? 'bg-red-600/20 text-red-400 border border-red-600/40'
                    : 'bg-red-100 text-red-700 border border-red-400'
                }`}>
                  Out of Rotation
                </span>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex gap-2 flex-wrap">
                <ShiftBadge shift={firefighter.shift} isDarkMode={isDarkMode} />
                {firefighter.fire_station && (
                  <div className={`flex items-center gap-1.5 px-3 py-1.5 border rounded-lg ${
                    isDarkMode
                      ? 'bg-sky-950/70 text-sky-300 border-sky-800'
                      : 'bg-sky-100 text-sky-700 border-sky-400'
                  }`}>
                    <span className="text-xs font-semibold">Station #{firefighter.fire_station}</span>
                  </div>
                )}
                <div className={`flex items-center gap-1.5 px-3 py-1.5 border rounded-lg ${
                  isDarkMode
                    ? 'bg-slate-800/70 text-slate-300 border-slate-700'
                    : 'bg-slate-100 text-slate-700 border-slate-300'
                }`}>
                  <span className="text-xs font-medium">Last Hold:</span>
                  <span className="text-xs font-semibold">{formatDate(firefighter.last_hold_date)}</span>
                </div>
              </div>

              {(firefighter.is_fto || firefighter.is_bls || firefighter.is_als) && (
                <div>
                  <span className={`text-xs font-semibold mb-1.5 block ${
                    isDarkMode ? 'text-gray-400' : 'text-slate-600'
                  }`}>Certifications & Roles:</span>
                  <div className="flex gap-2 flex-wrap">
                    {firefighter.is_fto && (
                      <div className={`flex items-center gap-1.5 px-2.5 py-1 border rounded-md ${
                        isDarkMode
                          ? 'bg-amber-900/30 text-amber-300 border-amber-700/50'
                          : 'bg-amber-100 text-amber-700 border-amber-400'
                      }`}>
                        <span className="text-xs font-bold">FTO</span>
                      </div>
                    )}
                    {firefighter.is_bls && (
                      <div className={`flex items-center gap-1.5 px-2.5 py-1 border rounded-md ${
                        isDarkMode
                          ? 'bg-emerald-900/30 text-emerald-300 border-emerald-700/50'
                          : 'bg-emerald-100 text-emerald-700 border-emerald-400'
                      }`}>
                        <span className="text-xs font-bold">BLS</span>
                      </div>
                    )}
                    {firefighter.is_als && (
                      <div className={`flex items-center gap-1.5 px-2.5 py-1 border rounded-md ${
                        isDarkMode
                          ? 'bg-cyan-900/30 text-cyan-300 border-cyan-700/50'
                          : 'bg-cyan-100 text-cyan-700 border-cyan-400'
                      }`}>
                        <span className="text-xs font-bold">ALS</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {firefighter.certification_level && (
                <div>
                  <span className={`text-xs font-semibold mb-1.5 block ${
                    isDarkMode ? 'text-gray-400' : 'text-slate-600'
                  }`}>Medical Certification:</span>
                  <div className={`flex items-center gap-1.5 px-3 py-1.5 border rounded-lg inline-flex ${
                    isDarkMode
                      ? 'bg-purple-900/30 text-purple-300 border-purple-700/50'
                      : 'bg-purple-100 text-purple-700 border-purple-400'
                  }`}>
                    <span className="text-xs font-semibold">{firefighter.certification_level}</span>
                  </div>
                </div>
              )}

              {(firefighter.apparatus_ambulance || firefighter.apparatus_brush_truck || firefighter.apparatus_engine ||
                firefighter.apparatus_tanker || firefighter.apparatus_truck || firefighter.apparatus_boat ||
                firefighter.apparatus_utv || firefighter.apparatus_rescue_squad) && (
                <div>
                  <span className={`text-xs font-semibold mb-1.5 block ${
                    isDarkMode ? 'text-gray-400' : 'text-slate-600'
                  }`}>Apparatus Clearances:</span>
                  <div className="flex gap-2 flex-wrap">
                    {firefighter.apparatus_ambulance && (
                      <span className={`px-2.5 py-1 border rounded-md text-xs font-semibold ${isDarkMode ? 'bg-amber-950/70 text-amber-300 border-amber-800' : 'bg-amber-100 text-amber-800 border-amber-400'}`}>
                        Ambulance
                      </span>
                    )}
                    {firefighter.apparatus_brush_truck && (
                      <span className={`px-2.5 py-1 border rounded-md text-xs font-semibold ${isDarkMode ? 'bg-amber-950/70 text-amber-300 border-amber-800' : 'bg-amber-100 text-amber-800 border-amber-400'}`}>
                        Brush Truck
                      </span>
                    )}
                    {firefighter.apparatus_engine && (
                      <span className={`px-2.5 py-1 border rounded-md text-xs font-semibold ${isDarkMode ? 'bg-amber-950/70 text-amber-300 border-amber-800' : 'bg-amber-100 text-amber-800 border-amber-400'}`}>
                        Engine
                      </span>
                    )}
                    {firefighter.apparatus_tanker && (
                      <span className={`px-2.5 py-1 border rounded-md text-xs font-semibold ${isDarkMode ? 'bg-amber-950/70 text-amber-300 border-amber-800' : 'bg-amber-100 text-amber-800 border-amber-400'}`}>
                        Tanker
                      </span>
                    )}
                    {firefighter.apparatus_truck && (
                      <span className={`px-2.5 py-1 border rounded-md text-xs font-semibold ${isDarkMode ? 'bg-amber-950/70 text-amber-300 border-amber-800' : 'bg-amber-100 text-amber-800 border-amber-400'}`}>
                        Truck
                      </span>
                    )}
                    {firefighter.apparatus_boat && (
                      <span className={`px-2.5 py-1 border rounded-md text-xs font-semibold ${isDarkMode ? 'bg-amber-950/70 text-amber-300 border-amber-800' : 'bg-amber-100 text-amber-800 border-amber-400'}`}>
                        Boat
                      </span>
                    )}
                    {firefighter.apparatus_utv && (
                      <span className={`px-2.5 py-1 border rounded-md text-xs font-semibold ${isDarkMode ? 'bg-amber-950/70 text-amber-300 border-amber-800' : 'bg-amber-100 text-amber-800 border-amber-400'}`}>
                        UTV
                      </span>
                    )}
                    {firefighter.apparatus_rescue_squad && (
                      <span className="px-2.5 py-1 border rounded-md text-xs font-semibold bg-white text-rose-600 border-rose-600">
                        Rescue Squad
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {isAdminMode && (
            <button
              onClick={() => onDelete(firefighter.id)}
              className={`p-2 rounded-lg transition-colors group focus-ring ${
                isDarkMode ? 'hover:bg-red-900/40' : 'hover:bg-red-100'
              }`}
              aria-label={`Remove ${firefighter.name} from roster`}
            >
              <Trash2 className={isDarkMode ? 'text-red-400 group-hover:text-red-300' : 'text-red-600 group-hover:text-red-700'} size={20} />
            </button>
          )}
        </div>

        {isAdminMode && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => onDeactivate(firefighter.id)}
                className={`py-3 px-4 rounded-lg font-semibold transition-all border flex items-center justify-center gap-2 focus-ring ${
                  isDarkMode
                    ? 'bg-gray-700 hover:bg-gray-600 text-white border-gray-600 hover:border-gray-500'
                    : 'bg-slate-200 hover:bg-slate-300 text-slate-900 border-slate-400 hover:border-slate-500'
                }`}
                aria-label={`Deactivate ${firefighter.name}`}
              >
                <UserX size={18} />
                Deactivate
              </button>

              <button
                onClick={() => onTransferShift(firefighter.id)}
                className={`py-3 px-4 rounded-lg font-semibold transition-all border flex items-center justify-center gap-2 focus-ring ${
                  isDarkMode
                    ? 'bg-gray-700 hover:bg-gray-600 text-white border-gray-600 hover:border-gray-500'
                    : 'bg-slate-200 hover:bg-slate-300 text-slate-900 border-slate-400 hover:border-slate-500'
                }`}
                aria-label={`Transfer ${firefighter.name} to different shift`}
              >
                <ArrowRightLeft size={18} />
                Transfer Shift
              </button>
            </div>

            {firefighter.is_available && (
              <button
                onClick={() => onCompleteHold(firefighter.id)}
                className={`w-full mt-3 py-3 px-4 rounded-lg font-semibold transition-all text-white shadow-lg flex items-center justify-center gap-2 focus-ring ${
                  isDarkMode
                    ? 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600'
                    : 'bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600'
                }`}
                aria-label={`Complete hold for ${firefighter.name}`}
              >
                <CheckCircle size={18} />
                Finish Hold & Move to End
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
