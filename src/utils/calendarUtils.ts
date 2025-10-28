import { Firefighter, Shift } from "../lib/supabase";

export interface ScheduledHold {
  id: string;
  firefighter_id: string;
  firefighter_name: string;
  hold_date: string;
  status: "scheduled" | "completed" | "skipped";
  shift: Shift;
  fire_station: string | null;
  lent_to_shift: Shift | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  completed_at: string | null;
}

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
  firefighters: Firefighter[]
): CalendarDay[] {
  const holdsByDate = new Map<string, ScheduledHold[]>();

  holds.forEach((hold) => {
    // Ensure date string is in YYYY-MM-DD format without time
    const dateKey = hold.hold_date.split("T")[0];
    if (!holdsByDate.has(dateKey)) {
      holdsByDate.set(dateKey, []);
    }
    holdsByDate.get(dateKey)!.push(hold);
  });

  firefighters.forEach((ff) => {
    if (ff.last_hold_date) {
      const dateKey = ff.last_hold_date.split("T")[0];
      const existingHolds = holdsByDate.get(dateKey) || [];
      const alreadyExists = existingHolds.some(
        (h) => h.firefighter_id === ff.id
      );

      if (!alreadyExists) {
        const pastHold: ScheduledHold = {
          id: `past-${ff.id}`,
          firefighter_id: ff.id,
          firefighter_name: ff.name,
          hold_date: ff.last_hold_date,
          status: "completed",
          shift: ff.shift,
          fire_station: ff.fire_station,
          lent_to_shift: null, // Past holds don't track lent-to shift
          notes: null,
          created_at: ff.last_hold_date,
          updated_at: ff.last_hold_date,
          completed_at: ff.last_hold_date,
        };

        if (!holdsByDate.has(dateKey)) {
          holdsByDate.set(dateKey, []);
        }
        holdsByDate.get(dateKey)!.push(pastHold);
      }
    }
  });

  return days.map((day) => ({
    ...day,
    scheduledHolds: holdsByDate.get(formatDateForDB(day.date)) || [],
  }));
}

export function formatDateForDB(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function parseDateStringLocal(dateString: string): Date {
  // Parse YYYY-MM-DD as local date, not UTC
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day);
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
  const available = firefighters
    .filter((ff) => ff.is_available)
    .sort((a, b) => a.order_position - b.order_position);

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
