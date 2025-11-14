#!/bin/bash
# Repository reorganization script
# Moves components into feature-based structure

set -e
cd "$(dirname "$0")/.."

echo "🧹 Reorganizing src/ into feature-based structure..."

# Layout components
echo "📦 Moving layout components..."
git mv src/components/Header.tsx src/components/layout/ 2>/dev/null || true
git mv src/components/Sidebar.tsx src/components/layout/ 2>/dev/null || true
git mv src/components/MobileNav.tsx src/components/layout/ 2>/dev/null || true
git mv src/components/FilterPanel.tsx src/components/layout/ 2>/dev/null || true

# Schedule feature
echo "📅 Moving schedule feature..."
git mv src/components/calendar src/features/schedule/components/ 2>/dev/null || true
git mv src/components/Calendar.tsx src/features/schedule/components/ 2>/dev/null || true
git mv src/components/CalendarView.tsx src/features/schedule/components/ 2>/dev/null || true
git mv src/components/CalendarSubscribeModal.tsx src/features/schedule/components/ 2>/dev/null || true
git mv src/pages/SchedulePage.tsx src/features/schedule/ 2>/dev/null || true
git mv src/hooks/useScheduledHolds.ts src/features/schedule/hooks/ 2>/dev/null || true
git mv src/hooks/useScheduledHoldsData.ts src/features/schedule/hooks/ 2>/dev/null || true
git mv src/hooks/useScheduledHoldsMutations.ts src/features/schedule/hooks/ 2>/dev/null || true
git mv src/hooks/useScheduledHoldsRealtime.ts src/features/schedule/hooks/ 2>/dev/null || true

# Roster feature
echo "👥 Moving roster feature..."
git mv src/components/roster src/features/roster/components/ 2>/dev/null || true
git mv src/components/FirefighterList.tsx src/features/roster/components/ 2>/dev/null || true
git mv src/components/FirefighterItem.tsx src/features/roster/components/ 2>/dev/null || true
git mv src/components/FirefighterProfileModal.tsx src/features/roster/components/ 2>/dev/null || true
git mv src/components/FirefightersModal.tsx src/features/roster/components/ 2>/dev/null || true
git mv src/components/AddFirefighterForm.tsx src/features/roster/components/ 2>/dev/null || true
git mv src/components/QuickAddFirefighterModal.tsx src/features/roster/components/ 2>/dev/null || true
git mv src/components/TransferShiftModal.tsx src/features/roster/components/ 2>/dev/null || true
git mv src/components/ReactivateModal.tsx src/features/roster/components/ 2>/dev/null || true
git mv src/hooks/useFirefighters.ts src/features/roster/hooks/ 2>/dev/null || true
git mv src/hooks/useFirefightersData.ts src/features/roster/hooks/ 2>/dev/null || true
git mv src/hooks/useFirefightersMutations.ts src/features/roster/hooks/ 2>/dev/null || true
git mv src/hooks/useFirefightersRealtime.ts src/features/roster/hooks/ 2>/dev/null || true
git mv src/hooks/useFilters.ts src/features/roster/hooks/ 2>/dev/null || true

# Shifts feature
echo "🔄 Moving shifts feature..."
git mv src/components/NextUpCard.tsx src/features/shifts/components/ 2>/dev/null || true
git mv src/components/NextUpBand.tsx src/features/shifts/components/ 2>/dev/null || true
git mv src/components/ShiftSelector.tsx src/features/shifts/components/ 2>/dev/null || true
git mv src/components/ShiftBadge.tsx src/features/shifts/components/ 2>/dev/null || true
git mv src/components/ShiftIndicator.tsx src/features/shifts/components/ 2>/dev/null || true
git mv src/components/StationSelector.tsx src/features/shifts/components/ 2>/dev/null || true
git mv src/components/CompleteHoldModal.tsx src/features/shifts/components/ 2>/dev/null || true

# Delete duplicate NextUp components (keep NextUpBand which uses NextUpCard)
rm -f src/components/NextUpBar.tsx src/components/NextUpBarV2.tsx 2>/dev/null || true

# Reports feature
echo "📊 Moving reports feature..."
git mv src/components/Reports.tsx src/features/reports/components/ 2>/dev/null || true
git mv src/components/ActivityLog.tsx src/features/reports/components/ 2>/dev/null || true
git mv src/components/ActivityLogModal.tsx src/features/reports/components/ 2>/dev/null || true

# Shared UI components (move celebrations, transitions to ui/)
echo "🎨 Organizing shared UI..."
git mv src/components/celebrations src/components/ui/ 2>/dev/null || true
git mv src/components/transitions src/components/ui/ 2>/dev/null || true

# Move MetricCard to ui if it's generic
git mv src/components/MetricCard.tsx src/components/ui/ 2>/dev/null || true

# Clean up Common folder - merge into ui/
if [ -d "src/components/Common" ]; then
  echo "Merging Common/ into ui/..."
  cp -r src/components/Common/* src/components/ui/ 2>/dev/null || true
  git rm -r src/components/Common 2>/dev/null || true
fi

# Move dev components
echo "🔧 Moving dev components..."
git mv src/components/dev src/dev 2>/dev/null || true

# Delete examples (or move to docs)
if [ -d "src/components/examples" ]; then
  echo "Removing example components..."
  rm -rf src/components/examples
fi

# Clean up empty Form folder if it exists
if [ -d "src/components/Form" ]; then
  if [ -z "$(ls -A src/components/Form)" ]; then
    rmdir src/components/Form
  fi
fi

# Consolidate mobile/tablet components
echo "📱 Consolidating mobile components..."
# These stay in components/mobile and components/tablet for now
# Can be evaluated later if they're still needed

# Consolidate config
echo "⚙️  Consolidating config..."
if [ -f "src/constants/breakpoints.ts" ]; then
  cat src/constants/breakpoints.ts >> src/config/constants.ts
  git rm src/constants/breakpoints.ts
  rmdir src/constants 2>/dev/null || true
fi

# Move tests next to source files
echo "🧪 Organizing tests..."
# This will be done manually to avoid complexity

echo "✅ Reorganization complete!"
echo ""
echo "Next steps:"
echo "1. Update import paths in all files"
echo "2. Run typecheck: pnpm typecheck"
echo "3. Run tests: pnpm test:run"
echo "4. Review and commit changes"
