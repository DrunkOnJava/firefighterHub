# Contributing to FirefighterHub

Thank you for your interest in contributing to FirefighterHub! This document provides guidelines and best practices for contributing to this shift rotation and availability management system.

## Table of Contents

- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Code Standards](#code-standards)
- [Testing Requirements](#testing-requirements)
- [Pull Request Process](#pull-request-process)
- [Commit Message Guidelines](#commit-message-guidelines)
- [Architecture Guidelines](#architecture-guidelines)
- [Common Pitfalls](#common-pitfalls)

## Getting Started

### Prerequisites

- **Node.js**: 20.19.5 (managed via volta/mise)
- **Package Manager**: pnpm (REQUIRED - not npm or yarn)
- **GitHub CLI**: `gh` (recommended for workflow management)

### Initial Setup

1. **Fork and clone the repository**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/firefighterHub.git
   cd firefighterHub
   ```

2. **Install dependencies**:
   ```bash
   pnpm install
   ```

3. **Set up environment variables**:
   ```bash
   cp .env.example .env
   # Edit .env with your Supabase credentials
   ```

4. **Verify setup**:
   ```bash
   pnpm dev          # Start dev server
   pnpm test:run     # Run tests
   pnpm typecheck    # Check types
   pnpm lint         # Lint code
   ```

## Development Workflow

### Branch Naming Convention

Use descriptive branch names that follow this pattern:

- **Features**: `feature/brief-description`
- **Bug fixes**: `fix/issue-number-brief-description`
- **Hotfixes**: `hotfix/critical-issue-description`
- **Refactoring**: `refactor/component-or-system-name`
- **Documentation**: `docs/what-is-being-documented`
- **Tests**: `test/what-is-being-tested`

**Examples**:
```bash
feature/apparatus-certification-tracking
fix/23-rotation-position-bug
hotfix/supabase-connection-timeout
refactor/rotation-logic-split
docs/contributing-guide
test/calendar-utils-coverage
```

### Creating a Branch

```bash
# Always branch from main
git checkout main
git pull origin main
git checkout -b feature/your-feature-name
```

## Code Standards

### TypeScript

- **Strict mode enabled** - No `any` types allowed
- Use interfaces from `src/lib/supabase.ts` for type safety
- Define component prop interfaces above the component
- Leverage auto-generated types from Supabase schema

**Good**:
```typescript
import { Firefighter } from '../lib/supabase';

interface FirefighterCardProps {
  firefighter: Firefighter;
  onSelect: (id: string) => void;
}

export function FirefighterCard({ firefighter, onSelect }: FirefighterCardProps) {
  // ...
}
```

**Bad**:
```typescript
// ❌ Using 'any'
function FirefighterCard({ firefighter }: { firefighter: any }) {
  // ...
}
```

### Tailwind CSS

- **Mobile-first responsive design**
- Use `dark:` prefix for dark mode variants
- Avoid arbitrary values - use design tokens
- Follow the spacing scale (gap-2, gap-4, gap-6, etc.)

**Good**:
```tsx
<div className="flex flex-col gap-4 p-6 rounded-lg bg-white dark:bg-gray-800">
  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
    Shift A
  </h2>
</div>
```

**Bad**:
```tsx
{/* ❌ Arbitrary values */}
<div className="flex flex-col gap-[23px] p-[25px] rounded-[12px] bg-[#ffffff]">
  <h2 className="text-[19px] font-bold">Shift A</h2>
</div>
```

### Accessibility

- Use semantic HTML (`<button>` not `<div onClick>`)
- Include ARIA labels for icon-only buttons
- Ensure keyboard navigation works (focus rings, Tab order)
- Use `useAnnounce()` hook for screen reader announcements
- Minimum touch target size: 44px (WCAG compliance)

**Example**:
```tsx
<button
  onClick={handleDelete}
  className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
  aria-label="Delete firefighter"
>
  <Trash2 className="w-5 h-5" />
</button>
```

## Testing Requirements

### Test Coverage Standards

- **Critical utilities**: 100% coverage required (`rotationLogic.ts`, `calendarUtils.ts`, `validation.ts`)
- **Custom hooks**: Comprehensive coverage for CRUD operations
- **Components**: Test user interactions and accessibility
- **Regression tests**: Document and test historical bugs

### Running Tests

```bash
# Watch mode (recommended during development)
pnpm test

# Single run (CI/CD)
pnpm test:run

# With coverage report
pnpm test:coverage

# Interactive UI
pnpm test:ui

# E2E tests
pnpm test:e2e
```

### Writing Tests

Use the factory functions from `src/test/mockData.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { createMockFirefighter } from '../test/mockData';
import { sortFirefighters } from './rotationLogic';

describe('rotationLogic', () => {
  it('sorts firefighters by order_position', () => {
    const firefighters = [
      createMockFirefighter({ order_position: 2 }),
      createMockFirefighter({ order_position: 0 }),
    ];

    const result = sortFirefighters(firefighters);

    expect(result[0].order_position).toBe(0);
    expect(result[1].order_position).toBe(1);
  });
});
```

### Before Submitting

All of these must pass:

```bash
pnpm typecheck  # No TypeScript errors
pnpm lint       # No ESLint errors
pnpm test:run   # All tests passing
pnpm build      # Production build succeeds
```

## Pull Request Process

### Before Creating a PR

1. **Ensure your branch is up to date**:
   ```bash
   git checkout main
   git pull origin main
   git checkout your-branch
   git rebase main
   ```

2. **Run all checks locally**:
   ```bash
   pnpm typecheck && pnpm lint && pnpm test:run && pnpm build
   ```

3. **Review your changes**:
   ```bash
   git diff main..HEAD
   ```

### PR Title Format

Follow conventional commits format:

```
<type>(<scope>): <short description>
```

**Types**:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples**:
```
feat(rotation): add apparatus certification tracking
fix(calendar): resolve date off-by-one bug in formatHoldDate
docs(contributing): add commit message guidelines
refactor(hooks): split useFirefighters into smaller hooks
test(rotation): add regression test for duplicate positions
```

### PR Description Template

```markdown
## Description
Brief description of what this PR does and why.

## Changes
- List of specific changes made
- Be concise but thorough

## Testing
- [ ] Unit tests added/updated
- [ ] Manual testing completed
- [ ] Tested on mobile viewport
- [ ] Tested with screen reader (if UI changes)

## Screenshots (if applicable)
Before/after screenshots for UI changes

## Related Issues
Closes #123
Relates to #456

## Checklist
- [ ] TypeScript compilation passes
- [ ] All tests pass
- [ ] ESLint passes with no warnings
- [ ] No arbitrary Tailwind values
- [ ] Activity logging added (if database changes)
- [ ] Documentation updated (if needed)
```

### Review Process

1. **Self-review**: Review your own PR first
2. **Automated checks**: Ensure all CI/CD checks pass
3. **Code review**: Request review from appropriate reviewers
4. **Address feedback**: Make requested changes promptly
5. **Final approval**: Obtain required approvals (minimum 1)

### Reviewers

**By change type**:
- **Database changes**: Requires review from someone familiar with schema
- **Rotation logic** (`rotationLogic.ts`, `useFirefighters.ts`): Critical - needs thorough testing
- **Real-time subscriptions**: Connection limit awareness needed
- **UI changes**: Can be fast-tracked if tests pass
- **Documentation**: Quick review acceptable

## Commit Message Guidelines

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting
- `refactor`: Code restructuring
- `test`: Tests
- `chore`: Maintenance

### Scope

The scope should indicate what part of the codebase is affected:

- `rotation`: Rotation logic system
- `calendar`: Calendar component and utilities
- `holds`: Scheduled holds functionality
- `auth`: Authentication
- `ui`: User interface
- `db`: Database/Supabase
- `ci`: CI/CD workflows

### Subject

- Use imperative mood ("add" not "added")
- Don't capitalize first letter
- No period at the end
- Maximum 50 characters

### Body (optional)

- Wrap at 72 characters
- Explain what and why, not how
- Reference issues and PRs

### Examples

```bash
# Simple fix
git commit -m "fix(calendar): resolve timezone bug in formatHoldDate"

# With body
git commit -m "feat(rotation): add moveToBottom utility function

Implements automatic rotation of firefighter to bottom of available
list when hold is completed. Prevents manual position calculation
errors.

Closes #42"

# Breaking change
git commit -m "refactor(hooks)!: split useFirefighters into smaller hooks

BREAKING CHANGE: useFirefighters no longer exports completeHold.
Import from useFirefighterMutations instead."
```

## Architecture Guidelines

### Critical Patterns

#### 1. Shift-Based Data Isolation ⚠️ CRITICAL

**Every Supabase query MUST filter by `currentShift`**:

```typescript
// ✅ CORRECT
const { data } = await supabase
  .from('firefighters')
  .select('*')
  .eq('shift', currentShift)  // ← CRITICAL
  .eq('is_active', true);

// ❌ WRONG - Will leak cross-shift data
const { data } = await supabase
  .from('firefighters')
  .select('*')
  .eq('is_active', true);
```

#### 2. Rotation Logic System

**Never manually set positions** - always use utility functions:

```typescript
import {
  sortFirefighters,
  recalculatePositions,
  moveToBottom,
  assignPositions
} from '../utils/rotationLogic';

// ✅ CORRECT - Use utility functions
const reordered = moveToBottom(firefighters, completedId);
const normalized = recalculatePositions(reordered);

// ❌ WRONG - Manual position assignment
firefighters[0].order_position = 5; // Don't do this!
```

#### 3. Date Handling

**Dates are ISO strings, NOT Date objects**:

```typescript
import { formatHoldDate } from '../utils/dateUtils';

// ✅ CORRECT - Use utility to handle UTC
const date = formatHoldDate(firefighter.last_hold_date); // "Oct 29, 2025"

// ❌ WRONG - Direct Date conversion can shift dates
const date = new Date(firefighter.last_hold_date).toLocaleDateString();
```

#### 4. Activity Logging

**Every mutation MUST log to activity_log**:

```typescript
await logActivity(
  firefighterName,
  'hold_completed',  // action_type
  `Moved to position ${newPosition}`,  // details
  firefighterId  // optional
);
```

#### 5. Real-Time Subscriptions

**Always clean up subscriptions**:

```typescript
useEffect(() => {
  const channel = supabase
    .channel(`firefighters_${currentShift}`)
    .on('postgres_changes', { /* ... */ }, handleChange)
    .subscribe();

  // CRITICAL: Clean up on unmount
  return () => {
    supabase.removeChannel(channel);
  };
}, [currentShift]);
```

## Common Pitfalls

### 1. Forgetting Shift Filter
❌ **Wrong**: Shows mixed data from all shifts
```typescript
const { data } = await supabase.from('firefighters').select('*');
```

✅ **Correct**: Filters by current shift
```typescript
const { data } = await supabase
  .from('firefighters')
  .select('*')
  .eq('shift', currentShift);
```

### 2. Manual Position Mutation
❌ **Wrong**: Creates gaps or duplicates
```typescript
firefighter.order_position = 5;
```

✅ **Correct**: Uses utility functions
```typescript
const updated = moveToBottom(firefighters, firefighterId);
```

### 3. Missing Activity Log
❌ **Wrong**: Lost audit trail
```typescript
await supabase.from('firefighters').update({ is_active: false });
```

✅ **Correct**: Logs the action
```typescript
await supabase.from('firefighters').update({ is_active: false });
await logActivity(name, 'deleted', 'Removed from roster', id);
```

### 4. Date String Handling
❌ **Wrong**: Treats ISO string as Date object
```typescript
const date = firefighter.last_hold_date.toLocaleDateString(); // Crash!
```

✅ **Correct**: Parses string first or uses utility
```typescript
const date = formatHoldDate(firefighter.last_hold_date);
```

### 5. Subscription Leaks
❌ **Wrong**: No cleanup
```typescript
useEffect(() => {
  const channel = supabase.channel('firefighters').subscribe();
  // Missing cleanup!
}, []);
```

✅ **Correct**: Removes channel on unmount
```typescript
useEffect(() => {
  const channel = supabase.channel('firefighters').subscribe();
  return () => supabase.removeChannel(channel);
}, []);
```

## Database Migrations

### Creating a Migration

1. **Write SQL in a new migration file**:
   ```bash
   # Name format: supabase/migrations/YYYYMMDDHHMMSS_description.sql
   touch supabase/migrations/20251107000000_add_apparatus_certification.sql
   ```

2. **Apply via Supabase SQL Editor**:
   - Open [Supabase SQL Editor](https://supabase.com/dashboard/project/YOUR_PROJECT_ID/sql/new)
   - Copy migration contents
   - Execute query
   - Document in PR

3. **Update types**:
   ```bash
   pnpm types:generate
   ```

### Migration Checklist

- [ ] SQL is idempotent (can run multiple times safely)
- [ ] Includes rollback instructions in comments
- [ ] Preserves existing data
- [ ] Updates indexes if needed
- [ ] RLS policies updated
- [ ] Foreign key constraints maintained
- [ ] Types regenerated after migration

## Dependency Updates

### Before Adding Dependencies

1. **Check if functionality exists** in current dependencies
2. **Consider bundle size impact**
3. **Verify TypeScript support**
4. **Check license compatibility**

### Adding a Dependency

```bash
# Production dependency
pnpm add package-name

# Development dependency
pnpm add -D package-name
```

### Updating Dependencies

```bash
# Check for updates
pnpm outdated

# Update specific package
pnpm update package-name

# Update all (carefully!)
pnpm update
```

### Security

```bash
# Check for vulnerabilities
pnpm audit

# Fix automatically if possible
pnpm audit fix
```

## Getting Help

- **Bug reports**: [Create an issue](https://github.com/DrunkOnJava/firefighterHub/issues/new)
- **Feature requests**: [Create an issue](https://github.com/DrunkOnJava/firefighterHub/issues/new)
- **Questions**: Check existing issues or create a new one
- **Documentation**: See `.github/docs/` for additional guides

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on the code, not the person
- Help others learn and grow
- Celebrate contributions of all sizes

## License

By contributing to FirefighterHub, you agree that your contributions will be licensed under the same license as the project.

---

**Thank you for contributing to FirefighterHub!** 🚒
