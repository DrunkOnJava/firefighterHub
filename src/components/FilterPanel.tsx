import { X, Filter, Trash2 } from 'lucide-react';
import { FirefighterFilters } from '../hooks/useFilters';

interface FilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FirefighterFilters;
  onUpdateFilter: <K extends keyof FirefighterFilters>(key: K, value: FirefighterFilters[K]) => void;
  onToggleArrayFilter: <K extends keyof FirefighterFilters>(key: K, value: string) => void;
  onClearAll: () => void;
  activeFilterCount: number;
  isDarkMode?: boolean;
  availableStations: string[];
}

export function FilterPanel({
  isOpen,
  onClose,
  filters,
  onUpdateFilter,
  onToggleArrayFilter,
  onClearAll,
  activeFilterCount,
  isDarkMode = true,
  availableStations
}: FilterPanelProps) {
  if (!isOpen) return null;

  const certificationOptions = ['EMT', 'EMT-A', 'EMT-I', 'Paramedic'];
  const apparatusOptions = [
    { value: 'ambulance', label: 'Ambulance' },
    { value: 'engine', label: 'Engine' },
    { value: 'truck', label: 'Truck' },
    { value: 'tanker', label: 'Tanker' },
    { value: 'brushTruck', label: 'Brush Truck' },
    { value: 'boat', label: 'Boat' },
    { value: 'utv', label: 'UTV' },
    { value: 'rescueSquad', label: 'Rescue Squad' }
  ];
  const qualificationOptions = [
    { value: 'FTO', label: 'FTO (Field Training Officer)' },
    { value: 'BLS', label: 'BLS (Basic Life Support)' },
    { value: 'ALS', label: 'ALS (Advanced Life Support)' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        className={`relative w-full max-w-2xl max-h-[80vh] rounded-lg shadow-2xl overflow-hidden ${
          isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-slate-900'
        }`}
        role="dialog"
        aria-labelledby="filter-panel-title"
        aria-modal="true"
      >
        {/* Header */}
        <div className={`flex items-center justify-between p-6 border-b ${
          isDarkMode ? 'border-gray-700' : 'border-slate-200'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${
              isDarkMode ? 'bg-blue-900/30' : 'bg-blue-50'
            }`}>
              <Filter className={`w-6 h-6 ${
                isDarkMode ? 'text-blue-400' : 'text-blue-600'
              }`} />
            </div>
            <div>
              <h2
                id="filter-panel-title"
                className="text-xl font-semibold"
              >
                Filter Firefighters
              </h2>
              {activeFilterCount > 0 && (
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>
                  {activeFilterCount} {activeFilterCount === 1 ? 'filter' : 'filters'} active
                </p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${
              isDarkMode
                ? 'hover:bg-gray-700 text-gray-400 hover:text-white'
                : 'hover:bg-slate-100 text-slate-400 hover:text-slate-900'
            }`}
            aria-label="Close filter panel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {/* Availability Filter */}
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-3">
              Availability Status
            </label>
            <div className="flex gap-2">
              {['all', 'available', 'unavailable'].map(status => (
                <button
                  key={status}
                  onClick={() => onUpdateFilter('availability', status as FirefighterFilters['availability'])}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    filters.availability === status
                      ? isDarkMode
                        ? 'bg-blue-600 text-white'
                        : 'bg-blue-600 text-white'
                      : isDarkMode
                        ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Certification Filter */}
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-3">
              Certification Level
            </label>
            <div className="grid grid-cols-2 gap-2">
              {certificationOptions.map(cert => (
                <label
                  key={cert}
                  className={`flex items-center gap-2 p-3 rounded-lg cursor-pointer transition-all ${
                    filters.certifications.includes(cert)
                      ? isDarkMode
                        ? 'bg-blue-900/50 border-2 border-blue-600'
                        : 'bg-blue-50 border-2 border-blue-600'
                      : isDarkMode
                        ? 'bg-gray-700 border-2 border-gray-600 hover:border-gray-500'
                        : 'bg-slate-50 border-2 border-slate-300 hover:border-slate-400'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={filters.certifications.includes(cert)}
                    onChange={() => onToggleArrayFilter('certifications', cert)}
                    className="w-4 h-4 rounded"
                  />
                  <span className="font-medium">{cert}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Station Filter */}
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-3">
              Fire Stations
            </label>
            <div className="grid grid-cols-3 gap-2">
              {availableStations.map(station => (
                <label
                  key={station}
                  className={`flex items-center gap-2 p-3 rounded-lg cursor-pointer transition-all ${
                    filters.stations.includes(station)
                      ? isDarkMode
                        ? 'bg-blue-900/50 border-2 border-blue-600'
                        : 'bg-blue-50 border-2 border-blue-600'
                      : isDarkMode
                        ? 'bg-gray-700 border-2 border-gray-600 hover:border-gray-500'
                        : 'bg-slate-50 border-2 border-slate-300 hover:border-slate-400'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={filters.stations.includes(station)}
                    onChange={() => onToggleArrayFilter('stations', station)}
                    className="w-4 h-4 rounded"
                  />
                  <span className="font-medium">Station {station}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Apparatus Filter */}
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-3">
              Apparatus Clearances
            </label>
            <div className="grid grid-cols-2 gap-2">
              {apparatusOptions.map(({ value, label }) => (
                <label
                  key={value}
                  className={`flex items-center gap-2 p-3 rounded-lg cursor-pointer transition-all ${
                    filters.apparatus.includes(value)
                      ? isDarkMode
                        ? 'bg-blue-900/50 border-2 border-blue-600'
                        : 'bg-blue-50 border-2 border-blue-600'
                      : isDarkMode
                        ? 'bg-gray-700 border-2 border-gray-600 hover:border-gray-500'
                        : 'bg-slate-50 border-2 border-slate-300 hover:border-slate-400'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={filters.apparatus.includes(value)}
                    onChange={() => onToggleArrayFilter('apparatus', value)}
                    className="w-4 h-4 rounded"
                  />
                  <span className="font-medium">{label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Qualifications Filter */}
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-3">
              Special Qualifications
            </label>
            <div className="grid grid-cols-1 gap-2">
              {qualificationOptions.map(({ value, label }) => (
                <label
                  key={value}
                  className={`flex items-center gap-2 p-3 rounded-lg cursor-pointer transition-all ${
                    filters.qualifications.includes(value)
                      ? isDarkMode
                        ? 'bg-blue-900/50 border-2 border-blue-600'
                        : 'bg-blue-50 border-2 border-blue-600'
                      : isDarkMode
                        ? 'bg-gray-700 border-2 border-gray-600 hover:border-gray-500'
                        : 'bg-slate-50 border-2 border-slate-300 hover:border-slate-400'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={filters.qualifications.includes(value)}
                    onChange={() => onToggleArrayFilter('qualifications', value)}
                    className="w-4 h-4 rounded"
                  />
                  <span className="font-medium">{label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={`flex gap-3 p-6 border-t ${
          isDarkMode ? 'border-gray-700 bg-gray-900/50' : 'border-slate-200 bg-slate-50'
        }`}>
          <button
            onClick={onClearAll}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              isDarkMode
                ? 'bg-gray-700 hover:bg-gray-600 text-white'
                : 'bg-white hover:bg-slate-50 text-slate-900 border-2 border-slate-300'
            }`}
            disabled={activeFilterCount === 0}
          >
            <Trash2 className="w-4 h-4" />
            Clear All Filters
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}
