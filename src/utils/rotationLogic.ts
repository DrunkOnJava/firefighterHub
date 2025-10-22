import { Firefighter } from '../lib/supabase';

export function sortFirefighters(firefighters: Firefighter[]): Firefighter[] {
  return [...firefighters].sort((a, b) => {
    if (!a.is_available && b.is_available) return 1;
    if (a.is_available && !b.is_available) return -1;

    return a.order_position - b.order_position;
  });
}

export function recalculatePositions(firefighters: Firefighter[]): Firefighter[] {
  const unavailable = firefighters.filter(ff => !ff.is_available);
  const available = firefighters.filter(ff => ff.is_available).sort((a, b) => a.order_position - b.order_position);

  const sorted = [...available, ...unavailable];

  return sorted.map((ff, index) => ({
    ...ff,
    order_position: index
  }));
}

export function assignPositions(firefighters: Firefighter[]): Firefighter[] {
  return firefighters.map((ff, index) => ({
    ...ff,
    order_position: index
  }));
}

export function moveToBottom(firefighters: Firefighter[], firefighterId: string): Firefighter[] {
  const firefighter = firefighters.find(ff => ff.id === firefighterId);
  if (!firefighter || !firefighter.is_available) return firefighters;

  const available = firefighters.filter(ff => ff.is_available);

  const maxAvailablePosition = available.length > 0
    ? Math.max(...available.map(ff => ff.order_position))
    : -1;

  return firefighters.map(ff => {
    if (ff.id === firefighterId) {
      return { ...ff, order_position: maxAvailablePosition + 1 };
    }
    return ff;
  });
}

export function formatHoldListMessage(firefighters: Firefighter[], shiftName: string = 'C-shift'): string {
  const available = firefighters
    .filter(ff => ff.is_available)
    .sort((a, b) => a.order_position - b.order_position);

  if (available.length === 0) {
    return `Hold list ${shiftName} hold list:\n\nNo firefighters currently in rotation.`;
  }

  const lines = available.map(ff => {
    const station = ff.fire_station ? `Station #${ff.fire_station}` : 'Station #?';
    const date = ff.last_hold_date
      ? new Date(ff.last_hold_date).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' })
      : 'Not yet';
    return `${ff.name} ${date} ${station}`;
  });

  return `Hold list ${shiftName} hold list:\n\n${lines.join('\n')}`;
}
