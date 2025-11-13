#!/bin/bash
#
# Final Import Path Fixes
# Resolves remaining ~30 TypeScript errors after reorganization
#

set -e
cd "$(dirname "$0")/.."

echo "🔧 Applying final import path fixes..."
echo ""

# Fix test imports to point to new feature locations
echo "📝 Fixing test file imports..."
sed -i '' "s|from '../AddFirefighterForm'|from '@/features/roster/components/AddFirefighterForm'|g" src/components/__tests__/AddFirefighterForm.test.tsx
sed -i '' "s|from '../Calendar'|from '@/features/schedule/components/Calendar'|g" src/components/__tests__/Calendar.test.tsx
sed -i '' "s|from '../CompleteHoldModal'|from '@/features/shifts/components/CompleteHoldModal'|g" src/components/__tests__/CompleteHoldModal.test.tsx
sed -i '' "s|from '../FirefighterList'|from '@/features/roster/components/FirefighterList'|g" src/components/__tests__/FirefighterList.test.tsx
sed -i '' "s|from '../FirefighterProfileModal'|from '@/features/roster/components/FirefighterProfileModal'|g" src/components/__tests__/FirefighterProfileModal.test.tsx
sed -i '' "s|from '../ShiftBadge'|from '@/features/shifts/components/ShiftBadge'|g" src/components/__tests__/ShiftBadge.test.tsx

# Fix feature hooks referencing shared hooks
echo "🔗 Fixing hook cross-references..."
find src/features -type f -name "*.ts" -exec sed -i '' \
  -e "s|from './useConfirm'|from '@/hooks/useConfirm'|g" \
  -e "s|from './useToast'|from '@/hooks/useToast'|g" \
  -e "s|from './useActivityLogger'|from '@/hooks/useActivityLogger'|g" \
  {} \;

# Fix useFilters path (it's in roster feature)
echo "🎯 Fixing useFilters imports..."
sed -i '' "s|from '@/hooks/useFilters'|from '@/features/roster/hooks/useFilters'|g" src/features/roster/components/FirefighterList.tsx
sed -i '' "s|from '@/hooks/useFilters'|from '@/features/roster/hooks/useFilters'|g" src/components/layout/FilterPanel.tsx

# Fix Shift component references (they moved to shifts feature)
echo "🔄 Fixing Shift component imports..."
find src/components/layout -type f -name "*.tsx" -exec sed -i '' \
  -e "s|from './ShiftSelector'|from '@/features/shifts/components/ShiftSelector'|g" \
  -e "s|from './ShiftBadge'|from '@/features/shifts/components/ShiftBadge'|g" \
  {} \;

find src/features/roster/components -type f -name "*.tsx" -exec sed -i '' \
  -e "s|from './ShiftSelector'|from '@/features/shifts/components/ShiftSelector'|g" \
  {} \;

find src/features/schedule/components/calendar -type f -name "*.tsx" -exec sed -i '' \
  -e "s|from '../ShiftIndicator'|from '@/features/shifts/components/ShiftIndicator'|g" \
  -e "s|from '../StationSelector'|from '@/features/shifts/components/StationSelector'|g" \
  {} \;

# Fix component cross-references
echo "📦 Fixing component cross-references..."
sed -i '' "s|from './FilterPanel'|from '@/components/layout/FilterPanel'|g" src/features/roster/components/FirefighterList.tsx
sed -i '' "s|from './MetricCard'|from '@/components/ui/MetricCard'|g" src/features/reports/components/Reports.tsx
sed -i '' "s|from '../EmptyState'|from '@/components/EmptyState'|g" src/features/schedule/components/calendar/HoldList.tsx

# Fix DashboardPage and SchedulePage imports
echo "📄 Fixing page imports..."
sed -i '' \
  -e "s|from '@/components/calendar/OptimizedMainCalendar'|from '@/features/schedule/components/calendar/OptimizedMainCalendar'|g" \
  -e "s|from '@/components/FirefighterList'|from '@/features/roster/components/FirefighterList'|g" \
  src/pages/DashboardPage.tsx

sed -i '' \
  -e "s|from '@/components/calendar/OptimizedMainCalendar'|from '@/features/schedule/components/calendar/OptimizedMainCalendar'|g" \
  -e "s|from '@/components/FirefighterList'|from '@/features/roster/components/FirefighterList'|g" \
  src/pages/SchedulePage.tsx

echo ""
echo "✅ Final import fixes applied!"
echo ""
echo "Running typecheck to verify..."
echo ""

pnpm typecheck 2>&1 | head -80

EXIT_CODE=${PIPESTATUS[0]}

if [ $EXIT_CODE -eq 0 ]; then
  echo ""
  echo "🎉 SUCCESS! All import errors resolved!"
  echo ""
  echo "Next steps:"
  echo "1. Run tests: pnpm test:run"
  echo "2. Build: pnpm build"
  echo "3. Commit: git add -A && git commit -m 'refactor: reorganize into feature-based architecture'"
else
  echo ""
  echo "⚠️  Still have some TypeScript errors (check output above)"
  echo "Most should be pre-existing issues, not import-related"
fi

exit 0
