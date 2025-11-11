#!/bin/bash
# Update import paths after reorganization
# Uses find and sed to update imports across all TypeScript files

set -e
cd "$(dirname "$0")/.."

echo "🔄 Updating import paths..."

# Function to update imports in all src files
update_imports() {
  find src -type f \( -name "*.ts" -o -name "*.tsx" \) ! -name "*.d.ts" -exec sed -i '' \
    -e "s|from ['\"]./hooks/useFirefighters['\"]|from '@/features/roster/hooks/useFirefighters'|g" \
    -e "s|from ['\"]../hooks/useFirefighters['\"]|from '@/features/roster/hooks/useFirefighters'|g" \
    -e "s|from ['\"]./hooks/useScheduledHolds['\"]|from '@/features/schedule/hooks/useScheduledHolds'|g" \
    -e "s|from ['\"]../hooks/useScheduledHolds['\"]|from '@/features/schedule/hooks/useScheduledHolds'|g" \
    -e "s|from ['\"]./components/Header['\"]|from '@/components/layout/Header'|g" \
    -e "s|from ['\"]./components/Sidebar['\"]|from '@/components/layout/Sidebar'|g" \
    -e "s|from ['\"]./components/MobileNav['\"]|from '@/components/layout/MobileNav'|g" \
    -e "s|from ['\"]./components/FilterPanel['\"]|from '@/components/layout/FilterPanel'|g" \
    -e "s|from ['\"]./pages/SchedulePage['\"]|from '@/features/schedule/SchedulePage'|g" \
    -e "s|from ['\"]../pages/SchedulePage['\"]|from '@/features/schedule/SchedulePage'|g" \
    -e "s|from ['\"]./components/Calendar['\"]|from '@/features/schedule/components/Calendar'|g" \
    -e "s|from ['\"]./components/CalendarView['\"]|from '@/features/schedule/components/CalendarView'|g" \
    -e "s|from ['\"]./components/NextUpBand['\"]|from '@/features/shifts/components/NextUpBand'|g" \
    -e "s|from ['\"]./components/NextUpCard['\"]|from '@/features/shifts/components/NextUpCard'|g" \
    -e "s|from ['\"]./components/ShiftSelector['\"]|from '@/features/shifts/components/ShiftSelector'|g" \
    -e "s|from ['\"]../components/ShiftSelector['\"]|from '@/features/shifts/components/ShiftSelector'|g" \
    -e "s|from ['\"]./components/ShiftBadge['\"]|from '@/features/shifts/components/ShiftBadge'|g" \
    -e "s|from ['\"]./components/CompleteHoldModal['\"]|from '@/features/shifts/components/CompleteHoldModal'|g" \
    -e "s|from ['\"]../components/CompleteHoldModal['\"]|from '@/features/shifts/components/CompleteHoldModal'|g" \
    -e "s|from ['\"]./components/ActivityLogModal['\"]|from '@/features/reports/components/ActivityLogModal'|g" \
    -e "s|from ['\"]../components/ActivityLogModal['\"]|from '@/features/reports/components/ActivityLogModal'|g" \
    -e "s|from ['\"]./components/QuickAddFirefighterModal['\"]|from '@/features/roster/components/QuickAddFirefighterModal'|g" \
    -e "s|from ['\"]../components/QuickAddFirefighterModal['\"]|from '@/features/roster/components/QuickAddFirefighterModal'|g" \
    -e "s|from ['\"]./components/TransferShiftModal['\"]|from '@/features/roster/components/TransferShiftModal'|g" \
    -e "s|from ['\"]../components/TransferShiftModal['\"]|from '@/features/roster/components/TransferShiftModal'|g" \
    -e "s|from ['\"]./components/Common/FloatingActionButton['\"]|from '@/components/ui/FloatingActionButton'|g" \
    -e "s|from ['\"]../components/Common/FloatingActionButton['\"]|from '@/components/ui/FloatingActionButton'|g" \
    -e "s|from ['\"]./components/dev/SentryTestButton['\"]|from '@/dev/SentryTestButton'|g" \
    {} \;
}

update_imports

echo "✅ Import paths updated!"
echo ""
echo "Running typecheck to verify..."
pnpm typecheck 2>&1 | head -50
