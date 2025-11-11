#!/usr/bin/env python3
"""
Comprehensive import path fixer for reorganized repository.
Handles all moved components and converts to @ aliases.
"""

import os
import re
from pathlib import Path

# Get project root
ROOT = Path("/Users/griffin/Projects/firefighterHub/src")

# Mapping of old paths to new paths (for moved files)
COMPONENT_MOVES = {
    # Roster feature
    "FirefighterList": "features/roster/components/FirefighterList",
    "FirefighterItem": "features/roster/components/FirefighterItem",
    "FirefighterProfileModal": "features/roster/components/FirefighterProfileModal",
    "FirefightersModal": "features/roster/components/FirefightersModal",
    "AddFirefighterForm": "features/roster/components/AddFirefighterForm",
    "QuickAddFirefighterModal": "features/roster/components/QuickAddFirefighterModal",
    "TransferShiftModal": "features/roster/components/TransferShiftModal",
    "ReactivateModal": "features/roster/components/ReactivateModal",
    
    # Schedule feature
    "Calendar": "features/schedule/components/Calendar",
    "CalendarView": "features/schedule/components/CalendarView",
    "CalendarSubscribeModal": "features/schedule/components/CalendarSubscribeModal",
    "SchedulePage": "features/schedule/SchedulePage",
    
    # Shifts feature
    "NextUpCard": "features/shifts/components/NextUpCard",
    "NextUpBand": "features/shifts/components/NextUpBand",
    "ShiftSelector": "features/shifts/components/ShiftSelector",
    "ShiftBadge": "features/shifts/components/ShiftBadge",
    "ShiftIndicator": "features/shifts/components/ShiftIndicator",
    "StationSelector": "features/shifts/components/StationSelector",
    "CompleteHoldModal": "features/shifts/components/CompleteHoldModal",
    
    # Reports feature
    "ActivityLog": "features/reports/components/ActivityLog",
    "ActivityLogModal": "features/reports/components/ActivityLogModal",
    "Reports": "features/reports/components/Reports",
    
    # Layout
    "Header": "components/layout/Header",
    "Sidebar": "components/layout/Sidebar",
    "MobileNav": "components/layout/MobileNav",
    "FilterPanel": "components/layout/FilterPanel",
    
    # Moved to UI
    "FloatingActionButton": "components/ui/FloatingActionButton",
    "IconButton": "components/ui/IconButton",
    "MetricCard": "components/ui/MetricCard",
    
    # Dev
    "SentryTestButton": "dev/SentryTestButton",
}

# Hook moves
HOOK_MOVES = {
    "useFirefighters": "features/roster/hooks/useFirefighters",
    "useFirefightersData": "features/roster/hooks/useFirefightersData",
    "useFirefightersMutations": "features/roster/hooks/useFirefightersMutations",
    "useFirefightersRealtime": "features/roster/hooks/useFirefightersRealtime",
    "useFilters": "features/roster/hooks/useFilters",
    
    "useScheduledHolds": "features/schedule/hooks/useScheduledHolds",
    "useScheduledHoldsData": "features/schedule/hooks/useScheduledHoldsData",
    "useScheduledHoldsMutations": "features/schedule/hooks/useScheduledHoldsMutations",
    "useScheduledHoldsRealtime": "features/schedule/hooks/useScheduledHoldsRealtime",
}


