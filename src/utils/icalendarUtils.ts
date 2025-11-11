import { Shift } from '@/lib/supabase';

interface ScheduledHold {
  id: string;
  firefighter_name: string;
  hold_date: string;
  fire_station: string | null;
  status: string;
  shift: Shift;
  notes: string | null;
}

/**
 * Generates an RFC 5545 compliant iCalendar file for hold schedules
 */
export function generateICalendar(holds: ScheduledHold[], shift?: Shift): string {
  const now = new Date();
  const timestamp = formatICalDate(now);

  // Filter by shift if specified
  const filteredHolds = shift
    ? holds.filter(h => h.shift === shift)
    : holds;

  const shiftLabel = shift ? `Shift ${shift}` : 'All Shifts';

  let ical = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//FirefighterHub//Hold Schedule//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:Firefighter Holds - ${shiftLabel}`,
    'X-WR-TIMEZONE:America/New_York',
    `X-WR-CALDESC:Firefighter hold schedule for ${shiftLabel}`,
    'X-PUBLISHED-TTL:PT30M',
    'REFRESH-INTERVAL;VALUE=DURATION:PT30M',
  ].join('\r\n');

  // Add timezone component
  ical += '\r\n' + [
    'BEGIN:VTIMEZONE',
    'TZID:America/New_York',
    'BEGIN:STANDARD',
    'DTSTART:19701101T020000',
    'RRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU',
    'TZOFFSETFROM:-0400',
    'TZOFFSETTO:-0500',
    'END:STANDARD',
    'BEGIN:DAYLIGHT',
    'DTSTART:19700308T020000',
    'RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU',
    'TZOFFSETFROM:-0500',
    'TZOFFSETTO:-0400',
    'END:DAYLIGHT',
    'END:VTIMEZONE',
  ].join('\r\n');

  // Add events
  filteredHolds.forEach(hold => {
    ical += '\r\n' + generateEvent(hold, timestamp);
  });

  ical += '\r\nEND:VCALENDAR';

  return ical;
}

function generateEvent(hold: ScheduledHold, timestamp: string): string {
  const holdDate = new Date(hold.hold_date + 'T00:00:00');
  const dateStr = formatICalDate(holdDate, true); // All-day event format

  const summary = `${hold.firefighter_name} - Hold`;
  const statusMark = hold.status === 'completed' ? ' (Completed)' : '';
  const description = [
    `Firefighter: ${hold.firefighter_name}`,
    `Shift: ${hold.shift}`,
    hold.fire_station ? `Station: ${hold.fire_station}` : null,
    `Status: ${hold.status}${statusMark}`,
    hold.notes ? `Notes: ${hold.notes}` : null,
  ].filter(Boolean).join('\\n');

  const location = hold.fire_station ? `Fire Station ${hold.fire_station}` : '';
  const uid = `hold-${hold.id}@firefighterhub.app`;

  // Determine status
  const status = hold.status === 'completed' ? 'CONFIRMED' : 'TENTATIVE';

  return [
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${timestamp}`,
    `DTSTART;VALUE=DATE:${dateStr}`,
    `SUMMARY:${escapeICalText(summary)}`,
    `DESCRIPTION:${escapeICalText(description)}`,
    location ? `LOCATION:${escapeICalText(location)}` : null,
    `STATUS:${status}`,
    'TRANSP:OPAQUE',
    `SEQUENCE:0`,
    'CLASS:PUBLIC',
    'END:VEVENT',
  ].filter(Boolean).join('\r\n');
}

/**
 * Format date for iCalendar (YYYYMMDDTHHMMSSZ for datetime, YYYYMMDD for all-day)
 */
function formatICalDate(date: Date, allDay: boolean = false): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');

  if (allDay) {
    return `${year}${month}${day}`;
  }

  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  const seconds = String(date.getUTCSeconds()).padStart(2, '0');

  return `${year}${month}${day}T${hours}${minutes}${seconds}Z`;
}

/**
 * Escape special characters for iCalendar text fields
 */
function escapeICalText(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n');
}

/**
 * Generate subscription URL for calendar feed
 */
export function getCalendarSubscriptionURL(baseURL: string, shift?: Shift): string {
  const params = new URLSearchParams();
  if (shift) params.set('shift', shift);

  const queryString = params.toString();
  const url = `${baseURL}/api/calendar/hold-schedule.ics${queryString ? '?' + queryString : ''}`;

  return url;
}

/**
 * Generate webcal:// URL for one-click subscription
 */
export function getWebcalURL(httpsURL: string): string {
  return httpsURL.replace(/^https:\/\//, 'webcal://');
}
