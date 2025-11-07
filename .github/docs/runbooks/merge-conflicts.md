# Runbook: Resolving Merge Conflicts

## Overview

This runbook provides step-by-step instructions for resolving merge conflicts in the FirefighterHub repository.

## When Conflicts Occur

Merge conflicts happen when:
- Two branches modify the same lines of code
- One branch deletes a file another branch modifies
- Changes in your branch conflict with changes merged to main

## Prerequisites

- Git installed and configured
- Local clone of the repository
- Branch with conflicts

## Quick Diagnosis

```bash
# Check if your branch has conflicts with main
git checkout your-branch
git fetch origin
git merge origin/main --no-commit --no-ff

# If conflicts exist, you'll see:
# CONFLICT (content): Merge conflict in src/file.tsx
# Automatic merge failed; fix conflicts and then commit the result.

# Abort the merge to start fresh
git merge --abort
```

## Resolution Methods

### Method 1: Rebase (Recommended for Clean History)

**Best for**: Feature branches, bug fixes, maintaining linear history

```bash
# 1. Ensure main is up to date
git checkout main
git pull origin main

# 2. Switch to your branch
git checkout your-branch

# 3. Start rebase
git rebase main

# 4. If conflicts occur, Git will pause and show which files have conflicts
# Output: CONFLICT (content): Merge conflict in src/components/Calendar.tsx
```

**Resolving conflicts during rebase**:

```bash
# 5. Open conflicted files and look for conflict markers:
# <<<<<<< HEAD (your changes)
# your code here
# =======
# their code here (from main)
# >>>>>>> main

# 6. Edit files to resolve conflicts
#    - Keep your changes
#    - Keep their changes
#    - Or combine both

# 7. Stage resolved files
git add src/components/Calendar.tsx

# 8. Continue rebase
git rebase --continue

# 9. Repeat steps 6-8 for each conflict until rebase completes

# 10. Force push to update PR (safe with --force-with-lease)
git push --force-with-lease origin your-branch
```

**Aborting if needed**:
```bash
# If you want to start over
git rebase --abort
```

### Method 2: Merge (Preserves Full History)

**Best for**: Complex conflicts, when you want to preserve branch context

```bash
# 1. Update main
git checkout main
git pull origin main

# 2. Switch to your branch
git checkout your-branch

# 3. Merge main into your branch
git merge main

# 4. Resolve conflicts (same process as rebase)
# Edit files, git add, git commit

# 5. Push (no force push needed)
git push origin your-branch
```

## Conflict Resolution Examples

### Example 1: Simple Code Conflict

**Scenario**: Both branches modified the same line

**Conflict markers**:
```tsx
function sortFirefighters(firefighters: Firefighter[]) {
<<<<<<< HEAD
  return firefighters.sort((a, b) => a.order_position - b.order_position);
=======
  return [...firefighters].sort((a, b) => a.order_position - b.order_position);
>>>>>>> main
}
```

**Resolution**: The main branch added array spread to avoid mutation (better practice)

```tsx
function sortFirefighters(firefighters: Firefighter[]) {
  return [...firefighters].sort((a, b) => a.order_position - b.order_position);
}
```

**Steps**:
```bash
# 1. Edit file to keep main's version
# 2. Remove conflict markers
# 3. Save file
git add src/utils/rotationLogic.ts
git rebase --continue  # or git commit for merge
```

### Example 2: Package.json Conflicts

**Scenario**: Both branches added different dependencies

**Conflict**:
```json
{
  "dependencies": {
<<<<<<< HEAD
    "lucide-react": "^0.263.1",
    "react-calendar": "^4.0.0"
=======
    "lucide-react": "^0.263.1",
    "react-datepicker": "^4.10.0"
>>>>>>> main
  }
}
```

**Resolution**: Keep both dependencies, ensure proper ordering

```json
{
  "dependencies": {
    "lucide-react": "^0.263.1",
    "react-calendar": "^4.0.0",
    "react-datepicker": "^4.10.0"
  }
}
```

