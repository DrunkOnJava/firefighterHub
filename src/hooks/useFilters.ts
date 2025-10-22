import { useState, useMemo, useCallback } from 'react';
import { Firefighter } from '../lib/supabase';

export interface FirefighterFilters {
  certifications: string[];
  apparatus: string[];
  availability: 'all' | 'available' | 'unavailable';
  stations: string[];
  qualifications: string[];
}

const defaultFilters: FirefighterFilters = {
  certifications: [],
  apparatus: [],
  availability: 'all',
  stations: [],
  qualifications: []
};

export function useFilters() {
  const [filters, setFilters] = useState<FirefighterFilters>(defaultFilters);
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.certifications.length > 0) count++;
    if (filters.apparatus.length > 0) count++;
    if (filters.availability !== 'all') count++;
    if (filters.stations.length > 0) count++;
    if (filters.qualifications.length > 0) count++;
    return count;
  }, [filters]);

  const clearAllFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const updateFilter = useCallback(<K extends keyof FirefighterFilters>(
    key: K,
    value: FirefighterFilters[K]
  ) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const toggleArrayFilter = useCallback(<K extends keyof FirefighterFilters>(
    key: K,
    value: string
  ) => {
    setFilters(prev => {
      const currentArray = prev[key] as string[];
      const newArray = currentArray.includes(value)
        ? currentArray.filter(v => v !== value)
        : [...currentArray, value];
      return { ...prev, [key]: newArray };
    });
  }, []);

  const applyFilters = useCallback((firefighters: Firefighter[]) => {
    return firefighters.filter(ff => {
      // Certification filter
      if (filters.certifications.length > 0) {
        if (!ff.certification_level || !filters.certifications.includes(ff.certification_level)) {
          return false;
        }
      }

      // Availability filter
      if (filters.availability !== 'all') {
        const shouldBeAvailable = filters.availability === 'available';
        if (ff.is_available !== shouldBeAvailable) {
          return false;
        }
      }

      // Station filter
      if (filters.stations.length > 0) {
        if (!ff.fire_station || !filters.stations.includes(ff.fire_station)) {
          return false;
        }
      }

      // Apparatus filter (ANY match - firefighter has at least one of the selected apparatus)
      if (filters.apparatus.length > 0) {
        const hasApparatus = filters.apparatus.some(app => {
          switch (app) {
            case 'ambulance': return ff.apparatus_ambulance;
            case 'engine': return ff.apparatus_engine;
            case 'truck': return ff.apparatus_truck;
            case 'tanker': return ff.apparatus_tanker;
            case 'brushTruck': return ff.apparatus_brush_truck;
            case 'boat': return ff.apparatus_boat;
            case 'utv': return ff.apparatus_utv;
            case 'rescueSquad': return ff.apparatus_rescue_squad;
            default: return false;
          }
        });
        if (!hasApparatus) return false;
      }

      // Qualifications filter (ANY match)
      if (filters.qualifications.length > 0) {
        const hasQualification = filters.qualifications.some(qual => {
          switch (qual) {
            case 'FTO': return ff.is_fto;
            case 'BLS': return ff.is_bls;
            case 'ALS': return ff.is_als;
            default: return false;
          }
        });
        if (!hasQualification) return false;
      }

      return true;
    });
  }, [filters]);

  return {
    filters,
    setFilters,
    updateFilter,
    toggleArrayFilter,
    clearAllFilters,
    activeFilterCount,
    applyFilters,
    isFilterPanelOpen,
    setIsFilterPanelOpen
  };
}
