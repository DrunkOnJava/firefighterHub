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
      <label className="flex items-center gap-2 text-sm font-semibold text-gray-300">
        <MapPin size={18} className="text-orange-400" />
        <span>Fire Station (Optional)</span>
      </label>

      <div className="grid grid-cols-5 gap-2">
        <button
          type="button"
          onClick={() => onStationChange('')}
          className={`
            h-14 rounded-lg font-bold text-base transition-all border-2
            ${selectedStation === ''
              ? 'bg-gray-600 border-gray-500 text-white shadow-lg'
              : 'bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-700 hover:border-gray-600'
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
                  ? 'bg-gradient-to-br from-orange-500 to-orange-600 border-orange-400 text-white shadow-lg shadow-orange-500/30 scale-105'
                  : isDefault
                  ? 'bg-blue-900/40 border-blue-600 text-blue-200 hover:bg-blue-800/50 hover:border-blue-500'
                  : 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700 hover:border-gray-600'
                }
              `}
            >
              {station}
              {isDefault && !isSelected && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-gray-900"></span>
              )}
            </button>
          );
        })}
      </div>

      {defaultStation && selectedStation === '' && (
        <p className="text-xs text-blue-300 flex items-center gap-1">
          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
          Default station: #{defaultStation}
        </p>
      )}
    </div>
  );
}