**Steps**:
```bash
# 1. Resolve conflict in package.json
git add package.json

# 2. Regenerate lockfile
pnpm install

# 3. Add lockfile
git add pnpm-lock.yaml

# 4. Continue
git rebase --continue
```

### Example 3: Database Migration Conflicts

**Scenario**: Two migrations with the same timestamp prefix

**⚠️ CRITICAL**: Never auto-resolve database migration conflicts!

**Conflict**:
```
Both modified: supabase/migrations/20251107000000_add_certification.sql
```

**Resolution**:

```bash
# 1. Check both versions
git show HEAD:supabase/migrations/20251107000000_add_certification.sql
git show main:supabase/migrations/20251107000000_add_certification.sql

# 2. Rename YOUR migration with new timestamp
git mv supabase/migrations/20251107000000_add_certification.sql \
       supabase/migrations/20251107000001_add_certification.sql

# 3. Accept main's version
git checkout --theirs supabase/migrations/20251107000000_add_certification.sql

# 4. Stage changes
git add supabase/migrations/

# 5. Continue
git rebase --continue

# 6. Update migration order documentation if needed
```

### Example 4: TypeScript Type Conflicts

**Scenario**: Both branches modified the same interface

**Conflict**:
```typescript
interface Firefighter {
  id: string;
  name: string;
<<<<<<< HEAD
  badge_number: string;
=======
  apparatus_certifications: string[];
>>>>>>> main
}
```

**Resolution**: Combine both changes

```typescript
interface Firefighter {
  id: string;
  name: string;
  badge_number: string;
  apparatus_certifications: string[];
}
```

**Steps**:
```bash
# 1. Resolve conflict
git add src/lib/supabase.ts

# 2. Verify TypeScript compiles
pnpm typecheck

# 3. Continue
git rebase --continue
```

## Common Conflict Patterns

### Pattern 1: Import Statement Conflicts

**Cause**: Both branches added imports

**Resolution**: Merge imports, maintain alphabetical order

```typescript
// Before (conflict)
<<<<<<< HEAD
import { Calendar, Trash2 } from 'lucide-react';
=======
import { Calendar, Edit } from 'lucide-react';
>>>>>>> main

// After (resolved)
import { Calendar, Edit, Trash2 } from 'lucide-react';
```

### Pattern 2: Tailwind Class Conflicts

**Cause**: Both branches modified the same element's classes

**Resolution**: Carefully merge class changes, test visually

```tsx
// Before (conflict)
<<<<<<< HEAD
<div className="flex flex-col gap-4 p-6 rounded-lg">
=======
<div className="flex flex-col gap-4 p-6 rounded-xl shadow-md">
>>>>>>> main

// After (resolved - combine both improvements)
<div className="flex flex-col gap-4 p-6 rounded-xl shadow-md">
```

### Pattern 3: Function Signature Conflicts

**Cause**: Both branches changed function parameters

**Resolution**: Align with latest architecture decisions

```typescript
// Before (conflict)
<<<<<<< HEAD
async function completeHold(firefighterId: string) {
=======
async function completeHold(firefighterId: string, date: Date) {
>>>>>>> main

// After (resolved - keep new signature, update your code)
async function completeHold(firefighterId: string, date: Date) {
```

## Validation After Resolution

### Always Run These Checks

```bash
# 1. TypeScript compilation
pnpm typecheck

# 2. Linting
pnpm lint

# 3. Tests
pnpm test:run

# 4. Build
pnpm build
```

### For Specific File Types

**TypeScript files**:
```bash
pnpm typecheck
```

**React components**:
```bash
pnpm test:run
pnpm dev  # Manual visual check
```

**Package dependencies**:
```bash
pnpm install
pnpm audit
pnpm build
```

**Database migrations**:
```bash
# Check SQL syntax
cat supabase/migrations/your-file.sql

# Apply in test environment first
# (via Supabase SQL Editor)
```

## Troubleshooting

### Problem: "Both modified" on Multiple Files

**Cause**: Large divergence between branches

**Solution**:
```bash
# Consider breaking up your branch
git rebase -i main  # Interactive rebase

# Or merge instead of rebase
git merge main
```

