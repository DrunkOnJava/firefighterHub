import { MapPin } from 'lucide-react';

interface StationSelectorM3Props {
  selectedStation: string;
  onStationChange: (station: string) => void;
  defaultStation?: string | null;
  className?: string;
}

const COMMON_STATIONS = ['1', '2', '3', '4', '5', '6', '8', '10'];

export function StationSelectorM3({
  selectedStation,
  onStationChange,
  defaultStation,
  className = ''
}: StationSelectorM3Props) {
  return (
    <div className={`space-y-3 ${className}`}>
      <label className="flex items-center gap-2 text-sm font-semibold text-materialm-text-secondary">
        <MapPin size={18} className="text-materialm-warning" />
        <span>Fire Station (Optional)</span>
      </label>

      <div className="grid grid-cols-5 gap-2">
        <button
          type="button"
          onClick={() => onStationChange('')}
          className={`
            h-14 rounded-lg font-bold text-base transition-all border-2
            ${selectedStation === ''
              ? 'bg-materialm-darkgray border-materialm-border-dark text-white shadow-materialm-2'
              : 'bg-white dark:bg-materialm-dark border-materialm-border dark:border-materialm-border-dark text-materialm-text-primary hover:bg-materialm-surface-bright dark:hover:bg-materialm-darkgray hover:border-materialm-primary-emphasis'
            }
          `}
        >
          None
        </button>

        {COMMON_STATIONS.map((station) => {
          const isSelected = selectedStation === station;
          const isDefault = defaultStation === station && selectedStation === '';

          return (
            <button
              key={station}
              type="button"
              onClick={() => onStationChange(station)}
              className={`
                h-14 rounded-lg font-bold text-lg transition-all border-2 relative
                ${isSelected
                  ? 'bg-gradient-to-r from-materialm-warning to-materialm-error border-materialm-warning text-white shadow-materialm-3 scale-105'
                  : isDefault
                  ? 'bg-materialm-primary-light border-materialm-primary text-materialm-primary hover:bg-materialm-primary-light/50 hover:border-materialm-primary-emphasis'
                  : 'bg-white dark:bg-materialm-dark border-materialm-border dark:border-materialm-border-dark text-materialm-text-primary hover:bg-materialm-surface-bright dark:hover:bg-materialm-darkgray hover:border-materialm-primary-emphasis'
                }
              `}
            >
              {station}
              {isDefault && !isSelected && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-materialm-primary rounded-full border-2 border-white dark:border-materialm-dark"></span>
              )}
            </button>
          );
        })}
      </div>

      {defaultStation && selectedStation === '' && (
        <p className="text-xs text-materialm-primary flex items-center gap-1.5">
          <span className="w-2 h-2 bg-materialm-primary rounded-full"></span>
          Default station: #{defaultStation}
        </p>
      )}
    </div>
  );
}
