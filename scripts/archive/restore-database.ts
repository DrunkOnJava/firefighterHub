import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// Load environment variables
const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

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

async function restoreDatabase() {
  console.log('🔄 Starting database restore...\n');

  // Read the dump file
  const dumpPath = path.join(process.cwd(), 'database_dump_2025-10-28T23-28-56-081Z.json');
  const dumpContent = fs.readFileSync(dumpPath, 'utf-8');
  const dump: DatabaseDump = JSON.parse(dumpContent);

  console.log(`📊 Dump info:`);
  console.log(`  Timestamp: ${dump.timestamp}`);
  console.log(`  Firefighters: ${dump.data.firefighters.length}`);
  console.log(`  Scheduled holds: ${dump.data.scheduled_holds.length}`);
  console.log(`  Activity logs: ${dump.data.activity_log.length}\n`);

  // 1. Insert firefighters
  console.log('👥 Restoring firefighters...');
  const firefighters = dump.data.firefighters.map((ff: OldFirefighter) => ({
    id: ff.id,
    name: ff.name,
    order_position: ff.order_position,
    is_available: ff.is_available,
    is_active: ff.is_active,
    shift: ff.shift,
    fire_station: ff.fire_station,
    last_hold_date: ff.last_hold_date,
    certification_level: ff.certification_level,
    apparatus_ambulance: ff.apparatus_ambulance,
    apparatus_brush_truck: ff.apparatus_brush_truck,
    apparatus_engine: ff.apparatus_engine,
    apparatus_tanker: ff.apparatus_tanker,
    apparatus_truck: ff.apparatus_truck,
    apparatus_boat: ff.apparatus_boat,
    apparatus_utv: ff.apparatus_utv,
    apparatus_rescue_squad: ff.apparatus_rescue_squad,
    is_fto: ff.is_fto,
    is_bls: ff.is_bls,
    is_als: ff.is_als,
    hours_worked_this_period: 0,  // New field, default to 0
    last_hours_reset_date: null,  // New field
    created_at: ff.created_at,
    updated_at: ff.updated_at,
  }));

  const { error: ffError } = await supabase
    .from('firefighters')
    .insert(firefighters);

  if (ffError) {
    console.error('❌ Error inserting firefighters:', ffError);
    process.exit(1);
  }
  console.log(`✅ Inserted ${firefighters.length} firefighters\n`);

  // 2. Insert scheduled holds
  console.log('📅 Restoring scheduled holds...');

  // Create a map of firefighter IDs to names for holds that might not have the name
  const ffMap = new Map(firefighters.map(ff => [ff.id, { name: ff.name, shift: ff.shift, station: ff.fire_station }]));

  const holds = dump.data.scheduled_holds.map((hold: OldScheduledHold) => {
    const ff = ffMap.get(hold.firefighter_id);

    // Determine the hold_date (prefer hold_date, fallback to scheduled_date)
    const holdDate = hold.hold_date || hold.scheduled_date;

    // Determine status (prefer status, fallback to is_completed)
    let status = hold.status || 'scheduled';
    if (!hold.status && hold.is_completed !== undefined) {
      status = hold.is_completed ? 'completed' : 'scheduled';
    }

    return {
      id: hold.id,
      firefighter_id: hold.firefighter_id,
      firefighter_name: hold.firefighter_name || ff?.name || 'Unknown',
      hold_date: holdDate,
      status: status,
      shift: hold.shift || ff?.shift || 'A',
      fire_station: hold.fire_station !== undefined ? hold.fire_station : ff?.station,
      lent_to_shift: null,  // New field, not in old data
      notes: hold.notes || null,
      duration: '24h',  // New field, default to 24h
      start_time: '07:00:00',  // New field, default to 07:00
      created_at: hold.created_at,
      updated_at: hold.updated_at,
      completed_at: hold.completed_at,
    };
  });

  const { error: holdsError } = await supabase
    .from('scheduled_holds')
    .insert(holds);

  if (holdsError) {
    console.error('❌ Error inserting scheduled holds:', holdsError);
    process.exit(1);
  }
  console.log(`✅ Inserted ${holds.length} scheduled holds\n`);

  // 3. Insert activity logs (if any)
  if (dump.data.activity_log && dump.data.activity_log.length > 0) {
    console.log('📝 Restoring activity logs...');
    const { error: logError } = await supabase
      .from('activity_log')
      .insert(dump.data.activity_log);

    if (logError) {
      console.error('❌ Error inserting activity logs:', logError);
      process.exit(1);
    }
    console.log(`✅ Inserted ${dump.data.activity_log.length} activity logs\n`);
  }

  console.log('✨ Database restore complete!');
}

restoreDatabase().catch(console.error);
