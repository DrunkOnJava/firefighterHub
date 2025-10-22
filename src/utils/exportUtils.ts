import { Firefighter } from '../lib/supabase';

interface HoldRecord {
  firefighter_name: string;
  hold_date: string;
  fire_station: string | null;
  status: string;
  shift: string;
}

/**
 * Converts data array to CSV format
 */
function convertToCSV(headers: string[], rows: string[][]): string {
  const csvHeaders = headers.join(',');
  const csvRows = rows.map(row =>
    row.map(cell => {
      // Escape cells containing commas, quotes, or newlines
      const stringCell = String(cell);
      if (stringCell.includes(',') || stringCell.includes('"') || stringCell.includes('\n')) {
        return `"${stringCell.replace(/"/g, '""')}"`;
      }
      return stringCell;
    }).join(',')
  );

  return [csvHeaders, ...csvRows].join('\n');
}

/**
 * Downloads a file with given content
 */
function downloadFile(content: string, filename: string, mimeType: string = 'text/csv') {
  const blob = new Blob([content], { type: mimeType });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

/**
 * Exports firefighter roster data as CSV
 */
export function exportRosterToCSV(firefighters: Firefighter[], shift: string) {
  const headers = [
    'Name',
    'Shift',
    'Station',
    'Certification Level',
    'Available',
    'Ambulance',
    'Engine',
    'Truck',
    'Tanker',
    'Brush Truck',
    'Boat',
    'UTV',
    'Rescue Squad',
    'FTO',
    'BLS',
    'ALS',
    'Last Hold Date'
  ];

  const rows = firefighters.map(ff => [
    ff.name,
    ff.shift,
    ff.fire_station || 'N/A',
    ff.certification_level || 'N/A',
    ff.is_available ? 'Yes' : 'No',
    ff.apparatus_ambulance ? 'Yes' : 'No',
    ff.apparatus_engine ? 'Yes' : 'No',
    ff.apparatus_truck ? 'Yes' : 'No',
    ff.apparatus_tanker ? 'Yes' : 'No',
    ff.apparatus_brush_truck ? 'Yes' : 'No',
    ff.apparatus_boat ? 'Yes' : 'No',
    ff.apparatus_utv ? 'Yes' : 'No',
    ff.apparatus_rescue_squad ? 'Yes' : 'No',
    ff.is_fto ? 'Yes' : 'No',
    ff.is_bls ? 'Yes' : 'No',
    ff.is_als ? 'Yes' : 'No',
    ff.last_hold_date || 'N/A'
  ]);

  const csv = convertToCSV(headers, rows);
  const timestamp = new Date().toISOString().split('T')[0];
  const filename = `roster_shift_${shift}_${timestamp}.csv`;

  downloadFile(csv, filename);
  return filename;
}

/**
 * Exports hold schedule data as CSV
 */
export function exportHoldsToCSV(holds: HoldRecord[], shift: string, month?: string) {
  const headers = [
    'Firefighter',
    'Hold Date',
    'Station',
    'Status',
    'Shift'
  ];

  const rows = holds.map(hold => [
    hold.firefighter_name,
    hold.hold_date,
    hold.fire_station || 'N/A',
    hold.status,
    hold.shift
  ]);

  const csv = convertToCSV(headers, rows);
  const timestamp = new Date().toISOString().split('T')[0];
  const monthStr = month ? `_${month}` : '';
  const filename = `holds_shift_${shift}${monthStr}_${timestamp}.csv`;

  downloadFile(csv, filename);
  return filename;
}

/**
 * Exports roster data as JSON
 */
export function exportRosterToJSON(firefighters: Firefighter[], shift: string) {
  const data = firefighters.map(ff => ({
    name: ff.name,
    shift: ff.shift,
    station: ff.fire_station,
    certificationLevel: ff.certification_level,
    available: ff.is_available,
    apparatus: {
      ambulance: ff.apparatus_ambulance,
      engine: ff.apparatus_engine,
      truck: ff.apparatus_truck,
      tanker: ff.apparatus_tanker,
      brushTruck: ff.apparatus_brush_truck,
      boat: ff.apparatus_boat,
      utv: ff.apparatus_utv,
      rescueSquad: ff.apparatus_rescue_squad
    },
    qualifications: {
      fto: ff.is_fto,
      bls: ff.is_bls,
      als: ff.is_als
    },
    lastHoldDate: ff.last_hold_date
  }));

  const json = JSON.stringify(data, null, 2);
  const timestamp = new Date().toISOString().split('T')[0];
  const filename = `roster_shift_${shift}_${timestamp}.json`;

  downloadFile(json, filename, 'application/json');
  return filename;
}

/**
 * Formats current date for filenames
 */
export function getExportTimestamp(): string {
  return new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
}
