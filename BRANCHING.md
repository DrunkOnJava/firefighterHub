# Branching Strategy & Workflow

This document describes the branching strategy, workflows, and best practices for the FirefighterHub repository.

## Table of Contents

- [Branching Model](#branching-model)
- [Branch Types](#branch-types)
- [Branch Naming Conventions](#branch-naming-conventions)
- [Workflow Patterns](#workflow-patterns)
- [Merge Strategies](#merge-strategies)
- [Branch Protection](#branch-protection)
- [Common Scenarios](#common-scenarios)

## Branching Model

FirefighterHub uses a **simplified GitHub Flow** model:

- `main` - Production-ready code (protected)
- Feature branches - Development work
- Hotfix branches - Critical production fixes

```
main
 ├── feature/add-certification-tracking
 ├── feature/improve-calendar-ui
 ├── fix/42-rotation-position-bug
 └── hotfix/supabase-connection-timeout
```

### Why GitHub Flow?

- **Simple**: One main branch, feature branches for everything
- **Fast**: Quick feedback loop, continuous deployment
- **Safe**: Protected main branch with required reviews
- **Flexible**: Works well for continuous deployment

## Branch Types

### Main Branch

**Purpose**: Production-ready code that can be deployed at any time

**Protection**:
- ✅ Require pull request reviews (minimum 1 approval)
- ✅ Require status checks to pass (build, typecheck, lint, tests)
- ✅ Require branches to be up to date before merging
- ✅ Require linear history (no merge commits)
- ✅ No force pushes
- ✅ No deletions

**Direct commits**: ❌ Never allowed (even for admins)

### Feature Branches

**Purpose**: Develop new features or improvements

**Naming**: `feature/brief-description`

**Examples**:
```bash
feature/apparatus-certification-tracking
feature/calendar-month-view
feature/activity-log-export
```

**Lifecycle**:
1. Branch from `main`
2. Develop and test
3. Create PR
4. Review and approval
5. Merge to `main`
6. Delete branch

### Bug Fix Branches

**Purpose**: Fix bugs reported in issues

**Naming**: `fix/issue-number-brief-description`

**Examples**:
```bash
fix/42-rotation-position-duplicates
fix/89-dark-mode-contrast
fix/103-calendar-timezone-bug
```

**Lifecycle**:
1. Branch from `main`
2. Fix and test
3. Create PR with "Fixes #42" in description
4. Review and approval
5. Merge to `main`
6. Delete branch
7. Issue auto-closes

### Hotfix Branches

**Purpose**: Critical fixes that must be deployed immediately

**Naming**: `hotfix/critical-issue-description`

**Examples**:
```bash
hotfix/supabase-connection-timeout
hotfix/authentication-failure
hotfix/data-loss-on-hold-complete
```

**Priority**: 🔴 Highest - Can bypass some review requirements with justification

**Lifecycle**:
1. Branch from `main`
2. Fix with minimal changes
3. Create PR with "HOTFIX:" prefix in title
4. Fast-track review (can merge with 1 approval or admin override)
5. Merge to `main`
6. Deploy immediately
7. Create follow-up issue for proper fix if needed

### Refactor Branches

**Purpose**: Improve code structure without changing functionality

**Naming**: `refactor/component-or-system-name`

**Examples**:
```bash
refactor/split-useFirefighters-hook
refactor/rotation-logic-utilities
refactor/modal-component-structure
```

**Requirements**:
- Must include tests proving no functionality changed
- Should improve code quality metrics

### Documentation Branches

**Purpose**: Update documentation

**Naming**: `docs/what-is-being-documented`

**Examples**:
```bash
docs/contributing-guide
docs/api-documentation
docs/deployment-runbook
```

**Fast-track**: Can merge quickly if no code changes

### Test Branches

**Purpose**: Add or improve tests

**Naming**: `test/what-is-being-tested`

**Examples**:
```bash
test/calendar-utils-coverage
test/rotation-logic-edge-cases
test/accessibility-compliance
```

## Branch Naming Conventions

### Format

```
<type>/<brief-description>
```

### Type Prefixes

- `feature/` - New features
- `fix/` - Bug fixes (reference issue number: `fix/42-description`)
- `hotfix/` - Critical production fixes
- `refactor/` - Code improvements
- `docs/` - Documentation
- `test/` - Testing
- `chore/` - Maintenance tasks
- `ci/` - CI/CD changes

### Description Guidelines

- Use lowercase with hyphens
- Be concise but descriptive
- Max 50 characters
- No issue numbers in feature branches
- Include issue numbers in fix branches

**Good**:
```bash
feature/add-apparatus-certifications
fix/42-duplicate-rotation-positions
hotfix/authentication-timeout
refactor/split-firefighter-hooks
docs/update-contributing-guide
test/calendar-edge-cases
```

**Bad**:
```bash
feature/issue-42  # Too vague
fix/bug  # Not descriptive
my-branch  # No type prefix
FEATURE/Something  # Wrong case
feature/this-is-a-really-long-branch-name-that-describes-everything  # Too long
```

## Workflow Patterns

### Standard Feature Development

```bash
# 1. Start from main
git checkout main
git pull origin main

# 2. Create feature branch
git checkout -b feature/calendar-improvements

# 3. Make changes and commit
git add .
git commit -m "feat(calendar): improve day cell hierarchy"

# 4. Push to remote
git push -u origin feature/calendar-improvements

# 5. Create PR on GitHub
gh pr create --title "feat(calendar): improve day cell hierarchy" \
             --body "Closes #18"

# 6. After approval and merge, delete branch
git checkout main
git pull origin main
git branch -d feature/calendar-improvements
```

### Bug Fix Workflow

```bash
# 1. Create fix branch from main
git checkout main
git pull origin main
git checkout -b fix/42-rotation-bug

# 2. Fix and test
pnpm test:run
pnpm typecheck
pnpm lint

# 3. Commit with issue reference
git commit -m "fix(rotation): prevent duplicate positions

Fixes #42"

# 4. Push and create PR
git push -u origin fix/42-rotation-bug
gh pr create --title "fix(rotation): prevent duplicate positions" \
             --body "Fixes #42"

# 5. After merge, issue auto-closes
```

### Hotfix Workflow

```bash
# 1. Create hotfix branch
git checkout main
git pull origin main
git checkout -b hotfix/auth-timeout

# 2. Make minimal fix
# Edit files...

# 3. Test thoroughly
pnpm test:run
pnpm build

# 4. Push and create urgent PR
git push -u origin hotfix/auth-timeout
gh pr create --title "HOTFIX: resolve authentication timeout" \
             --body "Critical fix for production auth issues" \
             --label "hotfix,priority:critical"

# 5. Request fast-track review
# Notify team in Slack/Discord

# 6. After merge, deploy immediately
```

### Keeping Branch Updated

```bash
# Option 1: Rebase (preferred for clean history)
git checkout main
git pull origin main
git checkout your-branch
git rebase main

# If conflicts, resolve them:
# 1. Fix conflicts in files
# 2. git add .
# 3. git rebase --continue

# Force push (safe with --force-with-lease)
git push --force-with-lease origin your-branch

# Option 2: Merge (preserves history)
git checkout your-branch
git merge main
git push origin your-branch
```

## Merge Strategies

### When to Use Each Strategy

#### Squash Merge (Default)

**Use for**:
- Feature branches with messy commit history
- Multiple "fix typo" or "wip" commits
- Small bug fixes
- Documentation updates

**Benefits**:
- Clean, linear history
- One commit per feature/fix
- Easy to revert
- Clear what changed

**Command**:
```bash
gh pr merge 42 --squash --delete-branch
```

**Result**:
```
main: A -- B -- C -- D (squashed feature)
                      ↑
feature: a -- b -- c -- d (deleted)
```

#### Merge Commit

**Use for**:
- Feature branches with well-organized commits
- When individual commits tell a story
- Release branches
- When preserving attribution is important

**Benefits**:
- Preserves full commit history
- Clear feature boundaries
- Good for code archaeology

**Command**:
```bash
gh pr merge 42 --merge --delete-branch
```

**Result**:
```
main: A -- B ------- M (merge commit)
            \       /
feature:     a -- b -- c
```

#### Rebase (Advanced)

**Use for**:
- Maintaining perfectly linear history
- When commits are already clean and atomic
- Small, well-formed PRs

**Benefits**:
- Cleanest possible history
- No merge commits
- Easy to bisect

**Command**:
```bash
gh pr merge 42 --rebase --delete-branch
```

**Result**:
```
main: A -- B -- a' -- b' -- c'
```

**⚠️ Warning**: Never rebase shared branches!

### Decision Matrix

| Situation | Strategy | Reason |
|-----------|----------|--------|
| 10+ commits with "wip", "fix" | Squash | Clean up history |
| 3 well-named commits | Merge | Preserve story |
| 1 perfect commit | Rebase | Linear history |
| Documentation only | Squash | Simple change |
| Release branch | Merge | Clear boundaries |
| Hotfix (1 commit) | Squash or Rebase | Quick and clean |
| Multiple related features | Merge | Preserve structure |

## Branch Protection

### Main Branch Rules

**Required status checks**:
- ✅ `build` - TypeScript compilation
- ✅ `typecheck` - Type validation
- ✅ `lint` - ESLint checks
- ✅ `test` - Unit and integration tests
- ✅ `Quality CI (PR) / *` - Frontend quality checks

**Required reviews**:
- Minimum 1 approval
- Dismiss stale reviews on new commits
- Require approval of most recent push

**Additional protections**:
- Require branches to be up to date
- Require linear history
- No force pushes
- No deletions
- Include administrators

### Setting Up Protection

See [.github/BRANCH_PROTECTION_SETUP.md](.github/BRANCH_PROTECTION_SETUP.md) for detailed instructions.

## Common Scenarios

### Scenario 1: Abandoned Branch Cleanup

**Situation**: Feature branch hasn't been updated in 30+ days

**Steps**:
```bash
# 1. Check if work is valuable
git log feature/old-branch

# 2. If valuable, create issue to track
gh issue create --title "Complete work from feature/old-branch"

# 3. Delete stale branch
git push origin --delete feature/old-branch
git branch -d feature/old-branch
```

### Scenario 2: Multiple Developers on Same Feature

**Situation**: Two developers need to work on related features

**Option A: Shared Feature Branch**
```bash
# Developer 1
git checkout -b feature/certification-system
git push -u origin feature/certification-system

# Developer 2
git checkout feature/certification-system
git pull origin feature/certification-system

# Both developers
git pull --rebase origin feature/certification-system  # Stay updated
git push origin feature/certification-system

# When ready
gh pr create  # Single PR from shared branch
```

**Option B: Dependent Branches**
```bash
# Developer 1
git checkout -b feature/certification-base
# Create PR, get merged

# Developer 2
git checkout feature/certification-base
git checkout -b feature/certification-ui
# Create PR with base: feature/certification-base

# After first PR merges
gh pr edit <pr-number> --base main
```

### Scenario 3: Merge Conflicts

**Situation**: Your PR has conflicts with main

**Steps**:
```bash
# 1. Update main
git checkout main
git pull origin main

# 2. Rebase your branch
git checkout your-branch
git rebase main

# 3. Resolve conflicts
# - Edit files with <<<<<<< markers
# - Test changes: pnpm test:run

# 4. Continue rebase
git add .
git rebase --continue

# 5. Force push (safe with --force-with-lease)
git push --force-with-lease origin your-branch

# 6. Verify PR updates automatically
```

**For complex conflicts**, see [.github/docs/runbooks/merge-conflicts.md](.github/docs/runbooks/merge-conflicts.md)

### Scenario 4: Urgent Hotfix While PRs Pending

**Situation**: Critical bug in production, but several PRs are in review

**Steps**:
```bash
# 1. Create hotfix from main
git checkout main
git pull origin main
git checkout -b hotfix/critical-bug

# 2. Fix with minimal changes
# ...

# 3. Fast-track PR
gh pr create --title "HOTFIX: critical bug" \
             --label "hotfix,priority:critical"

# 4. Get emergency approval and merge
gh pr merge --squash --delete-branch

# 5. Notify teams to rebase their branches
# - Post in Slack/Discord
# - Comment on open PRs

# 6. Developers rebase
git checkout their-branch
git fetch origin
git rebase origin/main
git push --force-with-lease
```

### Scenario 5: Long-Running Feature Branch

**Situation**: Feature development takes 2+ weeks, main keeps changing

**Best Practice**:
```bash
# Rebase frequently (every 2-3 days)
git checkout main
git pull origin main
git checkout feature/long-running
git rebase main

# Or use GitHub "Update branch" button
# (creates merge commit, less clean)

# When feature is large, consider breaking it up:
git checkout -b feature/part-1  # First deliverable
git cherry-pick abc123  # Pick relevant commits
gh pr create  # Merge incrementally
```

### Scenario 6: Undoing a Merge

**Situation**: Merged PR caused problems, need to undo

**Option A: Revert Commit**
```bash
# Find merge commit
git log --oneline -10

# Revert the merge
git revert -m 1 <merge-commit-sha>
git push origin main

# Or via GitHub
gh pr create --title "Revert: problematic feature" \
             --body "Reverts #123 due to production issues"
```

**Option B: Fix Forward** (Preferred)
```bash
# Create fix branch
git checkout -b fix/issue-from-pr-123

# Fix the issue
# ...

# Create PR
gh pr create --title "fix: issues introduced in #123"
```

## Branch Lifecycle Summary

```
┌─────────────────────────────────────────────────────────┐
│                   Branch Lifecycle                       │
└─────────────────────────────────────────────────────────┘

1. CREATE
   git checkout main
   git pull origin main
   git checkout -b feature/name
   
2. DEVELOP
   git add .
   git commit -m "feat: description"
   git push -u origin feature/name
   
3. PULL REQUEST
   gh pr create
   Wait for CI ✅
   Request reviews
   
4. REVIEW
   Address feedback
   git commit --amend (if needed)
   git push --force-with-lease
   
5. UPDATE
   git rebase main
   Resolve conflicts
   git push --force-with-lease
   
6. MERGE
   gh pr merge --squash
   
7. CLEANUP
   git checkout main
   git pull origin main
   git branch -d feature/name
   
8. VERIFY
   Deleted on remote ✅
   Issue closed ✅
   Changes in production ✅
```

## Best Practices

### Do's ✅

- Keep branches short-lived (< 3-5 days)
- Branch from main, merge to main
- Use descriptive branch names
- Rebase frequently to stay updated
- Delete branches after merge
- Use draft PRs for work in progress
- Write good commit messages
- Test before pushing
- Keep PRs focused and small

### Don'ts ❌

- Don't commit directly to main
- Don't force push to shared branches
- Don't create long-running branches
- Don't merge main into feature branches
- Don't use ambiguous branch names
- Don't leave stale branches
- Don't merge without review
- Don't merge failing CI checks
- Don't create massive PRs

## Tools and Commands

### Useful Git Commands

```bash
# List all branches
git branch -a

# Delete local branch
git branch -d branch-name

# Delete remote branch
git push origin --delete branch-name

# List merged branches
git branch --merged main

# Prune deleted remote branches
git fetch --prune

# Clean up local branches that are gone from remote
git branch -vv | grep ': gone]' | awk '{print $1}' | xargs git branch -D
```

### GitHub CLI Commands

```bash
# Create PR
gh pr create

# List PRs
gh pr list

# View PR
gh pr view 42

# Merge PR
gh pr merge 42 --squash

# Close PR
gh pr close 42

# Reopen PR
gh pr reopen 42

# List branches
gh api repos/:owner/:repo/branches
```

## Additional Resources

- [CONTRIBUTING.md](../CONTRIBUTING.md) - Contribution guidelines
- [.github/PULL_REQUEST_TEMPLATE.md](.github/PULL_REQUEST_TEMPLATE.md) - PR template
- [.github/BRANCH_PROTECTION_SETUP.md](.github/BRANCH_PROTECTION_SETUP.md) - Protection setup
- [.github/docs/runbooks/](./docs/runbooks/) - Workflow runbooks

---

**Questions?** Create an issue or check existing documentation.

**Last Updated**: November 7, 2025
