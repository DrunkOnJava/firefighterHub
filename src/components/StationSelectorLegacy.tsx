import { MapPin } from 'lucide-react';
import { colors, tokens } from '../styles';

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
      <label className={`flex items-center ${tokens.spacing.gap.sm} ${tokens.typography.body.secondary} font-semibold ${colors.structural.text.secondary}`}>
        <MapPin size={18} className={colors.semantic.warning.text} />
        <span>Fire Station (Optional)</span>
      </label>

      <div className="grid grid-cols-5 gap-2">
        <button
          type="button"
          onClick={() => onStationChange('')}
          className={`
            h-14 ${tokens.borders.radius.lg} font-bold text-base transition-all border-2
            ${selectedStation === ''
              ? `${colors.structural.bg.cardHover} ${colors.structural.border.hover} ${colors.structural.text.primary} ${colors.components.card.shadow}`
              : `${colors.structural.bg.card} ${colors.structural.border.default} ${colors.structural.text.tertiary} ${colors.interactive.hover.bg} hover:${colors.structural.border.hover}`
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
                h-14 ${tokens.borders.radius.lg} font-bold text-lg transition-all border-2 relative
                ${isSelected
                  ? `${colors.semantic.warning.gradient} ${colors.semantic.warning.border} text-white shadow-lg scale-105`
                  : isDefault
                  ? `bg-blue-900/40 ${colors.semantic.primary.border} text-blue-200 hover:bg-blue-800/50 hover:border-blue-500`
                  : `${colors.structural.bg.card} ${colors.structural.border.default} ${colors.structural.text.secondary} ${colors.interactive.hover.bg} hover:${colors.structural.border.hover}`
                }
              `}
            >
              {station}
              {isDefault && !isSelected && (
                <span className={`absolute -top-1 -right-1 w-3 h-3 ${colors.semantic.primary.solid} ${tokens.borders.radius.full} border-2 ${colors.structural.border.strong}`}></span>
              )}
            </button>
          );
        })}
      </div>

      {defaultStation && selectedStation === '' && (
        <p className={`${tokens.typography.body.small} text-blue-300 flex items-center ${tokens.spacing.gap.xs}`}>
          <span className={`w-2 h-2 ${colors.semantic.primary.solid} ${tokens.borders.radius.full}`}></span>
          Default station: #{defaultStation}
        </p>
      )}
    </div>
  );
}
