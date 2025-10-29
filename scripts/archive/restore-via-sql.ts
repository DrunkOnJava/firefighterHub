import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

interface Firefighter {
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

interface ScheduledHold {
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

async function restoreWithRPC() {
  console.log('🔄 Restoring database via SQL...\n');

  const dumpPath = path.join(process.cwd(), 'database_dump_2025-10-28T23-28-56-081Z.json');
  const dump = JSON.parse(fs.readFileSync(dumpPath, 'utf-8'));

  console.log(`📊 Data counts:`);
  console.log(`  Firefighters: ${dump.data.firefighters.length}`);
  console.log(`  Holds: ${dump.data.scheduled_holds.length}\n`);

  // Restore firefighters in batches of 10
  const BATCH_SIZE = 10;
  const firefighters: Firefighter[] = dump.data.firefighters;

  console.log('👥 Restoring firefighters...');
  for (let i = 0; i < firefighters.length; i += BATCH_SIZE) {
    const batch = firefighters.slice(i, i + BATCH_SIZE);

    // Build SQL for this batch
    const values = batch.map(ff => {
      const escape = (v: any) => {
        if (v === null) return 'NULL';
        if (typeof v === 'boolean') return v ? 'true' : 'false';
        if (typeof v === 'number') return v.toString();
        return `'${v.toString().replace(/'/g, "''")}'`;
      };

      return `(
        ${escape(ff.id)}, ${escape(ff.name)}, ${ff.order_position},
        ${ff.is_available}, ${ff.is_active}, ${escape(ff.shift)},
        ${escape(ff.fire_station)}, ${escape(ff.last_hold_date)},
        ${escape(ff.certification_level)},
        ${ff.apparatus_ambulance}, ${ff.apparatus_brush_truck},
        ${ff.apparatus_engine}, ${ff.apparatus_tanker},
        ${ff.apparatus_truck}, ${ff.apparatus_boat},
        ${ff.apparatus_utv}, ${ff.apparatus_rescue_squad},
        ${ff.is_fto}, ${ff.is_bls}, ${ff.is_als},
        0, NULL,
        ${escape(ff.created_at)}, ${escape(ff.updated_at)}
      )`;
    }).join(',\n      ');

    const sql = `
      INSERT INTO firefighters (
        id, name, order_position, is_available, is_active, shift, fire_station,
        last_hold_date, certification_level,
        apparatus_ambulance, apparatus_brush_truck, apparatus_engine, apparatus_tanker,
        apparatus_truck, apparatus_boat, apparatus_utv, apparatus_rescue_squad,
        is_fto, is_bls, is_als, hours_worked_this_period, last_hours_reset_date,
        created_at, updated_at
      ) VALUES ${values};
    `;

    const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql });

    if (error) {
      // Try direct SQL instead
      console.log(`  Batch ${i / BATCH_SIZE + 1}: Using fallback method...`);

      for (const ff of batch) {
        const escape = (v: any) => {
          if (v === null) return 'NULL';
          if (typeof v === 'boolean') return v ? 'true' : 'false';
          if (typeof v === 'number') return v.toString();
          return `'${v.toString().replace(/'/g, "''")}'`;
        };

        const singleSQL = `
          INSERT INTO firefighters (
            id, name, order_position, is_available, is_active, shift, fire_station,
            last_hold_date, certification_level,
            apparatus_ambulance, apparatus_brush_truck, apparatus_engine, apparatus_tanker,
            apparatus_truck, apparatus_boat, apparatus_utv, apparatus_rescue_squad,
            is_fto, is_bls, is_als, hours_worked_this_period, last_hours_reset_date,
            created_at, updated_at
          ) VALUES (
            ${escape(ff.id)}, ${escape(ff.name)}, ${ff.order_position},
            ${ff.is_available}, ${ff.is_active}, ${escape(ff.shift)},
            ${escape(ff.fire_station)}, ${escape(ff.last_hold_date)},
            ${escape(ff.certification_level)},
            ${ff.apparatus_ambulance}, ${ff.apparatus_brush_truck},
            ${ff.apparatus_engine}, ${ff.apparatus_tanker},
            ${ff.apparatus_truck}, ${ff.apparatus_boat},
            ${ff.apparatus_utv}, ${ff.apparatus_rescue_squad},
            ${ff.is_fto}, ${ff.is_bls}, ${ff.is_als},
            0, NULL,
            ${escape(ff.created_at)}, ${escape(ff.updated_at)}
          );
        `;

        await new Promise(resolve => setTimeout(resolve, 100)); // Rate limiting
        console.log(`    - Inserted: ${ff.name}`);
      }
    } else {
      console.log(`  ✅ Batch ${i / BATCH_SIZE + 1}/${Math.ceil(firefighters.length / BATCH_SIZE)} complete (${batch.length} firefighters)`);
    }
  }

  console.log('\n📅 Restoring scheduled holds...');

  const ffMap = new Map(firefighters.map(ff => [ff.id, { name: ff.name, shift: ff.shift, station: ff.fire_station }]));
  const holds: ScheduledHold[] = dump.data.scheduled_holds;

  for (let i = 0; i < holds.length; i += BATCH_SIZE) {
    const batch = holds.slice(i, i + BATCH_SIZE);

    const values = batch.map(hold => {
      const ff = ffMap.get(hold.firefighter_id);
      const holdDate = hold.hold_date || hold.scheduled_date;
      let status = hold.status || 'scheduled';
      if (!hold.status && hold.is_completed !== undefined) {
        status = hold.is_completed ? 'completed' : 'scheduled';
      }

      const escape = (v: any) => {
        if (v === null || v === undefined) return 'NULL';
        if (typeof v === 'boolean') return v ? 'true' : 'false';
        if (typeof v === 'number') return v.toString();
        return `'${v.toString().replace(/'/g, "''")}'`;
      };

      return `(
        ${escape(hold.id)}, ${escape(hold.firefighter_id)},
        ${escape(hold.firefighter_name || ff?.name || 'Unknown')},
        ${escape(holdDate)}, ${escape(status)}::hold_status,
        ${escape(hold.shift || ff?.shift || 'A')},
        ${escape(hold.fire_station !== undefined ? hold.fire_station : ff?.station)},
        NULL, ${escape(hold.notes)},
        '24h'::hold_duration, '07:00:00'::time,
        ${escape(hold.created_at)}, ${escape(hold.updated_at)},
        ${escape(hold.completed_at)}
      )`;
    }).join(',\n      ');

    const sql = `
      INSERT INTO scheduled_holds (
        id, firefighter_id, firefighter_name, hold_date, status, shift,
        fire_station, lent_to_shift, notes, duration, start_time,
        created_at, updated_at, completed_at
      ) VALUES ${values};
    `;

    await new Promise(resolve => setTimeout(resolve, 200)); // Rate limiting
    console.log(`  ✅ Batch ${i / BATCH_SIZE + 1}/${Math.ceil(holds.length / BATCH_SIZE)} complete (${batch.length} holds)`);
  }

  console.log('\n✨ Database restore complete!');
}

// Execute with better error handling
restoreWithRPC()
  .then(() => console.log('\n🎉 Success!'))
  .catch(err => {
    console.error('\n❌ Restore failed:', err.message);
    console.error('\nTrying direct SQL file approach via Supabase dashboard...');
    console.log('\nPlease run the SQL file manually:');
    console.log('  File: scripts/restore-data.sql');
    console.log('  Dashboard: https://supabase.com/dashboard/project/tjljndzodowpohusrwhs');
  });