def fix_file_imports(file_path):
    """Fix all imports in a single file."""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    
    # Fix component imports (handle both ./components/X and ../components/X)
    for comp_name, new_path in COMPONENT_MOVES.items():
        # Match: from './components/X' or from '../components/X' or from '../../components/X'
        patterns = [
            (rf"from ['\"]\.\.?\/\.\.?\/?(components|pages)/{comp_name}['\"]", f"from '@/{new_path}'"),
            (rf"import\((.*?)['\"]\.\.?\/\.\.?\/?(components|pages)/{comp_name}['\"]\)", f"import($1'@/{new_path}')"),
        ]
        
        for pattern, replacement in patterns:
            content = re.sub(pattern, replacement, content)
    
    # Fix hook imports
    for hook_name, new_path in HOOK_MOVES.items():
        patterns = [
            (rf"from ['\"]\.\.?\/\.\.?\/?(hooks)/{hook_name}['\"]", f"from '@/{new_path}'"),
        ]
        
        for pattern, replacement in patterns:
            content = re.sub(pattern, replacement, content)
    
    # Convert remaining relative imports to @ aliases
    replacements = [
        # lib imports
        (r"from ['\"]\.\./lib/([^'\"]+)['\"]", r"from '@/lib/\1'"),
        (r"from ['\"]\.\.?/\.\.?/lib/([^'\"]+)['\"]", r"from '@/lib/\1'"),
        
        # hooks imports (generic ones)
        (r"from ['\"]\.\.?/hooks/([^'\"]+)['\"]", r"from '@/hooks/\1'"),
        (r"from ['\"]\.\.?/\.\.?/hooks/([^'\"]+)['\"]", r"from '@/hooks/\1'"),
        
        # utils imports
        (r"from ['\"]\.\.?/utils/([^'\"]+)['\"]", r"from '@/utils/\1'"),
        (r"from ['\"]\.\.?/\.\.?/utils/([^'\"]+)['\"]", r"from '@/utils/\1'"),
        
        # config imports
        (r"from ['\"]\.\.?/config/([^'\"]+)['\"]", r"from '@/config/\1'"),
        (r"from ['\"]\.\.?/\.\.?/config/([^'\"]+)['\"]", r"from '@/config/\1'"),
        
        # constants imports (now in config)
        (r"from ['\"]\.\.?/constants/([^'\"]+)['\"]", r"from '@/config/constants'"),
        
        # component ui imports from wrong paths
        (r"from ['\"]\.\.?/ui/([^'\"]+)['\"]", r"from '@/components/ui/\1'"),
        (r"from ['\"]\./ui/([^'\"]+)['\"]", r"from '@/components/ui/\1'"),
        
        # Common folder (moved to ui)
        (r"from ['\"]\.\.?/Common/([^'\"]+)['\"]", r"from '@/components/ui/\1'"),
        (r"from ['\"]\.\.?/\.\.?/Common/([^'\"]+)['\"]", r"from '@/components/ui/\1'"),
    ]
    
    for pattern, replacement in replacements:
        content = re.sub(pattern, replacement, content)
    
    # Fix specific problem imports for components referencing each other
    specific_fixes = [
        # EmptyState, SkeletonLoader stayed in components/
        (r"from ['\"]\.\/EmptyState['\"]", "from '@/components/EmptyState'"),
        (r"from ['\"]\.\/SkeletonLoader['\"]", "from '@/components/SkeletonLoader'"),
        (r"from ['\"]\.\.?\/mobile/([^'\"]+)['\"]", r"from '@/components/mobile/\1'"),
        (r"from ['\"]\.\.?\/tablet/([^'\"]+)['\"]", r"from '@/components/tablet/\1'"),
    ]
    
    for pattern, replacement in specific_fixes:
        content = re.sub(pattern, replacement, content)
    
    # Only write if changed
    if content != original_content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    return False


def main():
    """Process all TypeScript files."""
    files_updated = 0
    
    # Find all .ts and .tsx files
    for file_path in ROOT.rglob("*.ts*"):
        if file_path.suffix in ['.ts', '.tsx'] and '.d.ts' not in file_path.name:
            if fix_file_imports(file_path):
                print(f"✓ {file_path.relative_to(ROOT)}")
                files_updated += 1
    
    print(f"\n✅ Updated {files_updated} files")
    print("\nNext: Run 'pnpm typecheck' to verify")


if __name__ == "__main__":
    main()
