import { MapPin } from 'lucide-react';

interface StationSelectorProps {
  selectedStation: string;
  onStationChange: (station: string) => void;
  defaultStation?: string | null;
  className?: string;
}

const COMMON_STATIONS = ['1', '2', '3', '4', '5', '6', '8', '10'];

export function StationSelector({
  selectedStation,
  onStationChange,
  defaultStation,
  className = ''
}: StationSelectorProps) {
  return (
    <div className={`space-y-3 ${className}`}>
      <label className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
        <MapPin size={18} className="text-amber-500" />
        <span>Fire Station (Optional)</span>
      </label>

      <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
        <button
          type="button"
          onClick={() => onStationChange('')}
          className={`
            h-14 rounded-lg font-bold text-base transition-all border-2
            ${selectedStation === ''
              ? 'bg-accent border-accent-foreground text-accent-foreground shadow-md'
              : 'bg-card border-border text-muted-foreground hover:bg-accent hover:border-accent-foreground'
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
                  ? 'bg-gradient-to-br from-amber-500 to-amber-600 border-amber-400 text-white shadow-lg scale-105'
                  : isDefault
                  ? 'bg-blue-900/40 border-blue-500 text-blue-200 hover:bg-blue-800/50 hover:border-blue-400'
                  : 'bg-card border-border text-secondary-foreground hover:bg-accent hover:border-accent-foreground'
                }
              `}
            >
              {station}
              {isDefault && !isSelected && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full border-2 border-primary-foreground"></span>
              )}
            </button>
          );
        })}
      </div>

      {defaultStation && selectedStation === '' && (
        <p className="text-xs text-blue-300 dark:text-blue-400 flex items-center gap-1">
          <span className="w-2 h-2 bg-primary rounded-full"></span>
          Default station: #{defaultStation}
        </p>
      )}
    </div>
  );
}
