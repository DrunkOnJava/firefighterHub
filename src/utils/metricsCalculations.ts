import { Firefighter } from "../lib/supabase";
import { ScheduledHold } from "./calendarUtils";

export interface FirefighterMetrics {
  firefighterId: string;
  name: string;
  totalHolds: number;
  completedHolds: number;
  averageIntervalDays: number;
}

/**
 * Calculate comprehensive metrics per firefighter including total holds,
 * completed holds, and average interval between holds.
 */
export function calculateHoldsPerFirefighter(
  holds: ScheduledHold[],
  firefighters: Firefighter[]
): FirefighterMetrics[] {
  return firefighters.map((ff) => {
    const ffHolds = holds.filter(
      (h) => h.firefighter_id === ff.id && h.hold_date !== null
    );
    const completed = ffHolds.filter((h) => h.status === "completed");

    // Calculate average interval between completed holds
    const sortedHolds = [...completed].sort((a, b) => {
      const dateA = a.hold_date ? new Date(a.hold_date).getTime() : 0;
      const dateB = b.hold_date ? new Date(b.hold_date).getTime() : 0;
      return dateA - dateB;
    });

    let totalIntervalDays = 0;
    for (let i = 1; i < sortedHolds.length; i++) {
      if (sortedHolds[i].hold_date && sortedHolds[i - 1].hold_date) {
        const days =
          (new Date(sortedHolds[i].hold_date!).getTime() -
            new Date(sortedHolds[i - 1].hold_date!).getTime()) /
          (1000 * 60 * 60 * 24);
        totalIntervalDays += days;
      }
    }

    const avgInterval =
      sortedHolds.length > 1 ? totalIntervalDays / (sortedHolds.length - 1) : 0;

    return {
      firefighterId: ff.id,
      name: ff.name,
      totalHolds: ffHolds.length,
      completedHolds: completed.length,
      averageIntervalDays: Math.round(avgInterval * 10) / 10,
    };
  });
}

/**
 * Calculate total holds by station
 */
export function calculateHoldsByStation(
  holds: ScheduledHold[]
): Map<string, number> {
  const stationMap = new Map<string, number>();
  holds.forEach((hold) => {
    if (hold.fire_station) {
      stationMap.set(
        hold.fire_station,
        (stationMap.get(hold.fire_station) || 0) + 1
      );
    }
  });
  return stationMap;
}

/**
 * Calculate holds by shift (A, B, C)
 */
export function calculateHoldsByShift(holds: ScheduledHold[]): {
  A: number;
  B: number;
  C: number;
} {
  return {
    A: holds.filter((h) => h.shift === "A").length,
    B: holds.filter((h) => h.shift === "B").length,
    C: holds.filter((h) => h.shift === "C").length,
  };
}

/**
 * Calculate holds by duration (12h vs 24h)
 */
export function calculateHoldsByDuration(holds: ScheduledHold[]): {
  "12h": number;
  "24h": number;
} {
  return {
    "12h": holds.filter((h) => h.duration === "12h").length,
    "24h": holds.filter((h) => h.duration === "24h").length,
  };
}

/**
 * Calculate average interval between holds for a specific firefighter
 */
export function calculateAverageIntervalBetweenHolds(
  holds: ScheduledHold[],
  firefighterId: string
): number {
  const ffHolds = holds
    .filter(
      (h) =>
        h.firefighter_id === firefighterId &&
        h.status === "completed" &&
        h.hold_date !== null
    )
    .sort((a, b) => {
      const dateA = a.hold_date ? new Date(a.hold_date).getTime() : 0;
      const dateB = b.hold_date ? new Date(b.hold_date).getTime() : 0;
      return dateA - dateB;
    });

  if (ffHolds.length < 2) return 0;

  let totalIntervalDays = 0;
  for (let i = 1; i < ffHolds.length; i++) {
    if (ffHolds[i].hold_date && ffHolds[i - 1].hold_date) {
      const days =
        (new Date(ffHolds[i].hold_date!).getTime() -
          new Date(ffHolds[i - 1].hold_date!).getTime()) /
        (1000 * 60 * 60 * 24);
      totalIntervalDays += days;
    }
  }

  return Math.round((totalIntervalDays / (ffHolds.length - 1)) * 10) / 10;
}

/**
 * Get firefighter with most completed holds
 */
export function getFirefighterWithMostHolds(
  holds: ScheduledHold[],
  firefighters: Firefighter[]
): { name: string; count: number } | null {
  const metrics = calculateHoldsPerFirefighter(holds, firefighters);
  if (metrics.length === 0) return null;

  const topFirefighter = metrics.reduce((max, current) =>
    current.completedHolds > max.completedHolds ? current : max
  );

  return {
    name: topFirefighter.name,
    count: topFirefighter.completedHolds,
  };
}

/**
 * Get station with most holds
 */
export function getStationWithMostHolds(holds: ScheduledHold[]): {
  station: string;
  count: number;
} | null {
  const stationMap = calculateHoldsByStation(holds);
  if (stationMap.size === 0) return null;

  let maxStation = "";
  let maxCount = 0;

  stationMap.forEach((count, station) => {
    if (count > maxCount) {
      maxCount = count;
      maxStation = station;
    }
  });

  return { station: maxStation, count: maxCount };
}

/**
 * Calculate completion rate (completed holds / total holds)
 */
export function calculateCompletionRate(holds: ScheduledHold[]): number {
  if (holds.length === 0) return 0;
  const completed = holds.filter((h) => h.status === "completed").length;
  return Math.round((completed / holds.length) * 100);
}

/**
 * Calculate average hold duration across all holds
 */
export function calculateAverageHoldDuration(holds: ScheduledHold[]): number {
  const holdsWithDuration = holds.filter((h) => h.duration);
  if (holdsWithDuration.length === 0) return 24; // Default to 24h

  const totalHours = holdsWithDuration.reduce((sum, hold) => {
    return sum + (hold.duration === "12h" ? 12 : 24);
  }, 0);

  return Math.round((totalHours / holdsWithDuration.length) * 10) / 10;
}

/**
 * Get holds within a date range
 */
export function getHoldsInDateRange(
  holds: ScheduledHold[],
  startDate: Date,
  endDate: Date
): ScheduledHold[] {
  return holds.filter((hold) => {
    const dateStr = hold.hold_date;
    if (!dateStr) return false;
    const holdDate = new Date(dateStr);
    return holdDate >= startDate && holdDate <= endDate;
  });
}
