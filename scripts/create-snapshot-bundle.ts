import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// Read .env file manually
const envContent = fs.readFileSync('.env', 'utf-8');
const envVars: Record<string, string> = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    envVars[match[1].trim()] = match[2].trim();
  }
});

const supabaseUrl = envVars.VITE_SUPABASE_URL || '';
const supabaseKey = envVars.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function fetchAllData() {
  console.log('Fetching data from Supabase...');
  
  const [firefighters, scheduledHolds, activityLog] = await Promise.all([
    supabase.from('firefighters').select('*').order('order_position'),
    supabase.from('scheduled_holds').select('*').order('hold_date'),
    supabase.from('activity_log').select('*').order('created_at', { ascending: false }).limit(500)
  ]);

  if (firefighters.error) throw firefighters.error;
  if (scheduledHolds.error) throw scheduledHolds.error;
  if (activityLog.error) throw activityLog.error;

  return {
    firefighters: firefighters.data,
    scheduled_holds: scheduledHolds.data,
    activity_log: activityLog.data
  };
}

async function createBundle() {
  const data = await fetchAllData();
  
  // Read built files from snapshot build
  const distPath = path.join(process.cwd(), 'dist-snapshot');
  
  // Get CSS
  const cssFiles = fs.readdirSync(distPath)
    .filter(f => f.endsWith('.css'))
    .map(f => fs.readFileSync(path.join(distPath, f), 'utf-8'))
    .join('\n');
  
  // Get JS bundle
  const jsBundle = fs.readFileSync(path.join(distPath, 'bundle.js'), 'utf-8');
  
  // Create mock Supabase that returns snapshot data
  const mockSupabase = `
    (function() {
      const SNAPSHOT_DATA = ${JSON.stringify(data, null, 2)};
      
      // Override the createClient function before the app loads
      window.createClient = function(url, key) {
        console.log('📸 Using snapshot data (read-only mode)');
        return {
          from: function(table) {
            const tableData = SNAPSHOT_DATA[table] || [];
            return {
              select: function(columns) {
                let filteredData = [...tableData];
                const chain = {
                  eq: function(column, value) {
                    filteredData = filteredData.filter(row => row[column] === value);
                    return chain;
                  },
                  order: function(column, options) {
                    const asc = !options || options.ascending !== false;
                    filteredData.sort((a, b) => {
                      if (a[column] < b[column]) return asc ? -1 : 1;
                      if (a[column] > b[column]) return asc ? 1 : -1;
                      return 0;
                    });
                    return chain;
                  },
                  limit: function(n) {
                    filteredData = filteredData.slice(0, n);
                    return Promise.resolve({ data: filteredData, error: null });
                  },
                  single: function() {
                    return Promise.resolve({ data: filteredData[0] || null, error: null });
                  },
                  then: function(resolve) {
                    resolve({ data: filteredData, error: null });
                  }
                };
                return chain;
              },
              insert: function() {
                return { 
                  select: () => Promise.resolve({ 
                    data: null, 
                    error: { message: '🔒 Read-only snapshot - changes not saved' } 
                  })
                };
              },
              update: function() {
                return { 
                  eq: () => ({ 
                    select: () => Promise.resolve({ 
                      data: null, 
                      error: { message: '🔒 Read-only snapshot - changes not saved' } 
                    })
                  })
                };
              },
              delete: function() {
                return { 
                  eq: () => Promise.resolve({ 
                    data: null, 
                    error: { message: '🔒 Read-only snapshot - changes not saved' } 
                  })
                };
              }
            };
          },
          channel: function(name) {
            return {
              on: function() { return this; },
              subscribe: function(callback) {
                setTimeout(() => callback && callback('SUBSCRIBED'), 0);
                return { unsubscribe: function() {} };
              }
            };
          },
          removeChannel: function() {},
          auth: {
            getSession: () => Promise.resolve({ data: { session: null }, error: null })
          }
        };
      };
    })();
  `;
  
  // Create single file HTML
  const singleFileHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>FirefighterHub - Static Snapshot (${new Date().toLocaleDateString()})</title>
  <style>
${cssFiles}
  </style>
</head>
<body>
  <div id="root"></div>
  
  <!-- Mock Supabase with snapshot data -->
  <script>
${mockSupabase}
  </script>
  
  <!-- Application bundle -->
  <script>
${jsBundle}
  </script>
</body>
</html>`;

  fs.writeFileSync('firefighterhub-snapshot.html', singleFileHtml);
  console.log('\n✅ Created: firefighterhub-snapshot.html');
  console.log(`📊 Data snapshot: ${data.firefighters.length} firefighters, ${data.scheduled_holds.length} holds, ${data.activity_log.length} logs`);
  
  const fileSize = (fs.statSync('firefighterhub-snapshot.html').size / 1024 / 1024).toFixed(2);
  console.log(`📦 File size: ${fileSize} MB`);
  console.log(`\n💡 This is a READ-ONLY snapshot - all database operations will show friendly error messages.`);
}

createBundle().catch(console.error);
