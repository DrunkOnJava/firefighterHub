import { X, Filter, Trash2 } from 'lucide-react';
import { FirefighterFilters } from '../hooks/useFilters';
import { ButtonM3, IconButtonM3 } from './m3/ButtonM3';

interface FilterPanelM3Props {
  isOpen: boolean;
  onClose: () => void;
  filters: FirefighterFilters;
  onUpdateFilter: <K extends keyof FirefighterFilters>(key: K, value: FirefighterFilters[K]) => void;
  onToggleArrayFilter: <K extends keyof FirefighterFilters>(key: K, value: string) => void;
  onClearAll: () => void;
  activeFilterCount: number;
  availableStations: string[];
}

export function FilterPanelM3({
  isOpen,
  onClose,
  filters,
  onUpdateFilter,
  onToggleArrayFilter,
  onClearAll,
  activeFilterCount,
  availableStations
}: FilterPanelM3Props) {
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
        className="relative w-full max-w-2xl max-h-[80vh] rounded-materialm-lg shadow-materialm-4 overflow-hidden bg-white dark:bg-materialm-dark text-materialm-text dark:text-materialm-text"
        role="dialog"
        aria-labelledby="filter-panel-title"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-materialm-border dark:border-materialm-border-dark">
          <div className="flex items-center gap-4">
            <div className="p-2 rounded-materialm-lg bg-materialm-primary-light">
              <Filter className="w-6 h-6 text-materialm-primary" />
            </div>
            <div>
              <h2
                id="filter-panel-title"
                className="text-xl font-semibold text-gray-900 dark:text-white"
              >
                Filter Firefighters
              </h2>
              {activeFilterCount > 0 && (
                <p className="text-sm text-materialm-text-secondary">
                  {activeFilterCount} {activeFilterCount === 1 ? 'filter' : 'filters'} active
                </p>
              )}
            </div>
          </div>
          <IconButtonM3
            onClick={onClose}
            variant="text"
            color="neutral"
            aria-label="Close filter panel"
          >
            <X className="w-5 h-5" />
          </IconButtonM3>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {/* Availability Filter */}
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-3 text-gray-900 dark:text-white">
              Availability Status
            </label>
            <div className="flex gap-2">
              {['all', 'available', 'unavailable'].map(status => (
                <ButtonM3
                  key={status}
                  onClick={() => onUpdateFilter('availability', status as FirefighterFilters['availability'])}
                  variant={filters.availability === status ? 'filled' : 'outlined'}
                  color="primary"
                  size="sm"
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </ButtonM3>
              ))}
            </div>
          </div>

          {/* Certification Filter */}
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-3 text-gray-900 dark:text-white">
              Certification Level
            </label>
            <div className="grid grid-cols-2 gap-2">
              {certificationOptions.map(cert => (
                <label
                  key={cert}
                  className={`flex items-center gap-2 p-3 rounded-materialm-lg cursor-pointer transition-all ${
                    filters.certifications.includes(cert)
                      ? 'bg-materialm-primary-light border-2 border-materialm-primary'
                      : 'bg-gray-50 dark:bg-materialm-darkgray border-2 border-materialm-border dark:border-materialm-border-dark hover:border-materialm-primary'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={filters.certifications.includes(cert)}
                    onChange={() => onToggleArrayFilter('certifications', cert)}
                    className="w-4 h-4 rounded border-materialm-border-dark bg-white dark:bg-materialm-dark text-materialm-primary focus:ring-2 focus:ring-materialm-primary"
                  />
                  <span className="font-medium text-gray-900 dark:text-white">{cert}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Station Filter */}
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-3 text-gray-900 dark:text-white">
              Fire Stations
            </label>
            <div className="grid grid-cols-3 gap-2">
              {availableStations.map(station => (
                <label
                  key={station}
                  className={`flex items-center gap-2 p-3 rounded-materialm-lg cursor-pointer transition-all ${
                    filters.stations.includes(station)
                      ? 'bg-materialm-primary-light border-2 border-materialm-primary'
                      : 'bg-gray-50 dark:bg-materialm-darkgray border-2 border-materialm-border dark:border-materialm-border-dark hover:border-materialm-primary'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={filters.stations.includes(station)}
                    onChange={() => onToggleArrayFilter('stations', station)}
                    className="w-4 h-4 rounded border-materialm-border-dark bg-white dark:bg-materialm-dark text-materialm-primary focus:ring-2 focus:ring-materialm-primary"
                  />
                  <span className="font-medium text-gray-900 dark:text-white">Station {station}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Apparatus Filter */}
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-3 text-gray-900 dark:text-white">
              Apparatus Clearances
            </label>
            <div className="grid grid-cols-2 gap-2">
              {apparatusOptions.map(({ value, label }) => (
                <label
                  key={value}
                  className={`flex items-center gap-2 p-3 rounded-materialm-lg cursor-pointer transition-all ${
                    filters.apparatus.includes(value)
                      ? 'bg-materialm-primary-light border-2 border-materialm-primary'
                      : 'bg-gray-50 dark:bg-materialm-darkgray border-2 border-materialm-border dark:border-materialm-border-dark hover:border-materialm-primary'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={filters.apparatus.includes(value)}
                    onChange={() => onToggleArrayFilter('apparatus', value)}
                    className="w-4 h-4 rounded border-materialm-border-dark bg-white dark:bg-materialm-dark text-materialm-primary focus:ring-2 focus:ring-materialm-primary"
                  />
                  <span className="font-medium text-gray-900 dark:text-white">{label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Qualifications Filter */}
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-3 text-gray-900 dark:text-white">
              Special Qualifications
            </label>
            <div className="grid grid-cols-1 gap-2">
              {qualificationOptions.map(({ value, label }) => (
                <label
                  key={value}
                  className={`flex items-center gap-2 p-3 rounded-materialm-lg cursor-pointer transition-all ${
                    filters.qualifications.includes(value)
                      ? 'bg-materialm-primary-light border-2 border-materialm-primary'
                      : 'bg-gray-50 dark:bg-materialm-darkgray border-2 border-materialm-border dark:border-materialm-border-dark hover:border-materialm-primary'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={filters.qualifications.includes(value)}
                    onChange={() => onToggleArrayFilter('qualifications', value)}
                    className="w-4 h-4 rounded border-materialm-border-dark bg-white dark:bg-materialm-dark text-materialm-primary focus:ring-2 focus:ring-materialm-primary"
                  />
                  <span className="font-medium text-gray-900 dark:text-white">{label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-4 p-6 border-t border-materialm-border dark:border-materialm-border-dark bg-gray-50 dark:bg-materialm-darkgray">
          <ButtonM3
            onClick={onClearAll}
            variant="outlined"
            color="neutral"
            disabled={activeFilterCount === 0}
            startIcon={<Trash2 className="w-4 h-4" />}
          >
            Clear All Filters
          </ButtonM3>
          <ButtonM3
            onClick={onClose}
            variant="filled"
            color="primary"
            fullWidth
          >
            Apply Filters
          </ButtonM3>
        </div>
      </div>
    </div>
  );
}
