import { Filter, Trash2 } from 'lucide-react';
import { FirefighterFilters } from '@/features/roster/hooks/useFilters';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Filter className="w-6 h-6 text-primary" />
            </div>
            <div>
              <DialogTitle>Filter Firefighters</DialogTitle>
              {activeFilterCount > 0 && (
                <p className="text-sm text-muted-foreground">
                  {activeFilterCount} {activeFilterCount === 1 ? 'filter' : 'filters'} active
                </p>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Availability Filter */}
          <div>
            <label className="text-sm font-semibold text-foreground mb-3 block">
              Availability Status
            </label>
            <div className="flex gap-2">
              {(['all', 'available', 'unavailable'] as const).map(status => (
                <Button
                  key={status}
                  variant={filters.availability === status ? "default" : "outline"}
                  size="sm"
                  onClick={() => onUpdateFilter('availability', status)}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </Button>
              ))}
            </div>
          </div>

          {/* Certification Filter */}
          <div>
            <label className="text-sm font-semibold text-foreground mb-3 block">
              Certification Level
            </label>
            <div className="grid grid-cols-2 gap-3">
              {certificationOptions.map(cert => (
                <label
                  key={cert}
                  className={`flex items-center gap-2 p-3 rounded-lg cursor-pointer transition-all border-2 ${
                    filters.certifications.includes(cert)
                      ? 'bg-primary/10 border-primary'
                      : 'bg-card border-border hover:border-accent-foreground'
                  }`}
                >
                  <Checkbox
                    checked={filters.certifications.includes(cert)}
                    onCheckedChange={() => onToggleArrayFilter('certifications', cert)}
                  />
                  <span className="font-medium text-sm">{cert}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Station Filter */}
          <div>
            <label className="text-sm font-semibold text-foreground mb-3 block">
              Fire Stations
            </label>
            <div className="grid grid-cols-3 gap-2">
              {availableStations.map(station => (
                <label
                  key={station}
                  className={`flex items-center gap-2 p-3 rounded-lg cursor-pointer transition-all border-2 ${
                    filters.stations.includes(station)
                      ? 'bg-primary/10 border-primary'
                      : 'bg-card border-border hover:border-accent-foreground'
                  }`}
                >
                  <Checkbox
                    checked={filters.stations.includes(station)}
                    onCheckedChange={() => onToggleArrayFilter('stations', station)}
                  />
                  <span className="font-medium text-sm">Station {station}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Apparatus Filter */}
          <div>
            <label className="text-sm font-semibold text-foreground mb-3 block">
              Apparatus Clearances
            </label>
            <div className="grid grid-cols-2 gap-3">
              {apparatusOptions.map(({ value, label }) => (
                <label
                  key={value}
                  className={`flex items-center gap-2 p-3 rounded-lg cursor-pointer transition-all border-2 ${
                    filters.apparatus.includes(value)
                      ? 'bg-primary/10 border-primary'
                      : 'bg-card border-border hover:border-accent-foreground'
                  }`}
                >
                  <Checkbox
                    checked={filters.apparatus.includes(value)}
                    onCheckedChange={() => onToggleArrayFilter('apparatus', value)}
                  />
                  <span className="font-medium text-sm">{label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Qualifications Filter */}
          <div>
            <label className="text-sm font-semibold text-foreground mb-3 block">
              Special Qualifications
            </label>
            <div className="space-y-2">
              {qualificationOptions.map(({ value, label }) => (
                <label
                  key={value}
                  className={`flex items-center gap-2 p-3 rounded-lg cursor-pointer transition-all border-2 ${
                    filters.qualifications.includes(value)
                      ? 'bg-primary/10 border-primary'
                      : 'bg-card border-border hover:border-accent-foreground'
                  }`}
                >
                  <Checkbox
                    checked={filters.qualifications.includes(value)}
                    onCheckedChange={() => onToggleArrayFilter('qualifications', value)}
                  />
                  <span className="font-medium text-sm">{label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button
            variant="outline"
            onClick={onClearAll}
            disabled={activeFilterCount === 0}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Clear All Filters
          </Button>
          <Button onClick={onClose}>
            Apply Filters
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
