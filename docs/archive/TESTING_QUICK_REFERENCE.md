# Testing Quick Reference

## Running Tests

### Manual Testing
```bash
# Open the app
pnpm dev

# Open test checklist
open VERIFICATION_TEST_CHECKLIST.md
```

### Quality Checks
```bash
# TypeScript validation
pnpm typecheck
# Expected: No errors

# ESLint
pnpm lint
# Expected: 8 warnings (acceptable)

# Production build test
pnpm build
# Expected: Success, dist/ folder created
```

## Test Coverage Status

### ❌ Automated Testing: NOT IMPLEMENTED
- No unit tests
- No integration tests
- No E2E tests
- No coverage reports

### ✅ Manual Testing: DOCUMENTED
- See `VERIFICATION_TEST_CHECKLIST.md` for 15 comprehensive test scenarios
- Covers critical bugs fixed: infinite loops, timezone issues, real-time sync

### ✅ Static Analysis: ACTIVE
- TypeScript strict mode enabled
- ESLint configured
- Type checking on every build

## Adding Automated Tests (Future)

### 1. Install Vitest
```bash
pnpm add -D vitest @testing-library/react @testing-library/jest-dom @vitest/ui @vitest/coverage-v8
```

### 2. Add Scripts
Update `package.json`:
```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage"
  }
}
```

### 3. Run Tests
```bash
pnpm test              # Run tests in watch mode
pnpm test:ui           # Open Vitest UI
pnpm test:coverage     # Generate coverage report
```

## Priority Test Areas

### Critical (Must Test)
1. **Rotation Logic** (`src/utils/rotationLogic.ts`)
   - `moveToBottom()` - sends firefighter to end
   - `recalculatePositions()` - normalizes gaps
   - Unavailable firefighters always last

2. **Shift Isolation**
   - All queries filter by `currentShift`
   - No data leaks between A/B/C shifts

3. **Date Handling** (Timezone-sensitive)
   - ISO strings in DB (UTC)
   - Display with `timeZone: 'UTC'`
   - Consistent across roster/calendar/modals

### High Priority
4. **Activity Logging**
   - Every mutation creates log entry
   - Correct `firefighter_name`, `action_type`, `shift`

5. **Hold Completion Workflow**
   - Firefighter moves to end of rotation
   - Position numbers recalculated
   - Last hold date updated

### Medium Priority
6. **Modal Interactions**
   - Profile modal hold history (no infinite loop)
   - Calendar modal scrolling (many holds)
   - Edit/cancel past holds

## Test Execution Guide

### Running Manual Tests

1. **Start development server**
   ```bash
   pnpm dev
   ```

2. **Open test checklist**
   - File: `VERIFICATION_TEST_CHECKLIST.md`
   - Tests: 15 scenarios across 5 categories

3. **Test in both modes**
   - Admin mode (login with password)
   - Read-only mode (logout or incognito)

4. **Multi-tab testing**
   - Open 2+ tabs for real-time sync tests
   - Edit in one tab, verify updates in others

5. **Fill out checklist**
   - Mark Pass/Fail for each test
   - Record notes for failures
   - Count total pass/fail at end

### Viewing Test Results

**TypeScript Errors:**
```bash
pnpm typecheck
# Expected: Found 0 errors
```

**ESLint Warnings:**
```bash
pnpm lint
# Expected: 8 problems (8 warnings, 0 errors)
# Note: Warnings are in commented code, acceptable
```

**Build Validation:**
```bash
pnpm build
# Expected: 
# - vite v5.4.2 building for production...
# - ✓ XX modules transformed
# - dist/index.html XX kB
# - dist/assets/... (multiple files)
```

## Known Issues to Test

### Fixed Issues (Verify Still Working)
- ✅ Profile modal infinite loop
- ✅ Timezone bug (dates off by 1 day)
- ✅ Cannot edit past holds
- ✅ Calendar modal scroll issues
- ✅ Real-time sync not working

### Ongoing Issues (Expected Behavior)
- ⚠️ Real-time sync disabled (WebSocket stability)
- ⚠️ Admin mode client-side only (insecure)
- ⚠️ No automated test coverage

## Test Environment Setup

### Prerequisites
- Node.js 22.18.0+
- pnpm installed
- Supabase project configured
- `.env` file with credentials

### Quick Environment Check
```bash
# Check Node version
node --version
# Expected: v22.18.0 or higher

# Check pnpm
pnpm --version
# Expected: Any version

# Verify environment variables
cat .env | grep VITE_SUPABASE
# Expected: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY

# Test database connection
tsx scripts/test-db-connection.ts
# Expected: Connection successful
```

## Reporting Issues

When a test fails:

1. **Document in checklist**
   - Test number and name
   - Pass/Fail status
   - Detailed notes

2. **Capture evidence**
   - Screenshot if visual bug
   - Console errors (F12 → Console)
   - Network tab for API failures

3. **Reproduce steps**
   - Record exact steps to reproduce
   - Note which shift/data used
   - Browser and OS version

4. **Create issue**
   - Add to GitHub Issues or TODO.md
   - Include reproduction steps
   - Link to test scenario in checklist

---

**Last Updated:** October 27, 2025
**Test Checklist Version:** See `VERIFICATION_TEST_CHECKLIST.md`
**Coverage:** 0% automated, 100% manual tests documented
