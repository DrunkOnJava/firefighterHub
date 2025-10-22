import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ScheduledHold {
  id: string;
  firefighter_name: string;
  hold_date: string;
  fire_station: string | null;
  status: string;
  shift: string;
  notes: string | null;
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const shift = url.searchParams.get('shift')?.toUpperCase();

    // Validate shift parameter
    if (shift && !['A', 'B', 'C'].includes(shift)) {
      return new Response('Invalid shift parameter. Must be A, B, or C.', {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'text/plain' },
      });
    }

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    // Fetch holds from database
    const now = new Date();
    const past30Days = new Date(now);
    past30Days.setDate(past30Days.getDate() - 30);

    const future180Days = new Date(now);
    future180Days.setDate(future180Days.getDate() + 180);

    let query = supabaseClient
      .from('scheduled_holds')
      .select('*')
      .gte('hold_date', past30Days.toISOString().split('T')[0])
      .lte('hold_date', future180Days.toISOString().split('T')[0])
      .order('hold_date', { ascending: true });

    if (shift) {
      query = query.eq('shift', shift);
    }

    const { data: holds, error } = await query;

    if (error) {
      console.error('Database error:', error);
      return new Response('Error fetching hold schedule', {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'text/plain' },
      });
    }

    // Generate iCalendar content
    const icalContent = generateICalendar(holds || [], shift || undefined);

    // Return iCalendar file
    return new Response(icalContent, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/calendar; charset=utf-8',
        'Content-Disposition': `attachment; filename="firefighter-holds${shift ? `-shift-${shift}` : ''}.ics"`,
        'Cache-Control': 'public, max-age=1800', // 30 minutes
      },
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response('Internal server error', {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'text/plain' },
    });
  }
});

function generateICalendar(holds: ScheduledHold[], shift?: string): string {
  const now = new Date();
  const timestamp = formatICalDate(now);
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
  holds.forEach(hold => {
    ical += '\r\n' + generateEvent(hold, timestamp);
  });

  ical += '\r\nEND:VCALENDAR';

  return ical;
}

function generateEvent(hold: ScheduledHold, timestamp: string): string {
  const holdDate = new Date(hold.hold_date + 'T00:00:00');
  const dateStr = formatICalDate(holdDate, true);

  const statusMark = hold.status === 'completed' ? ' ✓' : '';
  const summary = `${hold.firefighter_name} - Hold${statusMark}`;

  const description = [
    `Firefighter: ${hold.firefighter_name}`,
    `Shift: ${hold.shift}`,
    hold.fire_station ? `Station: ${hold.fire_station}` : null,
    `Status: ${hold.status}`,
    hold.notes ? `Notes: ${hold.notes}` : null,
  ].filter(Boolean).join('\\n');

  const location = hold.fire_station ? `Fire Station ${hold.fire_station}` : '';
  const uid = `hold-${hold.id}@firefighterhub.app`;
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
    'SEQUENCE:0',
    'CLASS:PUBLIC',
    'END:VEVENT',
  ].filter(Boolean).join('\r\n');
}

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

function escapeICalText(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n');
}
