#!/usr/bin/env node
/**
 * Update import paths after repository reorganization
 * Converts relative imports to @/* aliases and updates moved component paths
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Import path mappings for moved files
const MOVED_FILES = {
  // Layout
  './components/Header': '@/components/layout/Header',
  '../components/Header': '@/components/layout/Header',
  './components/Sidebar': '@/components/layout/Sidebar',
  '../components/Sidebar': '@/components/layout/Sidebar',
  './components/MobileNav': '@/components/layout/MobileNav',
  '../components/MobileNav': '@/components/layout/MobileNav',
  './components/FilterPanel': '@/components/layout/FilterPanel',
  '../components/FilterPanel': '@/components/layout/FilterPanel',
  
  // Roster feature
  './hooks/useFirefighters': '@/features/roster/hooks/useFirefighters',
  '../hooks/useFirefighters': '@/features/roster/hooks/useFirefighters',
  './hooks/useFirefightersData': '@/features/roster/hooks/useFirefightersData',
  '../hooks/useFirefightersData': '@/features/roster/hooks/useFirefightersData',
  './hooks/useFirefightersMutations': '@/features/roster/hooks/useFirefightersMutations',
  '../hooks/useFirefightersMutations': '@/features/roster/hooks/useFirefightersMutations',
  './hooks/useFirefightersRealtime': '@/features/roster/hooks/useFirefightersRealtime',
  '../hooks/useFirefightersRealtime': '@/features/roster/hooks/useFirefightersRealtime',
  './hooks/useFilters': '@/features/roster/hooks/useFilters',
  '../hooks/useFilters': '@/features/roster/hooks/useFilters',
  
  './components/FirefighterList': '@/features/roster/components/FirefighterList',
  '../components/FirefighterList': '@/features/roster/components/FirefighterList',
  './components/FirefighterItem': '@/features/roster/components/FirefighterItem',
  './components/FirefighterProfileModal': '@/features/roster/components/FirefighterProfileModal',
  './components/FirefightersModal': '@/features/roster/components/FirefightersModal',
  './components/AddFirefighterForm': '@/features/roster/components/AddFirefighterForm',
  './components/QuickAddFirefighterModal': '@/features/roster/components/QuickAddFirefighterModal',
  './components/TransferShiftModal': '@/features/roster/components/TransferShiftModal',
  './components/ReactivateModal': '@/features/roster/components/ReactivateModal',
  
  // Schedule feature
  './hooks/useScheduledHolds': '@/features/schedule/hooks/useScheduledHolds',
  '../hooks/useScheduledHolds': '@/features/schedule/hooks/useScheduledHolds',
  './hooks/useScheduledHoldsData': '@/features/schedule/hooks/useScheduledHoldsData',
  './hooks/useScheduledHoldsMutations': '@/features/schedule/hooks/useScheduledHoldsMutations',
  './hooks/useScheduledHoldsRealtime': '@/features/schedule/hooks/useScheduledHoldsRealtime',
  
  './components/Calendar': '@/features/schedule/components/Calendar',
  '../components/Calendar': '@/features/schedule/components/Calendar',
  './components/CalendarView': '@/features/schedule/components/CalendarView',
  './components/CalendarSubscribeModal': '@/features/schedule/components/CalendarSubscribeModal',
  './pages/SchedulePage': '@/features/schedule/SchedulePage',
  '../pages/SchedulePage': '@/features/schedule/SchedulePage',
  
  // Shifts feature
  './components/NextUpCard': '@/features/shifts/components/NextUpCard',
  '../components/NextUpCard': '@/features/shifts/components/NextUpCard',
  './components/NextUpBand': '@/features/shifts/components/NextUpBand',
  './components/ShiftSelector': '@/features/shifts/components/ShiftSelector',
  '../components/ShiftSelector': '@/features/shifts/components/ShiftSelector',
  './components/ShiftBadge': '@/features/shifts/components/ShiftBadge',
  './components/ShiftIndicator': '@/features/shifts/components/ShiftIndicator',
  './components/StationSelector': '@/features/shifts/components/StationSelector',
  './components/CompleteHoldModal': '@/features/shifts/components/CompleteHoldModal',
  '../components/CompleteHoldModal': '@/features/shifts/components/CompleteHoldModal',
  
  // Reports feature
  './components/Reports': '@/features/reports/components/Reports',
  './components/ActivityLog': '@/features/reports/components/ActivityLog',
  './components/ActivityLogModal': '@/features/reports/components/ActivityLogModal',
  '../components/ActivityLogModal': '@/features/reports/components/ActivityLogModal',
  
  // UI components moved
  './components/Common/FloatingActionButton': '@/components/ui/FloatingActionButton',
  '../components/Common/FloatingActionButton': '@/components/ui/FloatingActionButton',
  './components/Common/IconButton': '@/components/ui/IconButton',
  './components/MetricCard': '@/components/ui/MetricCard',
  
  // Dev components
  './components/dev/SentryTestButton': '@/dev/SentryTestButton',
  
  // Consolidated config
  './constants/breakpoints': '@/config/constants',
  '../constants/breakpoints': '@/config/constants',
};

// Additional patterns to convert to @ aliases
const ALIAS_PATTERNS = [
  { from: /from ['"]\.\.\/\.\.\/lib\/([\w\/]+)['"]/g, to: 'from "@/lib/$1"' },
  { from: /from ['"]\.\.\/lib\/([\w\/]+)['"]/g, to: 'from "@/lib/$1"' },
  { from: /from ['"]\.\/lib\/([\w\/]+)['"]/g, to: 'from "@/lib/$1"' },
  
  { from: /from ['"]\.\.\/\.\.\/hooks\/([\w\/]+)['"]/g, to: 'from "@/hooks/$1"' },
  { from: /from ['"]\.\.\/hooks\/([\w\/]+)['"]/g, to: 'from "@/hooks/$1"' },
  { from: /from ['"]\.\/hooks\/([\w\/]+)['"]/g, to: 'from "@/hooks/$1"' },
  
  { from: /from ['"]\.\.\/\.\.\/utils\/([\w\/]+)['"]/g, to: 'from "@/utils/$1"' },
  { from: /from ['"]\.\.\/utils\/([\w\/]+)['"]/g, to: 'from "@/utils/$1"' },
  { from: /from ['"]\.\/utils\/([\w\/]+)['"]/g, to: 'from "@/utils/$1"' },
  
  { from: /from ['"]\.\.\/\.\.\/config\/([\w\/]+)['"]/g, to: 'from "@/config/$1"' },
  { from: /from ['"]\.\.\/config\/([\w\/]+)['"]/g, to: 'from "@/config/$1"' },
  { from: /from ['"]\.\/config\/([\w\/]+)['"]/g, to: 'from "@/config/$1"' },
];

function updateImports(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let updated = false;
  
  // Update moved file paths
  for (const [oldPath, newPath] of Object.entries(MOVED_FILES)) {
    const regex = new RegExp(`from ['"]${oldPath.replace(/\//g, '\\/')}['"]`, 'g');
    if (regex.test(content)) {
      content = content.replace(regex, `from '${newPath}'`);
      updated = true;
    }
  }
  
  // Update generic patterns to use @ alias
  for (const { from, to } of ALIAS_PATTERNS) {
    if (from.test(content)) {
      content = content.replace(from, to);
      updated = true;
    }
  }
  
  if (updated) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✓ Updated: ${path.relative(process.cwd(), filePath)}`);
    return 1;
  }
  
  return 0;
}

// Find all TypeScript files
const files = glob.sync('src/**/*.{ts,tsx}', {
  ignore: ['**/node_modules/**', '**/dist/**', '**/*.d.ts']
});

console.log(`🔍 Found ${files.length} TypeScript files to process...`);
console.log('');

let updatedCount = 0;
for (const file of files) {
  updatedCount += updateImports(file);
}

console.log('');
console.log(`✅ Updated ${updatedCount} files`);
console.log('');
console.log('Next: Run pnpm typecheck to verify imports');
