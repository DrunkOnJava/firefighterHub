# FirefighterHub - AI Coding Agent Instructions

## Project Overview

FirefighterHub is a **shift rotation and availability management system** for fire departments. It tracks firefighters across 3 shifts (A, B, C), manages "hold" rotations (who's unavailable), tracks apparatus certifications, and maintains a complete audit trail via activity logs.

**Tech Stack:** React 18 + TypeScript + Vite + Tailwind CSS + Supabase (PostgreSQL)

## Critical Architecture Patterns

### 1. Shift-Based Data Isolation

**Every query MUST filter by `currentShift`**. The database has data for A/B/C shifts, but UI only shows one shift at a time:

```typescript
// ALWAYS include shift filter in Supabase queries
const { data } = await supabase
  .from('firefighters')
  .select('*')
  .eq('shift', currentShift)  // ← CRITICAL
  .eq('is_active', true);
```

The `currentShift` state lives in `App.tsx` and flows down. Missing this filter causes data leaks between shifts.

### 2. Rotation Logic System (`src/utils/rotationLogic.ts`)

Firefighters have an `order_position` field that determines hold rotation order. **Critical rules:**

- Available firefighters are sorted by `order_position` (ascending)
- Unavailable firefighters are pushed to the bottom
- When completing a hold, call `moveToBottom()` to send that firefighter to end of rotation
- After any position change, call `recalculatePositions()` to normalize gaps

```typescript
// Example: Completing a hold
const reordered = moveToBottom(firefighters, completedId);
const normalized = recalculatePositions(reordered);
// Then update database with new positions
```

**Don't manually set positions** - use the utility functions.

### 3. Real-Time Sync (Currently Disabled)

Supabase real-time subscriptions are **DISABLED** in `useFirefighters.ts` and `useScheduledHolds.ts` due to WebSocket stability issues. The code is commented out with:

```typescript
// DISABLED: Real-time subscription causing WebSocket failures in production
// TODO: Re-enable with proper error handling and backoff strategy
```

**WebSocket Failure Details:**
- **Symptom**: Connections drop after ~5-10 minutes, causing stale data
- **Cause**: Supabase WebSocket timeout + Vite dev server proxy issues
- **Impact**: Multi-tab editing shows stale data until manual refresh
- **Workaround**: Users must refresh browser to see changes from other sessions

**If re-enabling:** Implement:
1. Exponential backoff (start 1s, max 30s between retries)
2. Connection health checks every 30s with ping/pong
3. Graceful degradation (show "Connection lost" banner, auto-retry)
4. Channel cleanup on unmount to prevent memory leaks
5. Error boundary to catch subscription crashes

**Production considerations:**
- Supabase free tier has 200 concurrent connections limit
- Each tab = 2 channels (firefighters + scheduled_holds)
- 100 simultaneous users = 200 connections (at limit)
- Monitor with `supabase.channel.status` and log failures

### 4. Activity Logging

Every mutation (add, delete, complete hold, transfer shift) MUST log to the `activity_log` table:

```typescript
await logActivity(
  firefighterName,
  'hold_completed', // action_type
  `Additional details here`, // details (optional)
  firefighterId // optional
);
```

The `logActivity()` function is in `useFirefighters.ts`. It automatically captures `shift` and `created_at`.

### 5. Security Model (Incomplete)

**Current State:** Client-side "admin mode" using localStorage (`isAdminMode`)
**Known Issue:** This is insecure - anyone can bypass via dev tools

An **unused** but complete authentication system exists:
- `src/contexts/AuthContext.tsx` - Full Supabase Auth integration
- `src/components/LoginModal.tsx` - Login UI

The hardcoded password `VITE_ADMIN_PASSWORD` (default: "Firerescue") is intentional per legacy requirements. **When replacing admin mode:**
1. Integrate `AuthContext` provider in `App.tsx`
2. Replace `isAdminMode` checks with `isAdmin` from context
3. Apply RLS migration in `supabase/migrations/20251022_enable_rls_policies.sql`

## Database Schema

### Tables

- **firefighters** - Core roster with certifications, shift, station, `last_hold_date`, `order_position`
- **scheduled_holds** - Planned holds with `hold_date`, `status` ('scheduled'|'completed'|'skipped')
- **activity_log** - Audit trail with `action_type`, `details`, `firefighter_name`, `shift`

### Type Safety

Import types from `src/lib/supabase.ts`:
```typescript
import { Firefighter, Shift, supabase } from '../lib/supabase';
```

**Dates:** Database returns ISO strings, not Date objects. Always parse:
```typescript
const lastHold = ff.last_hold_date ? new Date(ff.last_hold_date) : null;
```

## Development Workflows

### Running the App

```bash
pnpm dev          # Start dev server (http://localhost:5173)
pnpm build        # Production build
pnpm typecheck    # TypeScript validation (no emitting)
pnpm lint         # ESLint check
```

**Environment:** Requires `.env` with `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`

### Database Migrations

**Apply new migrations:**
1. Open Supabase SQL Editor: [Dashboard → SQL Editor]
2. Paste migration SQL from `supabase/migrations/`
3. Run query

**Existing migrations:**
- `20251022000000_initial_schema.sql` - Core tables, indexes, RLS setup
- `20251022_fix_schema_mismatches.sql` - Adds denormalized fields, triggers
- `20251022_enable_rls_policies.sql` - Full RLS policies (not yet applied)

### Utility Scripts

Scripts in `/scripts` use `@supabase/supabase-js` directly (not the app's client):

```bash
# Example: Update all last_hold_dates
tsx scripts/update-all-last-hold-dates.ts
```

Scripts read `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` from `process.env`.

## Component Patterns

### Custom Hooks Architecture

Large hooks violate SRP. Example - `useFirefighters.ts` (468 lines) handles:
- Data fetching
- All mutations (add/delete/complete/transfer/reset)
- Optimistic updates
- Activity logging
- Real-time sync (disabled)

**Pattern:** When adding features, consider splitting:
```typescript
// Proposed refactor (not implemented)
useFirefightersData()       // Fetching + real-time
useFirefighterMutations()   // CUD operations
useActivityLog()            // Logging
```

### Modal Components

Standard modal pattern uses boolean state + callback props:

```typescript
<CompleteHoldModal
  firefighter={selectedFirefighter}
  isOpen={showCompleteHold}
  onClose={() => setShowCompleteHold(false)}
  onComplete={async (firefighter) => {
    await completeHold(firefighter.id, new Date());
    setShowCompleteHold(false);
  }}
/>
```

### Theming

Theme objects in `src/utils/theme.ts`, `src/utils/sidebarTheme.ts`, `src/utils/calendarTheme.ts`

Dark mode state: `isDarkMode` in `App.tsx`, persisted to localStorage

**Apply theme:**
```typescript
import { getTheme } from '../utils/theme';
const theme = getTheme(isDarkMode);
// Then use theme.background, theme.text, etc.
```

### Keyboard Shortcuts

Use `useKeyboardShortcuts` hook (see `src/hooks/useKeyboardShortcuts.ts`):

```typescript
const { shortcuts } = useKeyboardShortcuts({
  shortcuts: [
    {
      key: 'k',
      ctrl: true,
      meta: true, // Cmd on macOS
      description: 'Focus search',
      action: () => searchInputRef.current?.focus(),
    }
  ]
});
```

Shows `KeyboardShortcutsModal` when user presses `?`.

## Code Quality Standards

### Technical Debt Comments

The codebase uses structured comments to document known issues:

```typescript
// TECHNICAL DEBT: [description]
// CRITICAL SECURITY ISSUE: [description]
// ISSUE: [description]
// TODO: [specific action item]
```

**When you see these:** Don't remove them unless fixing the underlying issue. They're intentional markers for future work.

### TypeScript

- Strict mode enabled (`tsconfig.json`)
- No `any` types - use proper interfaces from `src/lib/supabase.ts`
- Component props: Define interface above component

### Accessibility

- Use semantic HTML (`<button>` not `<div onClick>`)
- Include ARIA labels for icon buttons
- Keyboard navigation required (focus rings, Tab order)
- Screen reader announcements via `useAnnounce()` hook

### Tailwind Conventions

- Dark mode: `dark:` prefix for all color classes
- Responsive: Mobile-first, use `sm:`, `md:`, `lg:` breakpoints
- Common pattern: `className={isDarkMode ? 'dark-class' : 'light-class'}`

## Common Pitfalls

1. **Forgetting shift filter** → Shows all shifts' data mixed together
2. **Mutating position without recalculating** → Gaps/duplicates in rotation order
3. **Missing activity log** → Lost audit trail
4. **Not handling date strings** → Crashes when treating as Date object
5. **Using `currentShift` directly in components** → Pass via props or context
6. **Real-time sync assumptions** → It's disabled; use manual refresh patterns

## Project-Specific Conventions

- **"Hold"** = firefighter being unavailable for their shift (NOT on-hold status)
- **Shift A/B/C** = Three rotating shifts, never intermix data
- **Station numbers** = Stored as strings (can be null)
- **Order position** = Zero-indexed rotation order (0 = next up)
- **Deactivated vs Deleted** = Soft delete (is_active=false) vs hard delete
- **Admin mode** = Client-side flag (insecure, being replaced)

## Key Files to Know

- `src/App.tsx` - Main component, manages modals, shift state, admin mode
- `src/hooks/useFirefighters.ts` - All firefighter CRUD operations
- `src/hooks/useScheduledHolds.ts` - Scheduled holds management
- `src/utils/rotationLogic.ts` - Position calculation logic (critical for holds)
- `src/lib/supabase.ts` - Type definitions, Supabase client
- `supabase/migrations/` - Database schema evolution
- `TODO.md` - Comprehensive task list (1552 lines) with progress tracking

## Next Steps / Active Work

See `TODO.md` for full task list. Current priorities:
1. Apply pending RLS migration for proper security
2. Refactor large hooks (useFirefighters, useScheduledHolds)
3. Re-enable real-time sync with proper error handling
4. Replace hardcoded admin password with AuthContext integration

## Testing & Quality Assurance

### Current Test Coverage

**Status**: ❌ **NO AUTOMATED TESTS EXIST**

The project currently has:
- ✅ TypeScript strict mode (compile-time checks)
- ✅ ESLint configuration (code quality)
- ❌ No unit tests (Vitest/Jest not configured)
- ❌ No integration tests
- ❌ No E2E tests (Playwright/Cypress not set up)
- ❌ No test coverage reporting

**To add testing:**

1. **Install Vitest** (recommended for Vite projects):
```bash
pnpm add -D vitest @testing-library/react @testing-library/jest-dom @vitest/ui
```

2. **Create `vitest.config.ts`**:
```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
  },
});
```

3. **Add test scripts to `package.json`**:
```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage"
  }
}
```

### Manual Testing Checklist

**Critical test scenarios** documented in `VERIFICATION_TEST_CHECKLIST.md`:

- **Profile Modal Tests** - Hold history loading, infinite loop prevention
- **Real-Time Sync Tests** - Multi-tab editing, data synchronization
- **Timezone Bug Tests** - Date consistency across roster/calendar/modals
- **Calendar Tests** - Past date editing, modal scrolling, completed holds
- **Read-Only Mode Tests** - Permission enforcement, UI state
- **Regression Tests** - Hold workflow, add/delete, drag-and-drop

**To run manual tests:**
1. Review `VERIFICATION_TEST_CHECKLIST.md` 
2. Test in admin mode AND read-only mode
3. Test with multiple browser tabs open
4. Verify all date displays for timezone consistency

### Key Test Areas

**Rotation Logic** (`src/utils/rotationLogic.ts`):
- Test `moveToBottom()` - firefighter should move to max position + 1
- Test `recalculatePositions()` - should normalize gaps (0, 1, 2, 3...)
- Test unavailable firefighters always sorted after available

**Date Handling** (timezone-sensitive):
- All dates stored as ISO strings in UTC
- Display uses `toLocaleDateString()` with UTC timezone
- Always parse: `new Date(dateString)` before formatting

**Activity Logging**:
- Every mutation MUST create activity_log entry
- Verify `firefighter_name`, `action_type`, `shift` are set
- Check logs via Activity Log modal (sidebar)

### Running Quality Checks

```bash
pnpm typecheck    # TypeScript errors (should be 0)
pnpm lint         # ESLint warnings (currently 8 warnings acceptable)
pnpm build        # Production build test (must succeed)
```

**Expected output:**
- `typecheck`: ✅ No errors found
- `lint`: ⚠️ 8 warnings (mostly unused vars in commented code)
- `build`: ✅ dist/ folder created successfully

---

**Questions?** Check the extensive inline comments in source files - most complex logic has detailed TECHNICAL DEBT annotations explaining "why" behind decisions.
