---
mode: 'agent'
tools: ['codebase', 'search', 'usages']
description: 'Fix rotation logic issues with shift filtering and position management'
---

# Rotation Logic Fix

Your goal is to fix rotation logic issues in the FirefighterHub codebase.

## Critical Context

- **Shift Filtering**: EVERY Supabase query MUST filter by `currentShift` (A/B/C)
- **Position Management**: Use utility functions from `src/utils/rotationLogic.ts`
  - `sortFirefighters()` - Sort by position
  - `recalculatePositions()` - Normalize positions
  - `moveToBottom()` - Move to end of rotation
  - `assignPositions()` - Assign sequential positions

## Common Issues

1. Missing shift filter in queries
2. Manual position assignment (use utilities instead)
3. Missing activity log entry
4. Date handling without `formatHoldDate()`

## Testing Requirements

- Run `pnpm test` (100% coverage required for rotation logic)
- Verify shift isolation (no cross-shift data leaks)
- Check activity log entries
- Test with multiple shifts