### Problem: Repeated Conflicts During Rebase

**Cause**: Same conflicts appear multiple times

**Solution**:
```bash
# Use rerere (reuse recorded resolution)
git config rerere.enabled true
git rebase main  # Conflicts auto-resolve after first resolution
```

### Problem: Lost Changes After Conflict Resolution

**Cause**: Accidentally used wrong version

**Solution**:
```bash
# Find lost changes in reflog
git reflog

# Recover from before rebase
git reset --hard HEAD@{5}  # Adjust number as needed

# Start fresh
git rebase main
```

### Problem: Can't Push After Rebase

**Error**: "Updates were rejected because the tip of your current branch is behind"

**Solution**:
```bash
# This is expected after rebase - use force push
git push --force-with-lease origin your-branch

# NEVER use --force alone (unsafe)
# --force-with-lease ensures no one else pushed changes
```

## Prevention Strategies

### 1. Rebase Frequently

```bash
# Don't wait for conflicts - stay updated
git fetch origin
git rebase origin/main

# Do this every 2-3 days for long-running branches
```

### 2. Communicate with Team

- Check open PRs before starting work
- Coordinate on files multiple people are editing
- Break up large changes into smaller PRs

### 3. Keep Branches Small

- Aim for < 500 lines changed
- Merge frequently
- Don't let branches live > 5 days

### 4. Use Feature Flags

```typescript
// For incomplete features
if (featureFlags.newCalendarView) {
  return <NewCalendar />;
}
return <OldCalendar />;
```

## Special Cases

### Conflict in Critical Files

**Critical files** (require extra care):
- `src/utils/rotationLogic.ts`
- `src/hooks/useFirefighters.ts`
- `src/hooks/useScheduledHolds.ts`
- `supabase/migrations/*`

**Extra validation**:
```bash
# Run full test suite
pnpm test:coverage

# Manual testing of affected functionality
pnpm dev
# Test rotation logic, holds, calendar, etc.
```

### Conflict with Real-Time Subscription Code

**Pattern**: Changes to `useEffect` subscriptions

**Validation**:
```bash
# 1. Check subscription cleanup
# Ensure return () => supabase.removeChannel(channel)

# 2. Test connection limits
# Open multiple tabs, verify no connection leaks

# 3. Check for shift filtering
# Verify .eq('shift', currentShift) is present
```

## Getting Help

If conflicts are complex or you're unsure:

1. **Ask for help**: Create a comment on your PR
2. **Pair program**: Schedule time with another developer
3. **Create a backup**: `git branch backup-branch` before resolving
4. **Document**: Explain resolution in PR comment

## Checklist

After resolving conflicts:

- [ ] All conflict markers removed (`<<<<<<<`, `=======`, `>>>>>>>`)
- [ ] TypeScript compiles (`pnpm typecheck`)
- [ ] Linter passes (`pnpm lint`)
- [ ] Tests pass (`pnpm test:run`)
- [ ] Build succeeds (`pnpm build`)
- [ ] Manual testing completed (if UI changes)
- [ ] Force-pushed to update PR (`--force-with-lease`)
- [ ] PR description updated (if resolution changed approach)
- [ ] Reviewers notified

## Quick Reference

```bash
# Rebase workflow
git rebase main
# Fix conflicts
git add .
git rebase --continue
git push --force-with-lease

# Merge workflow  
git merge main
# Fix conflicts
git add .
git commit
git push

# Abort and start over
git rebase --abort  # or git merge --abort

# Check what's conflicted
git status

# See conflict in file
git diff --ours src/file.tsx   # Your changes
git diff --theirs src/file.tsx # Their changes

# Choose version
git checkout --ours src/file.tsx   # Keep yours
git checkout --theirs src/file.tsx # Keep theirs
```

---

**Related Documentation**:
- [BRANCHING.md](../../../BRANCHING.md)
- [CONTRIBUTING.md](../../../CONTRIBUTING.md)
- [Dependency Updates Runbook](./dependency-updates.md)

**Last Updated**: November 7, 2025
