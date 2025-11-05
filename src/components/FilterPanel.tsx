import { X, Filter, Trash2 } from 'lucide-react';
import { FirefighterFilters } from '../hooks/useFilters';
import { colors, tokens } from '../styles';

interface FilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FirefighterFilters;
  onUpdateFilter: <K extends keyof FirefighterFilters>(key: K, value: FirefighterFilters[K]) => void;
  onToggleArrayFilter: <K extends keyof FirefighterFilters>(key: K, value: string) => void;
  onClearAll: () => void;
  activeFilterCount: number;
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
        className={`absolute inset-0 ${colors.components.modal.overlay}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        className={`relative w-full max-w-2xl max-h-[80vh] ${tokens.borders.radius.lg} ${colors.components.modal.shadow} overflow-hidden ${colors.components.modal.background} ${colors.structural.text.primary}`}
        role="dialog"
        aria-labelledby="filter-panel-title"
        aria-modal="true"
      >
        {/* Header */}
        <div className={`flex items-center justify-between ${tokens.spacing.card.lg} border-b ${colors.structural.border.default}`}>
          <div className={`flex items-center ${tokens.spacing.gap.md}`}>
            <div className={`p-2 ${tokens.borders.radius.lg} ${colors.semantic.primary.light}`}>
              <Filter className={`w-6 h-6 ${colors.semantic.primary.text}`} />
            </div>
            <div>
              <h2
                id="filter-panel-title"
                className={`${tokens.typography.heading.h3}`}
              >
                Filter Firefighters
              </h2>
              {activeFilterCount > 0 && (
                <p className={`${tokens.typography.body.small} ${colors.structural.text.tertiary}`}>
                  {activeFilterCount} {activeFilterCount === 1 ? 'filter' : 'filters'} active
                </p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-2 ${tokens.touchTarget.min} ${tokens.borders.radius.lg} transition-colors ${colors.interactive.hover.bg} ${colors.structural.text.secondary} hover:${colors.structural.text.primary} flex items-center justify-center`}
            aria-label="Close filter panel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className={`${tokens.spacing.card.lg} overflow-y-auto max-h-[60vh]`}>
          {/* Availability Filter */}
          <div className="mb-6">
            <label className={`block ${tokens.typography.body.secondary} font-semibold mb-3`}>
              Availability Status
            </label>
            <div className={`flex ${tokens.spacing.gap.sm}`}>
              {['all', 'available', 'unavailable'].map(status => (
                <button
                  key={status}
                  onClick={() => onUpdateFilter('availability', status as FirefighterFilters['availability'])}
                  className={`px-4 py-2 ${tokens.borders.radius.lg} font-medium transition-all ${
                    filters.availability === status
                      ? `${colors.semantic.primary.solid} text-white`
                      : `${colors.structural.bg.card} ${colors.interactive.hover.bg} ${colors.structural.text.secondary}`
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Certification Filter */}
          <div className="mb-6">
            <label className={`block ${tokens.typography.body.secondary} font-semibold mb-3`}>
              Certification Level
            </label>
            <div className={`grid grid-cols-2 ${tokens.spacing.gap.sm}`}>
              {certificationOptions.map(cert => (
                <label
                  key={cert}
                  className={`flex items-center ${tokens.spacing.gap.sm} p-3 ${tokens.borders.radius.lg} cursor-pointer transition-all ${
                    filters.certifications.includes(cert)
                      ? `${colors.semantic.primary.light} border-2 ${colors.semantic.primary.border}`
                      : `${colors.structural.bg.card} border-2 ${colors.structural.border.default} hover:${colors.structural.border.hover}`
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
            <label className={`block ${tokens.typography.body.secondary} font-semibold mb-3`}>
              Fire Stations
            </label>
            <div className={`grid grid-cols-3 ${tokens.spacing.gap.sm}`}>
              {availableStations.map(station => (
                <label
                  key={station}
                  className={`flex items-center ${tokens.spacing.gap.sm} p-3 ${tokens.borders.radius.lg} cursor-pointer transition-all ${
                    filters.stations.includes(station)
                      ? `${colors.semantic.primary.light} border-2 ${colors.semantic.primary.border}`
                      : `${colors.structural.bg.card} border-2 ${colors.structural.border.default} hover:${colors.structural.border.hover}`
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
            <label className={`block ${tokens.typography.body.secondary} font-semibold mb-3`}>
              Apparatus Clearances
            </label>
            <div className={`grid grid-cols-2 ${tokens.spacing.gap.sm}`}>
              {apparatusOptions.map(({ value, label }) => (
                <label
                  key={value}
                  className={`flex items-center ${tokens.spacing.gap.sm} p-3 ${tokens.borders.radius.lg} cursor-pointer transition-all ${
                    filters.apparatus.includes(value)
                      ? `${colors.semantic.primary.light} border-2 ${colors.semantic.primary.border}`
                      : `${colors.structural.bg.card} border-2 ${colors.structural.border.default} hover:${colors.structural.border.hover}`
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
            <label className={`block ${tokens.typography.body.secondary} font-semibold mb-3`}>
              Special Qualifications
            </label>
            <div className={`grid grid-cols-1 ${tokens.spacing.gap.sm}`}>
              {qualificationOptions.map(({ value, label }) => (
                <label
                  key={value}
                  className={`flex items-center ${tokens.spacing.gap.sm} p-3 ${tokens.borders.radius.lg} cursor-pointer transition-all ${
                    filters.qualifications.includes(value)
                      ? `${colors.semantic.primary.light} border-2 ${colors.semantic.primary.border}`
                      : `${colors.structural.bg.card} border-2 ${colors.structural.border.default} hover:${colors.structural.border.hover}`
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
        <div className={`flex ${tokens.spacing.gap.md} ${tokens.spacing.card.lg} border-t ${colors.structural.border.default} ${colors.structural.bg.surface}`}>
          <button
            onClick={onClearAll}
            className={`flex items-center ${tokens.spacing.gap.sm} px-4 py-2 ${tokens.borders.radius.lg} font-medium transition-all ${colors.components.button.secondary}`}
            disabled={activeFilterCount === 0}
          >
            <Trash2 className="w-4 h-4" />
            Clear All Filters
          </button>
          <button
            onClick={onClose}
            className={`flex-1 ${colors.semantic.primary.solid} ${colors.semantic.primary.hover} text-white px-4 py-2 ${tokens.borders.radius.lg} font-medium transition-all`}
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}
