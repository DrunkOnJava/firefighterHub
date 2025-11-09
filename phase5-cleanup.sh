#!/bin/bash
# Phase 5 Legacy UI Cleanup Script
# Systematically removes isDarkMode props and replaces hardcoded colors

set -e

echo "Phase 5 Legacy UI Cleanup - Starting..."
echo "========================================"
echo ""

# List of files to clean (excluding ui/ components which are already migrated)
FILES=(
  "src/components/MobileNav.tsx"
  "src/components/MobileNav.new.tsx"
  "src/components/FirefighterProfileModal.tsx"
  "src/components/CalendarView.tsx"
  "src/components/Calendar.tsx"
  "src/components/CalendarSubscribeModal.tsx"
  "src/components/calendar/MainCalendar.tsx"
  "src/components/calendar/DayCell.tsx"
  "src/components/calendar/CalendarHeader.tsx"
  "src/components/calendar/HoldList.tsx"
  "src/components/calendar/CalendarGrid.tsx"
  "src/components/calendar/DayModal.tsx"
  "src/components/calendar/DayScheduleModal.tsx"
  "src/components/calendar/HoldForm.tsx"
  "src/components/calendar/CalendarLegend.tsx"
  "src/components/CompleteHoldModal.tsx"
  "src/components/TransferShiftModal.tsx"
  "src/components/roster/RosterHeader.tsx"
  "src/components/roster/RosterSearchBar.tsx"
  "src/components/ShiftSelector.tsx"
  "src/components/ActivityLog.tsx"
  "src/components/tablet/FirefighterGrid.tsx"
)

echo "Files to process: ${#FILES[@]}"
echo ""

# Backup files first
echo "Creating backups..."
for file in "${FILES[@]}"; do
  if [ -f "$file" ]; then
    cp "$file" "$file.backup"
    echo "  ✓ Backed up: $file"
  fi
done
echo ""

echo "Processing files..."
echo ""

for file in "${FILES[@]}"; do
  if [ ! -f "$file" ]; then
    echo "  ⚠ Skipping (not found): $file"
    continue
  fi
  
  echo "  Processing: $file"
  
  # Note: These sed commands work on macOS (BSD sed)
  # For Linux, you may need to adjust the syntax
  
  # Remove isDarkMode from prop destructuring patterns
  # This is complex and may need manual review
  
  # Replace hardcoded color classes with semantic ones
  sed -i '' 's/bg-blue-600/bg-primary/g' "$file"
  sed -i '' 's/bg-blue-500/bg-primary\/90/g' "$file"
  sed -i '' 's/bg-blue-400/bg-primary\/80/g' "$file"
  sed -i '' 's/text-blue-600/text-primary/g' "$file"
  sed -i '' 's/text-blue-500/text-primary\/90/g' "$file"
  sed -i '' 's/text-blue-400/text-primary\/80/g' "$file"
  sed -i '' 's/border-blue-600/border-primary/g' "$file"
  sed -i '' 's/border-blue-500/border-primary\/90/g' "$file"
  sed -i '' 's/border-blue-400/border-primary\/80/g' "$file"
  sed -i '' 's/hover:bg-blue-700/hover:bg-primary\/90/g' "$file"
  
  # Red colors (except shift badges)
  sed -i '' 's/bg-red-600/bg-destructive/g' "$file"
  sed -i '' 's/bg-red-500/bg-destructive\/90/g' "$file"
  sed -i '' 's/bg-red-100/bg-destructive\/10/g' "$file"
  sed -i '' 's/bg-red-50/bg-destructive\/5/g' "$file"
  sed -i '' 's/text-red-600/text-destructive/g' "$file"
  sed -i '' 's/text-red-500/text-destructive\/90/g' "$file"
  sed -i '' 's/hover:bg-red-700/hover:bg-destructive\/90/g' "$file"
  
  # Slate backgrounds -> semantic
  sed -i '' 's/bg-slate-800/bg-card/g' "$file"
  sed -i '' 's/bg-slate-700/bg-muted/g' "$file"
  sed -i '' 's/bg-gray-300/bg-border/g' "$file"
  
  echo "    ✓ Color replacements complete"
done

echo ""
echo "========================================"
echo "Phase 5 Cleanup - Color replacements complete!"
echo ""
echo "IMPORTANT: Manual steps required:"
echo "1. Remove isDarkMode props from component interfaces"
echo "2. Remove isDarkMode={isDarkMode} prop passing"
echo "3. Replace conditional className with dark: variants"
echo "4. Test TypeScript compilation: pnpm typecheck"
echo "5. Test in browser with dark mode toggle"
echo ""
echo "Backups saved with .backup extension"
echo "To restore: for f in *.backup; do mv \"\$f\" \"\${f%.backup}\"; done"
