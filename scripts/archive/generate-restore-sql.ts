import * as fs from 'fs';
import * as path from 'path';

interface OldFirefighter {
  id: string;
  name: string;
  order_position: number;
  is_available: boolean;
  is_active: boolean;
  shift: string;
  fire_station: string | null;
  last_hold_date: string | null;
  certification_level: string | null;
  apparatus_ambulance: boolean;
  apparatus_brush_truck: boolean;
  apparatus_engine: boolean;
  apparatus_tanker: boolean;
  apparatus_truck: boolean;
  apparatus_boat: boolean;
  apparatus_utv: boolean;
  apparatus_rescue_squad: boolean;
  is_fto: boolean;
  is_bls: boolean;
  is_als: boolean;
  created_at: string;
  updated_at: string;
}

interface OldScheduledHold {
  id: string;
  firefighter_id: string;
  scheduled_date?: string;
  hold_date?: string;
  is_completed?: boolean;
  status?: string;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
  firefighter_name?: string;
  shift?: string;
  fire_station?: string | null;
  notes?: string | null;
}

interface DatabaseDump {
  timestamp: string;
  metadata: {
    supabaseUrl: string;
    tables: string[];
  };
  data: {
    firefighters: OldFirefighter[];
    scheduled_holds: OldScheduledHold[];
    activity_log: any[];
  };
}

function escapeSQL(value: any): string {
  if (value === null || value === undefined) {
    return 'NULL';
  }
  if (typeof value === 'boolean') {
    return value ? 'true' : 'false';
  }
  if (typeof value === 'number') {
    return value.toString();
  }
  // Escape single quotes in strings
  const str = value.toString().replace(/'/g, "''");
  return `'${str}'`;
}

function generateSQL() {
  console.log('Generating SQL restore script...\n');

  // Read the dump file
  const dumpPath = path.join(process.cwd(), 'database_dump_2025-10-28T23-28-56-081Z.json');
  const dumpContent = fs.readFileSync(dumpPath, 'utf-8');
  const dump: DatabaseDump = JSON.parse(dumpContent);

  let sql = '-- Database Restore Script\n';
  sql += `-- Generated from dump: ${dump.timestamp}\n`;
  sql += `-- Firefighters: ${dump.data.firefighters.length}\n`;
  sql += `-- Scheduled holds: ${dump.data.scheduled_holds.length}\n\n`;

  // Generate INSERT statements for firefighters
  sql += '-- Insert firefighters\n';
  for (const ff of dump.data.firefighters) {
    sql += `INSERT INTO firefighters (
      id, name, order_position, is_available, is_active, shift, fire_station,
      last_hold_date, certification_level,
      apparatus_ambulance, apparatus_brush_truck, apparatus_engine, apparatus_tanker,
      apparatus_truck, apparatus_boat, apparatus_utv, apparatus_rescue_squad,
      is_fto, is_bls, is_als, hours_worked_this_period, last_hours_reset_date,
      created_at, updated_at
    ) VALUES (
      ${escapeSQL(ff.id)},
      ${escapeSQL(ff.name)},
      ${ff.order_position},
      ${ff.is_available},
      ${ff.is_active},
      ${escapeSQL(ff.shift)},
      ${escapeSQL(ff.fire_station)},
      ${escapeSQL(ff.last_hold_date)},
      ${escapeSQL(ff.certification_level)},
      ${ff.apparatus_ambulance},
      ${ff.apparatus_brush_truck},
      ${ff.apparatus_engine},
      ${ff.apparatus_tanker},
      ${ff.apparatus_truck},
      ${ff.apparatus_boat},
      ${ff.apparatus_utv},
      ${ff.apparatus_rescue_squad},
      ${ff.is_fto},
      ${ff.is_bls},
      ${ff.is_als},
      0,
      NULL,
      ${escapeSQL(ff.created_at)},
      ${escapeSQL(ff.updated_at)}
    );\n`;
  }

  sql += '\n-- Insert scheduled holds\n';

  // Create a map for firefighter lookup
  const ffMap = new Map(dump.data.firefighters.map(ff => [ff.id, { name: ff.name, shift: ff.shift, station: ff.fire_station }]));

  for (const hold of dump.data.scheduled_holds) {
    const ff = ffMap.get(hold.firefighter_id);
    const holdDate = hold.hold_date || hold.scheduled_date;
    let status = hold.status || 'scheduled';
    if (!hold.status && hold.is_completed !== undefined) {
      status = hold.is_completed ? 'completed' : 'scheduled';
    }

    sql += `INSERT INTO scheduled_holds (
      id, firefighter_id, firefighter_name, hold_date, status, shift,
      fire_station, lent_to_shift, notes, duration, start_time,
      created_at, updated_at, completed_at
    ) VALUES (
      ${escapeSQL(hold.id)},
      ${escapeSQL(hold.firefighter_id)},
      ${escapeSQL(hold.firefighter_name || ff?.name || 'Unknown')},
      ${escapeSQL(holdDate)},
      ${escapeSQL(status)}::hold_status,
      ${escapeSQL(hold.shift || ff?.shift || 'A')},
      ${escapeSQL(hold.fire_station !== undefined ? hold.fire_station : ff?.station)},
      NULL,
      ${escapeSQL(hold.notes)},
      '24h'::hold_duration,
      '07:00:00'::time,
      ${escapeSQL(hold.created_at)},
      ${escapeSQL(hold.updated_at)},
      ${escapeSQL(hold.completed_at)}
    );\n`;
  }

  sql += '\n-- Restore complete\n';

  // Write SQL to file
  const outputPath = path.join(process.cwd(), 'scripts', 'restore-data.sql');
  fs.writeFileSync(outputPath, sql);
  console.log(`✅ SQL script generated: ${outputPath}`);
  console.log(`\nYou can now apply it using:`);
  console.log(`  - Supabase Dashboard SQL Editor`);
  console.log(`  - or via psql/Supabase CLI\n`);
}

generateSQL();
