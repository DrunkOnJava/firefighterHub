#!/usr/bin/env tsx
/**
 * Database Dump Script
 * Exports all data from FirefighterHub Supabase database to JSON
 */

import { createClient } from '@supabase/supabase-js';
import { writeFileSync } from 'fs';

// Supabase configuration
const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

interface DatabaseDump {
  timestamp: string;
  metadata: {
    supabaseUrl: string;
    tables: string[];
  };
  data: {
    firefighters: any[];
    scheduled_holds: any[];
    activity_log: any[];
  };
  counts: {
    firefighters: number;
    scheduled_holds: number;
    activity_log: number;
  };
}

async function dumpDatabase() {
  console.log('🔄 Starting database dump...\n');

  try {
    // Fetch all firefighters
    console.log('📋 Fetching firefighters...');
    const { data: firefighters, error: ffError } = await supabase
      .from('firefighters')
      .select('*')
      .order('order_position');

    if (ffError) throw ffError;
    console.log(`✅ Found ${firefighters?.length || 0} firefighters\n`);

    // Fetch all scheduled holds
    console.log('📅 Fetching scheduled holds...');
    const { data: scheduledHolds, error: holdsError } = await supabase
      .from('scheduled_holds')
      .select('*')
      .order('hold_date', { ascending: false });

    if (holdsError) throw holdsError;
    console.log(`✅ Found ${scheduledHolds?.length || 0} scheduled holds\n`);

    // Fetch all activity logs
    console.log('📝 Fetching activity logs...');
    const { data: activityLog, error: logError } = await supabase
      .from('activity_log')
      .select('*')
      .order('created_at', { ascending: false });

    if (logError) throw logError;
    console.log(`✅ Found ${activityLog?.length || 0} activity log entries\n`);

    // Create dump object
    const dump: DatabaseDump = {
      timestamp: new Date().toISOString(),
      metadata: {
        supabaseUrl,
        tables: ['firefighters', 'scheduled_holds', 'activity_log'],
      },
      data: {
        firefighters: firefighters || [],
        scheduled_holds: scheduledHolds || [],
        activity_log: activityLog || [],
      },
      counts: {
        firefighters: firefighters?.length || 0,
        scheduled_holds: scheduledHolds?.length || 0,
        activity_log: activityLog?.length || 0,
      },
    };

    // Save to file
    const filename = `database_dump_${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
    writeFileSync(filename, JSON.stringify(dump, null, 2));

    console.log('✅ Database dump completed!\n');
    console.log('📊 Summary:');
    console.log(`   Firefighters: ${dump.counts.firefighters}`);
    console.log(`   Scheduled Holds: ${dump.counts.scheduled_holds}`);
    console.log(`   Activity Log Entries: ${dump.counts.activity_log}`);
    console.log(`\n💾 Saved to: ${filename}`);

    // Also create a human-readable summary
    const summaryFilename = `database_summary_${new Date().toISOString().replace(/[:.]/g, '-')}.txt`;
    const summary = generateSummary(dump);
    writeFileSync(summaryFilename, summary);
    console.log(`📄 Summary saved to: ${summaryFilename}\n`);

  } catch (error) {
    console.error('❌ Error dumping database:', error);
    process.exit(1);
  }
}

function generateSummary(dump: DatabaseDump): string {
  const lines: string[] = [];

  lines.push('='.repeat(80));
  lines.push('FIREFIGHTERHUB DATABASE DUMP SUMMARY');
  lines.push('='.repeat(80));
  lines.push(`Generated: ${dump.timestamp}`);
  lines.push(`Database: ${dump.metadata.supabaseUrl}`);
  lines.push('');

  // Firefighters summary
  lines.push('-'.repeat(80));
  lines.push(`FIREFIGHTERS (${dump.counts.firefighters} total)`);
  lines.push('-'.repeat(80));

  const byShift = dump.data.firefighters.reduce((acc, ff) => {
    acc[ff.shift] = (acc[ff.shift] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const active = dump.data.firefighters.filter(ff => ff.is_active).length;
  const available = dump.data.firefighters.filter(ff => ff.is_available).length;

  lines.push(`Active: ${active} | Available: ${available}`);
  lines.push(`By Shift: A=${byShift.A || 0}, B=${byShift.B || 0}, C=${byShift.C || 0}`);
  lines.push('');

  lines.push('Name                    | Shift | Station | Active | Available | Last Hold');
  lines.push('-'.repeat(80));
  dump.data.firefighters.forEach(ff => {
    const name = ff.name.padEnd(23);
    const shift = ff.shift;
    const station = (ff.fire_station || 'N/A').padEnd(7);
    const active = ff.is_active ? 'Yes' : 'No ';
    const available = ff.is_available ? 'Yes' : 'No ';
    const lastHold = ff.last_hold_date
      ? new Date(ff.last_hold_date).toLocaleDateString()
      : 'Never';
    lines.push(`${name} | ${shift}     | ${station} | ${active}    | ${available}       | ${lastHold}`);
  });
  lines.push('');

  // Scheduled holds summary
  lines.push('-'.repeat(80));
  lines.push(`SCHEDULED HOLDS (${dump.counts.scheduled_holds} total)`);
  lines.push('-'.repeat(80));

  const holdsByStatus = dump.data.scheduled_holds.reduce((acc, hold) => {
    acc[hold.status] = (acc[hold.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  lines.push(`Scheduled: ${holdsByStatus.scheduled || 0} | Completed: ${holdsByStatus.completed || 0} | Skipped: ${holdsByStatus.skipped || 0}`);
  lines.push('');

  const upcoming = dump.data.scheduled_holds
    .filter(h => h.status === 'scheduled' && new Date(h.hold_date) >= new Date())
    .slice(0, 10);

  if (upcoming.length > 0) {
    lines.push('Next 10 Scheduled Holds:');
    lines.push('Date       | Firefighter          | Shift | Duration | Station');
    lines.push('-'.repeat(80));
    upcoming.forEach(hold => {
      const date = new Date(hold.hold_date).toLocaleDateString().padEnd(10);
      const name = hold.firefighter_name.padEnd(20);
      const shift = hold.shift;
      const duration = hold.duration;
      const station = (hold.fire_station || 'N/A').padEnd(7);
      lines.push(`${date} | ${name} | ${shift}     | ${duration}    | ${station}`);
    });
  }
  lines.push('');

  // Activity log summary
  lines.push('-'.repeat(80));
  lines.push(`ACTIVITY LOG (${dump.counts.activity_log} total entries)`);
  lines.push('-'.repeat(80));

  const recentActivity = dump.data.activity_log.slice(0, 15);
  if (recentActivity.length > 0) {
    lines.push('Recent Activity (last 15):');
    lines.push('Date/Time            | Firefighter          | Action');
    lines.push('-'.repeat(80));
    recentActivity.forEach(log => {
      const datetime = new Date(log.created_at).toLocaleString().padEnd(20);
      const name = log.firefighter_name.padEnd(20);
      const action = log.action_type;
      lines.push(`${datetime} | ${name} | ${action}`);
      if (log.details) {
        lines.push(`                     ${log.details}`);
      }
    });
  }
  lines.push('');

  lines.push('='.repeat(80));
  lines.push('END OF SUMMARY');
  lines.push('='.repeat(80));

  return lines.join('\n');
}

// Run the dump
dumpDatabase();
