import { ScheduledHold as DBScheduledHold, Firefighter } from "../lib/supabase";

// Re-export database type with convenience type alias
// This ensures consistency with the actual database schema
export type ScheduledHold = DBScheduledHold;

export interface CalendarDay {
  date: Date;
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isWeekend: boolean;
  isPast: boolean;
  scheduledHolds: ScheduledHold[];
}

export function getMonthDays(year: number, month: number): CalendarDay[] {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();

  const days: CalendarDay[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const prevMonthLastDay = new Date(year, month, 0).getDate();
  for (let i = startingDayOfWeek - 1; i >= 0; i--) {
    const date = new Date(year, month - 1, prevMonthLastDay - i);
    days.push(createCalendarDay(date, false, today));
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    days.push(createCalendarDay(date, true, today));
  }

  const remainingDays = 42 - days.length;
  for (let day = 1; day <= remainingDays; day++) {
    const date = new Date(year, month + 1, day);
    days.push(createCalendarDay(date, false, today));
  }

  return days;
}

function createCalendarDay(
  date: Date,
  isCurrentMonth: boolean,
  today: Date
): CalendarDay {
  const dayDate = new Date(date);
  dayDate.setHours(0, 0, 0, 0);

  return {
    date: dayDate,
    dayNumber: date.getDate(),
    isCurrentMonth,
    isToday: dayDate.getTime() === today.getTime(),
    isWeekend: date.getDay() === 0 || date.getDay() === 6,
    isPast: dayDate < today,
    scheduledHolds: [],
  };
}

export function attachScheduledHolds(
  days: CalendarDay[],
  holds: ScheduledHold[],
  _firefighters: Firefighter[] // Unused after removing synthetic holds (kept for API compatibility)
): CalendarDay[] {
  void _firefighters;
  if (!holds || !Array.isArray(holds)) holds = [];
  
  const holdsByDate = new Map<string, ScheduledHold[]>();

  holds.forEach((hold) => {
    // Parse the hold_date string as a local date to ensure correct matching
    // Database stores YYYY-MM-DD format, we need to match it to local calendar dates
    if (!hold.hold_date) return; // Skip holds without dates
    const dateKey = hold.hold_date.split("T")[0]; // Remove any time component
    if (!holdsByDate.has(dateKey)) {
      holdsByDate.set(dateKey, []);
    }
    holdsByDate.get(dateKey)!.push(hold);
  });

  // ✅ REMOVED: Synthetic hold creation from last_hold_date
  // This was causing duplicate holds to appear in member profiles, especially
  // for firefighters who transferred shifts. The synthetic holds used the
  // firefighter's CURRENT shift, not the shift at the time of the hold.
  //
  // All actual holds are stored in the scheduled_holds table, so we don't
  // need to create synthetic holds from the last_hold_date field.
  //
  // Bug fix: https://github.com/firefighterhub/issues/duplicate-holds

  /*
  firefighters.forEach((ff) => {
    if (ff.last_hold_date) {
      const dateKey = ff.last_hold_date.split("T")[0];
      const existingHolds = holdsByDate.get(dateKey) || [];
      const alreadyExists = existingHolds.some(
        (h) => h.firefighter_id === ff.id
      );

      if (!alreadyExists) {
        // Creates synthetic past hold - REMOVED to fix duplicates
        const pastHold: ScheduledHold = { ... };
        holdsByDate.get(dateKey)!.push(pastHold);
      }
    }
  });
  */

  // Match calendar days to holds using local date formatting
  return days.map((day) => {
    const dayKey = formatDateForDB(day.date);
    return {
      ...day,
      scheduledHolds: holdsByDate.get(dayKey) || [],
    };
  });
}

export function formatDateForDB(date: Date): string {
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
    throw new Error("Invalid date provided to formatDateForDB");
  }
  // Always use local date components to avoid timezone shifts
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function parseDateStringLocal(dateString: string): Date {
  if (!dateString || typeof dateString !== "string") {
    throw new Error("Invalid date string provided to parseDateStringLocal");
  }
  // Parse YYYY-MM-DD as local date, not UTC
  const [year, month, day] = dateString.split("-").map(Number);
  if (!year || !month || !day || month < 1 || month > 12 || day < 1 || day > 31) {
    throw new Error(`Malformed date string: ${dateString}`);
  }
  const date = new Date(year, month - 1, day);
  if (isNaN(date.getTime())) {
    throw new Error(`Invalid date values: ${dateString}`);
  }
  return date;
}

export function formatMonthYear(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

export function getMonthDateRange(
  year: number,
  month: number
): { start: string; end: string } {
  const start = new Date(year, month, 1);
  const end = new Date(year, month + 1, 0);
  return {
    start: formatDateForDB(start),
    end: formatDateForDB(end),
  };
}

export function autoScheduleNextHolds(
  firefighters: Firefighter[],
  startDate: Date,
  daysToSchedule: number
): Array<{ date: string; firefighter: Firefighter }> {
  if (!firefighters || !Array.isArray(firefighters)) return [];
  if (!startDate || !(startDate instanceof Date) || isNaN(startDate.getTime())) return [];
  
  const available = firefighters
    .filter((ff) => ff.is_available)
    .sort((a, b) => a.order_position - b.order_position);

  if (available.length === 0) return [];

  const schedule: Array<{ date: string; firefighter: Firefighter }> = [];
  let currentDate = new Date(startDate);
  let firefighterIndex = 0;

  for (let i = 0; i < daysToSchedule; i++) {
    schedule.push({
      date: formatDateForDB(currentDate),
      firefighter: available[firefighterIndex],
    });

    firefighterIndex = (firefighterIndex + 1) % available.length;
    currentDate = new Date(currentDate);
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return schedule;
}

export function getNextAvailableFirefighter(
  firefighters: Firefighter[]
): Firefighter | null {
  if (!firefighters || !Array.isArray(firefighters)) return null;
  
  const available = firefighters
    .filter((ff) => ff.is_available)
    .sort((a, b) => {
      // Handle NaN by treating as Infinity (sorts to end)
      const aPos = isNaN(a.order_position) ? Infinity : a.order_position;
      const bPos = isNaN(b.order_position) ? Infinity : b.order_position;
      return aPos - bPos;
    });

  return available.length > 0 ? available[0] : null;
}

export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }
  return parts
    .map((part) => part[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();
}

/**
 * Formats a full name for display on the calendar.
 * Returns: "J. LastName" format (first initial with period, space, full last name)
 * Examples: "John Bryson" -> "J. Bryson", "Sarah Jane Richardson" -> "S. Richardson"
 */
export function formatCalendarName(fullName: string): string {
  const parts = fullName.trim().split(/\s+/);

  if (parts.length === 1) {
    // Single name, just return it
    return parts[0];
  }

  // First initial + period + last part (last name)
  const firstInitial = parts[0][0].toUpperCase();
  const lastName = parts[parts.length - 1];

  return `${firstInitial}. ${lastName}`;
}
