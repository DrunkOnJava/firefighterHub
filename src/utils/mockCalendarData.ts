/**
 * Mock Data Generators
 * 
 * Generate realistic mock data for calendar roster page testing.
 */

import { Shift, HoldDuration } from '../lib/supabase';
import { CalendarEvent, RosterEntry, EventType } from '../types/calendarRoster';

/**
 * Generate mock calendar events for a given month
 */
export function generateMockCalendarEvents(
  year: number,
  month: number,
  count: number = 20
): CalendarEvent[] {
  const events: CalendarEvent[] = [];
  const shifts: Shift[] = ['A', 'B', 'C'];
  const eventTypes: EventType[] = ['hold', 'training', 'meeting', 'incident', 'other'];
  const firefighterNames = [
    'Johnson', 'Smith', 'Williams', 'Brown', 'Davis',
    'Miller', 'Wilson', 'Moore', 'Taylor', 'Anderson',
    'Thomas', 'Jackson', 'White', 'Harris', 'Martin',
  ];

  // Get the number of days in the month
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  for (let i = 0; i < count; i++) {
    const day = Math.floor(Math.random() * daysInMonth) + 1;
    const shift = shifts[Math.floor(Math.random() * shifts.length)];
    const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
    const firefighterName = firefighterNames[Math.floor(Math.random() * firefighterNames.length)];
    
    // Generate time
    const hour = Math.floor(Math.random() * 24);
    const minute = Math.floor(Math.random() * 4) * 15; // 0, 15, 30, 45
    const startTime = new Date(year, month, day, hour, minute).toISOString();

    // Generate event title based on type
    const eventTitle = getEventTitle(eventType, firefighterName);

    events.push({
      id: `event-${i}`,
      type: eventType,
      title: eventTitle,
      shift,
      startTime,
      duration: eventType === 'hold' ? (Math.random() > 0.5 ? '12h' : '24h') : undefined,
      firefighterId: `ff-${i}`,
      firefighterName: eventType === 'hold' ? firefighterName : undefined,
      station: eventType === 'hold' ? `${Math.floor(Math.random() * 5) + 1}` : undefined,
      notes: eventType === 'incident' ? 'Major incident response' : undefined,
    });
  }

  return events.sort((a, b) => 
    new Date(a.startTime!).getTime() - new Date(b.startTime!).getTime()
  );
}

/**
 * Generate event title based on type
 */
function getEventTitle(type: EventType, name: string): string {
  switch (type) {
    case 'hold':
      return `${name} - Hold`;
    case 'training':
      return 'Training Session';
    case 'meeting':
      return 'Department Meeting';
    case 'incident':
      return 'Major Incident';
    case 'other':
      return 'Special Event';
    default:
      return 'Event';
  }
}

/**
 * Generate mock roster entries
 */
export function generateMockRosterEntries(
  shift: Shift,
  count: number = 15
): RosterEntry[] {
  const entries: RosterEntry[] = [];
  const firstNames = [
    'James', 'John', 'Robert', 'Michael', 'William',
    'David', 'Richard', 'Joseph', 'Thomas', 'Charles',
    'Christopher', 'Daniel', 'Matthew', 'Anthony', 'Mark',
    'Donald', 'Steven', 'Paul', 'Andrew', 'Joshua',
  ];
  const lastNames = [
    'Smith', 'Johnson', 'Williams', 'Brown', 'Jones',
    'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
    'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson',
    'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin',
  ];

  const certifications = [
    ['EMT', 'Driver'],
    ['Paramedic', 'Driver', 'Officer'],
    ['EMT'],
    ['Paramedic', 'Hazmat'],
    ['Driver', 'Officer'],
  ];

  for (let i = 0; i < count; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const isAvailable = Math.random() > 0.2; // 80% available
    
    // Generate a random past date for last hold
    const daysAgo = Math.floor(Math.random() * 90); // 0-90 days ago
    const lastHoldDate = new Date();
    lastHoldDate.setDate(lastHoldDate.getDate() - daysAgo);

    entries.push({
      id: `roster-${shift}-${i}`,
      firefighterName: `${firstName} ${lastName}`,
      shift,
      station: `${Math.floor(Math.random() * 5) + 1}`,
      position: i,
      isAvailable,
      lastHoldDate: isAvailable ? lastHoldDate.toISOString().split('T')[0] : undefined,
      certifications: certifications[Math.floor(Math.random() * certifications.length)],
    });
  }

  return entries;
}

/**
 * Generate a complete dataset for testing
 */
export function generateMockDataset(shift: Shift = 'A') {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  return {
    events: generateMockCalendarEvents(year, month, 25),
    roster: generateMockRosterEntries(shift, 18),
  };
}
